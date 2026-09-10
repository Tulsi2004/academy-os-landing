"use client";

import type { BlogPost } from "@/lib/sanity";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PostCard } from "./PostCard";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  const { t } = useLanguage();
  if (!posts || posts.length === 0) return null;

  return (
    <section className="related-posts">
      <span className="eyebrow">{t.blog.keepReading}</span>
      <h2>{t.blog.moreFromBlog}</h2>
      <div className="post-grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
