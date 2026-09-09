/** Display formatters shared across the admin pages. */

const numberFormat = new Intl.NumberFormat("en-US");

export function num(value: number | null | undefined): string {
  return numberFormat.format(Math.round(value ?? 0));
}

export function pct(value: number | null | undefined, digits = 1): string {
  return `${(value ?? 0).toFixed(digits)}%`;
}

/** Seconds as a compact duration: 45s, 3m 12s, 1h 04m. */
export function duration(seconds: number | null | undefined): string {
  const total = Math.max(0, Math.round(seconds ?? 0));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  if (minutes < 60) return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`;
}

/** Core Web Vitals: CLS is unitless, everything else is milliseconds. */
export function metricValue(metric: string, value: number): string {
  if (metric === "CLS") return value.toFixed(3);
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`;
  return `${Math.round(value)}ms`;
}

export function dateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function relativeTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2_592_000) return `${Math.floor(seconds / 86400)}d ago`;
  return dateTime(d);
}

/** A fingerprint is a UUID; only the leading block is useful on screen. */
export function shortId(value: string | null | undefined, length = 8): string {
  if (!value) return "—";
  return value.replace(/-/g, "").slice(0, length);
}

export function locationLabel(
  city?: string | null,
  country?: string | null,
): string {
  return [city, country].filter(Boolean).join(", ") || "—";
}
