import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { StatGrid, StatTile } from "@/components/admin/StatTile";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { getReportOverview, resolveReportRange } from "@/lib/admin/reports";
import { duration, num, pct } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const PRESETS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "365d", label: "1 year" },
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const range = resolveReportRange(params);
  const overview = await getReportOverview(range);

  // Carried through to every export link so a download matches what is on screen.
  const query = new URLSearchParams();
  if (params.from && params.to) {
    query.set("from", params.from);
    query.set("to", params.to);
  } else {
    query.set("range", params.range ?? "30d");
  }
  const qs = query.toString();

  return (
    <>
      <PageHeader
        title="Reports"
        description="Pick a period, then export it. Exports always cover the range shown below."
      />

      <Card title="Period" subtitle={range.label}>
        <div className="adm-pill-row">
          {PRESETS.map((preset) => (
            <Link
              key={preset.value}
              href={`/admin/reports?range=${preset.value}`}
              className="adm-pill"
              data-active={!params.from && (params.range ?? "30d") === preset.value}
            >
              {preset.label}
            </Link>
          ))}
        </div>

        <form method="GET" action="/admin/reports" className="adm-row">
          <label className="adm-row" style={{ gap: 6 }}>
            <span className="adm-muted">From</span>
            <input type="date" name="from" defaultValue={params.from} className="adm-input" required />
          </label>
          <label className="adm-row" style={{ gap: 6 }}>
            <span className="adm-muted">To</span>
            <input type="date" name="to" defaultValue={params.to} className="adm-input" required />
          </label>
          <button type="submit" className="adm-btn adm-btn-primary">
            Apply
          </button>
        </form>
      </Card>

      <StatGrid>
        <StatTile label="Visitors" value={num(overview.visitors)} />
        <StatTile label="Sessions" value={num(overview.sessions)} />
        <StatTile label="Page views" value={num(overview.pageViews)} />
        <StatTile label="Leads" value={num(overview.leads)} />
        <StatTile label="Conversion" value={pct(overview.conversionRate, 2)} />
        <StatTile label="Bounce rate" value={pct(overview.bounceRate)} />
        <StatTile label="Avg time" value={duration(overview.avgDurationSeconds)} />
        <StatTile label="CTA clicks" value={num(overview.ctaClicks)} />
        <StatTile label="JS errors" value={num(overview.errors)} />
      </StatGrid>

      <Card title="Exports" subtitle="Downloads open in a new tab and cover the selected period.">
        <div className="adm-row">
          <Link href={`/api/reports/overview?format=csv&${qs}`} className="adm-btn" prefetch={false}>
            <Download size={14} aria-hidden />
            Overview CSV
          </Link>
          <Link href={`/api/reports/overview?format=xlsx&${qs}`} className="adm-btn" prefetch={false}>
            <Download size={14} aria-hidden />
            Overview XLSX
          </Link>
          <Link href={`/api/reports/overview?format=pdf&${qs}`} className="adm-btn" prefetch={false}>
            <Download size={14} aria-hidden />
            Overview PDF
          </Link>
          <Link href={`/api/reports/leads?format=csv&${qs}`} className="adm-btn" prefetch={false}>
            <Download size={14} aria-hidden />
            Leads CSV
          </Link>
          <Link href={`/api/reports/leads?format=xlsx&${qs}`} className="adm-btn" prefetch={false}>
            <Download size={14} aria-hidden />
            Leads XLSX
          </Link>
        </div>
      </Card>

      <Card title="Traffic sources" subtitle="Included in the overview exports.">
        <Table>
          <Thead>
            <Th>Source</Th>
            <Th>Medium</Th>
            <Th>Campaign</Th>
            <Th numeric>Sessions</Th>
            <Th numeric>Leads</Th>
          </Thead>
          <tbody>
            {overview.sources.length === 0 ? (
              <EmptyState title="No traffic in this period" colSpan={5} />
            ) : (
              overview.sources.map((source) => (
                <Tr key={`${source.source}-${source.medium}-${source.campaign}`}>
                  <Td>{source.source}</Td>
                  <Td>{source.medium}</Td>
                  <Td truncate>{source.campaign}</Td>
                  <Td numeric>{num(source.sessions)}</Td>
                  <Td numeric>{num(source.leads)}</Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
