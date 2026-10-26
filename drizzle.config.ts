import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./shared/db/schema.ts",
  out: "./drizzle",
});
