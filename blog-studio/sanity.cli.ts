import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    // `npx sanity init` fills these in; they are public identifiers, not secrets.
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "REPLACE_WITH_PROJECT_ID",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
