import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js loads .env.local itself, but the Prisma CLI does not — load it here so
// `prisma migrate` / `prisma studio` see the same DATABASE_URL the app uses.
// dotenv does not overwrite already-set vars, so .env.local wins over .env.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
