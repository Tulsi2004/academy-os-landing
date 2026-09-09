import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { ReplayPlayer } from "@/components/admin/ReplayPlayer";
import { getSessionMeta, getSessionReplay } from "@/lib/admin/queries";
import { dateTime, duration, shortId } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function SessionReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSessionMeta(id);
  if (!session) notFound();

  const events = await getSessionReplay(id);

  return (
    <>
      <PageHeader
        title="Session replay"
        description={`Visitor ${shortId(session.visitor.fingerprint)} · ${dateTime(
          session.startedAt,
        )} · ${duration(session.totalDuration)} · ${session.pagesViewed} page${
          session.pagesViewed === 1 ? "" : "s"
        }`}
        actions={
          <Link href="/admin/sessions" className="adm-btn">
            <ArrowLeft size={14} aria-hidden />
            Back to sessions
          </Link>
        }
      />

      <Card
        subtitle={`${events.length} recorded events across ${session._count.replays} chunk${
          session._count.replays === 1 ? "" : "s"
        }. Form inputs were masked at capture time and are never stored.`}
      >
        <ReplayPlayer events={events} />
      </Card>
    </>
  );
}
