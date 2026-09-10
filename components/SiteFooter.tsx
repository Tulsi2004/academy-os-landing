"use client";

import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { RevealGroup } from "./RevealGroup";
import { LinkedInGlyph, WhatsAppGlyph } from "./icons";
import { APP_URL, CONTACT_EMAIL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useSectionHref } from "@/lib/useSectionHref";

export function SiteFooter() {
  const { t } = useLanguage();
  const section = useSectionHref();

  const PRODUCT_LINKS = [
    { href: section("modules"), label: t.nav.features },
    { href: section("how-it-works"), label: t.nav.howItWorks },
    { href: section("for-you"), label: t.nav.whoItsFor },
    { href: section("pricing"), label: t.nav.pricing },
    { href: section("faq"), label: t.nav.faq },
  ];

  const LEGAL_LINKS = [
    { href: "/privacy", label: t.footer.privacy },
    { href: "/terms", label: t.footer.terms },
    { href: "/refund", label: t.footer.refund },
  ];

  const SOCIAL_LINKS = [
    { label: t.footer.social.linkedin, href: LINKEDIN_URL, Icon: LinkedInGlyph },
    { label: t.footer.social.whatsapp, href: WHATSAPP_URL, Icon: WhatsAppGlyph },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <RevealGroup as="div" className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <BrandMark />
              <span className="brand-text">
                <span className="brand-parent">TULSI</span>
                <span className="brand-product">Academy OS</span>
              </span>
            </Link>
            <p>{t.footer.tagline}</p>
          </div>

          <div className="footer-col">
            <h4>{t.footer.product}</h4>
            <ul>
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <Link href="/blog">{t.nav.blog}</Link>
              </li>
              <li>
                <a href={APP_URL}>{t.footer.dashboard}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.footer.legal}</h4>
            <ul>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.footer.connect}</h4>
            <ul>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{t.footer.contact}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            </ul>
            <div className="footer-social" aria-label="Social links">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </RevealGroup>

        <div className="footer-bottom">
          <p className="footer-copy">{t.footer.copyright}</p>
          <p className="footer-note">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
