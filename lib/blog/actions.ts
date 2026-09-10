"use server";

import { getPostsPage, type BlogPost } from "@/lib/sanity";

/**
 * Fetches a page of posts for the blog index.
 *
 * Public and read-only, so there is no session check here — it exposes exactly
 * what /blog already renders. `getPostsPage` swallows CMS failures and returns
 * an empty page, so a Sanity outage leaves the button inert rather than
 * throwing into the client.
 */
export async function loadPosts({
  offset,
  q,
}: {
  offset: number;
  q?: string;
}): Promise<{ items: BlogPost[]; total: number }> {
  return getPostsPage({ offset, q });
}
