/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SITE } from "@/lib/site";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** False until a projectId is configured — every query then returns empty. */
export const blogEnabled = Boolean(projectId);

/**
 * Read-only Sanity client for the blog, built on first use.
 *
 * Lazy on purpose: `createClient` throws when `projectId` is empty, and this
 * module is imported by the sitemap and the homepage. Constructing it eagerly
 * would take the whole site down before a Sanity project exists, rather than
 * just leaving the blog empty.
 *
 * `projectId`/`dataset` are public identifiers, not secrets — the dataset is
 * public and `perspective: "published"` hides drafts, so no API token is
 * needed and these queries are safe to run at build time or on the server.
 *
 * `useCdn: false` is deliberate: Next's fetch cache (the `revalidate` values
 * on each route) is the only cache worth reasoning about.
 */
let client: ReturnType<typeof createClient> | null = null;

function sanityClient() {
  if (!client) {
    client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      perspective: "published",
    });
  }
  return client;
}

let builder: ReturnType<typeof imageUrlBuilder> | null = null;

/** Build a CDN image URL from a Sanity image reference. */
export function urlFor(source: any) {
  if (!builder) builder = imageUrlBuilder({ projectId, dataset });
  return builder.image(source);
}

/** A post as shown on cards. */
export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  author?: string;
  categories?: string[];
  readMinutes?: number;
};

/** A fully-resolved post for the article page. */
export type BlogPostFull = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
  _updatedAt?: string;
  body?: any;
  metaTitle?: string;
  metaDescription?: string;
  readMinutes?: number;
  author?: { name: string; slug?: { current: string }; role?: string; image?: any; bio?: any; url?: string };
  categories?: { title: string; slug?: { current: string } }[];
};

/** An author plus everything they have written for this site. */
export type BlogAuthor = {
  name: string;
  slug: { current: string };
  role?: string;
  image?: any;
  bio?: any;
  url?: string;
  posts: BlogPost[];
};

/**
 * Card fields, shared by every listing query.
 *
 * `readMinutes` is computed server-side: `pt::text()` flattens the Portable
 * Text body to a plain string, and ~1100 characters is about a minute at
 * 200wpm. Cheaper than shipping the whole body just to count words.
 */
const CARD_FIELDS = `
  _id, title, slug, excerpt, mainImage, publishedAt,
  "author": author->name,
  "categories": categories[]->title,
  "readMinutes": round(length(pt::text(body)) / 1100)
`;

/** Only posts ticked for this deployment's site, and only ones with a slug. */
const FOR_THIS_SITE = `_type == "post" && $site in sites && defined(slug.current)`;

/**
 * Every query is wrapped so a CMS outage degrades to an empty listing rather
 * than a 500. The blog is the one part of these sites with a hard network
 * dependency; it must never take the marketing page down with it.
 */
async function query<T>(groq: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!blogEnabled) return fallback;
  try {
    return await sanityClient().fetch<T>(groq, { site: SITE, ...params });
  } catch (error) {
    console.error("[sanity] query failed", error);
    return fallback;
  }
}

/** All posts for this site, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  return query<BlogPost[]>(
    `*[${FOR_THIS_SITE}] | order(publishedAt desc) { ${CARD_FIELDS} }`,
    {},
    [],
  );
}

/** How many cards the index shows before "Load more". */
export const BLOG_PAGE_SIZE = 9;

/**
 * One page of posts, with the total that matched.
 *
 * Offset slicing rather than a keyset cursor: GROQ has no stable cursor of its
 * own, and a blog would need tens of thousands of posts before the re-scan cost
 * of a deep `[offset...]` mattered. The total comes back in the same query so
 * the index can render "showing 9 of 40" without a second round-trip.
 *
 * `q` searches title, excerpt, author and category server-side, so a search on
 * a long blog reaches posts that have not been loaded into the browser yet.
 */
export async function getPostsPage({
  offset = 0,
  limit = BLOG_PAGE_SIZE,
  q,
}: {
  offset?: number;
  limit?: number;
  q?: string;
} = {}): Promise<{ items: BlogPost[]; total: number }> {
  const term = q?.trim();
  const filter = term
    ? `${FOR_THIS_SITE} && (
         title match $term || excerpt match $term ||
         author->name match $term || categories[]->title match $term
       )`
    : FOR_THIS_SITE;

  return query<{ items: BlogPost[]; total: number }>(
    `{
      "items": *[${filter}] | order(publishedAt desc)[$offset...$end] { ${CARD_FIELDS} },
      "total": count(*[${filter}])
    }`,
    {
      offset,
      end: offset + limit,
      // A trailing wildcard makes "acad" match "academy"; GROQ escapes the
      // parameter itself, so user input needs no sanitising here.
      ...(term ? { term: `${term}*` } : {}),
    },
    { items: [], total: 0 },
  );
}

/** The newest posts, for the homepage teaser section. */
export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
  return query<BlogPost[]>(
    `*[${FOR_THIS_SITE}] | order(publishedAt desc)[0...$limit] { ${CARD_FIELDS} }`,
    { limit },
    [],
  );
}

/** A single post by slug, or null if this site has no such post. */
export async function getPost(slug: string): Promise<BlogPostFull | null> {
  return query<BlogPostFull | null>(
    `*[${FOR_THIS_SITE} && slug.current == $slug][0] {
      _id, _updatedAt, title, slug, excerpt, mainImage, publishedAt, body,
      metaTitle, metaDescription,
      "readMinutes": round(length(pt::text(body)) / 1100),
      "author": author->{name, slug, role, image, bio, url},
      "categories": categories[]->{title, slug}
    }`,
    { slug },
    null,
  );
}

/**
 * Posts to read next: same category where possible, newest otherwise.
 *
 * Two queries rather than one so a post with no categories (or a category with
 * no siblings) still gets a filled rail instead of an empty one.
 */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const sameCategory = await query<BlogPost[]>(
    `*[${FOR_THIS_SITE} && slug.current != $slug &&
       count(categories[@._ref in *[_type == "post" && slug.current == $slug][0].categories[]._ref]) > 0]
       | order(publishedAt desc)[0...$limit] { ${CARD_FIELDS} }`,
    { slug, limit },
    [],
  );

  if (sameCategory.length >= limit) return sameCategory;

  const recent = await query<BlogPost[]>(
    `*[${FOR_THIS_SITE} && slug.current != $slug] | order(publishedAt desc)[0...$limit] {
      ${CARD_FIELDS}
    }`,
    { slug, limit },
    [],
  );

  const seen = new Set(sameCategory.map((p) => p._id));
  return [...sameCategory, ...recent.filter((p) => !seen.has(p._id))].slice(0, limit);
}

/** An author and their posts on this site, or null if they have none here. */
export async function getAuthor(slug: string): Promise<BlogAuthor | null> {
  return query<BlogAuthor | null>(
    `*[_type == "author" && slug.current == $slug][0]{
      name, slug, role, image, bio, url,
      "posts": *[${FOR_THIS_SITE} && author._ref == ^._id] | order(publishedAt desc) {
        ${CARD_FIELDS}
      }
    }`,
    { slug },
    null,
  );
}

/** Every author slug that has at least one post on this site. */
export async function getAuthorSlugs(): Promise<string[]> {
  return query<string[]>(
    `array::unique(*[${FOR_THIS_SITE} && defined(author->slug.current)].author->slug.current)`,
    {},
    [],
  );
}
