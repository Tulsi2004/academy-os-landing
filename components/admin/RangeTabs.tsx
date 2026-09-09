import Link from "next/link";

const OPTIONS = [7, 30, 90] as const;

export const DEFAULT_DAYS = 30;

/** Reads ?days= from a page's searchParams, clamped to the offered options. */
export function resolveDays(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return (OPTIONS as readonly number[]).includes(parsed) ? parsed : DEFAULT_DAYS;
}

export function RangeTabs({ basePath, days }: { basePath: string; days: number }) {
  return (
    <div className="adm-row" role="group" aria-label="Date range">
      {OPTIONS.map((option) => (
        <Link
          key={option}
          href={`${basePath}?days=${option}`}
          className="adm-pill"
          data-active={option === days}
        >
          {option} days
        </Link>
      ))}
    </div>
  );
}
