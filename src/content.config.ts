// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/skills' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    framework: z.array(z.string()),
    status: z.enum(['live', 'draft', 'deprecated']),
    version: z.string(),
    lastUpdated: z.coerce.date(),
    gistUrl: z.string().url().optional(),
    installCmd: z.string().optional(),
    tags: z.array(z.string()),
  }),
});

export const collections = { skills };
