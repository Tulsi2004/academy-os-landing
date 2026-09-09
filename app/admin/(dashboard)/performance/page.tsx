import { PageHeader, Card } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { RangeTabs, resolveDays } from "@/components/admin/RangeTabs";
import { getPerformanceStats } from "@/lib/admin/queries";
import { metricValue, num, pct } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const DESCRIPTIONS: Record<string, string> = {
  LCP: "Largest Contentful Paint — when the main content finished rendering.",
  INP: "Interaction to Next Paint — responsiveness to taps and clicks.",
  CLS: "Cumulative Layout Shift — how much the page jumps while loading.",
  FCP: "First Contentful Paint — when the first pixel of content appeared.",
  TTFB: "Time to First Byte — server and network latency.",
};

export default async function PerformancePage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = resolveDays((await searchParams).days);
  const stats = await getPerformanceStats(days);

  return (
    <>
      <PageHeader
        title="Performance"
        description="Core Web Vitals as measured in real visitors' browsers, not a lab test."
        actions={<RangeTabs basePath="/admin/performance" days={days} />}
      />

      <Table>
        <Thead>
          <Th>Metric</Th>
          <Th numeric>Average</Th>
          <Th numeric>Samples</Th>
          <Th>Good / Needs work / Poor</Th>
          <Th numeric>% good</Th>
        </Thead>
        <tbody>
          {stats.length === 0 ? (
            <EmptyState
              title="No performance data yet"
              hint="Web Vitals are reported by the tracking beacon once real visitors load the site."
              colSpan={5}
            />
          ) : (
            stats.map((stat) => {
              const total = stat.good + stat.needsImprovement + stat.poor;
              const share = (count: number) => (total > 0 ? (count / total) * 100 : 0);
              return (
                <Tr key={stat.metric}>
                  <Td title={DESCRIPTIONS[stat.metric]}>
                    <strong>{stat.metric}</strong>
                  </Td>
                  <Td numeric>{metricValue(stat.metric, stat.average)}</Td>
                  <Td numeric>{num(stat.samples)}</Td>
                  <Td>
                    <span className="adm-ratingbar" title={`${stat.good} good, ${stat.needsImprovement} needs improvement, ${stat.poor} poor`}>
                      <i className="good" style={{ width: `${share(stat.good)}%` }} />
                      <i className="ni" style={{ width: `${share(stat.needsImprovement)}%` }} />
                      <i className="poor" style={{ width: `${share(stat.poor)}%` }} />
                    </span>
                  </Td>
                  <Td numeric>{total > 0 ? pct(share(stat.good)) : "—"}</Td>
                </Tr>
              );
            })
          )}
        </tbody>
      </Table>

      <Card subtitle="Google's thresholds: LCP good under 2.5s, INP under 200ms, CLS under 0.1, FCP under 1.8s, TTFB under 800ms." />
    </>
  );
}
