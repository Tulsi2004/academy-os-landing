import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/admin/Table";
import { getSessions } from "@/lib/admin/queries";
import { dateTime, duration, locationLabel, shortId } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await getSessions(100);

  return (
    <>
      <PageHeader
        title="Sessions"
        description="The last 100 visits. One session per browser tab; replays are available where the recorder captured enough events."
      />

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
          {sessions.length === 0 ? (
            <EmptyState
              title="No sessions recorded yet"
              hint="Visit the public site in another browser, then reload this page."
              colSpan={11}
            />
          ) : (
            sessions.map((session) => (
              <Tr key={session.id}>
                <Td>{dateTime(session.startedAt)}</Td>
                <Td mono title={session.visitor.fingerprint}>
                  {shortId(session.visitor.fingerprint)}
                  {session.visitor.isReturning ? (
                    <span className="adm-badge adm-badge-neutral" style={{ marginLeft: 6 }}>
                      returning
                    </span>
                  ) : (
                    <span className="adm-badge adm-badge-new" style={{ marginLeft: 6 }}>
                      new
                    </span>
                  )}
                </Td>
                <Td>
                  {[session.visitor.deviceType, session.visitor.browser, session.visitor.os]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Td>
                <Td>{locationLabel(session.visitor.city, session.visitor.country)}</Td>
                <Td mono>{session.ipAddress ?? "—"}</Td>
                <Td truncate title={session.referrer ?? undefined}>
                  {session.utmSource ?? session.referrer ?? "direct"}
                </Td>
                <Td truncate>{session.entryPath ?? "—"}</Td>
                <Td numeric>{session.pagesViewed}</Td>
                <Td numeric>{duration(session.totalDuration)}</Td>
                <Td>
                  {session.isBounce ? (
                    <span className="adm-badge adm-badge-lost">bounce</span>
                  ) : (
                    <span className="adm-badge adm-badge-won">engaged</span>
                  )}
                </Td>
                <Td>
                  {session._count.replays > 0 ? (
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
    </>
  );
}
