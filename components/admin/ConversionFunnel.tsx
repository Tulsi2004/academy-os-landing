import { num, pct } from "@/lib/admin/format";

export type FunnelStage = { label: string; sessions: number };

/**
 * Horizontal bar funnel. Bar width is relative to the first stage, so each row
 * reads as "share of everyone who arrived".
 */
export function ConversionFunnel({ stages }: { stages: FunnelStage[] }) {
  const start = stages[0]?.sessions ?? 0;

  if (start === 0) {
    return (
      <div className="adm-empty">
        <strong>No sessions in this period</strong>
        <span>The funnel fills in once the tracking beacon records traffic.</span>
      </div>
    );
  }

  return (
    <div>
      {stages.map((stage, index) => {
        const share = (stage.sessions / start) * 100;
        const previous = index > 0 ? stages[index - 1].sessions : null;
        const dropped = previous !== null ? previous - stage.sessions : 0;

        return (
          <div className="adm-funnel-row" key={stage.label}>
            <div className="adm-funnel-head">
              <span className="adm-funnel-label">{stage.label}</span>
              <span className="adm-funnel-meta">
                {num(stage.sessions)} · {pct(share)}
              </span>
            </div>
            <div className="adm-funnel-track">
              <div className="adm-funnel-fill" style={{ width: `${Math.max(share, 0.5)}%` }} />
            </div>
            {previous !== null && dropped > 0 ? (
              <div className="adm-dropoff">
                −{num(dropped)} dropped off ({pct((dropped / previous) * 100)} of previous step)
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
