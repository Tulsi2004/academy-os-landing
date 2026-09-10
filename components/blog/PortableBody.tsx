/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";

function youTubeId(url: string) {
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
}

function vimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/**
 * Renders a Sanity Portable Text body.
 *
 * Every renderer returns null on malformed input — a missing asset reference,
 * an unparseable video URL — rather than throwing. A bad paste in the CMS must
 * not be able to take an article down.
 *
 * Mirrors `blockContent.ts` in blog-studio; a type added there needs an entry
 * here or it silently renders nothing.
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="post-figure">
          <Image
            src={urlFor(value).width(1600).fit("max").url()}
            alt={value.alt || ""}
            width={1600}
            height={900}
            sizes="(max-width: 820px) 100vw, 760px"
            className="post-figure-img"
          />
          {(value.caption || value.alt) && (
            <figcaption>{value.caption || value.alt}</figcaption>
          )}
        </figure>
      );
    },

    youtube: ({ value }: any) => {
      const id = youTubeId(value?.url || "");
      if (!id) return null;
      return (
        <figure className="post-figure">
          <div className="post-embed">
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },

    vimeo: ({ value }: any) => {
      const id = vimeoId(value?.url || "");
      if (!id) return null;
      return (
        <figure className="post-figure">
          <div className="post-embed">
            <iframe
              src={`https://player.vimeo.com/video/${id}`}
              title="Vimeo video player"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },

    code: ({ value }: any) => {
      if (!value?.code) return null;
      return (
        <pre className="post-code">
          <code>{value.code}</code>
        </pre>
      );
    },
  },

  block: {
    h2: ({ children }: any) => <h2 className="post-h2">{children}</h2>,
    h3: ({ children }: any) => <h3 className="post-h3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="post-h4">{children}</h4>,
    blockquote: ({ children }: any) => <blockquote className="post-quote">{children}</blockquote>,
    normal: ({ children }: any) => <p className="post-p">{children}</p>,
  },

  list: {
    bullet: ({ children }: any) => <ul className="post-list">{children}</ul>,
    number: ({ children }: any) => <ol className="post-list">{children}</ol>,
  },

  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },

  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => <code className="post-inline-code">{children}</code>,
    link: ({ value, children }: any) => {
      const href = value?.href ?? "";
      const external = href.startsWith("http");
      return (
        <a
          className="post-link"
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
