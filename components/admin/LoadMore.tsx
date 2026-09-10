"use client";

import { useCallback, useState, useTransition } from "react";
import type { PageResult } from "@/lib/admin/actions";

/**
 * Shared "load more" behaviour for the admin list tables.
 *
 * The server component renders the first page; this holds every page after it.
 * `fetchPage` is a Server Action passed down from the page, which is why the
 * three tables can share one hook without this file knowing anything about
 * leads, sessions or errors.
 */
export function useLazyList<T>({
  initialItems,
  initialCursor,
  fetchPage,
}: {
  initialItems: T[];
  initialCursor: string | null;
  fetchPage: (cursor: string) => Promise<PageResult<T>>;
}) {
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const loadMore = useCallback(() => {
    if (!cursor || pending) return;
    setError(null);

    startTransition(async () => {
      const result = await fetchPage(cursor);

      if (!result.ok) {
        // Keep the cursor so the button stays live and the user can retry.
        setError(result.error ?? "Could not load more.");
        return;
      }

      setItems((current) => [...current, ...result.items]);
      setCursor(result.nextCursor);
    });
  }, [cursor, pending, fetchPage]);

  return { items, loadMore, pending, error, hasMore: cursor !== null };
}

/**
 * The button under a table, plus its count and error line.
 *
 * `total` is the number the filter matches; when it is known the count reads
 * "50 of 1,240", and when it is not it just reports what is on screen.
 */
export function LoadMore({
  shown,
  total,
  hasMore,
  pending,
  error,
  onLoadMore,
  label = "Load more",
  noun = "rows",
}: {
  shown: number;
  total?: number;
  hasMore: boolean;
  pending: boolean;
  error: string | null;
  onLoadMore: () => void;
  label?: string;
  noun?: string;
}) {
  const count =
    total !== undefined
      ? `Showing ${shown.toLocaleString()} of ${total.toLocaleString()} ${noun}`
      : `Showing ${shown.toLocaleString()} ${noun}`;

  return (
    <div className="adm-loadmore">
      {hasMore ? (
        <button type="button" className="adm-btn" onClick={onLoadMore} disabled={pending}>
          {pending ? "Loading…" : label}
        </button>
      ) : null}

      <span className="adm-loadmore-count" aria-live="polite">
        {count}
      </span>

      {error ? (
        <span className="adm-loadmore-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
