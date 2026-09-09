import { gunzipSync } from "node:zlib";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import type { LeadStatus } from "@/lib/analytics/payload";

/**
 * Read queries for the admin panel. Plain async functions called directly from
 * Server Components — no API round-trip for reads.
 *
 * Every query is scoped to SITE, so this panel only ever sees its own site's
 * traffic even though both landing sites share one database.
 *
 * Day bucketing is done in UTC.
 */

export function sinceDays(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// --- Overview ----------------------------------------------------------------

export type OverviewStats = {
  visitors: number;
  sessions: number;
  leads: number;
  conversionRate: number;
  scrollHalfway: number;
  ctaClicks: number;
  avgDurationSeconds: number;
};

export async function getOverviewStats(days = 30): Promise<OverviewStats> {
  const since = sinceDays(days);
  const where = { site: SITE, startedAt: { gte: since } };

  const [visitors, sessions, leads, scrollHalfway, ctaClicks, duration] = await Promise.all([
    prisma.session
      .findMany({ where, select: { visitorId: true }, distinct: ["visitorId"] })
      .then((rows) => rows.length),
    prisma.session.count({ where }),
    prisma.lead.count({ where: { site: SITE, createdAt: { gte: since } } }),
    countDistinctSessions("ScrollEvent", since, `AND depth >= 50`),
    prisma.ctaEvent.count({ where: { site: SITE, action: "clicked", createdAt: { gte: since } } }),
    prisma.session.aggregate({
      where: { ...where, totalDuration: { not: null } },
      _avg: { totalDuration: true },
    }),
  ]);

  return {
    visitors,
    sessions,
    leads,
    conversionRate: sessions > 0 ? (leads / sessions) * 100 : 0,
    scrollHalfway,
    ctaClicks,
    avgDurationSeconds: Math.round(duration._avg.totalDuration ?? 0),
  };
}

/**
 * COUNT(DISTINCT "sessionId") over one event table.
 *
 * `table` and `extra` are never caller-supplied strings — they are literals from
 * this module — so interpolating them is safe. Values stay parameterised.
 */
async function countDistinctSessions(
  table: "ScrollEvent" | "CtaEvent" | "FormEvent",
  since: Date,
  extra = "",
): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<Array<{ count: number }>>(
    `SELECT COUNT(DISTINCT "sessionId")::int AS count
       FROM "${table}"
      WHERE site = $1 AND "createdAt" >= $2 ${extra}`,
    SITE,
    since,
  );
  return rows[0]?.count ?? 0;
}

export type DailyPoint = { date: string; visitors: number; sessions: number; leads: number };

export async function getDailyTimeSeries(days = 30): Promise<DailyPoint[]> {
  const since = sinceDays(days);

  const [sessionRows, leadRows] = await Promise.all([
    prisma.$queryRaw<Array<{ day: Date; sessions: number; visitors: number }>>`
      SELECT date_trunc('day', "startedAt")::date AS day,
             COUNT(*)::int AS sessions,
             COUNT(DISTINCT "visitorId")::int AS visitors
        FROM "Session"
       WHERE site = ${SITE} AND "startedAt" >= ${since}
       GROUP BY 1`,
    prisma.$queryRaw<Array<{ day: Date; leads: number }>>`
      SELECT date_trunc('day', "createdAt")::date AS day,
             COUNT(*)::int AS leads
        FROM "Lead"
       WHERE site = ${SITE} AND "createdAt" >= ${since}
       GROUP BY 1`,
  ]);

  const key = (d: Date) => d.toISOString().slice(0, 10);
  const sessionsBy = new Map(sessionRows.map((r) => [key(new Date(r.day)), r]));
  const leadsBy = new Map(leadRows.map((r) => [key(new Date(r.day)), Number(r.leads)]));

  // Emit a point for every day in the window, so gaps render as zero rather
  // than being silently skipped by the chart.
  const out: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const k = key(d);
    const s = sessionsBy.get(k);
    out.push({
      date: k,
      visitors: Number(s?.visitors ?? 0),
      sessions: Number(s?.sessions ?? 0),
      leads: leadsBy.get(k) ?? 0,
    });
  }
  return out;
}

export type TrafficSource = {
  source: string;
  medium: string;
  campaign: string;
  sessions: number;
  leads: number;
};

