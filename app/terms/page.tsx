import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/config";

const TITLE = "Terms of Service — Academy OS";
const DESCRIPTION =
  "The terms that apply when your academy uses Academy OS — accounts, billing, acceptable use and data ownership.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    siteName: "Academy OS",
    url: "/terms",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Agreeing to these terms",
    body: [
      "By creating an Academy OS account or using the service, you agree to these terms on behalf of yourself and the academy you represent. If you do not agree, please do not use the service.",
      "Academy OS is a product of TULSI, based in Mumbai, India.",
    ],
  },
  {
    heading: "Your account",
    body: [
      "You need an account to use the product. You are responsible for the accuracy of the information you provide, for keeping your credentials secure, and for everything done under your account.",
      "You may invite staff at your academy and set their permissions. You remain responsible for what those users do.",
      "You must be at least 18 years old to hold an account.",
    ],
  },
  {
    heading: "Free trial",
    body: [
      "We offer a free trial so you can judge the product on your own data. No payment is required to start it.",
      "At the end of the trial your account moves to a paid plan only if you choose one. If you do not, access is paused and your data is kept for 90 days so you can come back or export it.",
    ],
  },
  {
    heading: "Plans, fees and billing",
    body: [
      "Paid plans are billed in advance on the cycle shown at checkout. Prices are listed on our pricing page and are exclusive of taxes unless stated otherwise.",
      "Subscriptions renew automatically until you cancel. You can cancel at any time from your account settings, and the cancellation takes effect at the end of the current billing period.",
      "If we change our prices, we will give you at least 30 days' notice before the change applies to your renewal.",
    ],
  },
  {
    heading: "Your data is yours",
    body: [
      "The records you enter — students, parents, batches, fees, attendance and everything else — belong to your academy. We do not claim ownership of them.",
      "We process that data only to provide the service, as described in our Privacy Policy. You can export your data at any time while your account is active.",
    ],
  },
  {
    heading: "Acceptable use",
    body: ["To keep the service safe for everyone, you agree not to:"],
    points: [
      "Use the service for anything unlawful, or to store data you have no right to hold.",
      "Attempt to breach, probe or disrupt our systems, or access another academy's data.",
      "Resell, sublicense or white-label the service without our written agreement.",
      "Upload malware, or use the service to send unsolicited bulk messages.",
      "Reverse engineer the product, or copy its interface or code.",
    ],
  },
  {
    heading: "Availability and support",
    body: [
      "We work to keep Academy OS available and fast, but we do not promise uninterrupted service. We may need to take the product down for maintenance, and we will give notice where we reasonably can.",
      "Support is provided by email during Indian business hours. We aim to reply within one working day.",
    ],
  },
  {
    heading: "Our intellectual property",
    body: [
      "The Academy OS software, design, brand and documentation remain ours. Your subscription gives you a limited, non-exclusive, non-transferable right to use the product while your account is in good standing.",
    ],
  },
  {
    heading: "Suspension and termination",
    body: [
      "You can close your account at any time. We may suspend or close an account that breaches these terms, that has unpaid fees, or where we are required to by law — after telling you and, where practical, giving you a chance to put it right.",
      "After closure we keep your data for 90 days so you can export it, then delete it.",
    ],
  },
  {
    heading: "Disclaimers and liability",
    body: [
      "The service is provided as-is. To the extent the law allows, we exclude implied warranties, and we are not liable for indirect or consequential loss, or for lost profits or data.",
      "Where liability cannot be excluded, our total liability in any 12-month period is limited to the fees you paid us in that period.",
      "Academy OS helps you keep records. It is not a substitute for your own legal, tax or accounting advice.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of India, and the courts of Mumbai, Maharashtra have exclusive jurisdiction over any dispute.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms as the product changes. If a change materially affects your rights, we will email you before it takes effect. Continuing to use the service after that means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="10 September 2026"
      intro="These terms cover what you can expect from Academy OS, and what we expect from you. We have tried to write them in ordinary language."
      sections={SECTIONS}
      footnote={
        <>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </>
      }
    />
  );
}
