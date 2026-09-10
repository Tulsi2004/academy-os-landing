import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleView } from "@/components/blog/ArticleView";
import { getAllPosts, getPost, getRelatedPosts, urlFor } from "@/lib/sanity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy-os-landing.vercel.app";
const BRAND = "Academy OS";

// Articles change less often than the index, but still without a redeploy.
export const revalidate = 30;

/** Pre-render every post that exists at build time; new ones arrive via ISR. */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug.current }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug.toLowerCase());

  if (!post) return { title: `Post not found — ${BRAND}` };

  const title = post.metaTitle || post.title;
  const description =
    post.metaDescription || post.excerpt || `Read ${post.title} on the ${BRAND} blog.`;
  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      siteName: BRAND,
      url: `${siteUrl}/blog/${slug}`,
      title,
      description,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt ?? post.publishedAt,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // One canonical casing per article: /blog/My-Post 308s to /blog/my-post
  // rather than serving the same content at two URLs.
  if (slug !== slug.toLowerCase()) permanentRedirect(`/blog/${slug.toLowerCase()}`);

  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, 3);
  const authorSlug = post.author?.slug?.current;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}/blog/${slug}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.mainImage?.asset
      ? { "@type": "ImageObject", url: urlFor(post.mainImage).width(1200).height(630).url() }
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author:
      post.author && authorSlug
        ? {
            "@type": "Person",
            "@id": `${siteUrl}/author/${authorSlug}#person`,
            name: post.author.name,
            url: `${siteUrl}/author/${authorSlug}`,
            ...(post.author.url ? { sameAs: [post.author.url] } : {}),
          }
        : undefined,
    publisher: { "@id": `${siteUrl}/#organization` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".post-intro"] },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <ArticleView post={post} related={related} />
      <SiteFooter />
    </>
  );
}
