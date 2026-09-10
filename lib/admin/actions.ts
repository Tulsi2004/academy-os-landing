"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import { verifyAdminSession } from "@/lib/auth/dal";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/analytics/payload";
import { getErrorsPage, getLeadsPage, getSessionsPage } from "@/lib/admin/queries";
import {
  toErrorRowView,
  toLeadRowView,
  toSessionRowView,
  type ErrorRowView,
  type LeadRowView,
  type SessionRowView,
} from "@/lib/admin/rows";

export type ActionResult = { ok: boolean; error?: string };

/**
 * Every action re-checks auth itself. The (dashboard) layout guard does not
 * cover Server Actions, which can be invoked directly.
 */
export async function updateLeadStatus(leadId: string, status: string): Promise<ActionResult> {
  await verifyAdminSession();

  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: "Unknown status." };
  }

  // Scoped by site as well as id, so a lead belonging to the other landing site
  // cannot be edited from this panel.
  const result = await prisma.lead.updateMany({
    where: { id: leadId, site: SITE },
    data: { status },
  });

  if (result.count === 0) return { ok: false, error: "Lead not found." };

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

// --- Lazy-loaded list pages --------------------------------------------------

/*
 * "Load more" for the list tables. Each returns the next page already mapped to
 * its view model, so the client component appends plain strings rather than
 * re-formatting Prisma rows — see lib/admin/rows.ts for why that matters.
 *
 * These read rather than write, so none of them revalidate: the pages already
 * declare `dynamic = "force-dynamic"`, and revalidating here would throw away
 * the pages the visitor has just loaded.
 */

export type PageResult<T> = { ok: boolean; items: T[]; nextCursor: string | null; error?: string };

function failed<T>(error: string): PageResult<T> {
  return { ok: false, items: [], nextCursor: null, error };
}

export async function loadMoreLeads(
  cursor: string,
  status?: string,
): Promise<PageResult<LeadRowView>> {
  await verifyAdminSession();

  const filter = (LEAD_STATUSES as readonly string[]).includes(status ?? "")
    ? (status as LeadStatus)
    : undefined;

  try {
    const page = await getLeadsPage(filter, cursor);
    return { ok: true, items: page.items.map(toLeadRowView), nextCursor: page.nextCursor };
  } catch (error) {
    console.error("[admin] loadMoreLeads failed", error);
    return failed("Could not load more leads.");
  }
}

export async function loadMoreSessions(cursor: string): Promise<PageResult<SessionRowView>> {
  await verifyAdminSession();

  try {
    const page = await getSessionsPage(cursor);
    return { ok: true, items: page.items.map(toSessionRowView), nextCursor: page.nextCursor };
  } catch (error) {
    console.error("[admin] loadMoreSessions failed", error);
    return failed("Could not load more sessions.");
  }
}

export async function loadMoreErrors(cursor: string): Promise<PageResult<ErrorRowView>> {
  await verifyAdminSession();

  try {
    const page = await getErrorsPage(cursor);
    return { ok: true, items: page.items.map(toErrorRowView), nextCursor: page.nextCursor };
  } catch (error) {
    console.error("[admin] loadMoreErrors failed", error);
    return failed("Could not load more errors.");
  }
}
