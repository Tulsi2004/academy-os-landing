import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BrandMark } from "@/components/BrandMark";
import { RevealGroup } from "@/components/RevealGroup";
import { APP_URL } from "@/lib/config";
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
  InstagramGlyph,
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

const DISCIPLINES = ["Dance", "Music", "Art", "Sport", "Language", "Coaching"];
const ROTATOR_DURATION = 8.4;

const DASHBOARD_STATS = [
  { label: "Students", value: "128" },
  { label: "Collected", value: "₹42k" },
  { label: "Attendance", value: "94%" },
];

const CHECK_ROWS = ["Fee paid", "Fee due", "Marked present"];

const FLEX_DOTS = [
  { size: "14px", left: "6%", top: "10%" },
  { size: "10px", left: "28%", top: "55%" },
  { size: "18px", left: "48%", top: "20%" },
  { size: "11px", left: "68%", top: "60%" },
  { size: "15px", left: "88%", top: "15%" },
];

const MORE_MODULES = [
  { label: "Parents", Icon: ParentsIcon },
  { label: "Courses", Icon: CoursesIcon },
  { label: "Batches", Icon: BatchesIcon },
  { label: "Teachers", Icon: TeachersIcon },
  { label: "Events", Icon: EventsIcon },
  { label: "Exams", Icon: ExamsIcon },
  { label: "Documents", Icon: DocumentsIcon },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    tagline: "For solo instructors and small studios getting organized.",
    price: "₹999",
    features: ["Up to 50 active students", "Enquiries & student records", "Fees & attendance tracking", "Email support"],
  },
  {
    name: "Growth",
    tagline: "For growing academies running multiple batches and teachers.",
    price: "₹2,499",
    features: ["Everything in Starter", "Unlimited students & batches", "Parent portal access", "Priority chat support"],
    featured: true,
  },
  {
    name: "Academy",
    tagline: "For multi-location academies that need more control.",
    price: "₹4,999",
    features: ["Everything in Growth", "Multiple branches", "Teacher payroll & payouts", "Dedicated onboarding"],
  },
];

const TRIAL_POINTS = ["No credit card required", "Full feature access", "Cancel anytime"];

const FAQS = [
  {
    question: "Can I try Academy OS before paying?",
    answer: "Yes — every plan starts with a 14-day free trial, no credit card required. You can log real enquiries and students from day one.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Anytime. Upgrade or downgrade from your settings and we prorate the difference — no need to talk to anyone.",
  },
  {
    question: "Is my academy's data secure?",
    answer: "Your data lives in your own workspace, encrypted at rest and in transit. It's never shared with or sold to anyone else.",
  },
  {
    question: "Do you support multiple branches?",
    answer: "Yes, on the Academy plan. Each branch gets its own batches and staff while owners see everything rolled up in one dashboard.",
  },
  {
    question: "What if my team is used to spreadsheets?",
    answer: "Most teams are fully switched over within a week. Import your existing student list with our CSV importer and we'll walk you through the rest.",
  },
];

