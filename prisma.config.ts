import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Multi-file schema: prisma/schema/{base,skillpips,raalhu}.prisma
  schema: path.join("prisma", "schema"),
  datasource: {
    // Prisma CLI (migrate/introspect) needs a direct, non-pooled connection.
    // DIRECT_URL is for Supabase (port 5432); local dev falls back to DATABASE_URL.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
