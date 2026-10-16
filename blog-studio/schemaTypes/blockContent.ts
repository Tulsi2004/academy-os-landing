import { defineType, defineArrayMember } from "sanity";

/**
 * The rich-text type behind `post.body` and `author.bio`.
 *
 * Every block, mark and embed listed here needs a matching renderer in each
 * app's `components/blog/PortableBody.tsx` — add one here without the other and
 * the block renders as nothing.
 */
export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      // No H1: the page <h1> is the post title, so body headings start at H2.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (R) => R.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describes the image for screen readers and search engines.",
        },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),

    defineArrayMember({
      name: "youtube",
      type: "object",
      title: "YouTube embed",
      fields: [
        { name: "url", type: "url", title: "YouTube URL" },
        { name: "caption", type: "string", title: "Caption" },
      ],
      preview: {
        select: { title: "url" },
        prepare: ({ title }) => ({ title: `▶ ${title ?? "YouTube"}` }),
      },
    }),

    defineArrayMember({
      name: "vimeo",
      type: "object",
      title: "Vimeo embed",
      fields: [
        { name: "url", type: "url", title: "Vimeo URL" },
        { name: "caption", type: "string", title: "Caption" },
      ],
      preview: {
        select: { title: "url" },
        prepare: ({ title }) => ({ title: `▶ ${title ?? "Vimeo"}` }),
      },
    }),

    defineArrayMember({
      name: "code",
      type: "object",
      title: "Code block",
      fields: [
        { name: "code", type: "text", title: "Code" },
        { name: "language", type: "string", title: "Language" },
      ],
      preview: {
        select: { language: "language", code: "code" },
        prepare: ({ language, code }) => ({
          title: language ? `{ } ${language}` : "{ } Code",
          subtitle: (code ?? "").split("\n")[0],
        }),
      },
    }),
  ],
});
