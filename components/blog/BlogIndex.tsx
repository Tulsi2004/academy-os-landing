"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { BlogPost } from "@/lib/sanity";
import { loadPosts } from "@/lib/blog/actions";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SITE_LABEL } from "@/lib/site";
import { PostCard } from "./PostCard";
import { SkeletonPostCard } from "@/components/Skeleton";

/**
 * The blog index body: hero copy, search, and the card grid.
 *
 * The server renders the first page; everything after it is fetched on demand,
 * so the payload stays flat as the blog grows.
 *
 * Search takes one of two paths depending on how much is already in the
 * browser. Once every matching post has been loaded, filtering happens in
 * memory — instant, no round-trip, which is the common case for a small blog.
 * While pages are still outstanding it defers to a debounced GROQ query, so a
 * search reaches posts that have not been loaded yet instead of quietly
 * searching only the first page.
 */
export function BlogIndex({
  initialPosts,
  total,
}: {
  initialPosts: BlogPost[];
  total: number;
}) {
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [matched, setMatched] = useState(total);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  // True once the browser holds every post that matches the current view, which
  // is what makes local filtering safe.
  const allLoaded = posts.length >= matched;

  const trimmed = query.trim();
  const searchingLocally = allLoaded && !pending;

  const visible = useMemo(() => {
    if (!trimmed || !searchingLocally) return posts;
    const q = trimmed.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.categories?.some((c) => c.toLowerCase().includes(q)),
    );
  }, [posts, trimmed, searchingLocally]);

  /*
   * Server-backed search, debounced so a fast typist sends one query rather
   * than one per keystroke. Skipped entirely while everything is loaded — the
   * local filter above already has the answer.
   *
   * `settled` guards against an out-of-order response: a slow query for "aca"
   * must not overwrite the results for "academy" typed after it.
   */
  const requestId = useRef(0);
  const everythingLoadedOnMount = initialPosts.length >= total;

  useEffect(() => {
    if (everythingLoadedOnMount) return;

    const id = ++requestId.current;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const page = await loadPosts({ offset: 0, q: trimmed || undefined });
        if (id !== requestId.current) return;
        setPosts(page.items);
        setMatched(page.total);
        setError(false);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [trimmed, everythingLoadedOnMount]);

  const loadMore = useCallback(() => {
    if (pending) return;
    setError(false);

    const id = ++requestId.current;
    startTransition(async () => {
      const page = await loadPosts({
        offset: posts.length,
        q: allLoaded ? undefined : trimmed || undefined,
      });
      if (id !== requestId.current) return;

      if (page.items.length === 0) {
        setError(true);
        return;
      }

      // Guard against a post shifting between pages while browsing.
      setPosts((current) => {
        const seen = new Set(current.map((p) => p._id));
        return [...current, ...page.items.filter((p) => !seen.has(p._id))];
      });
      setMatched(page.total);
    });
  }, [pending, posts.length, allLoaded, trimmed]);

  const hasMore = visible.length < matched && !(searchingLocally && trimmed);

  return (
    <>
      <section className="page-hero blog-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">{t.blog.eyebrow}</span>
          <h1>{t.blog.heading.replace("{brand}", SITE_LABEL)}</h1>
          <p className="page-hero-lead">{t.blog.lead}</p>
        </div>
      </section>

      <section className="blog-main">
        <div className="container">
          {(total > 0 || trimmed) && (
            <div className="blog-search">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.blog.searchPlaceholder}
                aria-label={t.blog.searchLabel}
              />
            </div>
          )}

          {total === 0 && !trimmed ? (
            <div className="blog-empty">
              <h2>{t.blog.emptyTitle}</h2>
              <p>{t.blog.emptyBody}</p>
            </div>
          ) : visible.length === 0 && !pending ? (
            <div className="blog-empty">
              <h2>{t.blog.noResultsTitle}</h2>
              <p>{t.blog.noResultsBody.replace("{query}", trimmed)}</p>
              <button type="button" className="btn btn-ghost" onClick={() => setQuery("")}>
                {t.blog.clearSearch}
              </button>
            </div>
          ) : (
            <div className="post-grid">
              {visible.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              {/* Placeholders sit in the grid while the next page is in flight. */}
              {pending &&
                Array.from({ length: 3 }, (_, i) => <SkeletonPostCard key={`skel-${i}`} />)}
            </div>
          )}

          {(hasMore || error) && (
            <div className="load-more">
              {hasMore && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={loadMore}
                  disabled={pending}
                >
                  {pending ? t.blog.loading : t.blog.loadMore}
                </button>
              )}
              <span className="load-more-count" aria-live="polite">
                {t.blog.showingCount
                  .replace("{shown}", String(visible.length))
                  .replace("{total}", String(matched))}
              </span>
              {error && (
                <span className="load-more-error" role="alert">
                  {t.blog.loadError}
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
