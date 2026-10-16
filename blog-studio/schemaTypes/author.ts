import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (R) => R.required() }),

    // The article byline links to /author/<this slug> and the JSON-LD Person
    // node is keyed on it, so it is required rather than optional.
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
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

    defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }),

    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title shown under the name on the author page, e.g. \"Founder\".",
    }),

    defineField({ name: "bio", title: "Bio", type: "blockContent" }),

    defineField({
      name: "url",
      title: "Profile URL",
      type: "url",
      description: "LinkedIn / X / personal site — emitted as schema.org sameAs.",
    }),
  ],

  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
