import type { ErrorRow, LeadRow, SessionRow } from "./queries";
import { dateTime, duration, locationLabel, shortId } from "./format";

/**
 * View models for the lazy-loaded tables.
 *
 * The tables are client components (they hold the "load more" state), and the
 * rows they render arrive from two places: the server component on first paint,
 * and a Server Action on every page after that. Both go through the mappers
 * here, so the two paths can never format the same row differently.
 *
 * Dates are formatted here, on the server, and cross the boundary as strings.
 * That is deliberate: `dateTime` uses the runtime's own time zone, so a Date
 * formatted during hydration in Mumbai would not match the same Date formatted
 * during SSR in UTC, and React would report a mismatch. Sending strings also
 * keeps Prisma's full row objects out of the client payload.
 */

export type LeadRowView = {
  id: string;
  received: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string;
  message: string;
  source: string;
  location: string;
  status: string;
};

export function toLeadRowView(lead: LeadRow): LeadRowView {
  return {
    id: lead.id,
    received: dateTime(lead.createdAt),
    name: lead.name ?? "—",
    email: lead.email,
    phone: lead.phone,
    company: lead.company ?? "—",
    message: lead.message ?? "—",
    source: lead.session?.utmSource ?? lead.source ?? lead.session?.referrer ?? "direct",
    location: locationLabel(lead.visitor?.city, lead.visitor?.country),
    status: lead.status,
  };
}

export type SessionRowView = {
  id: string;
  started: string;
  fingerprint: string;
  fingerprintShort: string;
  isReturning: boolean;
  device: string;
  location: string;
  ipAddress: string;
  referrer: string | null;
  source: string;
  entryPath: string;
  pagesViewed: number;
  duration: string;
  isBounce: boolean;
  hasReplay: boolean;
};

export function toSessionRowView(session: SessionRow): SessionRowView {
  return {
    id: session.id,
    started: dateTime(session.startedAt),
    fingerprint: session.visitor.fingerprint,
    fingerprintShort: shortId(session.visitor.fingerprint),
    isReturning: session.visitor.isReturning,
    device:
      [session.visitor.deviceType, session.visitor.browser, session.visitor.os]
        .filter(Boolean)
        .join(" · ") || "—",
    location: locationLabel(session.visitor.city, session.visitor.country),
    ipAddress: session.ipAddress ?? "—",
    referrer: session.referrer,
    source: session.utmSource ?? session.referrer ?? "direct",
    entryPath: session.entryPath ?? "—",
    pagesViewed: session.pagesViewed,
    duration: duration(session.totalDuration),
    isBounce: session.isBounce,
    hasReplay: session._count.replays > 0,
  };
}

export type ErrorRowView = {
  id: string;
  when: string;
  type: string;
  message: string;
  /** Full stack where captured, shown as the row's tooltip. */
  detail: string;
  path: string;
};

export function toErrorRowView(error: ErrorRow): ErrorRowView {
  return {
    id: error.id,
    when: dateTime(error.createdAt),
    type: error.type,
    message: error.message,
    detail: error.stack ?? error.message,
    path: error.path ?? "—",
  };
}
