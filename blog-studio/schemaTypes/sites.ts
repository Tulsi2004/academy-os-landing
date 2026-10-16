/**
 * The two landing sites this studio feeds.
 *
 * These values must stay in sync with `SITE` in each Next.js app's
 * `lib/site.ts` — the frontends query `$SITE in sites`, so a typo here means a
 * post silently never appears.
 */
export const SITES = [
  { title: "TULSI", value: "tulsi" },
  { title: "Academy OS", value: "academy" },
] as const;
