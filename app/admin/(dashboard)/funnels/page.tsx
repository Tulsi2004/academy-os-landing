import { PageHeader, Card } from "@/components/admin/PageHeader";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { RangeTabs, resolveDays } from "@/components/admin/RangeTabs";
import { Table, Thead, Th, Tr, Td } from "@/components/admin/Table";
import { getFunnelStats } from "@/lib/admin/queries";
import { num, pct } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function FunnelsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = resolveDays((await searchParams).days);
  const stages = await getFunnelStats(days);
  const start = stages[0]?.sessions ?? 0;

  return (
    <>
      <PageHeader
        title="Funnels"
        description="How far sessions get, from landing on a page to submitting a lead. Each step counts distinct sessions, so one visitor clicking five CTAs still counts once."
        actions={<RangeTabs basePath="/admin/funnels" days={days} />}
      />

      <Card title={`Conversion path · last ${days} days`}>
        <ConversionFunnel stages={stages} />
      </Card>

      <Card title="Step detail">
        <Table>
          <Thead>
            <Th>Step</Th>
            <Th numeric>Sessions</Th>
            <Th numeric>% of start</Th>
            <Th numeric>Drop-off from previous</Th>
          </Thead>
          <tbody>
            {stages.map((stage, index) => {
              const previous = index > 0 ? stages[index - 1].sessions : null;
              const dropped = previous !== null ? previous - stage.sessions : null;
              return (
                <Tr key={stage.label}>
                  <Td>{stage.label}</Td>
                  <Td numeric>{num(stage.sessions)}</Td>
                  <Td numeric>{start > 0 ? pct((stage.sessions / start) * 100) : "—"}</Td>
                  <Td numeric>
                    {dropped === null || previous === 0
                      ? "—"
                      : `${num(dropped)} (${pct((dropped / previous!) * 100)})`}
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
