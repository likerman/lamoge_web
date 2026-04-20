import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const es = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/es" }),
  schema: z.any()
});

const en = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/en" }),
  schema: z.any()
});

export const collections = { es, en };
