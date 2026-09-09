import { geolocation, ipAddress } from "@vercel/functions";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import { DEVICE_TYPES, bool, clientDate, int, isRecord, oneOf, path, str } from "./payload";

/** Visitor identity + device facts the client can see about itself. */
export function readVisitorInput(raw: unknown) {
  if (!isRecord(raw)) return undefined;
  const fingerprint = str(raw.fingerprint, 128);
  if (!fingerprint) return undefined;
  return {
    fingerprint,
    isReturning: bool(raw.isReturning),
    timezone: str(raw.timezone, 64),
    language: str(raw.language, 32),
    browser: str(raw.browser, 64),
    browserVersion: str(raw.browserVersion, 32),
    os: str(raw.os, 64),
    deviceType: oneOf(raw.deviceType, DEVICE_TYPES),
    screenWidth: int(raw.screenWidth, 0, 20000),
    screenHeight: int(raw.screenHeight, 0, 20000),
  };
}

export type VisitorInput = NonNullable<ReturnType<typeof readVisitorInput>>;

/** Per-tab session facts: entry context and acquisition attribution. */
export function readSessionInput(raw: unknown) {
  if (!isRecord(raw)) return undefined;
  const clientId = str(raw.clientId, 128);
  if (!clientId) return undefined;
  return {
    clientId,
    startedAt: clientDate(raw.startedAt),
    entryPath: path(raw.entryPath),
    referrer: str(raw.referrer, 1024),
    utmSource: str(raw.utmSource, 128),
    utmMedium: str(raw.utmMedium, 128),
    utmCampaign: str(raw.utmCampaign, 128),
    utmContent: str(raw.utmContent, 128),
    utmTerm: str(raw.utmTerm, 128),
    gclid: str(raw.gclid, 256),
    fbclid: str(raw.fbclid, 256),
    msclkid: str(raw.msclkid, 256),
    viewportWidth: int(raw.viewportWidth, 0, 20000),
    viewportHeight: int(raw.viewportHeight, 0, 20000),
  };
}

export type SessionInput = NonNullable<ReturnType<typeof readSessionInput>>;

/**
 * Geo/IP come from Vercel's edge network headers. They are null in local dev and
 * on non-Vercel hosts — every consumer treats them as optional.
 */
export function readRequestGeo(request: Request) {
  try {
    const geo = geolocation(request);
    return {
      ipAddress: ipAddress(request) ?? null,
      country: geo.country ?? null,
      // `countryRegion` is the ISO 3166-2 region of the client. Deliberately not
      // falling back to `geo.region`, which is Vercel's edge region (e.g "iad1")
      // and says where the request was served, not where the visitor is.
      region: geo.countryRegion ?? null,
      // Already URL-decoded by @vercel/functions; decoding again would throw on
      // a city name containing a literal '%'.
      city: geo.city ?? null,
    };
  } catch {
    return { ipAddress: null, country: null, region: null, city: null };
  }
}

/**
 * Find-or-create the Visitor for this fingerprint within this site.
 *
 * `isReturning` is decided server-side (did a row already exist?) rather than
 * trusting the client's own claim, which is only a localStorage flag.
 */
export async function upsertVisitor(
  request: Request,
  input: VisitorInput,
): Promise<{ id: string }> {
  const geo = readRequestGeo(request);

  const device = {
    timezone: input.timezone,
    language: input.language,
    browser: input.browser,
    browserVersion: input.browserVersion,
    os: input.os,
    deviceType: input.deviceType,
    screenWidth: input.screenWidth,
    screenHeight: input.screenHeight,
    ...(geo.country ? { country: geo.country } : {}),
    ...(geo.region ? { region: geo.region } : {}),
    ...(geo.city ? { city: geo.city } : {}),
  };

  const existing = await prisma.visitor.findUnique({
    where: { site_fingerprint: { site: SITE, fingerprint: input.fingerprint } },
    select: { id: true },
  });

  if (existing) {
    await prisma.visitor.update({
      where: { id: existing.id },
      data: { ...device, isReturning: true },
    });
    return existing;
  }

  return prisma.visitor.create({
    data: { site: SITE, fingerprint: input.fingerprint, isReturning: false, ...device },
    select: { id: true },
  });
}

/** Find-or-create the Session for this clientId. Attribution is only set on create. */
export async function findOrCreateSession(
  request: Request,
  visitorId: string,
  input: SessionInput,
): Promise<{ id: string; startedAt: Date; pagesViewed: number; isBounce: boolean }> {
  const select = { id: true, startedAt: true, pagesViewed: true, isBounce: true };

  const existing = await prisma.session.findUnique({ where: { clientId: input.clientId }, select });
  if (existing) return existing;

  const geo = readRequestGeo(request);

  try {
    return await prisma.session.create({
      data: {
        site: SITE,
        clientId: input.clientId,
        visitorId,
        startedAt: input.startedAt,
        entryPath: input.entryPath,
        referrer: input.referrer,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
        utmContent: input.utmContent,
        utmTerm: input.utmTerm,
        gclid: input.gclid,
        fbclid: input.fbclid,
        msclkid: input.msclkid,
        viewportWidth: input.viewportWidth,
        viewportHeight: input.viewportHeight,
        ipAddress: geo.ipAddress,
      },
      select,
    });
  } catch {
    // Two beacons for a new tab can race on the unique clientId; the loser reads
    // the row the winner just wrote.
    const raced = await prisma.session.findUnique({ where: { clientId: input.clientId }, select });
    if (raced) return raced;
    throw new Error("Could not create or find session");
  }
}

/** Look up an existing session without creating one (used by /api/replay). */
export async function findSessionByClientId(clientId: string) {
  return prisma.session.findUnique({ where: { clientId }, select: { id: true, site: true } });
}
