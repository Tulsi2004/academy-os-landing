import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="adm-spread">
      <div className="adm-page-header">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="adm-row">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="adm-card">
      {title ? <h2 className="adm-card-title">{title}</h2> : null}
      {subtitle ? <p className="adm-card-sub">{subtitle}</p> : null}
      {children}
    </section>
  );
}
