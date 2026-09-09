import { cache } from "react";
import { redirect } from "next/navigation";
import { readAdminSessionCookie, verifyAdminSessionToken } from "./session";

/**
 * The single auth guard for the admin panel.
 *
 * Redirects to /admin/login when there is no valid session. Called by the
 * (dashboard) layout, and independently by every Server Action and protected
 * route handler — the layout guard alone does not protect actions/routes,
 * since those can be invoked directly.
 *
 * Wrapped in React's cache() so it runs once per request even when several
 * components/queries call it.
 */
export const verifyAdminSession = cache(async (): Promise<{ role: "admin" }> => {
  const token = await readAdminSessionCookie();
  const ok = await verifyAdminSessionToken(token);
  if (!ok) redirect("/admin/login");
  return { role: "admin" };
});

/** Non-redirecting variant, for route handlers that should answer 401 instead. */
export async function isAdminRequest(): Promise<boolean> {
  return verifyAdminSessionToken(await readAdminSessionCookie());
}
