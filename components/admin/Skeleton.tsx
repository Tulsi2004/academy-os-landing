import type { CSSProperties, ReactNode } from "react";

/**
 * Loading placeholders for the admin panel.
 *
 * All server-safe (no client state) so they can be used directly from a
 * `loading.tsx`, which Next renders on the server while the real page awaits
 * its queries.
 *
 * The rule these follow: a skeleton should occupy the same space as the content
 * it stands in for. Getting the row count and column widths roughly right is
 * what stops the page jumping when the data lands.
 */

/** One shimmering block. Width/height accept any CSS length. */
export function Skeleton({
  width = "100%",
  height = 12,
  radius = 6,
  style,
}: {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: CSSProperties;
}) {
  return (
    <span
      className="adm-skel"
      aria-hidden
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

/**
 * Wraps a whole loading screen.
 *
 * `role="status"` plus the visually-hidden label means a screen reader hears
 * "Loading <page>" once, rather than nothing at all while the bars animate.
 */
export function SkeletonScreen({
  label = "Loading",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="adm-sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Several lines of text, the last one short so it reads as a paragraph. */
export function SkeletonText({ lines = 3, width = "100%" }: { lines?: number; width?: string }) {
  return (
    <span className="adm-skel-stack" style={{ width }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={11} width={i === lines - 1 ? "62%" : "100%"} />
      ))}
    </span>
  );
}

/** Title, description and (optionally) the range tabs or export button. */
export function SkeletonPageHeader({ actions = false }: { actions?: boolean }) {
  return (
    <div className="adm-spread">
      <div className="adm-page-header">
        <Skeleton width={190} height={25} radius={8} />
        <Skeleton width={330} height={12} style={{ marginTop: 10 }} />
      </div>
      {actions ? (
        <div className="adm-row">
          <Skeleton width={188} height={32} radius={8} />
        </div>
      ) : null}
    </div>
  );
}

/** The row of headline numbers at the top of the overview and reports pages. */
export function SkeletonStatGrid({ tiles = 4 }: { tiles?: number }) {
  return (
    <div className="adm-stat-grid">
      {Array.from({ length: tiles }, (_, i) => (
        <div className="adm-stat" key={i}>
          <Skeleton width={84} height={10} />
          <Skeleton width={68} height={26} radius={8} style={{ marginTop: 14 }} />
          <Skeleton width={104} height={10} style={{ marginTop: 12 }} />
        </div>
      ))}
    </div>
  );
}

/** A card shell, so the skeleton keeps the panel's usual rhythm of sections. */
export function SkeletonCard({
  title = true,
  subtitle = false,
  children,
}: {
  title?: boolean;
  subtitle?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="adm-card">
      {title ? <Skeleton width={172} height={14} /> : null}
      {subtitle ? <Skeleton width={280} height={11} style={{ marginTop: 8 }} /> : null}
      <div style={{ marginTop: title || subtitle ? 18 : 0 }}>{children}</div>
    </section>
  );
}

/**
 * Bars of varying height, standing in for the time-series chart.
 *
 * The heights come from a fixed pattern rather than Math.random(): a random
 * skeleton would differ between the server render and hydration, and React
 * would warn about the mismatch.
 */
const BAR_HEIGHTS = [42, 68, 55, 80, 47, 72, 60, 88, 51, 76, 64, 93, 58, 70, 45, 82];

export function SkeletonChart({ height = 220, bars = 16 }: { height?: number; bars?: number }) {
  return (
    <div className="adm-skel-chart" style={{ height }}>
      {Array.from({ length: bars }, (_, i) => (
        <Skeleton
          key={i}
          width="100%"
          height={`${BAR_HEIGHTS[i % BAR_HEIGHTS.length]}%`}
          radius={4}
          style={{ alignSelf: "flex-end" }}
        />
      ))}
    </div>
  );
}

/** The stacked, tapering bars of the conversion funnel. */
export function SkeletonFunnel({ stages = 5 }: { stages?: number }) {
  return (
    <div className="adm-skel-stack" style={{ gap: 14 }}>
      {Array.from({ length: stages }, (_, i) => (
        <span className="adm-skel-funnel-row" key={i}>
          <Skeleton width={120} height={11} />
          <Skeleton width={`${100 - i * 15}%`} height={26} radius={7} />
        </span>
      ))}
    </div>
  );
}

/** The status filter pills above the leads table. */
export function SkeletonPills({ count = 5 }: { count?: number }) {
  return (
    <div className="adm-pill-row">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} width={i === 0 ? 74 : 104} height={30} radius={999} />
      ))}
    </div>
  );
}

/**
 * A table placeholder.
 *
 * `columns` is either a count or per-column hints — `numeric` right-aligns the
 * bar and `width` sets it — which is what keeps the skeleton from looking like
 * a uniform grid when the real table is anything but.
 */
export type SkeletonColumn = { width?: number | string; numeric?: boolean };

export function SkeletonTable({
  columns,
  rows = 8,
}: {
  columns: number | SkeletonColumn[];
  rows?: number;
}) {
  const cols: SkeletonColumn[] =
    typeof columns === "number" ? Array.from({ length: columns }, () => ({})) : columns;

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={i} className={col.numeric ? "adm-num" : undefined}>
                <Skeleton width={col.numeric ? 52 : 76} height={10} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              {cols.map((col, c) => (
                <td key={c} className={col.numeric ? "adm-num" : undefined}>
                  <Skeleton width={col.width ?? (col.numeric ? 46 : "82%")} height={11} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
