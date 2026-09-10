"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/sanity";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PostCard } from "./PostCard";

/** Homepage teaser rail. Renders nothing when there is nothing to show. */
export function LatestPosts({ posts }: { posts: BlogPost[] }) {
  const { t } = useLanguage();
  if (!posts || posts.length === 0) return null;

  return (
    <section className="latest-posts" id="blog">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{t.blog.homeEyebrow}</span>
          <h2>{t.blog.homeHeading}</h2>
          <p>{t.blog.homeBody}</p>
        </div>

        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        <div className="latest-posts-cta">
          <Link className="btn btn-ghost" href="/blog">
            {t.blog.readAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
