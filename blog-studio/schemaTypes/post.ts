import { defineType, defineField } from "sanity";
import { SITES } from "./sites";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    // Which landing site(s) this post appears on. Tick both to publish it to
    // TULSI and Academy OS without duplicating the document.
    defineField({
      name: "sites",
      title: "Show on",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: SITES.map((s) => ({ title: s.title, value: s.value })),
        layout: "grid",
      },
      initialValue: ["academy"],
      validation: (R) => R.required().min(1).error("Pick at least one site, or nobody sees this."),
    }),

    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      // Slugs must be lowercase: the article route permanently redirects
      // mixed-case URLs to lowercase, so a mixed-case slug would 404 forever.
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 96),
      },
      validation: (R) => R.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "Shown on cards, as the article intro paragraph, and as the meta description fallback.",
      validation: (R) => R.max(300),
    }),

    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),

    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),

    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    defineField({ name: "body", title: "Body", type: "blockContent" }),

    // --- SEO overrides -------------------------------------------------------
    defineField({
      name: "metaTitle",
      title: "Meta title (SEO)",
      type: "string",
      description: "Overrides the post title in <title> and OG tags. Aim for 60 characters or less.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description (SEO)",
      type: "text",
      rows: 2,
      description: "Overrides the excerpt in the meta description. Aim for 155 characters or less.",
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      date: "publishedAt",
      sites: "sites",
    },
    prepare: ({ title, author, media, date, sites }) => {
      const labels = (sites ?? [])
        .map((v: string) => SITES.find((s) => s.value === v)?.title ?? v)
        .join(" + ");
      return {
        title,
        subtitle: [labels, author, date && new Date(date).toLocaleDateString()]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
