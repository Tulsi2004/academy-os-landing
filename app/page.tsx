"use client";

import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BrandMark } from "@/components/BrandMark";
import { RevealGroup } from "@/components/RevealGroup";
import { APP_URL, CONTACT_EMAIL } from "@/lib/config";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  EnquiriesIcon,
  StudentsIcon,
  FeesAttendanceIcon,
  DashboardIcon,
  ParentsIcon,
  CoursesIcon,
  BatchesIcon,
  TeachersIcon,
  EventsIcon,
  ExamsIcon,
  DocumentsIcon,
  ClockIcon,
  BellIcon,
  TeamIcon,
  ShieldIcon,
  CheckIcon,
  ChevronIcon,
  LinkedInGlyph,
  WhatsAppGlyph,
} from "@/components/icons";

const POP_COLORS = [
  "var(--pop-purple)",
  "var(--pop-orange)",
  "var(--pop-blue)",
  "var(--pop-green)",
  "var(--pop-coral)",
];

function popColor(index: number) {
  return POP_COLORS[index % POP_COLORS.length];
}

const ROTATOR_DURATION = 8.4;

const MORE_MODULE_ICONS = [ParentsIcon, CoursesIcon, BatchesIcon, TeachersIcon, EventsIcon, ExamsIcon, DocumentsIcon];

const FLEX_DOTS = [
  { size: "14px", left: "6%", top: "10%" },
  { size: "10px", left: "28%", top: "55%" },
  { size: "18px", left: "48%", top: "20%" },
  { size: "11px", left: "68%", top: "60%" },
  { size: "15px", left: "88%", top: "15%" },
];

