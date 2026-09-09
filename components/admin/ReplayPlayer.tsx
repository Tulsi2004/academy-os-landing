"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wrapper around rrweb-player.
 *
 * The player is a Svelte component that writes directly into a DOM node, so it
 * is imported lazily inside an effect — it must never run during SSR, and
 * keeping it out of the main bundle keeps the rest of the panel light.
 */
export function ReplayPlayer({ events }: { events: unknown[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // rrweb needs a full snapshot plus at least one incremental event.
    if (events.length < 2) return;

    let player: { pause?: () => void } | null = null;
    let cancelled = false;
    // Captured now so the cleanup does not read a ref that may have moved on.
    const mount = mountRef.current;

    (async () => {
      try {
        const [{ default: RrwebPlayer }] = await Promise.all([
          import("rrweb-player"),
          import("rrweb-player/dist/style.css"),
        ]);

        if (cancelled || !mount) return;
        mount.innerHTML = "";

        const width = Math.max(mount.clientWidth - 24, 360);

        player = new RrwebPlayer({
          target: mount,
          props: {
            events: events as never,
            width,
            height: Math.round(width * 0.58),
            autoPlay: false,
            showController: true,
            skipInactive: true,
          },
        });
      } catch (cause) {
        console.error("[ReplayPlayer] could not start playback", cause);
        if (!cancelled) setError("This recording could not be played back.");
      }
    })();

    return () => {
      cancelled = true;
      try {
        player?.pause?.();
      } catch {
        /* player already torn down */
      }
      if (mount) mount.innerHTML = "";
    };
  }, [events]);

  if (events.length < 2) {
    return (
      <div className="adm-empty">
        <strong>Not enough recorded activity</strong>
        <span>
          This session has {events.length} replay event{events.length === 1 ? "" : "s"} — too
          few to reconstruct. Very short visits often end before the first snapshot is sent.
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-empty">
        <strong>Playback failed</strong>
        <span>{error}</span>
      </div>
    );
  }

  return <div className="adm-replay" ref={mountRef} />;
}
