import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { SITES } from "./schemaTypes/sites";

/**
 * One project, one dataset, both blogs.
 *
 * Every post carries a `sites` array ("tulsi" / "academy"), mirroring the
 * `site` column the two landing sites already share in Postgres. The desk is
 * split by site so an editor writing for Academy OS never has to scroll past
 * TULSI posts — but authors and categories stay shared, because the same
 * person writes for both brands.
 */
export default defineConfig({
  name: "default",
  title: "TULSI Blog",

  // Replace with the projectId from `npx sanity init` (see README.md).
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "REPLACE_WITH_PROJECT_ID",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...SITES.map((site) =>
              S.listItem()
                .title(`${site.title} posts`)
                .child(
                  S.documentList()
                    .title(`${site.title} posts`)
                    .filter('_type == "post" && $site in sites')
                    .params({ site: site.value })
                    // New posts created from this list start on the right site.
                    .initialValueTemplates([
                      S.initialValueTemplateItem("post-by-site", { site: site.value }),
                    ]),
                ),
            ),
            S.divider(),
            S.documentTypeListItem("post").title("All posts"),
            S.documentTypeListItem("author").title("Authors"),
            S.documentTypeListItem("category").title("Categories"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "post-by-site",
        title: "Post for a site",
        schemaType: "post",
        parameters: [{ name: "site", type: "string" }],
        value: ({ site }: { site: string }) => ({ sites: [site] }),
      },
    ],
  },
});
