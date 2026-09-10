"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor, type BlogPost, type BlogPostFull } from "@/lib/sanity";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SITE_LABEL } from "@/lib/site";
import { PortableBody } from "./PortableBody";
import { RelatedPosts } from "./RelatedPosts";
import { formatPostDate } from "./format";

/**
 * The article body. Split out of the route so the page itself can stay a
 * server component (ISR, metadata, JSON-LD) while the chrome around the post
 * still speaks the reader's language.
 */
export function ArticleView({ post, related }: { post: BlogPostFull; related: BlogPost[] }) {
  const { t, locale } = useLanguage();
  const authorSlug = post.author?.slug?.current;
  const minutes = Math.max(1, post.readMinutes ?? 1);

  return (
    <>
      <header className="page-hero article-hero">
        <div className="container article-hero-inner">
          <Link href="/blog" className="article-back">
            {t.blog.allArticles}
          </Link>

          {post.categories && post.categories.length > 0 && (
            <div className="post-card-tags">
              {post.categories.map((category) => (
                <span className="post-tag" key={category.slug?.current ?? category.title}>
                  {category.title}
                </span>
              ))}
            </div>
          )}

          <h1>{post.title}</h1>

          <div className="article-meta">
            {post.author && authorSlug ? (
              <Link href={`/author/${authorSlug}`}>{post.author.name}</Link>
            ) : (
              <span>{post.author?.name ?? SITE_LABEL}</span>
            )}
            <span aria-hidden="true">·</span>
            <span>{formatPostDate(post.publishedAt, locale, t.blog.recently)}</span>
            <span aria-hidden="true">·</span>
            <span>{t.blog.minRead.replace("{min}", String(minutes))}</span>
          </div>
        </div>
      </header>

      <main className="article-main">
        <div className="container article-container">
          {post.mainImage?.asset && (
            <div className="article-cover">
              <Image
                src={urlFor(post.mainImage).width(1600).height(900).url()}
                alt={post.mainImage?.alt || post.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 820px"
              />
            </div>
          )}

          <article className="article-body">
            {post.excerpt && <p className="post-intro">{post.excerpt}</p>}
            <PortableBody value={post.body} />
          </article>

          {post.author?.bio && (
            <aside className="author-box">
              {post.author.image?.asset && (
                <span className="author-box-avatar">
                  <Image
                    src={urlFor(post.author.image).width(128).height(128).url()}
                    alt={post.author.name}
                    fill
                    sizes="64px"
                  />
                </span>
              )}
              <div className="author-box-copy">
                <span className="eyebrow">{t.blog.aboutTheAuthor}</span>
                {authorSlug ? (
                  <Link className="author-box-name" href={`/author/${authorSlug}`}>
                    {post.author.name}
                  </Link>
                ) : (
                  <span className="author-box-name">{post.author.name}</span>
                )}
                <PortableBody value={post.author.bio} />
              </div>
            </aside>
          )}

          <RelatedPosts posts={related} />
        </div>
      </main>
    </>
  );
}
