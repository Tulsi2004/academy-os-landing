"use client";

import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { APP_URL } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_LINKS = [
    { href: "#modules", label: t.nav.features },
    { href: "#how-it-works", label: t.nav.howItWorks },
    { href: "#for-you", label: t.nav.whoItsFor },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <BrandMark />
          <span className="brand-text">
            <span className="brand-parent">TULSI</span>
            <span className="brand-product">Academy OS</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <LanguageSwitcher />
          <a className="btn btn-primary" href={APP_URL}>
            {t.nav.startNow}
          </a>
        </div>

        <button
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
          </svg>
        </button>
      </div>

      <div className={`mobile-nav${open ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="btn btn-primary" href={APP_URL} onClick={() => setOpen(false)}>
          {t.nav.startNow}
        </a>
        <div className="mobile-lang">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
