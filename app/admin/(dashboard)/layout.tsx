import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { verifyAdminSession } from "@/lib/auth/dal";
import { getNavCounts } from "@/lib/admin/queries";

/**
 * Guards every admin page except /admin/login.
 *
 * One await here protects all nested routes. Server Actions and route handlers
 * still verify independently — this layout does not run for those.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await verifyAdminSession();

  const counts = await getNavCounts().catch(() => ({ leads: 0, sessions: 0, errors: 0 }));

  return (
    <>
      <AdminNav counts={counts} />
      <main className="adm-main">{children}</main>
    </>
  );
}
