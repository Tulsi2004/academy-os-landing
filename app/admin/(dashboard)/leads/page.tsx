import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { getLeadStatusCounts, getLeadsPage } from "@/lib/admin/queries";
import { toLeadRowView } from "@/lib/admin/rows";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/analytics/payload";

export const dynamic = "force-dynamic";

function resolveStatus(value: string | undefined): LeadStatus | undefined {
  return (LEAD_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as LeadStatus)
    : undefined;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const status = resolveStatus((await searchParams).status);

  // Only the first page is fetched here; LeadsTable pulls the rest on demand.
  const [page, counts] = await Promise.all([getLeadsPage(status), getLeadStatusCounts()]);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Form submissions, newest first. Changing a status saves immediately."
        actions={
          <Link href="/api/reports/leads?format=csv&range=90d" className="adm-btn">
            <Download size={14} aria-hidden />
            Export CSV
          </Link>
        }
      />

      <div className="adm-pill-row">
        <Link href="/admin/leads" className="adm-pill" data-active={!status}>
          All <span className="adm-tab-badge">{total}</span>
        </Link>
        {LEAD_STATUSES.map((option) => (
          <Link
            key={option}
            href={`/admin/leads?status=${option}`}
            className="adm-pill"
            data-active={status === option}
          >
            {option} <span className="adm-tab-badge">{counts[option] ?? 0}</span>
          </Link>
        ))}
      </div>

      <LeadsTable
        // Remount on filter change so the table starts from that filter's first
        // page rather than appending to the previous filter's rows.
        key={status ?? "all"}
        initialLeads={page.items.map(toLeadRowView)}
        initialCursor={page.nextCursor}
        total={status ? (counts[status] ?? 0) : total}
        status={status}
      />
    </>
  );
}
