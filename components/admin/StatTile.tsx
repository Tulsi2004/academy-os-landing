import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-label">
        {Icon ? <Icon size={13} strokeWidth={2.2} aria-hidden /> : null}
        {label}
      </div>
      <div className="adm-stat-value">{value}</div>
      {sub ? <div className="adm-stat-sub">{sub}</div> : null}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="adm-stat-grid">{children}</div>;
}
