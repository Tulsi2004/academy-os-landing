import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  // The panel must never be indexed, even if a URL leaks.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Shared chrome for everything under /admin, including the login page.
 * Auth lives one level down in (dashboard)/layout.tsx, so /admin/login stays
 * reachable without a session.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="adm">{children}</div>;
}
