import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/config";

const TITLE = "Privacy Policy — Academy OS";
const DESCRIPTION =
  "How Academy OS collects, uses and protects the information you and your academy share with us.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    siteName: "Academy OS",
    url: "/privacy",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      "Academy OS is a product of TULSI, based in Mumbai, India. This policy covers the Academy OS marketing site and the Academy OS application.",
      `If you have a question about anything here, write to us at ${CONTACT_EMAIL} and a person will reply.`,
    ],
  },
  {
    heading: "Information we collect",
    body: ["We collect three kinds of information, and no more than we need to run the service."],
    points: [
      "Account information — the name, email address, phone number and academy details you give us when you sign up or send an enquiry.",
      "Academy data — the records you enter into the product: students, parents, batches, teachers, fees, attendance, enquiries and related notes.",
      "Usage information — pages visited, actions taken, approximate location derived from your IP address, browser and device type. We use this to understand what is working and to find errors.",
    ],
  },
  {
    heading: "How we use it",
    body: ["We use your information to provide and improve the service. Specifically:"],
    points: [
      "To run your account, keep your data available, and provide support.",
      "To send service messages — billing notices, security alerts and important changes.",
      "To improve the product, by studying which features are used and where people get stuck.",
      "To meet legal and accounting obligations.",
    ],
  },
  {
    heading: "Student and minor data",
    body: [
      "Academies using Academy OS store records about students, many of whom are minors. Your academy is the controller of that data; we process it on your instructions and only to provide the service.",
      "We do not use student records to train models, we do not sell them, and we do not share them with advertisers. You remain responsible for having the consent you need from parents and guardians under applicable law.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "The site uses cookies and similar storage to keep you signed in, remember your language, and measure how the site is used.",
      "We use our own first-party analytics along with Vercel Analytics. You can block cookies in your browser; the marketing site will still work, though parts of the application need them to keep you signed in.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We do not sell your data. We share it only with the service providers we need to operate — hosting, database, email delivery and payment processing — and only to the extent they need it to perform that work.",
      "We may disclose information if the law requires it, or to protect the rights and safety of our users.",
    ],
  },
  {
    heading: "Where it is stored, and for how long",
    body: [
      "Data is stored on servers operated by our hosting and database providers, which may be located outside India. We take steps to ensure it is protected wherever it is held.",
      "We keep your data for as long as your account is active. After you close your account we delete or anonymise it within 90 days, except where we must keep records longer for legal or accounting reasons.",
    ],
  },
  {
    heading: "Security",
    body: [
      "Access is protected by authentication, encryption in transit, and role-based permissions inside the product. Only the people at your academy that you authorise can see your records.",
      "No system is perfectly secure. If we ever become aware of a breach affecting your data, we will tell you promptly and explain what happened.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us to show you the personal data we hold about you, correct it, export it, or delete it. Write to us and we will respond within 30 days.",
      "You can opt out of marketing email at any time using the unsubscribe link. Service messages about your account cannot be opted out of while the account is open.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If we change this policy in a way that materially affects you, we will update the date at the top of this page and let you know by email before the change takes effect.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="10 September 2026"
      intro="We keep this short and plain. Here is exactly what we collect, why we collect it, and what you can ask us to do with it."
      sections={SECTIONS}
      footnote={
        <>
          Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </>
      }
    />
  );
}
