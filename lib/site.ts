/**
 * Which landing site this deployment is.
 *
 * Both landing sites share one database; every analytics/lead row carries this
 * value so each admin panel only ever reads its own traffic. It is a build-time
 * constant rather than an env var so the two deployments can never be
 * misconfigured into reading each other's data.
 */
export const SITE = "academy" as const;

/** Human-readable name, used in the admin chrome and report headers. */
export const SITE_LABEL = "Academy OS";
