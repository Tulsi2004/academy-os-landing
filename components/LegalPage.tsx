import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export type LegalSection = {
  heading: string;
  /** Each entry renders as its own paragraph. */
  body: string[];
  /** Optional bulleted list rendered after the paragraphs. */
  points?: string[];
};

/**
 * Shell for the policy pages. These are deliberately English-only: the
 * dictionaries carry marketing copy, and translating legal text without review
 * would be worse than showing one authoritative version.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
  footnote,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  footnote?: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="legal-hero">
          <div className="container legal-hero-inner">
            <span className="eyebrow">Legal</span>
            <h1>{title}</h1>
            <p className="legal-updated">Last updated: {updated}</p>
            <p className="legal-lead">{intro}</p>
          </div>
        </section>

        <section className="legal-body">
          <div className="container legal-body-inner">
            {sections.map((section) => (
              <article className="legal-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.points && (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
            {footnote && <p className="legal-footnote">{footnote}</p>}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
