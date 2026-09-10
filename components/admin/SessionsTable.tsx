"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Table, Thead, Th, Tr, Td, EmptyState } from "./Table";
import { LoadMore, useLazyList } from "./LoadMore";
import { loadMoreSessions } from "@/lib/admin/actions";
import type { SessionRowView } from "@/lib/admin/rows";

const COLUMNS = 11;

export function SessionsTable({
  initialSessions,
  initialCursor,
  total,
}: {
  initialSessions: SessionRowView[];
  initialCursor: string | null;
  total: number;
}) {
  const { items, loadMore, pending, error, hasMore } = useLazyList<SessionRowView>({
    initialItems: initialSessions,
    initialCursor,
    fetchPage: loadMoreSessions,
  });

  return (
    <>
      <Table>
        <Thead>
          <Th>Started</Th>
          <Th>Visitor</Th>
          <Th>Device</Th>
          <Th>Location</Th>
          <Th>IP</Th>
          <Th>Source</Th>
          <Th>Entry</Th>
          <Th numeric>Pages</Th>
          <Th numeric>Duration</Th>
          <Th>Bounce</Th>
          <Th>Replay</Th>
        </Thead>
        <tbody>
          {items.length === 0 ? (
            <EmptyState
              title="No sessions recorded yet"
              hint="Visit the public site in another browser, then reload this page."
              colSpan={COLUMNS}
            />
          ) : (
            items.map((session) => (
              <Tr key={session.id}>
                <Td>{session.started}</Td>
                <Td mono title={session.fingerprint}>
                  {session.fingerprintShort}
                  {session.isReturning ? (
                    <span className="adm-badge adm-badge-neutral" style={{ marginLeft: 6 }}>
                      returning
                    </span>
                  ) : (
                    <span className="adm-badge adm-badge-new" style={{ marginLeft: 6 }}>
                      new
                    </span>
                  )}
                </Td>
                <Td>{session.device}</Td>
                <Td>{session.location}</Td>
                <Td mono>{session.ipAddress}</Td>
                <Td truncate title={session.referrer ?? undefined}>
                  {session.source}
                </Td>
                <Td truncate>{session.entryPath}</Td>
                <Td numeric>{session.pagesViewed}</Td>
                <Td numeric>{session.duration}</Td>
                <Td>
                  {session.isBounce ? (
                    <span className="adm-badge adm-badge-lost">bounce</span>
                  ) : (
                    <span className="adm-badge adm-badge-won">engaged</span>
                  )}
                </Td>
                <Td>
                  {session.hasReplay ? (
                    <Link href={`/admin/sessions/${session.id}/replay`} className="adm-btn">
                      <PlayCircle size={13} aria-hidden />
                      Watch
                    </Link>
                  ) : (
                    <span className="adm-muted">—</span>
                  )}
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
          noun="sessions"
        />
      ) : null}
    </>
  );
}
