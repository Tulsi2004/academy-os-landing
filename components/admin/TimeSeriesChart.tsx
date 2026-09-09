"use client";

import { useMemo, useState } from "react";

export type SeriesPoint = { date: string; visitors: number; sessions: number; leads: number };

type SeriesKey = "visitors" | "sessions" | "leads";

const SERIES: Array<{ key: SeriesKey; label: string; color: string }> = [
  { key: "visitors", label: "Visitors", color: "var(--adm-accent)" },
  { key: "sessions", label: "Sessions", color: "#e0a12a" },
  { key: "leads", label: "Leads", color: "#17835f" },
];

// A fixed viewBox scaled by CSS: the chart stays sharp at any container width.
const WIDTH = 760;
const HEIGHT = 240;
const PAD = { top: 12, right: 12, bottom: 26, left: 38 };

/**
 * Hand-rolled SVG multi-line chart — no charting library for three series.
 */
export function TimeSeriesChart({ data }: { data: SeriesPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const { paths, maxValue, xFor, yFor } = useMemo(() => {
    const max = Math.max(
      1,
      ...data.flatMap((d) => [d.visitors, d.sessions, d.leads]),
    );
    // Round the axis up to something human (10, 25, 50, 100...).
    const niceMax = niceCeiling(max);

    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const x = (index: number) =>
      PAD.left + (data.length <= 1 ? innerW / 2 : (index / (data.length - 1)) * innerW);
    const y = (value: number) => PAD.top + innerH - (value / niceMax) * innerH;

    const built = SERIES.map((series) => ({
      ...series,
      d: data
        .map((point, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(point[series.key])}`)
        .join(" "),
    }));

    return { paths: built, maxValue: niceMax, xFor: x, yFor: y };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="adm-empty">
        <strong>No data yet</strong>
        <span>This chart fills in as traffic arrives.</span>
      </div>
    );
  }

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const hovered = hover !== null ? data[hover] : null;

  return (
    <div className="adm-chart">
      <div className="adm-chart-legend">
        {SERIES.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Daily traffic">
        {gridLines.map((ratio) => {
          const value = maxValue * (1 - ratio);
          const y = PAD.top + ratio * (HEIGHT - PAD.top - PAD.bottom);
          return (
            <g key={ratio}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--adm-line)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 7}
                y={y + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="var(--adm-muted)"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {paths.map((series) => (
          <path
            key={series.key}
            d={series.d}
            fill="none"
            stroke={series.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {hovered ? (
          <line
            x1={xFor(hover!)}
            x2={xFor(hover!)}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
            stroke="var(--adm-muted)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ) : null}

        {hovered
          ? SERIES.map((s) => (
              <circle
                key={s.key}
                cx={xFor(hover!)}
                cy={yFor(hovered[s.key])}
                r="3.5"
                fill={s.color}
              />
            ))
          : null}

        {/* First and last date labels only — a label per day would collide. */}
        <text x={PAD.left} y={HEIGHT - 8} fontSize="10" fill="var(--adm-muted)">
          {data[0]?.date.slice(5)}
        </text>
        <text
          x={WIDTH - PAD.right}
          y={HEIGHT - 8}
          fontSize="10"
          fill="var(--adm-muted)"
          textAnchor="end"
        >
          {data.at(-1)?.date.slice(5)}
        </text>

        {/* Invisible hit targets, one per day. */}
        {data.map((point, index) => {
          const step = (WIDTH - PAD.left - PAD.right) / Math.max(data.length - 1, 1);
          return (
            <rect
              key={point.date}
              x={xFor(index) - step / 2}
              y={PAD.top}
              width={step}
              height={HEIGHT - PAD.top - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>

      {hovered ? (
        <div
          className="adm-tooltip"
          style={{
            left: `${(xFor(hover!) / WIDTH) * 100}%`,
            top: `${(PAD.top / HEIGHT) * 100}%`,
          }}
        >
          <strong>{hovered.date}</strong>
          <br />
          {hovered.visitors} visitors · {hovered.sessions} sessions · {hovered.leads} leads
        </div>
      ) : null}
    </div>
  );
}

function niceCeiling(value: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalised = value / magnitude;
  const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
  return step * magnitude;
}
