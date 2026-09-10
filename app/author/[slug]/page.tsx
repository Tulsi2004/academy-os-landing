import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AuthorView } from "@/components/blog/AuthorView";
import { getAuthor, getAuthorSlugs, urlFor } from "@/lib/sanity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy-os-landing.vercel.app";
const BRAND = "Academy OS";

export const revalidate = 300;

/**
 * Only authors who have published here get a page — the article byline links
 * to this route, so every linked slug must resolve.
 */
export async function generateStaticParams() {
  const slugs = await getAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: `Author not found — ${BRAND}` };

  const title = `${author.name}${author.role ? ` — ${author.role}` : ""} | ${BRAND}`;
  const description = `Articles by ${author.name} on the ${BRAND} blog.`;

  return {
    title,
    description,
    alternates: { canonical: `/author/${slug}` },
    openGraph: { type: "profile", siteName: BRAND, url: `${siteUrl}/author/${slug}`, title, description },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/author/${slug}#person`,
    name: author.name,
    url: `${siteUrl}/author/${slug}`,
    ...(author.role ? { jobTitle: author.role } : {}),
    ...(author.image?.asset ? { image: urlFor(author.image).width(400).height(400).url() } : {}),
    ...(author.url ? { sameAs: [author.url] } : {}),
    worksFor: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <AuthorView author={author} />
      <SiteFooter />
    </>
  );
}
