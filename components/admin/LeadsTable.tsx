"use client";

import { Table, Thead, Th, Tr, Td, EmptyState } from "./Table";
import { LeadStatusSelect } from "./LeadStatusSelect";
import { LoadMore, useLazyList } from "./LoadMore";
import { loadMoreLeads } from "@/lib/admin/actions";
import type { LeadRowView } from "@/lib/admin/rows";

const COLUMNS = 9;

export function LeadsTable({
  initialLeads,
  initialCursor,
  total,
  status,
}: {
  initialLeads: LeadRowView[];
  initialCursor: string | null;
  total: number;
  status?: string;
}) {
  const { items, loadMore, pending, error, hasMore } = useLazyList<LeadRowView>({
    initialItems: initialLeads,
    initialCursor,
    fetchPage: (cursor) => loadMoreLeads(cursor, status),
  });

  return (
    <>
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
          {items.length === 0 ? (
            <EmptyState
              title={status ? `No ${status} leads` : "No leads yet"}
              hint={
                status
                  ? "Try another status filter."
                  : "The Lead table and /api/leads are live — leads land here as soon as a form on the public site posts to it."
              }
              colSpan={COLUMNS}
            />
          ) : (
            items.map((lead) => (
              <Tr key={lead.id}>
                <Td>{lead.received}</Td>
                <Td>{lead.name}</Td>
                <Td truncate>
                  {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
                </Td>
                <Td>{lead.phone ? <a href={`tel:${lead.phone}`}>{lead.phone}</a> : "—"}</Td>
                <Td truncate>{lead.company}</Td>
                <Td truncate title={lead.message}>
                  {lead.message}
                </Td>
                <Td truncate>{lead.source}</Td>
                <Td>{lead.location}</Td>
                <Td>
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>

      {items.length > 0 ? (
        <LoadMore
          shown={items.length}
          total={total}
          hasMore={hasMore}
          pending={pending}
          error={error}
          onLoadMore={loadMore}
          label="Load 50 more"
          noun="leads"
        />
      ) : null}
    </>
  );
}
