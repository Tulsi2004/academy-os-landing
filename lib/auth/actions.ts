"use server";

import { redirect } from "next/navigation";
import { createAdminSession, deleteAdminSession, safeEquals } from "./session";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter the admin password." };
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "ADMIN_PASSWORD is not configured on the server." };
  }

  if (!safeEquals(password, expected)) {
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  // redirect() throws a control-flow signal, so it must sit outside any try/catch.
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteAdminSession();
  redirect("/admin/login");
}
