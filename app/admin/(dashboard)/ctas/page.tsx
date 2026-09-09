import { PageHeader } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { RangeTabs, resolveDays } from "@/components/admin/RangeTabs";
import { getCtaStats } from "@/lib/admin/queries";
import { num, pct } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function CtasPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = resolveDays((await searchParams).days);
  const stats = await getCtaStats(days);

  return (
    <>
      <PageHeader
        title="CTAs"
        description="Every element marked with data-cta on the public site. Viewed counts a CTA scrolling at least halfway into view; CTR is clicks ÷ views."
        actions={<RangeTabs basePath="/admin/ctas" days={days} />}
      />

      <Table>
        <Thead>
          <Th>CTA</Th>
          <Th numeric>Viewed</Th>
          <Th numeric>Hovered</Th>
          <Th numeric>Clicked</Th>
          <Th numeric>CTR</Th>
        </Thead>
        <tbody>
          {stats.length === 0 ? (
            <EmptyState
              title="No CTA activity recorded"
              hint='Add data-cta="some-id" to a button or link on the public site to start measuring it.'
              colSpan={5}
            />
          ) : (
            stats.map((stat) => (
              <Tr key={stat.ctaId}>
                <Td mono>{stat.ctaId}</Td>
                <Td numeric>{num(stat.viewed)}</Td>
                <Td numeric>{num(stat.hovered)}</Td>
                <Td numeric>{num(stat.clicked)}</Td>
                <Td numeric>{stat.viewed > 0 ? pct(stat.ctr) : "—"}</Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
