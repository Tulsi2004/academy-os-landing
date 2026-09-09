import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import {
  findOrCreateSession,
  readSessionInput,
  readVisitorInput,
  upsertVisitor,
} from "@/lib/analytics/ingest";
import { LIMITS, isRecord, str } from "@/lib/analytics/payload";

/**
 * Public lead capture. Unauthenticated (it backs a public form).
 *
 * The visitor/session block is optional: a lead still saves if the tracking
 * beacon never ran (ad blocker, JS error), it just lands unattributed.
 */

const MAX_BODY_BYTES = 100_000;

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

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const phone = str(body.phone, 64);

  // At least one way to reach them, or the lead is worthless.
  if (!email && !phone) {
    return Response.json(
      { ok: false, error: "An email address or phone number is required." },
      { status: 400 },
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "That email address is not valid." }, { status: 400 });
  }

  // Honeypot: a hidden field real users never fill. Answer 200 so a bot cannot
  // tell it was rejected, but write nothing.
  if (str(body.company_website, 200)) {
    return Response.json({ ok: true });
  }

  try {
    let visitorId: string | null = null;
    let sessionId: string | null = null;

    const visitorInput = readVisitorInput(body.visitor);
    const sessionInput = readSessionInput(body.session);

    if (visitorInput) {
      const visitor = await upsertVisitor(request, visitorInput);
      visitorId = visitor.id;
      if (sessionInput) {
        const session = await findOrCreateSession(request, visitor.id, sessionInput);
        sessionId = session.id;
      }
    }

    const lead = await prisma.lead.create({
      data: {
        site: SITE,
        visitorId,
        sessionId,
        formId: str(body.formId, 128) ?? null,
        name: name ?? null,
        phone: phone ?? null,
        email: email ?? null,
        company: str(body.company, 200) ?? null,
        interest: str(body.interest, 200) ?? null,
        message: str(body.message, LIMITS.longString) ?? null,
        source: str(body.source, 128) ?? null,
      },
      select: { id: true },
    });

    return Response.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("[/api/leads] could not save lead", error);
    return Response.json({ ok: false, error: "could not save lead" }, { status: 500 });
  }
}