const FOOTER_LINKS = [
  { href: "#modules", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-you", label: "Who it's for" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInGlyph },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramGlyph },
  { label: "WhatsApp", href: "https://wa.me", Icon: WhatsAppGlyph },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <RevealGroup as="div" className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Now in early access</span>
              <h1>Run your academy from one calm dashboard</h1>
              <p className="lead">
                Enquiries, students, batches, fees, attendance and more — everything a dance,
                music, art or coaching academy needs, without the spreadsheet chaos.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-lg" href={APP_URL}>
                  Start now
                </a>
                <a className="btn btn-ghost btn-lg" href="#modules">
                  See what&apos;s inside ↓
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
            <div className="value-card" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
              <div className="value-icon">
                <EnquiriesIcon />
              </div>
              <h3>Every enquiry, followed up</h3>
              <p>Log a lead in seconds and never let a promising enquiry go cold — follow-ups are tracked automatically.</p>
            </div>

            <div className="value-card" style={{ "--icon-accent": popColor(1) } as CSSProperties}>
              <div className="value-icon">
                <StudentsIcon />
              </div>
              <h3>One record per student</h3>
              <p>Parents, batches, payments and attendance — all linked to a single student profile, not scattered across sheets.</p>
            </div>

            <div className="value-card" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
              <div className="value-icon">
                <FeesAttendanceIcon />
              </div>
              <h3>Fees &amp; attendance, tracked</h3>
              <p>See who&apos;s paid, who&apos;s due, and who showed up — at a glance, without chasing anyone for updates.</p>
            </div>
          </RevealGroup>
        </section>

        {/* Modules */}
        <section className="modules" id="modules">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">Everything in one place</span>
              <h2>One dashboard for the whole academy</h2>
              <p>Every part of running your academy, connected — so nothing falls through the cracks.</p>
            </RevealGroup>

            <RevealGroup as="div" className="modules-bento">
              <div className="bento-card bento-card--wide" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <span className="module-icon">
                  <DashboardIcon />
                </span>
                <h3>Dashboard</h3>
                <p>One screen for your whole academy — enquiries, fees, attendance, and today&apos;s schedule, all at a glance.</p>
                <div className="mini-stats" aria-hidden="true">
                  {DASHBOARD_STATS.map((stat, i) => (
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
                <h3>Enquiries</h3>
                <p>Log a lead in seconds and get an automatic nudge before it goes cold.</p>
                <div className="enquiry-ping">
                  <span className="ping-dot" />
                  <span>New enquiry just came in</span>
                </div>
              </div>

              <div className="bento-card" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <span className="module-icon">
                  <StudentsIcon />
                </span>
                <h3>Students</h3>
                <p>Parents, batches, payments, and attendance — one record per student.</p>
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
                <h3>Fees &amp; Attendance</h3>
                <p>See who&apos;s paid, who&apos;s due, and who showed up — without chasing anyone.</p>
                <div className="check-rows" aria-hidden="true">
                  {CHECK_ROWS.map((row, i) => (
                    <div className="row" key={row}>
                      <span className="box" style={{ animationDelay: `${i * 1.5}s` } as CSSProperties} />
                      {row}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-card bento-card--visual">
                <h3>Every discipline</h3>
                <p>One system, whatever you teach:</p>
                <div className="word-rotator" aria-hidden="true">
                  {DISCIPLINES.map((word, i) => (
                    <span
                      key={word}
                      style={{ color: popColor(i), animationDelay: `${i * (ROTATOR_DURATION / DISCIPLINES.length)}s` } as CSSProperties}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <span className="sr-only">Dance, music, art, sport, language, and coaching.</span>
              </div>

              <div className="bento-card bento-card--wide bento-card--visual">
                <span className="live-badge">
                  <span className="live-dot" />
                  Live
                </span>
                <h3>Always up to date</h3>
                <p>Every enquiry, payment, and check-in updates the dashboard instantly — no refresh, no re-entry.</p>
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
              <p className="modules-more-label">…and everything else, built in</p>
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
              <span className="eyebrow">How it works</span>
              <h2>From first enquiry to fee receipt</h2>
              <p>A simple flow that mirrors how academies actually run — no retraining your front desk.</p>
            </RevealGroup>

            <div className="steps-wrap">
              <span className="steps-track" aria-hidden="true" />
              <span className="steps-runner" aria-hidden="true" />
              <RevealGroup as="ol" className="steps">
                <li className="step">
                  <span className="step-number">1</span>
                  <h3>Capture the enquiry</h3>
                  <p>A parent calls or walks in — log their interest in under a minute, with an automatic follow-up reminder.</p>
                </li>
                <li className="step">
                  <span className="step-number">2</span>
                  <h3>Convert to a student</h3>
                  <p>When they&apos;re ready to join, turn the enquiry into a full student profile and assign a batch — no re-typing.</p>
                </li>
                <li className="step">
                  <span className="step-number">3</span>
                  <h3>Manage fees &amp; attendance</h3>
                  <p>Track payments, mark attendance, and keep a running history for every student, automatically.</p>
                </li>
              </RevealGroup>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="for-you" id="for-you">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">Built to flex</span>
              <h2>Whichever way your academy runs</h2>
            </RevealGroup>

            <RevealGroup as="div" className="path-grid">
              <div className="path-card" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <h3>Structured academies</h3>
                <p>
                  Fixed courses, term-based batches, and a set weekly schedule. Academy OS keeps every
                  batch&apos;s roster, teacher, and capacity in sync.
                </p>
                <div className="schedule-grid" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 0.2}s` } as CSSProperties} />
                  ))}
                </div>
              </div>
              <div className="path-card" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <h3>Flexible studios</h3>
                <p>
                  Drop-in classes, private lessons, and rolling admissions. Academy OS adapts to
                  ad-hoc enquiries and one-off bookings just as easily.
                </p>
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
              <span className="eyebrow">Why teams switch</span>
              <h2>What you get back</h2>
            </RevealGroup>

            <RevealGroup as="div" className="benefits-grid">
              <div className="benefit" style={{ "--icon-accent": popColor(0) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--clock">
                  <ClockIcon />
                </span>
                <h4>Save hours every week</h4>
                <p>Stop rebuilding the same spreadsheet three different ways for three different people.</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(1) } as CSSProperties}>
                <span className="benefit-icon">
                  <BellIcon />
                  <span className="ping-dot benefit-icon-badge" />
                </span>
                <h4>Never miss a follow-up</h4>
                <p>Every open enquiry surfaces exactly when it needs your attention — not a day later.</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(2) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--pulse">
                  <TeamIcon />
                </span>
                <h4>Keep your team aligned</h4>
                <p>Front desk, teachers, and accounts all look at the same up-to-date record.</p>
              </div>
              <div className="benefit" style={{ "--icon-accent": popColor(3) } as CSSProperties}>
                <span className="benefit-icon benefit-icon--glow">
                  <ShieldIcon />
                </span>
                <h4>Your data, your academy</h4>
                <p>Everything lives in your own workspace — organized, exportable, and under your control.</p>
              </div>
            </RevealGroup>
          </div>
        </section>

        {/* Category strip */}
        <section className="categories">
          <div className="container">
            <p className="categories-label">Built for academies of every kind</p>
            <RevealGroup as="div" className="pill-row">
              {["Dance", "Music", "Art", "Sports", "Language", "Coaching"].map((category, i) => (
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
            <span className="eyebrow">No risk</span>
            <h2>Try Academy OS free for 14 days</h2>
            <p>Full access to every feature on every plan. No credit card, no games — cancel whenever you like.</p>
            <div className="trial-points">
              {TRIAL_POINTS.map((point) => (
                <span className="trial-point" key={point}>
                  <CheckIcon />
                  {point}
                </span>
              ))}
            </div>
            <a className="btn btn-primary btn-lg btn-pulse" href={APP_URL}>
              Start your free trial
            </a>
          </RevealGroup>
        </section>

        {/* Pricing */}
        <section className="pricing" id="pricing">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">Simple pricing</span>
              <h2>Plans that grow with your academy</h2>
              <p>No setup fees, no hidden costs. Every plan includes a 14-day free trial.</p>
            </RevealGroup>

            <RevealGroup as="div" className="pricing-grid">
              {PRICING_PLANS.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`price-card${plan.featured ? " price-card--featured" : ""}`}
                  style={{ "--icon-accent": popColor(i) } as CSSProperties}
                >
                  {plan.featured && <span className="price-card-badge">Most popular</span>}
                  <h3>{plan.name}</h3>
                  <p className="price-tagline">{plan.tagline}</p>
                  <p className="price-value">
                    {plan.price}
                    <span className="price-suffix">/month</span>
                  </p>
                  <ul className="price-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`btn btn-lg ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                    href={APP_URL}
                  >
                    Get started
                  </a>
                </div>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="container">
            <RevealGroup as="div" className="section-heading">
              <span className="eyebrow">Questions</span>
              <h2>Frequently asked questions</h2>
            </RevealGroup>

            <RevealGroup as="div" className="faq-list">
              {FAQS.map((item) => (
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
            <h2>Ready to bring order to your academy?</h2>
            <p>Set up takes minutes. Your first enquiry can be logged today.</p>
            <a className="btn btn-primary btn-lg btn-pulse" href={APP_URL}>
              Start now
            </a>
          </RevealGroup>
        </section>
      </main>

      <footer className="site-footer">
        <RevealGroup as="div" className="container footer-inner">
          <div className="footer-top">
            <a href="#top" className="brand">
              <BrandMark />
              Academy OS
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
            <p className="footer-copy">© 2026 Academy OS. Built for academies, by people who run them.</p>
            <nav className="footer-legal" aria-label="Legal">
              <a href="/privacy">Privacy Policy</a>
              <a href="/contact">Contact Us</a>
            </nav>
          </div>
        </RevealGroup>
      </footer>
    </>
  );
}
