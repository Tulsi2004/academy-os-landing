import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],

  preview: { select: { title: "title", subtitle: "description" } },
});
