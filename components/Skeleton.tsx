import type { CSSProperties, ReactNode } from "react";

/**
 * Loading placeholders for the public site.
 *
 * Separate from the admin panel's set (components/admin/Skeleton.tsx) because
 * the two live in different stylesheets — this one draws on globals.css tokens,
 * that one on admin.css. Keeping them apart means neither page has to load the
 * other's CSS.
 *
 * Server-safe: no client state, so a `loading.tsx` can render them directly.
 */

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
    <span className="skel" aria-hidden style={{ width, height, borderRadius: radius, ...style }} />
  );
}

/**
 * Wraps a whole loading screen so assistive tech hears one "Loading…" rather
 * than nothing while the bars animate.
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
      <span className="skel-sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Lines of body text, the last one short so it reads as a paragraph. */
export function SkeletonText({
  lines = 3,
  width = "100%",
  gap = 10,
}: {
  lines?: number;
  width?: string;
  gap?: number;
}) {
  return (
    <span className="skel-stack" style={{ width, gap }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? "58%" : "100%"} />
      ))}
    </span>
  );
}

/** Matches the .post-card layout used across the blog. */
export function SkeletonPostCard() {
  return (
    <span className="post-card skel-card">
      <span className="post-card-media">
        <Skeleton width="100%" height="100%" radius={0} />
      </span>
      <span className="post-card-body">
        <span className="post-card-tags">
          <Skeleton width={64} height={20} radius={999} />
          <Skeleton width={52} height={20} radius={999} />
        </span>
        <Skeleton width="94%" height={18} radius={5} style={{ marginTop: 4 }} />
        <Skeleton width="72%" height={18} radius={5} />
        <SkeletonText lines={2} gap={8} />
        <span className="post-card-meta">
          <Skeleton width={92} height={11} />
          <Skeleton width={74} height={11} />
        </span>
      </span>
    </span>
  );
}

/** A grid of post cards, matching .post-grid. */
export function SkeletonPostGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="post-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonPostCard key={i} />
      ))}
    </div>
  );
}

/** The tinted hero band at the top of the blog, article and author pages. */
export function SkeletonPageHero({ lines = 1 }: { lines?: number }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        <Skeleton width={104} height={12} />
        <Skeleton width="72%" height={40} radius={10} style={{ margin: "18px 0 10px" }} />
        {lines > 0 ? <SkeletonText lines={lines} width="60%" /> : null}
      </div>
    </section>
  );
}
