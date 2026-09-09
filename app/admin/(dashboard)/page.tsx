import Link from "next/link";
import {
  ArrowDownWideNarrow,
  Clock,
  MousePointerClick,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { StatGrid, StatTile } from "@/components/admin/StatTile";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { TimeSeriesChart } from "@/components/admin/TimeSeriesChart";
import { RangeTabs, resolveDays } from "@/components/admin/RangeTabs";
import {
  getDailyTimeSeries,
  getFunnelStats,
  getOverviewStats,
  getRecentLeads,
  getTrafficSources,
} from "@/lib/admin/queries";
import { duration, num, pct, relativeTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const days = resolveDays((await searchParams).days);

  const [stats, series, sources, funnel, recentLeads] = await Promise.all([
    getOverviewStats(days),
    getDailyTimeSeries(days),
    getTrafficSources(days),
    getFunnelStats(days),
    getRecentLeads(8),
  ]);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Traffic, engagement and leads for the last ${days} days.`}
        actions={<RangeTabs basePath="/admin" days={days} />}
      />

      <StatGrid>
        <StatTile label="Visitors" value={num(stats.visitors)} icon={Users} />
        <StatTile label="Sessions" value={num(stats.sessions)} icon={TrendingUp} />
        <StatTile label="Leads" value={num(stats.leads)} icon={UserPlus} />
        <StatTile
          label="Conversion"
          value={pct(stats.conversionRate, 2)}
          sub="leads ÷ sessions"
          icon={Target}
        />
        <StatTile
          label="Scrolled 50%+"
          value={num(stats.scrollHalfway)}
          sub="sessions"
          icon={ArrowDownWideNarrow}
        />
        <StatTile label="CTA clicks" value={num(stats.ctaClicks)} icon={MousePointerClick} />
        <StatTile
          label="Avg time"
          value={duration(stats.avgDurationSeconds)}
          sub="per session"
          icon={Clock}
        />
      </StatGrid>

      <Card title="Daily traffic" subtitle={`Visitors, sessions and leads over ${days} days.`}>
        <TimeSeriesChart data={series} />
      </Card>

      <div className="adm-grid-2">
        <Card title="Conversion funnel" subtitle="Share of sessions reaching each step.">
          <ConversionFunnel stages={funnel} />
        </Card>

        <Card title="Recent leads" subtitle="The eight most recent form submissions.">
          <Table>
            <Thead>
              <Th>Name</Th>
              <Th>Contact</Th>
              <Th>Status</Th>
              <Th>When</Th>
            </Thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <EmptyState
                  title="No leads yet"
                  hint="Leads appear here once a form on the site posts to /api/leads."
                  colSpan={4}
                />
              ) : (
                recentLeads.map((lead) => (
                  <Tr key={lead.id}>
                    <Td>{lead.name ?? "—"}</Td>
                    <Td truncate>{lead.email ?? lead.phone ?? "—"}</Td>
                    <Td>
                      <span className={`adm-badge adm-badge-${lead.status}`}>{lead.status}</span>
                    </Td>
                    <Td>{relativeTime(lead.createdAt)}</Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
          <p style={{ marginTop: 12, marginBottom: 0 }}>
            <Link href="/admin/leads" className="adm-btn">
              All leads
            </Link>
          </p>
        </Card>
      </div>

      <Card title="Traffic sources" subtitle="Sessions grouped by UTM tags, with referrer fallback.">
        <Table>
          <Thead>
            <Th>Source</Th>
            <Th>Medium</Th>
            <Th>Campaign</Th>
            <Th numeric>Sessions</Th>
            <Th numeric>Leads</Th>
            <Th numeric>Conv.</Th>
          </Thead>
          <tbody>
            {sources.length === 0 ? (
              <EmptyState
                title="No traffic recorded yet"
                hint="Sources appear once the tracking beacon reports its first session."
                colSpan={6}
              />
            ) : (
              sources.map((source) => (
                <Tr key={`${source.source}-${source.medium}-${source.campaign}`}>
                  <Td>{source.source}</Td>
                  <Td>{source.medium}</Td>
                  <Td truncate>{source.campaign}</Td>
                  <Td numeric>{num(source.sessions)}</Td>
                  <Td numeric>{num(source.leads)}</Td>
                  <Td numeric>
                    {source.sessions > 0 ? pct((source.leads / source.sessions) * 100) : "—"}
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
