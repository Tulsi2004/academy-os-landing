"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { login, type LoginState } from "@/lib/auth/actions";
import { SITE_LABEL } from "@/lib/site";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="adm-login">
      <form className="adm-login-card" action={formAction}>
        <h1>{SITE_LABEL} admin</h1>
        <p>Analytics, sessions and leads for this landing site.</p>

        {state.error ? (
          <div className="adm-error" role="alert">
            {state.error}
          </div>
        ) : null}

        <label className="adm-field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </label>

        <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
          <Lock size={14} aria-hidden />
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
