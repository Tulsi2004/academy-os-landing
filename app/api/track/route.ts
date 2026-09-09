import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import {
  findOrCreateSession,
  readSessionInput,
  readVisitorInput,
  upsertVisitor,
} from "@/lib/analytics/ingest";
import {
  CTA_ACTIONS,
  ERROR_TYPES,
  FORM_ACTIONS,
  HEATMAP_TYPES,
  LIMITS,
  METRICS,
  MOUSE_TYPES,
  RATINGS,
  SCROLL_DEPTHS,
  clientDate,
  int,
  isRecord,
  list,
  num,
  oneOf,
  path,
  str,
} from "@/lib/analytics/payload";

/**
 * Public analytics beacon. Unauthenticated by design — a browser cannot hold a
 * secret — so every field is re-validated and clamped in lib/analytics/payload.
 */

const MAX_BODY_BYTES = 1_000_000;

// A session under this duration counts as a bounce unless the visitor showed
// another signal (a second page, a scroll, a CTA, a form touch).
const ENGAGED_MS = 10_000;

function jsonMetadata(value: unknown): Prisma.InputJsonValue | undefined {
  if (!isRecord(value)) return undefined;
  const encoded = JSON.stringify(value);
  if (!encoded || encoded.length > LIMITS.longString) return undefined;
  return value as Prisma.InputJsonValue;
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  if (!isRecord(body)) {
    return Response.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const visitorInput = readVisitorInput(body.visitor);
  const sessionInput = readSessionInput(body.session);
  if (!visitorInput || !sessionInput) {
    return Response.json({ ok: false, error: "missing visitor or session" }, { status: 400 });
  }

  // ---- Normalise every event array before touching the database -------------

  const pageViews = list(body.pageViews, (e) => {
    const p = path(e.path);
    if (!p) return undefined;
    return {
      path: p,
      title: str(e.title, 256) ?? null,
      enteredAt: clientDate(e.enteredAt),
      exitedAt: e.exitedAt === undefined || e.exitedAt === null ? null : clientDate(e.exitedAt),
      timeOnPage: int(e.timeOnPage, 0, 86_400_000) ?? null,
    };
  });

  const events = list(body.events, (e) => {
    const name = str(e.name, 128);
    if (!name) return undefined;
    return { name, metadata: jsonMetadata(e.metadata), createdAt: clientDate(e.createdAt) };
  });

  const scrolls = list(body.scrolls, (e) => {
    const p = path(e.path);
    const depth = int(e.depth, 0, 100);
    if (!p || depth === undefined) return undefined;
    if (!(SCROLL_DEPTHS as readonly number[]).includes(depth)) return undefined;
    return {
      path: p,
      depth,
      timeToReach: int(e.timeToReach, 0, 86_400_000) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  const ctas = list(body.ctas, (e) => {
    const ctaId = str(e.ctaId, 128);
    const action = oneOf(e.action, CTA_ACTIONS);
    if (!ctaId || !action) return undefined;
    return {
      ctaId,
      action,
      timeBeforeClick: int(e.timeBeforeClick, 0, 86_400_000) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  const forms = list(body.forms, (e) => {
    const formId = str(e.formId, 128);
    const action = oneOf(e.action, FORM_ACTIONS);
    if (!formId || !action) return undefined;
    return {
      formId,
      action,
      fieldName: str(e.fieldName, 128) ?? null,
      errorMessage: str(e.errorMessage, 512) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  const metrics = list(body.metrics, (e) => {
    const p = path(e.path);
    const metric = oneOf(e.metric, METRICS);
    const rating = oneOf(e.rating, RATINGS);
    const value = num(e.value, 0, 1_000_000);
    if (!p || !metric || !rating || value === undefined) return undefined;
    return { path: p, metric, value, rating, createdAt: clientDate(e.createdAt) };
  });

  const errors = list(body.errors, (e) => {
    const type = oneOf(e.type, ERROR_TYPES);
    const message = str(e.message, LIMITS.string);
    if (!type || !message) return undefined;
    return {
      type,
      message,
      stack: str(e.stack, LIMITS.stack) ?? null,
      path: path(e.path) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  const mouse = list(body.mouse, (e) => {
    const p = path(e.path);
    const type = oneOf(e.type, MOUSE_TYPES);
    const x = int(e.x, -20000, 20000);
    const y = int(e.y, -20000, 200000);
    if (!p || !type || x === undefined || y === undefined) return undefined;
    return {
      path: p,
      type,
      x,
      y,
      targetSelector: str(e.targetSelector, 256) ?? null,
      hoverDuration: int(e.hoverDuration, 0, 86_400_000) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  const heatmap = list(body.heatmap, (e) => {
    const p = path(e.path);
    const type = oneOf(e.type, HEATMAP_TYPES);
    const xPct = num(e.xPct, 0, 100);
    const yPct = num(e.yPct, 0, 100);
    if (!p || !type || xPct === undefined || yPct === undefined) return undefined;
    return {
      path: p,
      type,
      xPct,
      yPct,
      viewportWidth: int(e.viewportWidth, 0, 20000) ?? null,
      createdAt: clientDate(e.createdAt),
    };
  });

  // ---- Persist --------------------------------------------------------------

  try {
    const visitor = await upsertVisitor(request, visitorInput);
    const session = await findOrCreateSession(request, visitor.id, sessionInput);

    const base = { site: SITE, sessionId: session.id };

    await Promise.all([
      pageViews.length
        ? prisma.pageView.createMany({ data: pageViews.map((d) => ({ ...base, ...d })) })
        : null,
      events.length
        ? prisma.event.createMany({ data: events.map((d) => ({ ...base, ...d })) })
        : null,
      scrolls.length
        ? prisma.scrollEvent.createMany({ data: scrolls.map((d) => ({ ...base, ...d })) })
        : null,
      ctas.length
        ? prisma.ctaEvent.createMany({ data: ctas.map((d) => ({ ...base, ...d })) })
        : null,
      forms.length
        ? prisma.formEvent.createMany({ data: forms.map((d) => ({ ...base, ...d })) })
        : null,
      metrics.length
        ? prisma.performanceMetric.createMany({ data: metrics.map((d) => ({ ...base, ...d })) })
        : null,
      errors.length
        ? prisma.errorEvent.createMany({ data: errors.map((d) => ({ ...base, ...d })) })
        : null,
      mouse.length
        ? prisma.mouseEvent.createMany({ data: mouse.map((d) => ({ ...base, ...d })) })
        : null,
      heatmap.length
        ? prisma.heatmapEvent.createMany({ data: heatmap.map((d) => ({ ...base, ...d })) })
        : null,
    ]);

    // ---- Roll the session forward -------------------------------------------

    const lastActivityAt = clientDate(body.lastActivityAt ?? Date.now());
    const totalPages = session.pagesViewed + pageViews.length;
    const elapsedMs = lastActivityAt.getTime() - session.startedAt.getTime();

    const engaged =
      totalPages > 1 ||
      elapsedMs >= ENGAGED_MS ||
      scrolls.length > 0 ||
      ctas.length > 0 ||
      forms.length > 0 ||
      events.length > 0;

    await prisma.session.update({
      where: { id: session.id },
      data: {
        endedAt: lastActivityAt,
        totalDuration: Math.max(0, Math.round(elapsedMs / 1000)),
        pagesViewed: totalPages,
        exitPath: path(body.exitPath) ?? pageViews.at(-1)?.path ?? undefined,
        // Only ever clears the flag — a later quiet batch must not re-bounce a
        // session that already showed engagement.
        ...(engaged && session.isBounce ? { isBounce: false } : {}),
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[/api/track] ingestion failed", error);
    return Response.json({ ok: false, error: "ingestion failed" }, { status: 500 });
  }
}
