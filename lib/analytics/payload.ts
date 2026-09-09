/**
 * Shapes and sanitisers for the public /api/track and /api/leads payloads.
 *
 * These endpoints are unauthenticated by design (a browser beacon cannot hold a
 * secret), so everything here assumes the input is hostile: unknown fields are
 * dropped, strings are length-clamped, numbers are range-clamped, and every
 * array is capped so one request cannot insert unbounded rows.
 */

export const LIMITS = {
  string: 512,
  longString: 4000,
  stack: 8000,
  arrayPerBatch: 200,
  replayBytes: 2_000_000,
} as const;

export const SCROLL_DEPTHS = [25, 50, 75, 100] as const;
export const CTA_ACTIONS = ["viewed", "hovered", "clicked"] as const;
export const FORM_ACTIONS = [
  "viewed",
  "started",
  "field_focus",
  "field_complete",
  "validation_error",
  "abandoned",
  "submitted",
] as const;
export const METRICS = ["LCP", "INP", "CLS", "FCP", "TTFB"] as const;
export const RATINGS = ["good", "needs-improvement", "poor"] as const;
export const ERROR_TYPES = ["js", "unhandled_rejection", "image_load"] as const;
export const MOUSE_TYPES = ["rage_click", "dead_click", "double_click"] as const;
export const HEATMAP_TYPES = ["click", "hover"] as const;
export const DEVICE_TYPES = ["mobile", "tablet", "desktop"] as const;
export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Trimmed string, clamped to `max`; undefined for anything empty or non-string. */
export function str(value: unknown, max: number = LIMITS.string): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

/** Like `str`, but only accepts one of `allowed`. */
export function oneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): T[number] | undefined {
  const s = str(value, 64);
  return s && (allowed as readonly string[]).includes(s) ? (s as T[number]) : undefined;
}

export function num(value: unknown, min: number, max: number): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(n, min), max);
}

export function int(value: unknown, min: number, max: number): number | undefined {
  const n = num(value, min, max);
  return n === undefined ? undefined : Math.round(n);
}

export function bool(value: unknown): boolean {
  return value === true;
}

/** Epoch-ms timestamp from the client, clamped to a sane window around now. */
export function clientDate(value: unknown): Date {
  const now = Date.now();
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return new Date(now);
  // Reject clock-skewed or forged timestamps: 30 days back, 5 minutes forward.
  const min = now - 30 * 24 * 60 * 60 * 1000;
  const max = now + 5 * 60 * 1000;
  return new Date(Math.min(Math.max(n, min), max));
}

/** A URL path, normalised to a leading slash and stripped of query/hash. */
export function path(value: unknown): string | undefined {
  const raw = str(value, 1024);
  if (!raw) return undefined;
  let p = raw;
  const cut = p.search(/[?#]/);
  if (cut !== -1) p = p.slice(0, cut);
  if (!p.startsWith("/")) p = `/${p}`;
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : "/";
}

/** Reads an array field, dropping entries the mapper rejects, capped in length. */
export function list<T>(
  value: unknown,
  map: (entry: Record<string, unknown>) => T | undefined,
  cap: number = LIMITS.arrayPerBatch,
): T[] {
  if (!Array.isArray(value)) return [];
  const out: T[] = [];
  for (const entry of value.slice(0, cap)) {
    if (!isRecord(entry)) continue;
    const mapped = map(entry);
    if (mapped !== undefined) out.push(mapped);
  }
  return out;
}
