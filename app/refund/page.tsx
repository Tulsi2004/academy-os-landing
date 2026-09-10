import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/config";

const TITLE = "Refund Policy — Academy OS";
const DESCRIPTION =
  "When you can get your money back on an Academy OS subscription, how to ask, and how long it takes.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/refund" },
  openGraph: {
    type: "website",
    siteName: "Academy OS",
    url: "/refund",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Try before you pay",
    body: [
      "Every academy gets a free trial with the full product and no card required. We would much rather you decided during the trial than asked for a refund later, so take the time you need.",
    ],
  },
  {
    heading: "The 14-day refund window",
    body: [
      "If you are not happy with Academy OS, write to us within 14 days of a charge and we will refund it in full. You do not need to justify the decision.",
      "This applies to your first payment on a plan, and to the first payment after an upgrade.",
    ],
  },
  {
    heading: "Renewals",
    body: [
      "Subscriptions renew automatically. We email you before an annual renewal so it is never a surprise.",
      "If a renewal catches you out, tell us within 14 days and we will refund it and close the subscription.",
    ],
  },
  {
    heading: "Cancelling",
    body: [
      "You can cancel at any time from your account settings. Cancelling stops the next charge; it does not by itself refund the current period.",
      "You keep access until the end of the period you have already paid for.",
    ],
  },
  {
    heading: "What we cannot refund",
    body: ["A few things sit outside this policy:"],
    points: [
      "Periods older than 14 days that you used normally.",
      "Custom onboarding, data migration or training work that has already been carried out.",
      "Accounts closed by us for a breach of our Terms of Service.",
      "Payment gateway charges, where the gateway does not return them to us.",
    ],
  },
  {
    heading: "How to request a refund",
    body: [
      `Email ${CONTACT_EMAIL} from the address on the account. Tell us the academy name and roughly when you were charged — we will find the rest.`,
      "We respond within two working days, and approved refunds are sent back to the original payment method within 5–10 working days depending on your bank.",
    ],
  },
  {
    heading: "If something goes wrong on our side",
    body: [
      "If the product is unavailable for an extended period through our fault, tell us. We will credit or refund the affected time even if the 14 days have passed.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy. The version that applies to a payment is the one published on the day the payment was made.",
    ],
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="10 September 2026"
      intro="We would rather have a happy academy than a reluctant subscription. If the product is not right for you, here is how to get your money back."
      sections={SECTIONS}
      footnote={
        <>
          Need a refund? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will sort it out.
        </>
      }
    />
  );
}