export async function getTrafficSources(days = 30): Promise<TrafficSource[]> {
  const since = sinceDays(days);
  const rows = await prisma.$queryRaw<TrafficSource[]>`
    SELECT
      COALESCE(s."utmSource",
        CASE WHEN s.referrer IS NULL OR s.referrer = '' THEN 'direct' ELSE 'referral' END
      ) AS source,
      COALESCE(s."utmMedium", '(none)') AS medium,
      COALESCE(s."utmCampaign", '(none)') AS campaign,
      COUNT(DISTINCT s.id)::int AS sessions,
      COUNT(DISTINCT l.id)::int AS leads
    FROM "Session" s
    LEFT JOIN "Lead" l ON l."sessionId" = s.id
    WHERE s.site = ${SITE} AND s."startedAt" >= ${since}
    GROUP BY 1, 2, 3
    ORDER BY sessions DESC
    LIMIT 25`;
  return rows.map((r) => ({ ...r, sessions: Number(r.sessions), leads: Number(r.leads) }));
}

// --- Leads -------------------------------------------------------------------

export async function getLeads(status?: LeadStatus) {
  return prisma.lead.findMany({
    where: { site: SITE, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      session: {
        select: { utmSource: true, utmMedium: true, utmCampaign: true, referrer: true, id: true },
      },
      visitor: { select: { country: true, city: true, deviceType: true } },
    },
  });
}

export type LeadRow = Awaited<ReturnType<typeof getLeads>>[number];

export async function getRecentLeads(limit = 8) {
  return prisma.lead.findMany({
    where: { site: SITE },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
      source: true,
    },
  });
}

export async function getLeadStatusCounts(): Promise<Record<string, number>> {
  const rows = await prisma.lead.groupBy({
    by: ["status"],
    where: { site: SITE },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.status, r._count._all]));
}

// --- Sessions ----------------------------------------------------------------

export async function getSessions(limit = 100) {
  return prisma.session.findMany({
    where: { site: SITE },
    orderBy: { startedAt: "desc" },
    take: limit,
    include: {
      visitor: {
        select: {
          fingerprint: true,
          isReturning: true,
          deviceType: true,
          browser: true,
          os: true,
          country: true,
          city: true,
        },
      },
      _count: { select: { replays: true, leads: true } },
    },
  });
}

export type SessionRow = Awaited<ReturnType<typeof getSessions>>[number];

/** Chunks are stored gzip'd and in order; this reassembles the full rrweb stream. */
export async function getSessionReplay(sessionId: string): Promise<unknown[]> {
  const chunks = await prisma.sessionReplay.findMany({
    where: { sessionId, site: SITE },
    orderBy: { seq: "asc" },
    select: { data: true },
  });

  const events: unknown[] = [];
  for (const chunk of chunks) {
    try {
      const json = gunzipSync(Buffer.from(chunk.data)).toString("utf8");
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) events.push(...parsed);
    } catch {
      // A corrupt chunk should not take the whole replay down.
      continue;
    }
  }
  return events;
}

export async function getSessionMeta(sessionId: string) {
  return prisma.session.findFirst({
    where: { id: sessionId, site: SITE },
    include: {
      visitor: { select: { fingerprint: true, deviceType: true, browser: true, os: true } },
      _count: { select: { replays: true } },
    },
  });
}

// --- Heatmap -----------------------------------------------------------------

export async function getHeatmapPaths(): Promise<Array<{ path: string; count: number }>> {
  const rows = await prisma.heatmapEvent.groupBy({
    by: ["path"],
    where: { site: SITE },
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: 50,
  });
  return rows.map((r) => ({ path: r.path, count: r._count._all }));
}

export type HeatmapPoint = { xPct: number; yPct: number };

export async function getHeatmapPoints(
  path: string,
  type: "click" | "hover",
  limit = 3000,
): Promise<HeatmapPoint[]> {
  const rows = await prisma.heatmapEvent.findMany({
    where: { site: SITE, path, type },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { xPct: true, yPct: true },
  });
  return rows;
}

// --- Funnel ------------------------------------------------------------------

export type FunnelStage = { label: string; sessions: number };

export async function getFunnelStats(days = 30): Promise<FunnelStage[]> {
  const since = sinceDays(days);

  const [viewed, scrolled, ctaClicked, formStarted, converted] = await Promise.all([
    prisma.session.count({ where: { site: SITE, startedAt: { gte: since } } }),
    countDistinctSessions("ScrollEvent", since, `AND depth >= 25`),
    countDistinctSessions("CtaEvent", since, `AND action = 'clicked'`),
    countDistinctSessions("FormEvent", since, `AND action = 'started'`),
    prisma.lead
      .findMany({
        where: { site: SITE, createdAt: { gte: since }, sessionId: { not: null } },
        select: { sessionId: true },
        distinct: ["sessionId"],
      })
      .then((rows) => rows.length),
  ]);

  return [
    { label: "Visited a page", sessions: viewed },
    { label: "Scrolled 25%+", sessions: scrolled },
    { label: "Clicked a CTA", sessions: ctaClicked },
    { label: "Started the form", sessions: formStarted },
    { label: "Submitted a lead", sessions: converted },
  ];
}

