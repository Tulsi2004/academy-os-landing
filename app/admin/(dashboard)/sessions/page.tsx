import { PageHeader } from "@/components/admin/PageHeader";
import { SessionsTable } from "@/components/admin/SessionsTable";
import { countSessions, getSessionsPage } from "@/lib/admin/queries";
import { toSessionRowView } from "@/lib/admin/rows";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  // Only the first page is fetched here; SessionsTable pulls the rest on demand.
  const [page, total] = await Promise.all([getSessionsPage(), countSessions()]);

  return (
    <>
      <PageHeader
        title="Sessions"
        description="Visits newest first. One session per browser tab; replays are available where the recorder captured enough events."
      />

      <SessionsTable
        initialSessions={page.items.map(toSessionRowView)}
        initialCursor={page.nextCursor}
        total={total}
      />
    </>
  );
}
