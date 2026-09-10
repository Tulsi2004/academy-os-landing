"use client";

import { usePathname } from "next/navigation";

/**
 * Landing-page sections live on "/". From any other route (the legal pages) the
 * same links have to navigate home first, so they need the "/#id" form.
 */
export function useSectionHref() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (id: string) => (onHome ? `#${id}` : `/#${id}`);
}
