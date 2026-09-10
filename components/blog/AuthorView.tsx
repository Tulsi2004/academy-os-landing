"use client";

import Image from "next/image";
import { urlFor, type BlogAuthor } from "@/lib/sanity";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PortableBody } from "./PortableBody";
import { PostCard } from "./PostCard";

export function AuthorView({ author }: { author: BlogAuthor }) {
  const { t } = useLanguage();

  return (
    <>
      <header className="page-hero author-hero">
        <div className="container page-hero-inner">
          {author.image?.asset && (
            <span className="author-hero-avatar">
              <Image
                src={urlFor(author.image).width(176).height(176).url()}
                alt={author.name}
                fill
                sizes="88px"
                priority
              />
            </span>
          )}
          <span className="eyebrow">{t.blog.authorEyebrow}</span>
          <h1>{author.name}</h1>
          {author.role && <p className="author-hero-role">{author.role}</p>}
        </div>
      </header>

      <main className="blog-main">
        <div className="container">
          {author.bio && (
            <div className="author-bio">
              <PortableBody value={author.bio} />
            </div>
          )}

          {author.posts.length > 0 && (
            <>
              <h2 className="author-posts-heading">
                {t.blog.postsByAuthor.replace("{name}", author.name)}
              </h2>
              <div className="post-grid">
                {author.posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
