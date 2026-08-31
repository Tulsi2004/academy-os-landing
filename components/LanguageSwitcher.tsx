"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES } from "@/lib/i18n/locales";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function GlobeIcon() {
  return (
    <svg className="lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.75 5.75 3.75 9s-1.25 6.5-3.75 9c-2.5-2.5-3.75-5.75-3.75-9S9.5 5.5 12 3Z" />
    </svg>
  );
}

function FlagGlyph({ flag }: { flag: string }) {
  if (flag === "globe") return <GlobeIcon />;
  return <span aria-hidden="true">{flag}</span>;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="lang-flag">
          <FlagGlyph flag={current.flag} />
        </span>
        <span>{current.label}</span>
        <svg className="lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="lang-switcher-menu" role="listbox">
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                className={`lang-switcher-option${l.code === locale ? " active" : ""}`}
                role="option"
                aria-selected={l.code === locale}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
              >
                <span className="lang-flag">
                  <FlagGlyph flag={l.flag} />
                </span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