export default function Home() {
  const { t } = useLanguage();

  const FOOTER_LINKS = [
    { href: "#modules", label: t.nav.features },
    { href: "#how-it-works", label: t.nav.howItWorks },
    { href: "#for-you", label: t.nav.whoItsFor },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#faq", label: t.nav.faq },
  ];

  const SOCIAL_LINKS = [
    { label: t.footer.social.linkedin, href: "https://linkedin.com", Icon: LinkedInGlyph },
    { label: t.footer.social.whatsapp, href: "https://wa.me", Icon: WhatsAppGlyph },
  ];

  const MORE_MODULES = t.modules.more.map((label, i) => ({ label, Icon: MORE_MODULE_ICONS[i] }));

  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <RevealGroup as="div" className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">{t.hero.eyebrow}</span>
              <h1>{t.hero.heading}</h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-lg" href={APP_URL}>
                  {t.hero.ctaPrimary}
                </a>
                <a className="btn btn-ghost btn-lg" href="#modules">
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="mock-window">
                <div className="mock-titlebar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="mock-body">
                  <div className="mock-sidebar">
                    <div className="mock-pill active"></div>
                    <div className="mock-pill"></div>
                    <div className="mock-pill"></div>
                    <div className="mock-pill"></div>
                    <div className="mock-pill"></div>
                  </div>
                  <div className="mock-main">
                    <div className="mock-stats">
                      <div className="mock-stat"></div>
                      <div className="mock-stat"></div>
                      <div className="mock-stat"></div>
                    </div>
                    <div className="mock-row"></div>
                    <div className="mock-row"></div>
                    <div className="mock-row"></div>
                  </div>
                </div>
              </div>
            </div>
          </RevealGroup>
        </section>

        {/* Value props */}
        <section className="values">
          <RevealGroup as="div" className="container values-grid">
            {t.values.items.map((item, i) => {
              const Icon = [EnquiriesIcon, StudentsIcon, FeesAttendanceIcon][i];
              return (
                <div className="value-card" key={item.title} style={{ "--icon-accent": popColor(i) } as CSSProperties}>
                  <div className="value-icon">
                    <Icon />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              );
            })}
          </RevealGroup>
        </section>

        {/* Modules */}
        <section className="modules" id="modules">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.modules.eyebrow}</span>
              <h2>{t.modules.heading}</h2>
              <p>{t.modules.body}</p>
            </RevealGroup>

            <RevealGroup as="div" className="modules-bento">
              <div className="bento-card bento-card--wide" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <span className="module-icon">
                  <DashboardIcon />
                </span>
                <h3>{t.modules.dashboard.title}</h3>
                <p>{t.modules.dashboard.body}</p>
                <div className="mini-stats" aria-hidden="true">
                  {t.modules.dashboard.stats.map((stat, i) => (
                    <div className="mini-stat" key={stat.label} style={{ animationDelay: `${i * 0.5}s` } as CSSProperties}>
                      <span className="value">{stat.value}</span>
                      <span className="label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-card" style={{ "--icon-accent": popColor(1) } as CSSProperties}>
                <span className="module-icon">
                  <EnquiriesIcon />
                </span>
                <h3>{t.modules.enquiries.title}</h3>
                <p>{t.modules.enquiries.body}</p>
                <div className="enquiry-ping">
                  <span className="ping-dot" />
                  <span>{t.modules.enquiries.ping}</span>
                </div>
              </div>

              <div className="bento-card" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <span className="module-icon">
                  <StudentsIcon />
                </span>
                <h3>{t.modules.students.title}</h3>
                <p>{t.modules.students.body}</p>
                <div className="link-pulse" aria-hidden="true">
                  <span className="track" />
                  <span className="node" style={{ left: "0%" } as CSSProperties} />
                  <span className="node" style={{ left: "50%" } as CSSProperties} />
                  <span className="node" style={{ left: "100%" } as CSSProperties} />
                  <span className="runner" />
                </div>
              </div>

              <div className="bento-card" style={{ "--icon-accent": popColor(3) } as CSSProperties}>
                <span className="module-icon">
                  <FeesAttendanceIcon />
                </span>
                <h3>{t.modules.feesAttendance.title}</h3>
                <p>{t.modules.feesAttendance.body}</p>
                <div className="check-rows" aria-hidden="true">
                  {t.modules.feesAttendance.rows.map((row, i) => (
                    <div className="row" key={row}>
                      <span className="box" style={{ animationDelay: `${i * 1.5}s` } as CSSProperties} />
                      {row}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-card bento-card--visual">
                <h3>{t.modules.everyDiscipline.title}</h3>
                <p>{t.modules.everyDiscipline.lead}</p>
                <div className="word-rotator" aria-hidden="true">
                  {t.modules.everyDiscipline.disciplines.map((word, i) => (
                    <span
                      key={word}
                      style={
                        {
                          color: popColor(i),
                          animationDelay: `${i * (ROTATOR_DURATION / t.modules.everyDiscipline.disciplines.length)}s`,
                        } as CSSProperties
                      }
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <span className="sr-only">{t.modules.everyDiscipline.srSummary}</span>
              </div>

              <div className="bento-card bento-card--wide bento-card--visual">
                <span className="live-badge">
                  <span className="live-dot" />
                  {t.modules.alwaysUpToDate.live}
                </span>
                <h3>{t.modules.alwaysUpToDate.title}</h3>
                <p>{t.modules.alwaysUpToDate.body}</p>
                <div className="bento-bars" aria-hidden="true">
                  {[0.55, 0.85, 0.4, 0.95, 0.65, 0.75].map((peak, i) => (
                    <span
                      key={i}
                      style={
                        {
                          "--peak": peak,
                          background: popColor(i),
                          animationDelay: `${i * 0.18}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </RevealGroup>

            <div className="modules-more">
              <p className="modules-more-label">{t.modules.moreLabel}</p>
              <RevealGroup as="div" className="modules-more-list">
                {MORE_MODULES.map(({ label, Icon }) => (
                  <span className="module-chip" key={label}>
                    <Icon />
                    {label}
                  </span>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works" id="how-it-works">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.howItWorks.eyebrow}</span>
              <h2>{t.howItWorks.heading}</h2>
              <p>{t.howItWorks.body}</p>
            </RevealGroup>

            <div className="steps-wrap">
              <span className="steps-track" aria-hidden="true" />
              <span className="steps-runner" aria-hidden="true" />
              <RevealGroup as="ol" className="steps">
                {t.howItWorks.steps.map((step, i) => (
                  <li className="step" key={step.title}>
                    <span className="step-number">{i + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </li>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="for-you" id="for-you">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.forYou.eyebrow}</span>
              <h2>{t.forYou.heading}</h2>
            </RevealGroup>

            <RevealGroup as="div" className="path-grid">
              <div className="path-card" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <h3>{t.forYou.structured.title}</h3>
                <p>{t.forYou.structured.body}</p>
                <div className="schedule-grid" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 0.2}s` } as CSSProperties} />
                  ))}
                </div>
              </div>
              <div className="path-card" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <h3>{t.forYou.flexible.title}</h3>
                <p>{t.forYou.flexible.body}</p>
                <div className="flex-dots" aria-hidden="true">
                  {FLEX_DOTS.map((dot, i) => (
                    <span
                      key={i}
                      style={
                        {
                          width: dot.size,
                          height: dot.size,
                          left: dot.left,
                          top: dot.top,
                          animationDelay: `${i * 0.35}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            </RevealGroup>
          </div>
        </section>

        {/* Benefits */}
        <section className="benefits">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.benefits.eyebrow}</span>
              <h2>{t.benefits.heading}</h2>
            </RevealGroup>

            <RevealGroup as="div" className="benefits-grid">
              <div className="benefit" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--clock">
                  <ClockIcon />
                </span>
                <h4>{t.benefits.items[0].title}</h4>
                <p>{t.benefits.items[0].body}</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(1) } as CSSProperties}>
                <span className="benefit-icon">
                  <BellIcon />
                  <span className="ping-dot benefit-icon-badge" />
                </span>
                <h4>{t.benefits.items[1].title}</h4>
                <p>{t.benefits.items[1].body}</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--pulse">
                  <TeamIcon />
                </span>
                <h4>{t.benefits.items[2].title}</h4>
                <p>{t.benefits.items[2].body}</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(3) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--glow">
                  <ShieldIcon />
                </span>
                <h4>{t.benefits.items[3].title}</h4>
                <p>{t.benefits.items[3].body}</p>
              </div>
            </RevealGroup>
          </div>
        </section>

        {/* Category strip */}
        <section className="categories">
          <div className="container">
            <p className="categories-label">{t.categories.label}</p>
            <RevealGroup as="div" className="pill-row">
              {t.categories.items.map((category, i) => (
                <span className="pill" key={category} style={{ animationDelay: `${i * 0.15}s` } as CSSProperties}>
                  {category}
                </span>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Free trial */}
        <section className="trial-banner" id="free-trial">
          <RevealGroup as="div" className="container trial-inner">
            <span className="eyebrow">{t.trial.eyebrow}</span>
            <h2>{t.trial.heading}</h2>
            <p>{t.trial.body}</p>
            <div className="trial-points">
              {t.trial.points.map((point) => (
                <span className="trial-point" key={point}>
                  <CheckIcon />
                  {point}
                </span>
              ))}
            </div>
            <a className="btn btn-primary btn-lg btn-pulse" href={APP_URL}>
              {t.trial.cta}
            </a>
          </RevealGroup>
        </section>

        {/* Pricing */}
        <section className="pricing" id="pricing">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.pricing.eyebrow}</span>
              <h2>{t.pricing.heading}</h2>
              <p>{t.pricing.body}</p>
            </RevealGroup>

            <RevealGroup as="div" className="pricing-grid">
              {t.pricing.plans.map((plan, i) => {
                const featured = i === 1;
                return (
                  <div
                    key={plan.name}
                    className={`price-card${featured ? " price-card--featured" : ""}`}
                    style={{ "--icon-accent": popColor(i) } as CSSProperties}
                  >
                    {featured && <span className="price-card-badge">{t.pricing.mostPopular}</span>}
                    <h3>{plan.name}</h3>
                    <p className="price-tagline">{plan.tagline}</p>
                    <p className="price-value">
                      {plan.price}
                      <span className="price-suffix">{t.pricing.monthSuffix}</span>
                    </p>
                    <ul className="price-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <CheckIcon />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a className={`btn btn-lg ${featured ? "btn-primary" : "btn-ghost"}`} href={APP_URL}>
                      {t.pricing.cta}
                    </a>
                  </div>
                );
              })}
            </RevealGroup>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">{t.faq.eyebrow}</span>
              <h2>{t.faq.heading}</h2>
            </RevealGroup>

            <RevealGroup as="div" className="faq-list">
              {t.faq.items.map((item) => (
                <details className="faq-item" key={item.question}>
                  <summary>
                    {item.question}
                    <ChevronIcon className="chevron" />
                  </summary>
                  <p className="faq-answer">{item.answer}</p>
                </details>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-banner">
          <RevealGroup as="div" className="container cta-banner-inner">
            <h2>{t.finalCta.heading}</h2>
            <p>{t.finalCta.body}</p>
            <a className="btn btn-primary btn-lg btn-pulse" href={APP_URL}>
              {t.finalCta.cta}
            </a>
          </RevealGroup>
        </section>
      </main>

      <footer className="site-footer">
        <RevealGroup as="div" className="container footer-inner">
          <div className="footer-top">
            <a href="#top" className="brand">
              <BrandMark />
              <span className="brand-text">
                <span className="brand-parent">TULSI</span>
                <span className="brand-product">Academy OS</span>
              </span>
            </a>
            <nav className="footer-nav" aria-label="Footer">
              {FOOTER_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="footer-social" aria-label="Social links">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">{t.footer.copyright}</p>
            <nav className="footer-legal" aria-label="Legal">
              <a href="/privacy">{t.footer.privacy}</a>
              <a href={`mailto:${CONTACT_EMAIL}`}>{t.footer.contact}</a>
            </nav>
          </div>
        </RevealGroup>
      </footer>
    </>
  );
}
