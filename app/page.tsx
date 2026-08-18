import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BrandMark } from "@/components/BrandMark";
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
  AttendanceIcon,
  FeesIcon,
  EventsIcon,
  ExamsIcon,
  DocumentsIcon,
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

const MODULES = [
  { label: "Dashboard", Icon: DashboardIcon },
  { label: "Enquiries", Icon: EnquiriesIcon },
  { label: "Students", Icon: StudentsIcon },
  { label: "Parents", Icon: ParentsIcon },
  { label: "Courses", Icon: CoursesIcon },
  { label: "Batches", Icon: BatchesIcon },
  { label: "Teachers", Icon: TeachersIcon },
  { label: "Attendance", Icon: AttendanceIcon },
  { label: "Fees", Icon: FeesIcon },
  { label: "Events", Icon: EventsIcon },
  { label: "Exams", Icon: ExamsIcon },
  { label: "Documents", Icon: DocumentsIcon },
];

const FOOTER_LINKS = [
  { href: "#modules", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-you", label: "Who it's for" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="container hero-inner">
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
          </div>
        </section>

        {/* Value props */}
        <section className="values">
          <div className="container values-grid">
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
          </div>
        </section>

        {/* Modules */}
        <section className="modules" id="modules">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Everything in one place</span>
              <h2>One dashboard for the whole academy</h2>
              <p>Every part of running your academy, connected — so nothing falls through the cracks.</p>
            </div>

            <div className="modules-grid">
              {MODULES.map(({ label, Icon }, index) => (
                <div
                  className="module-card"
                  key={label}
                  style={{ "--icon-accent": popColor(index) } as CSSProperties}
                >
                  <span className="module-icon">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="how-it-works" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">How it works</span>
              <h2>From first enquiry to fee receipt</h2>
              <p>A simple flow that mirrors how academies actually run — no retraining your front desk.</p>
            </div>

            <ol className="steps">
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
            </ol>
          </div>
        </section>

        {/* Who it's for */}
        <section className="for-you" id="for-you">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Built to flex</span>
              <h2>Whichever way your academy runs</h2>
            </div>

            <div className="path-grid">
              <div className="path-card">
                <h3>Structured academies</h3>
                <p>
                  Fixed courses, term-based batches, and a set weekly schedule. Academy OS keeps every
                  batch&apos;s roster, teacher, and capacity in sync.
                </p>
              </div>
              <div className="path-card">
                <h3>Flexible studios</h3>
                <p>
                  Drop-in classes, private lessons, and rolling admissions. Academy OS adapts to
                  ad-hoc enquiries and one-off bookings just as easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="benefits">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Why teams switch</span>
              <h2>What you get back</h2>
            </div>

            <div className="benefits-grid">
              <div className="benefit">
                <h4>Save hours every week</h4>
                <p>Stop rebuilding the same spreadsheet three different ways for three different people.</p>
              </div>
              <div className="benefit">
                <h4>Never miss a follow-up</h4>
                <p>Every open enquiry surfaces exactly when it needs your attention — not a day later.</p>
              </div>
              <div className="benefit">
                <h4>Keep your team aligned</h4>
                <p>Front desk, teachers, and accounts all look at the same up-to-date record.</p>
              </div>
              <div className="benefit">
                <h4>Your data, your academy</h4>
                <p>Everything lives in your own workspace — organized, exportable, and under your control.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Category strip */}
        <section className="categories">
          <div className="container">
            <p className="categories-label">Built for academies of every kind</p>
            <div className="pill-row">
              {["Dance", "Music", "Art", "Sports", "Language", "Coaching"].map((category) => (
                <span className="pill" key={category}>
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-banner">
          <div className="container cta-banner-inner">
            <h2>Ready to bring order to your academy?</h2>
            <p>Set up takes minutes. Your first enquiry can be logged today.</p>
            <a className="btn btn-primary btn-lg" href={APP_URL}>
              Start now
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
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
          <p className="footer-copy">© 2026 Academy OS. Built for academies, by people who run them.</p>
        </div>
      </footer>
    </>
  );
}
