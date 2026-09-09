import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import { getTrafficSources } from "./queries";

/** Date-range resolution shared by the reports page and the export routes. */

export type ReportRange = { from: Date; to: Date; label: string; days: number };

const PRESETS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setUTCHours(23, 59, 59, 999);
  return copy;
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Accepts either a preset (`range=30d`) or an explicit `from`/`to` pair.
 * Falls back to the last 30 days for anything unrecognised.
 */
export function resolveReportRange(params: {
  range?: string;
  from?: string;
  to?: string;
}): ReportRange {
  const from = parseDate(params.from);
  const to = parseDate(params.to);

  if (from && to) {
    // Tolerate a reversed pair rather than returning an empty report.
    const [start, end] = from <= to ? [from, to] : [to, from];
    const days = Math.max(
      1,
      Math.round((endOfDay(end).getTime() - startOfDay(start).getTime()) / 86_400_000),
    );
    return {
      from: startOfDay(start),
      to: endOfDay(end),
      label: `${start.toISOString().slice(0, 10)} to ${end.toISOString().slice(0, 10)}`,
      days,
    };
  }

  const days = PRESETS[params.range ?? "30d"] ?? 30;
  const end = new Date();
  const begin = new Date(end.getTime() - days * 86_400_000);
  return {
    from: startOfDay(begin),
    to: end,
    label: `Last ${days} days`,
    days,
  };
}

export type ReportOverview = {
  range: ReportRange;
  visitors: number;
  sessions: number;
  pageViews: number;
  leads: number;
  conversionRate: number;
  bounceRate: number;
  avgDurationSeconds: number;
  ctaClicks: number;
  errors: number;
  sources: Awaited<ReturnType<typeof getTrafficSources>>;
};

export async function getReportOverview(range: ReportRange): Promise<ReportOverview> {
  const inRange = { gte: range.from, lte: range.to };
  const sessionWhere = { site: SITE, startedAt: inRange };

  const [visitors, sessions, pageViews, leads, bounced, duration, ctaClicks, errors, sources] =
    await Promise.all([
      prisma.session
        .findMany({ where: sessionWhere, select: { visitorId: true }, distinct: ["visitorId"] })
        .then((rows) => rows.length),
      prisma.session.count({ where: sessionWhere }),
      prisma.pageView.count({ where: { site: SITE, enteredAt: inRange } }),
      prisma.lead.count({ where: { site: SITE, createdAt: inRange } }),
      prisma.session.count({ where: { ...sessionWhere, isBounce: true } }),
      prisma.session.aggregate({
        where: { ...sessionWhere, totalDuration: { not: null } },
        _avg: { totalDuration: true },
      }),
      prisma.ctaEvent.count({ where: { site: SITE, action: "clicked", createdAt: inRange } }),
      prisma.errorEvent.count({ where: { site: SITE, createdAt: inRange } }),
      getTrafficSources(range.days),
    ]);

  return {
    range,
    visitors,
    sessions,
    pageViews,
    leads,
    conversionRate: sessions > 0 ? (leads / sessions) * 100 : 0,
    bounceRate: sessions > 0 ? (bounced / sessions) * 100 : 0,
    avgDurationSeconds: Math.round(duration._avg.totalDuration ?? 0),
    ctaClicks,
    errors,
    sources,
  };
}

/** Full lead rows for the leads export. */
export async function getReportLeads(range: ReportRange) {
  return prisma.lead.findMany({
    where: { site: SITE, createdAt: { gte: range.from, lte: range.to } },
    orderBy: { createdAt: "desc" },
    include: {
      session: { select: { utmSource: true, utmMedium: true, utmCampaign: true, referrer: true } },
      visitor: { select: { country: true, city: true, deviceType: true } },
    },
  });
}
