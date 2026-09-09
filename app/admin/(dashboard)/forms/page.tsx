import { PageHeader } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { RangeTabs, resolveDays } from "@/components/admin/RangeTabs";
import { getFormStats } from "@/lib/admin/queries";
import { num, pct } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function FormsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = resolveDays((await searchParams).days);
  const stats = await getFormStats(days);

  return (
    <>
      <PageHeader
        title="Forms"
        description="The form funnel, step by step. Started means the first field was focused; abandoned means started but never submitted before the visitor left."
        actions={<RangeTabs basePath="/admin/forms" days={days} />}
      />

      <Table>
        <Thead>
          <Th>Form</Th>
          <Th numeric>Viewed</Th>
          <Th numeric>Started</Th>
          <Th numeric>Submitted</Th>
          <Th numeric>Abandoned</Th>
          <Th numeric>Validation errors</Th>
          <Th numeric>Completion</Th>
        </Thead>
        <tbody>
          {stats.length === 0 ? (
            <EmptyState
              title="No form activity recorded"
              hint='Wrap a form in data-form="some-id" on the public site to start measuring it.'
              colSpan={7}
            />
          ) : (
            stats.map((stat) => (
              <Tr key={stat.formId}>
                <Td mono>{stat.formId}</Td>
                <Td numeric>{num(stat.viewed)}</Td>
                <Td numeric>{num(stat.started)}</Td>
                <Td numeric>{num(stat.submitted)}</Td>
                <Td numeric>{num(stat.abandoned)}</Td>
                <Td numeric>{num(stat.errors)}</Td>
                <Td numeric>{stat.started > 0 ? pct(stat.completionRate) : "—"}</Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
