import type { LocaleCode } from "@/lib/i18n/locales";

/**
 * Format a post date in the reader's language.
 *
 * Missing or garbage dates fall back to a caller-supplied label rather than
 * rendering "Invalid Date" — the CMS is user input.
 */
export function formatPostDate(iso: string | undefined, locale: LocaleCode, fallback: string) {
  if (!iso) return fallback;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getFullYear() < 2000) return fallback;
  return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}