// --- CTAs --------------------------------------------------------------------

export type CtaStat = {
  ctaId: string;
  viewed: number;
  hovered: number;
  clicked: number;
  ctr: number;
};

export async function getCtaStats(days = 30): Promise<CtaStat[]> {
  const rows = await prisma.ctaEvent.groupBy({
    by: ["ctaId", "action"],
    where: { site: SITE, createdAt: { gte: sinceDays(days) } },
    _count: { _all: true },
  });

  const byId = new Map<string, CtaStat>();
  for (const row of rows) {
    const stat = byId.get(row.ctaId) ?? {
      ctaId: row.ctaId,
      viewed: 0,
      hovered: 0,
      clicked: 0,
      ctr: 0,
    };
    if (row.action === "viewed") stat.viewed = row._count._all;
    else if (row.action === "hovered") stat.hovered = row._count._all;
    else if (row.action === "clicked") stat.clicked = row._count._all;
    byId.set(row.ctaId, stat);
  }

  return [...byId.values()]
    .map((s) => ({ ...s, ctr: s.viewed > 0 ? (s.clicked / s.viewed) * 100 : 0 }))
    .sort((a, b) => b.clicked - a.clicked);
}

// --- Forms -------------------------------------------------------------------

export type FormStat = {
  formId: string;
  viewed: number;
  started: number;
  submitted: number;
  abandoned: number;
  errors: number;
  completionRate: number;
};

export async function getFormStats(days = 30): Promise<FormStat[]> {
  const rows = await prisma.formEvent.groupBy({
    by: ["formId", "action"],
    where: { site: SITE, createdAt: { gte: sinceDays(days) } },
    _count: { _all: true },
  });

  const byId = new Map<string, FormStat>();
  for (const row of rows) {
    const stat = byId.get(row.formId) ?? {
      formId: row.formId,
      viewed: 0,
      started: 0,
      submitted: 0,
      abandoned: 0,
      errors: 0,
      completionRate: 0,
    };
    if (row.action === "viewed") stat.viewed = row._count._all;
    else if (row.action === "started") stat.started = row._count._all;
    else if (row.action === "submitted") stat.submitted = row._count._all;
    else if (row.action === "abandoned") stat.abandoned = row._count._all;
    else if (row.action === "validation_error") stat.errors = row._count._all;
    byId.set(row.formId, stat);
  }

  return [...byId.values()]
    .map((s) => ({
      ...s,
      completionRate: s.started > 0 ? (s.submitted / s.started) * 100 : 0,
    }))
    .sort((a, b) => b.started - a.started);
}

// --- Performance -------------------------------------------------------------

export type PerformanceStat = {
  metric: string;
  average: number;
  samples: number;
  good: number;
  needsImprovement: number;
  poor: number;
};

export async function getPerformanceStats(days = 30): Promise<PerformanceStat[]> {
  const where = { site: SITE, createdAt: { gte: sinceDays(days) } };

  const [averages, ratings] = await Promise.all([
    prisma.performanceMetric.groupBy({
      by: ["metric"],
      where,
      _avg: { value: true },
      _count: { _all: true },
    }),
    prisma.performanceMetric.groupBy({
      by: ["metric", "rating"],
      where,
      _count: { _all: true },
    }),
  ]);

  const order = ["LCP", "INP", "CLS", "FCP", "TTFB"];

  return averages
    .map((row) => {
      const forMetric = ratings.filter((r) => r.metric === row.metric);
      const count = (rating: string) =>
        forMetric.find((r) => r.rating === rating)?._count._all ?? 0;
      return {
        metric: row.metric,
        average: row._avg.value ?? 0,
        samples: row._count._all,
        good: count("good"),
        needsImprovement: count("needs-improvement"),
        poor: count("poor"),
      };
    })
    .sort((a, b) => order.indexOf(a.metric) - order.indexOf(b.metric));
}

// --- Errors ------------------------------------------------------------------

export async function getErrors(limit = 100) {
  return prisma.errorEvent.findMany({
    where: { site: SITE },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      message: true,
      path: true,
      stack: true,
      createdAt: true,
      sessionId: true,
    },
  });
}

// --- Nav badges --------------------------------------------------------------

export async function getNavCounts(): Promise<{ leads: number; sessions: number; errors: number }> {
  const since = sinceDays(30);
  const [leads, sessions, errors] = await Promise.all([
    prisma.lead.count({ where: { site: SITE, status: "new" } }),
    prisma.session.count({ where: { site: SITE, startedAt: { gte: since } } }),
    prisma.errorEvent.count({ where: { site: SITE, createdAt: { gte: since } } }),
  ]);
  return { leads, sessions, errors };
}
