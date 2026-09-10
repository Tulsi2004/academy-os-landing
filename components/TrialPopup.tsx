"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { APP_URL } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getTrackingIdentity, trackEvent } from "@/lib/analytics/tracker";
import { CheckIcon, CloseIcon } from "@/components/icons";

/** Fraction of the scrollable page that must go by before the offer appears. */
const SCROLL_TRIGGER = 0.3;
/** Once dismissed or converted, stay quiet for the rest of the tab's session. */
const SEEN_KEY = "academy-os-trial-popup-seen";
const FORM_ID = "trial-popup";

type Status = "idle" | "sending" | "done";

function seenThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Private mode / blocked storage: better to show it than to crash.
    return false;
  }
}

function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Free-trial offer that surfaces once the visitor has read ~30% of the page —
 * far enough in to be interested, early enough to still be reading.
 *
 * Submissions land in /api/leads, attributed to the same visitor and session
 * the analytics beacon is tracking, so they show up in the admin Leads view.
 */
export function TrialPopup() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const copy = t.trialPopup;

  const close = useCallback((via: "dismiss" | "backdrop" | "escape" | "close-button") => {
    markSeen();
    setOpen(false);
    trackEvent("trial_popup_dismissed", { via });
  }, []);

  // --- Trigger: 30% scroll depth ---------------------------------------------
  useEffect(() => {
    // The admin heatmap previews this page in an iframe with ?__notrack=1 —
    // a popup over the screenshot would only get in the operator's way.
    if (new URLSearchParams(window.location.search).has("__notrack")) return;
    if (seenThisSession()) return;

    let shown = false;
    const onScroll = () => {
      if (shown) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if ((window.scrollY || 0) / scrollable < SCROLL_TRIGGER) return;

      shown = true;
      window.removeEventListener("scroll", onScroll);
      setOpen(true);
      trackEvent("trial_popup_shown", { trigger: "scroll_30" });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Modal behaviour: scroll lock, escape, focus trap ----------------------
  useEffect(() => {
    if (!open) {
      restoreFocusTo.current?.focus?.();
      restoreFocusTo.current = null;
      return;
    }

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close("escape");
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Let the entrance animation start before pulling focus in.
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 120);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const honeypot = String(data.get("company_website") ?? "").trim();

    // One field for either, so the visitor gives whichever they prefer.
    const isEmail = contact.includes("@");
    if (!contact) {
      setError(copy.errorRequired);
      return;
    }
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setError(copy.errorEmail);
      return;
    }
    if (!isEmail && contact.replace(/\D/g, "").length < 7) {
      setError(copy.errorPhone);
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email: isEmail ? contact : undefined,
          phone: isEmail ? undefined : contact,
          company_website: honeypot || undefined,
          formId: FORM_ID,
          source: "trial-popup-scroll-30",
          interest: "Free trial",
          ...(getTrackingIdentity() ?? {}),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.ok) {
        setStatus("idle");
        setError(result?.error ?? copy.errorGeneric);
        return;
      }

      markSeen();
      setStatus("done");
      trackEvent("trial_popup_lead", { contact: isEmail ? "email" : "phone" });
    } catch {
      setStatus("idle");
      setError(copy.errorGeneric);
    }
  }

  if (!open) return null;

  return (
    <div
      className="trial-popup-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close("backdrop");
      }}
    >
      <div
        className="trial-popup"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-popup-heading"
      >
        <button
          type="button"
          className="trial-popup-close"
          aria-label={copy.close}
          onClick={() => close("close-button")}
        >
          <CloseIcon />
        </button>

        {status === "done" ? (
          <div className="trial-popup-done">
            <span className="trial-popup-tick" aria-hidden="true">
              <CheckIcon />
            </span>
            <h2 id="trial-popup-heading">{copy.successHeading}</h2>
            <p className="trial-popup-body">{copy.successBody}</p>
            <a className="btn btn-primary btn-lg" href={APP_URL} data-cta="trial-popup-open-app">
              {copy.successCta}
            </a>
          </div>
        ) : (
          <>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="trial-popup-heading">{copy.heading}</h2>
            <p className="trial-popup-body">{copy.body}</p>

            <div className="trial-popup-points">
              {copy.points.map((point) => (
                <span className="trial-point" key={point}>
                  <CheckIcon />
                  {point}
                </span>
              ))}
            </div>

            <form className="trial-popup-form" onSubmit={onSubmit} data-form={FORM_ID} noValidate>
              <label className="trial-popup-field">
                <span>{copy.nameLabel}</span>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={copy.namePlaceholder}
                />
              </label>

              <label className="trial-popup-field">
                <span>{copy.contactLabel}</span>
                <input
                  type="text"
                  name="contact"
                  required
                  autoComplete="email"
                  placeholder={copy.contactPlaceholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "trial-popup-error" : undefined}
                  onChange={() => error && setError(null)}
                />
              </label>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="trial-popup-honeypot"
              />

              {error && (
                <p className="trial-popup-error" id="trial-popup-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === "sending"}
                data-cta="trial-popup-submit"
              >
                {status === "sending" ? copy.submitting : copy.submit}
              </button>
            </form>

            <button type="button" className="trial-popup-later" onClick={() => close("dismiss")}>
              {copy.dismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
