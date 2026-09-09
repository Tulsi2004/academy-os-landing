"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  ExternalLink,
  FileText,
  Filter,
  Flame,
  Gauge,
  LayoutDashboard,
  LogOut,
  MousePointerClick,
  Users,
} from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { SITE_LABEL } from "@/lib/site";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

export function AdminNav({
  counts,
}: {
  counts: { leads: number; sessions: number; errors: number };
}) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads", icon: Users, badge: counts.leads },
    { href: "/admin/sessions", label: "Sessions", icon: BarChart3, badge: counts.sessions },
    { href: "/admin/heatmap", label: "Heatmap", icon: Flame },
    { href: "/admin/funnels", label: "Funnels", icon: Filter },
    { href: "/admin/ctas", label: "CTAs", icon: MousePointerClick },
    { href: "/admin/forms", label: "Forms", icon: FileText },
    { href: "/admin/performance", label: "Performance", icon: Gauge },
    { href: "/admin/errors", label: "Errors", icon: AlertTriangle, badge: counts.errors },
    { href: "/admin/reports", label: "Reports", icon: FileText },
  ];

  // /admin must not light up for every nested route, so it matches exactly.
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <header className="adm-header">
      <div className="adm-header-bar">
        <Link href="/admin" className="adm-brand">
          {SITE_LABEL}
          <span>Admin</span>
        </Link>

        <div className="adm-header-actions">
          <Link href="/" className="adm-btn" target="_blank" rel="noreferrer">
            <ExternalLink size={14} aria-hidden />
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className="adm-btn">
              <LogOut size={14} aria-hidden />
              Log out
            </button>
          </form>
        </div>
      </div>

      <nav className="adm-tabs" aria-label="Admin sections">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="adm-tab"
              aria-current={active ? "page" : undefined}
            >
              <Icon size={14} aria-hidden />
              {item.label}
              {item.badge ? <span className="adm-tab-badge">{item.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
