import { PageHeader } from "@/components/admin/PageHeader";
import { ErrorsTable } from "@/components/admin/ErrorsTable";
import { countErrors, getErrorsPage } from "@/lib/admin/queries";
import { toErrorRowView } from "@/lib/admin/rows";

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  // Only the first page is fetched here; ErrorsTable pulls the rest on demand.
  const [page, total] = await Promise.all([getErrorsPage(), countErrors()]);

  return (
    <>
      <PageHeader
        title="Errors"
        description="Client-side errors caught on the public site, newest first. Hover a message to see its stack trace."
      />

      <ErrorsTable
        initialErrors={page.items.map(toErrorRowView)}
        initialCursor={page.nextCursor}
        total={total}
      />
    </>
  );
}
