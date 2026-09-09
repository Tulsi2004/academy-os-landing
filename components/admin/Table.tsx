import type { ReactNode } from "react";

/** Table primitives shared by every list page. Server-safe (no client state). */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({
  children,
  numeric = false,
}: {
  children?: ReactNode;
  numeric?: boolean;
}) {
  return <th className={numeric ? "adm-num" : undefined}>{children}</th>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

export function Td({
  children,
  numeric = false,
  truncate = false,
  mono = false,
  title,
}: {
  children?: ReactNode;
  numeric?: boolean;
  truncate?: boolean;
  mono?: boolean;
  title?: string;
}) {
  const className =
    [numeric && "adm-num", mono && "adm-mono", truncate && "adm-truncate"]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <td className={className} title={title}>
      {children}
    </td>
  );
}

export function EmptyState({
  title,
  hint,
  colSpan,
}: {
  title: string;
  hint?: string;
  colSpan: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="adm-empty">
          <strong>{title}</strong>
          {hint ? <span>{hint}</span> : null}
        </div>
      </td>
    </tr>
  );
}
