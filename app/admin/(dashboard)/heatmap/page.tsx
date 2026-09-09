import Link from "next/link";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { HeatmapOverlay } from "@/components/admin/HeatmapOverlay";
import { getHeatmapPaths, getHeatmapPoints } from "@/lib/admin/queries";
import { num } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const TYPES = ["click", "hover"] as const;

export default async function HeatmapPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; type?: string }>;
}) {
  const params = await searchParams;
  const paths = await getHeatmapPaths();

  const type = (TYPES as readonly string[]).includes(params.type ?? "")
    ? (params.type as "click" | "hover")
    : "click";

  // Only ever render a path we have data for — never an arbitrary ?path= value,
  // which would let anyone frame a URL of their choosing inside the panel.
  const selectedPath =
    paths.find((entry) => entry.path === params.path)?.path ?? paths[0]?.path ?? null;

  const points = selectedPath ? await getHeatmapPoints(selectedPath, type) : [];

  return (
    <>
      <PageHeader
        title="Heatmap"
        description="Recorded interactions plotted over the live page. Coordinates are stored as percentages, so the overlay lines up at any width."
      />

      {paths.length === 0 ? (
        <Card>
          <div className="adm-empty">
            <strong>No interaction data yet</strong>
            <span>Clicks are captured on the public site and appear here shortly after.</span>
          </div>
        </Card>
      ) : (
        <>
          <div className="adm-pill-row">
            {paths.map((entry) => (
              <Link
                key={entry.path}
                href={`/admin/heatmap?path=${encodeURIComponent(entry.path)}&type=${type}`}
                className="adm-pill"
                data-active={entry.path === selectedPath}
              >
                {entry.path} <span className="adm-tab-badge">{num(entry.count)}</span>
              </Link>
            ))}
          </div>

          <div className="adm-pill-row">
            {TYPES.map((option) => (
              <Link
                key={option}
                href={`/admin/heatmap?path=${encodeURIComponent(selectedPath ?? "/")}&type=${option}`}
                className="adm-pill"
                data-active={option === type}
              >
                {option === "click" ? "Clicks" : "Hovers"}
              </Link>
            ))}
          </div>

          <Card
            subtitle={`${num(points.length)} ${type} point${points.length === 1 ? "" : "s"} on ${
              selectedPath ?? "—"
            }${points.length >= 3000 ? " (showing the 3,000 most recent)" : ""}.`}
          >
            {selectedPath ? (
              <HeatmapOverlay path={selectedPath} points={points} type={type} />
            ) : null}
          </Card>
        </>
      )}
    </>
  );
}
