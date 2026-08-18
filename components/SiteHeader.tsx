"use client";

import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { APP_URL } from "@/lib/config";

const NAV_LINKS = [
  { href: "#modules", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-you", label: "Who it's for" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <BrandMark />
          Academy OS
        </a>

        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <a className="btn btn-primary" href={APP_URL}>
            Start now
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
          Start now
        </a>
      </div>
    </header>
  );
}
