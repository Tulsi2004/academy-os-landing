"use client";

import { Table, Thead, Th, Tr, Td, EmptyState } from "./Table";
import { LoadMore, useLazyList } from "./LoadMore";
import { loadMoreErrors } from "@/lib/admin/actions";
import type { ErrorRowView } from "@/lib/admin/rows";

const COLUMNS = 4;

const TYPE_LABELS: Record<string, string> = {
  js: "JS error",
  unhandled_rejection: "Promise rejection",
  image_load: "Image failed",
};

export function ErrorsTable({
  initialErrors,
  initialCursor,
  total,
}: {
  initialErrors: ErrorRowView[];
  initialCursor: string | null;
  total: number;
}) {
  const { items, loadMore, pending, error, hasMore } = useLazyList<ErrorRowView>({
    initialItems: initialErrors,
    initialCursor,
    fetchPage: loadMoreErrors,
  });

  return (
    <>
      <Table>
        <Thead>
          <Th>When</Th>
          <Th>Type</Th>
          <Th>Message</Th>
          <Th>Path</Th>
        </Thead>
        <tbody>
          {items.length === 0 ? (
            <EmptyState
              title="No errors recorded"
              hint="Nothing has thrown in a visitor's browser — the good outcome."
              colSpan={COLUMNS}
            />
          ) : (
            items.map((row) => (
              <Tr key={row.id}>
                <Td>{row.when}</Td>
                <Td>
                  <span
                    className={`adm-badge ${
                      row.type === "image_load" ? "adm-badge-contacted" : "adm-badge-lost"
                    }`}
                  >
                    {TYPE_LABELS[row.type] ?? row.type}
                  </span>
                </Td>
                <Td truncate title={row.detail}>
                  {row.message}
                </Td>
                <Td mono>{row.path}</Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>

      {items.length > 0 ? (
        <LoadMore
          shown={items.length}
          total={total}
          hasMore={hasMore}
          pending={pending}
          error={error}
          onLoadMore={loadMore}
          label="Load 50 more"
          noun="errors"
        />
      ) : null}
    </>
  );
}
