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

    // Exact phrases that trigger this skill in Claude Code — used in skills reference artifact
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

// Track 1 of the guides → Keystatic migration: net-new guides authored as MDX,
// Keystatic-managed, rendered at clean /guides/<slug>/ URLs (no collision with the
// 6 legacy public/guides/*.html archive entries). Legacy guides migrate later,
// one at a time, gated on Search Console — see _v2/_v3/guides-keystatic-migration-plan.md.
const guides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    // Optional for the same reason as skills: Keystatic's slugField stores the slug
    // as the filename and strips `slug:` from frontmatter on save. Canonical slug is
    // entry.id. Do not re-require this.
    slug: z.string().optional(),
    description: z.string(),
    status: z.enum(['live', 'draft', 'deprecated']),
    lastUpdated: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { skills, guides };
