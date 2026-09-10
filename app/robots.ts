import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://academy-os-landing.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      // Answer-engine crawlers, allowed so blog articles can be cited.
      ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Google-Extended", "ClaudeBot", "Applebot-Extended"].map(
        (userAgent) => ({ userAgent, allow: "/", disallow: ["/admin", "/api"] }),
      ),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
