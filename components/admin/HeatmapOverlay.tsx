"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HeatmapPoint = { xPct: number; yPct: number };

// The page is rendered at this width inside the iframe, then scaled to fit the
// admin container — so the overlay looks the same on any admin screen.
const RENDER_WIDTH = 1280;

export function HeatmapOverlay({
  path,
  points,
  type,
}: {
  path: string;
  points: HeatmapPoint[];
  type: "click" | "hover";
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(900);
  const [blocked, setBlocked] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const frame = frameRef.current;
    if (!container) return;

    setScale(container.clientWidth / RENDER_WIDTH);

    try {
      // Same-origin, so the real rendered height is readable.
      const doc = frame?.contentDocument;
      const height = doc?.documentElement?.scrollHeight;
      if (height && height > 0) setPageHeight(height);
    } catch {
      // A cross-origin or sandboxed frame cannot be measured.
      setBlocked(true);
    }
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);

    // Fonts, images and reveal animations settle after load, changing the
    // height — re-measure a few times rather than trusting the first read.
    const timers = [300, 900, 2000].map((delay) => window.setTimeout(measure, delay));

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [measure, path]);

  const dotColor =
    type === "click" ? "rgba(220, 60, 40, 0.34)" : "rgba(40, 110, 220, 0.26)";

  return (
    <div>
      <div
        ref={containerRef}
        className="adm-heatmap-stage"
        style={{ height: pageHeight * scale }}
      >
        <iframe
          ref={frameRef}
          // __notrack keeps the beacon from recording the admin's own preview.
          src={`${path}?__notrack=1`}
          title={`Preview of ${path}`}
          onLoad={measure}
          width={RENDER_WIDTH}
          height={pageHeight}
          style={{ transform: `scale(${scale})` }}
          scrolling="no"
        />

        <div className="adm-heatmap-layer" aria-hidden>
          {points.map((point, index) => (
            <span
              key={index}
              className="adm-heatmap-dot"
              style={{
                left: `${point.xPct}%`,
                top: `${point.yPct}%`,
                background: `radial-gradient(circle, ${dotColor} 0%, transparent 70%)`,
              }}
            />
          ))}
        </div>
      </div>

      {blocked ? (
        <p className="adm-muted" style={{ fontSize: "0.8rem", marginTop: 10 }}>
          The preview could not be measured, so dot alignment may drift.
        </p>
      ) : null}
    </div>
  );
}
