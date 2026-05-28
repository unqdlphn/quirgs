# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Quirgs is a governance-first AI product platform. This repo is the production source for **three things deployed together**:

1. The **Astro static site** at `quirgs.com` (the public surface).
2. A pair of **standalone Cloudflare Workers** under `workers/` (`registry-api`, `hitl-gate`) — independently deployed, not part of the Astro build.
3. The **skill catalog** (`src/content/skills/*.mdx`) that doubles as the site's content collection AND the source synced out to public Gists for distribution.

Treat these as three deploy units in one repo, not one monolith.

## Common commands

```bash
npm install
npm run dev          # astro dev — http://localhost:4321
npm run build        # astro build — emits ./dist
npm run preview      # preview the built site
```

There are no test or lint scripts wired in `package.json`. Type checking is available via the installed `@astrojs/check` (`npx astro check`) but is not part of the default flow.

Workers are deployed from their own subdirectories with `wrangler` (e.g. `cd workers/registry-api && wrangler deploy`). They do not share the Astro pipeline.

## Architecture you must hold in your head

### The site is static, but content-driven

`astro.config.mjs` declares `output: 'static'` with the `@astrojs/cloudflare` adapter. The adapter emits a split output: `dist/client/` (static assets) and `dist/server/` (SSR entry). Cloudflare serves static assets from `dist/client` — `wrangler.jsonc` `assets.directory` must point at `dist/client`, not `dist`. There is no SSR — every page is rendered at build time.

The skills registry pages (`/skills/`, `/skills/[slug]/`, `/bundle/`) are generated from the `skills` content collection defined in [src/content.config.ts](src/content.config.ts). The schema is strict (Zod) — adding a frontmatter field requires touching both `content.config.ts` AND `keystatic.config.ts`, because Keystatic mirrors the same files via GitHub storage and edits round-trip through PRs.

The drop order for the skills `ls` listing is hardcoded in [src/pages/skills/index.astro](src/pages/skills/index.astro) (`dropOrder` array). It is not derived from frontmatter. If you add a skill, add it to that array too or it sorts to position `-1`.

### Two distinct UI contexts — do not mix them

1. **Terminal interface** (`/`, `/skills/`, `/bundle/`, `/transparency/`, `/support/`) — dark, monospace, JetBrains Mono. Design tokens live in `:root` inside [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) and are duplicated in [src/pages/index.astro](src/pages/index.astro) (the landing page is intentionally standalone for fast first paint).
2. **Documentation layout** (`/guides/*.html`) — light, system-UI, served as plain HTML from `public/guides/`. These are V1 legacy pages preserved verbatim for SEO. **Do not modify them.**

The landing page animation is **JS-injected DOM, sequenced with `setTimeout`** — not CSS keyframes (see `runSequence()` in `index.astro`). Keep it that way; the brand guide forbids fade/slide transitions in the terminal context.

### Workers are independent

- `workers/registry-api/` — KV-backed (`QUIRGS_REGISTRY`, id in its `wrangler.toml`) read API for skill catalog metadata. Plain ES module.
- `workers/hitl-gate/` — D1-backed (`HITL_DB`, id in its `wrangler.toml`) event log for human-in-the-loop checkpoints. Bootstraps its `events` table on first hit and applies a lazy 30-day TTL on read.

Each has its own `wrangler.toml`, its own `.dev.vars`, and is deployed separately. They do not import from `src/` and `src/` does not import from them.

### The Gist sync pipeline

[.github/workflows/sync-gists.yml](.github/workflows/sync-gists.yml) watches `skills/*/SKILL.md` on `main` (note: `skills/` at the repo root — distinct from `src/content/skills/`) and runs [.github/scripts/sync-gists.js](.github/scripts/sync-gists.js) to publish each changed file to its Gist. The resulting `gistUrl` and `installCmd` are then surfaced through the skill's MDX frontmatter for the site to render. The mapping lives in [skills/gist-map.json](skills/gist-map.json).

## Hard rules (carried forward from `.jules/rules.md` — these apply to any agent)

- **Never push to `main` directly.** All work is on feature branches off `v2`. Merges to `main` are HITL-approved.
- **Never modify `public/guides/`** — SEO-indexed legacy content, zero changes.
- **Never modify [src/pages/index.astro](src/pages/index.astro)** unless the task explicitly includes it. The boot sequence is brand-critical.
- **Never add a `deploy.yml` workflow.** Cloudflare deploys via native GitHub integration. No workflow file is needed or wanted.
- **Never add a `CNAME` file.** Domain binding is managed in the Cloudflare dashboard — `CNAME` has been deliberately removed.
- **Validate against the Cloudflare branch preview URL**, never against `quirgs.com` production.

## Branching

- `main` — production. Cloudflare deploys on push. No branch preview — direct to quirgs.com.
- `v2` — permanent staging branch. **All feature work branches from `v2` and merges back to `v2` first.** After every `v2 → main` merge, re-sync immediately: `git checkout v2 && git merge main && git push`. Never let `v2` fall behind `main`.
- `feat/<scope>` — always cut from `v2`. `feat/*` → `v2` PRs generate Cloudflare branch preview URLs. Jules validates against the preview URL before merge. **Never merge a feature branch directly to `main`** — it skips the preview gate.
- `_v2/` — docs folder only (architecture specs, session prompts, handoffs). Not a code branch.

## Brand voice for any user-facing copy you write

The brand voice is declarative, technical, no hype. The canonical reference is [`brand/style guide/Quirgs Brand Style Guide.md`](brand/style%20guide/Quirgs%20Brand%20Style%20Guide.md). A few load-bearing rules that frequently catch agents off-guard:

- The platform is **Quirgs** (capital Q). The product unit is a **quirg** (lowercase). Three formats: **Skill**, **Guide**, **Tool** (capitalized when used as labels).
- Tagline: **"Governance first. Build accordingly."** — do not paraphrase.
- `[INFO]` / `[WARN]` / `[SYSTEM]` / `[OK]` / `[ERR]` are a **terminal-UI convention**, not a writing device. Do not sprinkle them into prose, blog posts, or long-form docs.
- Never reference the legacy name **AMB** or **"The Agentic AI Management Brief"** in any new output. That brand no longer exists.
- The accent green is `#4ade80` (Tailwind green-400), **not** phosphor `#00FF41`. Do not substitute.

## Things that look broken but are intentional

- `package-lock.json` internally references the package name `certain-crater` (Astro's default-generated name from before the rename). Cosmetic only — `package.json` is authoritative. Don't "fix" it as a side quest.
- The `_v2/` directory contains build plans and session prompts — it is intentionally tracked but should not be referenced from production code.
- Skill MDX files live in `src/content/skills/`. Skill **SKILL.md** files (the Gist-sync sources) live in `skills/`. Both are valid; they serve different pipelines.

## Launch-day fixes (2026-05-27 — do not revert)

- **`wrangler.jsonc` `assets.directory: "dist/client"`** — The `@astrojs/cloudflare` adapter splits build output into `dist/client/` (static) and `dist/server/` (SSR entry). Setting `assets.directory` to `dist` (the pre-launch value) caused 404 on every route. Must be `dist/client`. Do not change this back.
- **GitHub Pages decommissioned** — GitHub Pages was still building the repo alongside Cloudflare after the v2 merge, causing Jekyll to choke on `.astro` files. Resolved by deleting the GitHub Pages apex A record in DNS. The site now serves exclusively from the Cloudflare Worker. `.nojekyll` was added and then removed — do not re-add it. Do not re-enable GitHub Pages for this repo.
