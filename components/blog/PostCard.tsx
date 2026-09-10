"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor, type BlogPost } from "@/lib/sanity";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SITE_LABEL } from "@/lib/site";
import { formatPostDate } from "./format";

/** The card used by the blog index, the related rail and the author page. */
export function PostCard({ post }: { post: BlogPost }) {
  const { t, locale } = useLanguage();
  const hasImage = Boolean(post.mainImage?.asset);

  return (
    <Link href={`/blog/${post.slug.current}`} className="post-card">
      <span className="post-card-media" aria-hidden={!hasImage}>
        {hasImage ? (
          <Image
            src={urlFor(post.mainImage).width(800).height(450).url()}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 380px"
          />
        ) : (
          <span className="post-card-media-empty" />
        )}
      </span>

      <span className="post-card-body">
        {post.categories && post.categories.length > 0 && (
          <span className="post-card-tags">
            {post.categories.slice(0, 2).map((category) => (
              <span className="post-tag" key={category}>
                {category}
              </span>
            ))}
          </span>
        )}

        <span className="post-card-title">{post.title}</span>

        {post.excerpt && <span className="post-card-excerpt">{post.excerpt}</span>}

        <span className="post-card-meta">
          <span>{post.author || SITE_LABEL}</span>
          <span>{formatPostDate(post.publishedAt, locale, t.blog.recently)}</span>
        </span>
      </span>
    </Link>
  );
}
