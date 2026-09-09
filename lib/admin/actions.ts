"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";
import { verifyAdminSession } from "@/lib/auth/dal";
import { LEAD_STATUSES } from "@/lib/analytics/payload";

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
