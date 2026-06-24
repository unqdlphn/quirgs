// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/skills' }),
  schema: z.object({
    // Core identity
    title: z.string(),
    // Optional: the canonical slug is the file id (filename), which all site code
    // already uses via entry.id. Keystatic owns `slug` as the *filename* (slugField)
    // and strips it from frontmatter on every save, so it must not be required here.
    slug: z.string().optional(),
    tagline: z.string(),

    // Product bundle this skill belongs to — used for UI tab filtering
    bundle: z.enum(['compliance', 'publish']),

    // Governance structure
    // One of the three Quirgs governance pillars — used for UI filtering and routing
    pillar: z.enum([
      'Inventory',           // Pillar 1 — Know What You Have
      'Checkpoints',         // Pillar 2 — Control How AI Ships
      'Standards Alignment', // Pillar 3 — Prove You Meet the Bar
    ]),

    // Frameworks this skill maps to (e.g. "EU AI Act", "NIST AI RMF 1.0")
    framework: z.array(z.string()),

    // Skills this skill directly hands off to or receives from in a workflow
    // References sibling skill slugs — used to render interoperation graph in UI
    interoperates_with: z.array(z.string()).default([]),

    // Exact phrases that trigger this skill in Cowork — used in skills reference artifact
    triggers: z.array(z.string()).default([]),

    // Short, concrete example prompts shown in the skill detail drawer
    example_prompts: z.array(z.string()).default([]),

    // Publication state
    status: z.enum(['live', 'draft', 'deprecated']),
    version: z.string(),
    lastUpdated: z.coerce.date(),

    // Distribution — hand-maintained (not auto-populated). sync-gists.yml only
    // syncs SKILL.md to the Gist and updates skills/gist-map.json.
    gistUrl: z.string().url().optional(),
    // Step 1 of the marketplace install: registers the quirgs marketplace
    marketplaceCmd: z.string().optional(),
    // Step 2 of the marketplace install: installs the plugin from it
    installCmd: z.string().optional(),

    // Search and discovery
    tags: z.array(z.string()),
  }),
});

export const collections = { skills };
