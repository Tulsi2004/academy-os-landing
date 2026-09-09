import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { getLeadStatusCounts, getLeads } from "@/lib/admin/queries";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/analytics/payload";
import { dateTime, locationLabel } from "@/lib/admin/format";

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

  const [leads, counts] = await Promise.all([getLeads(status), getLeadStatusCounts()]);
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

      <Table>
        <Thead>
          <Th>Received</Th>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Company</Th>
          <Th>Message</Th>
          <Th>Source</Th>
          <Th>Location</Th>
          <Th>Status</Th>
        </Thead>
        <tbody>
          {leads.length === 0 ? (
            <EmptyState
              title={status ? `No ${status} leads` : "No leads yet"}
              hint={
                status
                  ? "Try another status filter."
                  : "The Lead table and /api/leads are live — leads land here as soon as a form on the public site posts to it."
              }
              colSpan={9}
            />
          ) : (
            leads.map((lead) => (
              <Tr key={lead.id}>
                <Td>{dateTime(lead.createdAt)}</Td>
                <Td>{lead.name ?? "—"}</Td>
                <Td truncate>
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
                </Td>
                <Td>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "—"}</Td>
                <Td truncate>{lead.company ?? "—"}</Td>
                <Td truncate title={lead.message ?? undefined}>
                  {lead.message ?? "—"}
                </Td>
                <Td truncate>
                  {lead.session?.utmSource ?? lead.source ?? lead.session?.referrer ?? "direct"}
                </Td>
                <Td>{locationLabel(lead.visitor?.city, lead.visitor?.country)}</Td>
                <Td>
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
