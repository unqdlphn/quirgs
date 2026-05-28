# Changelog — Quirgs V2 Build

All notable changes to the Quirgs V2 Astro migration are documented here.
Each entry maps to a feature branch and PR merge into the build pipeline.

Format: `[Branch Name] — PR #N (YYYY-MM-DD)`

---

## [Unreleased]

_Changes staged on `v2` branch, pending merge to `main`._

---

## Branch 1 — Astro Scaffold

**PR #3 · Merged to `feat/astro-scaffold` · 2026-05-18**
**Branch:** `feat/astro-scaffold`
**Agent:** Jules (Google Labs) + HITL review (Torrey + Claude)

### Added
- `src/pages/index.astro` — Terminal landing page ported from `index.html` with `<script lang="ts">` TypeScript label
- `astro.config.mjs` — Astro static output config; site set to `https://quirgs.com`
- `package.json` — Astro project manifest (`name: "quirgs"`, `astro: ^6.3.3`)
- `tsconfig.json` — Extends `astro/tsconfigs/strict`
- `public/assets/` — Static assets moved from `assets/` (favicon, logos, webp)
- `public/css/` — Stylesheets moved from `css/` (styles.css, guides-v2.css)
- `public/guides/` — Legacy HTML guides moved from `guides/` (SEO URLs preserved verbatim)
- `public/favicon.ico`, `public/favicon.svg` — Favicon files in correct Astro location
- `package-lock.json` — Lock file generated for `astro ^6.3.3`
- `.gitignore` additions — `dist/`, `.astro/`, `node_modules/`, `_v2/`, IDE folders

### Removed
- `index.html` — Replaced by `src/pages/index.astro`
- `CNAME` (root) — Deleted; Cloudflare Pages manages domain binding for `quirgs.com`
- `_v2/feat_handoffs/branch1-jules-validation.md` — Validation artifact cleaned up post-merge

### Fixed
- `<script lang="ts">` tag added to `index.astro` — resolves Astro TypeScript build error

### Notes
- `package-lock.json` internally still references `"certain-crater"` (Astro default generated before name fix). Cosmetic only — `package.json` is authoritative. Regenerate lock file in a follow-up `npm install` run.
- `public/CNAME` added during review as a precaution — can be removed; Cloudflare manages domain binding per V2_ARCHITECTURE.md §6.
- CI: Cloudflare Workers build `quirgs` passed with `SUCCESS` on merge.
- Terminal sequence validated: starts and completes as programmed.

---

## Pre-V2 Baseline

**Live site at `quirgs.com` — `main` branch (unchanged)**
- Static HTML site (`index.html`) with animated terminal sequence
- 7 legacy HTML guides at `/guides/*.html` (SEO-indexed, preserved)
- Hosted on Cloudflare Pages, domain managed by Cloudflare
- `main` remains production-stable until `v2` branch is fully validated

---

_See `_v2/V2_ARCHITECTURE.md` for full build plan and branch roadmap._
