import type { MetadataRoute } from "next";
import { getAllPosts, getAuthorSlugs } from "@/lib/sanity";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy-os-landing.vercel.app";

// Re-rendered alongside the blog index, so a new post appears in the sitemap
// within a minute of publishing rather than at the next deploy.
export const revalidate = 60;

/** Parse an ISO date, falling back to now for missing or malformed values. */
function safeDate(iso?: string): Date {
  if (!iso) return new Date();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, priority: 0.3 },
    { url: `${siteUrl}/refund`, lastModified: now, priority: 0.3 },
  ];

  // getAllPosts already swallows CMS failures and returns [], so a Sanity
  // outage costs us the post URLs, not the whole sitemap.
  const [posts, authorSlugs] = await Promise.all([getAllPosts(), getAuthorSlugs()]);

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug.current}`,
    lastModified: safeDate(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${siteUrl}/author/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...authorRoutes];
}
