import { PageHeader } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { getErrors } from "@/lib/admin/queries";
import { dateTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  js: "JS error",
  unhandled_rejection: "Promise rejection",
  image_load: "Image failed",
};

export default async function ErrorsPage() {
  const errors = await getErrors(100);

  return (
    <>
      <PageHeader
        title="Errors"
        description="The last 100 client-side errors caught on the public site. Hover a message to see its stack trace."
      />

      <Table>
        <Thead>
          <Th>When</Th>
          <Th>Type</Th>
          <Th>Message</Th>
          <Th>Path</Th>
        </Thead>
        <tbody>
          {errors.length === 0 ? (
            <EmptyState
              title="No errors recorded"
              hint="Nothing has thrown in a visitor's browser — the good outcome."
              colSpan={4}
            />
          ) : (
            errors.map((error) => (
              <Tr key={error.id}>
                <Td>{dateTime(error.createdAt)}</Td>
                <Td>
                  <span
                    className={`adm-badge ${
                      error.type === "image_load" ? "adm-badge-contacted" : "adm-badge-lost"
                    }`}
                  >
                    {TYPE_LABELS[error.type] ?? error.type}
                  </span>
                </Td>
                <Td truncate title={error.stack ?? error.message}>
                  {error.message}
                </Td>
                <Td mono>{error.path ?? "—"}</Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
