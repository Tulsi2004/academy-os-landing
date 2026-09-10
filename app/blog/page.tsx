import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getPostsPage } from "@/lib/sanity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy-os-landing.vercel.app";

const TITLE = "Blog — Academy OS";
const DESCRIPTION =
  "Guides, deep-dives and field notes from the Academy OS team.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    siteName: "Academy OS",
    url: `${siteUrl}/blog`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

// A new post goes live within a minute, with no redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  // Only the first page is rendered here; BlogIndex fetches the rest on demand.
  // Every post still reaches crawlers through sitemap.xml.
  const { items, total } = await getPostsPage();

  return (
    <>
      <SiteHeader />
      <BlogIndex initialPosts={items} total={total} />
      <SiteFooter />
    </>
  );
}
