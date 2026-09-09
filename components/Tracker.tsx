"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startTracking, trackPageView } from "@/lib/analytics/tracker";

/**
 * Mounts the analytics beacon on public pages.
 *
 * Deliberately inert on /admin: the panel should not measure the operator
 * looking at their own numbers.
 */
export function Tracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Also inert inside the admin heatmap preview, which loads the real page in an
  // iframe with ?__notrack=1 — otherwise reviewing a heatmap would record traffic.
  const isAdmin =
    (pathname?.startsWith("/admin") ?? false) ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("__notrack"));

  useEffect(() => {
    if (isAdmin) return;
    // Starts once for the public site; cleans up if the visitor enters /admin.
    return startTracking();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin || !pathname) return;

    // The effect above already recorded the page the beacon started on, so the
    // first run here only takes note of it.
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }

    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackPageView(pathname);
  }, [pathname, isAdmin]);

  return null;
}
