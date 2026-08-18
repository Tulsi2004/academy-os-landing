import type { Metadata } from "next";
import { Nunito, Public_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-heading",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Academy OS — Run your academy from one calm dashboard",
  description:
    "Enquiries, students, batches, fees, attendance and more — everything a dance, music, art or coaching academy needs, in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${publicSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
