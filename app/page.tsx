import { HomeContent } from "@/components/HomeContent";
import { getLatestPosts } from "@/lib/sanity";

/**
 * Thin server shell for the homepage.
 *
 * The page itself is a client component (the language provider reads
 * localStorage), so the blog teaser is fetched here and passed down — that
 * keeps the Sanity call on the server and out of the visitor's browser.
 */
export const revalidate = 60;

export default async function Home() {
  const latestPosts = await getLatestPosts(3);
  return <HomeContent latestPosts={latestPosts} />;
}
