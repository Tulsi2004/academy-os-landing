import { gzipSync } from "node:zlib";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import { findSessionByClientId } from "@/lib/analytics/ingest";
import { LIMITS, int, isRecord, str } from "@/lib/analytics/payload";

/**
 * Public session-replay sink. Stores one gzip'd chunk of rrweb events per call,
 * keyed by (sessionId, seq) so the player can reassemble them in order and a
 * client retry cannot duplicate a chunk.
 *
 * Should be consent-gated on the client before recording starts.
 */

const MAX_BODY_BYTES = 4_000_000;

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

  const clientId = str(body.clientId, 128);
  const seq = int(body.seq, 0, 1_000_000);
  const events = body.events;

  if (!clientId || seq === undefined || !Array.isArray(events) || events.length === 0) {
    return Response.json({ ok: false, error: "invalid chunk" }, { status: 400 });
  }

  // The replay beacon can beat the first /api/track call, so the session may not
  // exist yet. Tell the client to hold the chunk and retry rather than dropping it.
  const session = await findSessionByClientId(clientId);
  if (!session) {
    return Response.json({ ok: true, retry: true });
  }
  if (session.site !== SITE) {
    return Response.json({ ok: false, error: "unknown session" }, { status: 400 });
  }

  let compressed: Uint8Array<ArrayBuffer>;
  try {
    const encoded = JSON.stringify(events);
    if (encoded.length > LIMITS.replayBytes) {
      return Response.json({ ok: false, error: "chunk too large" }, { status: 413 });
    }
    // Copied into a plain Uint8Array: Prisma's Bytes input rejects Node's
    // Buffer type, whose backing store may be a SharedArrayBuffer.
    const gzipped = gzipSync(Buffer.from(encoded, "utf8"));
    compressed = new Uint8Array(gzipped.byteLength);
    compressed.set(gzipped);
  } catch {
    return Response.json({ ok: false, error: "could not encode chunk" }, { status: 400 });
  }

  try {
    await prisma.sessionReplay.upsert({
      where: { sessionId_seq: { sessionId: session.id, seq } },
      create: {
        site: SITE,
        sessionId: session.id,
        seq,
        data: compressed,
        eventCount: events.length,
      },
      update: { data: compressed, eventCount: events.length },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[/api/replay] could not store chunk", error);
    return Response.json({ ok: false, error: "could not store chunk" }, { status: 500 });
  }
}
