# Changelog — Quirgs V2 Build

All notable changes to the Quirgs V2 Astro migration are documented here.
Each entry maps to a feature branch and PR merge into the build pipeline.

Format: `[Branch Name] — PR #N (YYYY-MM-DD)`

---

## [Unreleased]

_No pending changes — `v2` and `main` are in sync as of 2026-05-28. All V2 build branches and post-launch fixes have been merged to `main` and are live at `quirgs.com`._

---

## Post-Launch Additions

**Merged to `main` via PR #35 (`v2` → `main`) · 2026-05-28**
**Branch:** `v2`

### Added
- `@astrojs/sitemap` integration — wired into `astro.config.mjs` integrations; generates `sitemap-index.xml` at build time from `site: 'https://quirgs.com'`. Submit `https://quirgs.com/sitemap-index.xml` to Google Search Console.
- `src/pages/404.astro` — Terminal-UI 404 page matching the site aesthetic; links back to `/` and `/skills/`.

### Removed
- Google Analytics `gtag` script removed from legacy guides (`public/guides/`).

---

## Nitpick / Cosmetic Tweaks

**Merged to `main` via PR #33 (`v2` → `main`) · 2026-05-28**
**Branch:** `v2`

### Changed
- `src/pages/index.astro` — reformatted `description` meta tag; updated terminal output styling and navigation links.
- `HelpModal` UI text simplified.

---

## Post-Launch Fixes

**Merged to `main` via PR #32 (`v2` → `main`) · 2026-05-28**
**PR #31 · `feat/post-launch-fixes` → `v2` · 2026-05-28**
**Branch:** `feat/post-launch-fixes`

Post-launch smoke-test cleanup, Safari font handling, Lighthouse improvements, and analytics disclosure.

### Added
- Cloudflare Web Analytics — privacy-respecting page analytics; privacy policy updated to disclose it.
- `@astrojs/react` renderer — required for the Keystatic admin UI (a React app); added to `main`/`v2` during smoke test. Load-bearing for the `/keystatic/` route.
- Explicit `setup-node` step added to the `sync-gists` workflow.

### Fixed
- Safari landscape `text-size-adjust` and assorted Lighthouse contrast/landmark improvements.
- `currentPath` corrected on policy pages.
- Nav descriptions hidden on mobile.
- `npm audit fix` — resolved 5 moderate-severity dependency vulnerabilities.

### Changed
- `CLAUDE.md` moved to local-only (untracked + gitignored) agent guidance.
- Project docs updated — deployment workflow, validation rules, and branching strategy.

---

## V2 Goes Live

**Merged to `main` via PR #22 (`v2` → `main`) · 2026-05-28**
**Branch:** `v2`

The full V2 Astro migration promoted from staging to production. `quirgs.com` now serves from the Cloudflare Worker built from `dist/client`.

### Notes
- See "Launch-day fixes" in `CLAUDE.md` — `wrangler.jsonc` `assets.directory` corrected to `dist/client`, GitHub Pages decommissioned (apex A record removed), `.nojekyll` relic removed.

---

## V2 Upgrade Assessment

**PR #21 · `feat/v2-assessment` → `v2` · 2026-05-28**
**Agent:** Jules (Google Labs)

### Added
- `.jules/v2-assessment.md` — performance, design, and security assessment of the V2 upgrade.

### Notes
- Performance: build successful, `astro check` passed, lean payload for public pages.
- Design: brand tokens (green `#4ade80`) and terminal-UI aesthetic verified across components.
- Security: Bearer-token auth in Workers confirmed; no hardcoded secrets. Frontend verified via Playwright screenshots.

---

## Landing Copy

**PR #20 · `feat/landing-copy` → `v2` · 2026-05-27**
**Branch:** `feat/landing-copy`

### Changed
- `src/pages/index.astro` — landing page updated to a formal brand introduction; terminal boot sequence copy revised. HITL-verified.

### Added
- Quirgs green glass shadow on `.terminal-container`.

---

## Transparency Page

**PR #19 · `feat/transparency-page` → `v2` · 2026-05-27**
**Branch:** `feat/transparency-page`

### Added
- `src/pages/transparency.astro` — AI transparency page.
- `/transparency/` added to `src/components/NavBlock.astro` as the last nav item.
- `LICENSE` added; support page updated.
- `README.md` and `CLAUDE.md` documentation expanded (project architecture, agent guidance).

### Notes
- `privacy.astro`, `terms.astro`, `support.astro` confirmed present and untouched.

---

## Phase 1 Schema Validation & Policy Pages

**PR #18 · Phase 1 schema verification → `v2` · 2026-05-26**
**Agent:** Jules (Google Labs) + HITL review

### Added
- Skill schema enriched — governance pillars, interoperability (`interoperates_with`), triggers, and example prompts added across all 7 skill definitions.
- Global footer; `privacy.astro`, `terms.astro`, `support.astro` policy pages.
- `.jules/jules-validation-phase1-schema.md` validation guide.

### Fixed (tooling)
- Added `@astrojs/check` to `devDependencies`.
- Standardized `typescript` to `^5.6.3` to resolve validation errors.

### Notes
- Validation PASSED: Astro build, `astro check` (zero errors, 7 MDX files), `interoperates_with` slug integrity, all 9 skill routes HTTP 200, no regressions on legacy guide routes.

---

## UX Audit Cleanup

**PR #17 · `feat/ux-audit-cleanup` → `v2` · 2026-05-25**
**Branch:** `feat/ux-audit-cleanup`

### Added
- `src/components/NavBlock.astro` — reusable terminal-style site map; renders `→ /path/ ← description` for all routes and highlights the current page as `(you are here)`. Replaces hand-rolled nav blocks.
- `src/components/HelpModal.astro` — first-visitor help overlay triggered by `[?]` in the terminal header (explains what a quirg is, how to read the `ls -la` listing, status badges, and install flow).

### Changed
- `BaseLayout.astro` — imports HelpModal; adds `[?]` button to terminal header.
- `bundle/`, `skills/`, `skills/[slug]`, `guides/` pages — migrated to `<NavBlock currentPath=… />`.
- `index.astro` — bundle line changed from "Coming Soon" → `Install now →` link to `/bundle/`; `Browse:` nav hint added at end of boot animation.

---

## UI Audit Cleanup

**PR #16 · `fix/ui-audit-cleanup` → `v2` · 2026-05-25**
**Branch:** `fix/ui-audit-cleanup`

Closes 7 findings from the brand style-guide audit (2026-05-24).

### Fixed
- Gray terminal text on home page (Astro CSS scoping + `is:global`).
- `[OK]` terminal line color corrected from red → bright in `index.astro`.
- `bundle/index.astro` — removed ~280 duplicated lines of BaseLayout CSS; refactored to use `BaseLayout`.

### Added
- `.text-green`, `.cursor` + `@keyframes blink`, and `.tag` component styles added to BaseLayout global styles.
- `LEGACY GUIDES ONLY` warning comment added to `public/css/styles.css`.

### Changed
- Stale "Dropping weekly…" copy updated to "7 production-validated skills".

---

## Branch 7 — Keystatic Admin UI

**PR #14 · `feat/keystatic` → `v2` · 2026-05-24**
**Branch:** `feat/keystatic`

### Added
- `@keystatic/core`, `@keystatic/astro`, `@astrojs/cloudflare`, `react`, `react-dom` (installed with `--legacy-peer-deps` for Astro 6 peer requirements).
- `.npmrc` — `legacy-peer-deps=true` so the Cloudflare Pages build pipeline installs without peer conflicts.
- `keystatic.config.ts` — maps the `skills` content collection to GitHub storage (`unqdlphn/quirgs`); added missing `slug` text field to fix `slugField` type error.

### Changed
- `astro.config.mjs` — `output: 'static'` with `@astrojs/cloudflare` adapter; registered the `keystatic` integration; Vite `chunkSizeWarningLimit` + Rollup `onwarn` to suppress React directive warnings; excluded `virtual:keystatic-config` from `optimizeDeps`.

### Notes
- Subsequently **deferred** (see `CLAUDE.md`, 2026-05-28) due to an Astro 6 + Cloudflare incompatibility — `/keystatic/` is intentionally non-functional; edit skill MDX directly. `@keystatic/astro` pinned at `5.0.6`; do not bump to 5.1.0+.

---

## Branch 6 — Gist Sync

**PR #12 · `feat/gist-sync` → `v2` · 2026-05-24**
**Branch:** `feat/gist-sync`

### Added
- `.github/workflows/sync-gists.yml` — GitHub Actions workflow triggered on push to `main` for changes under `skills/*/SKILL.md`. Separates the Gist API token (`GIST_TOKEN` ← `secrets.GIST_SYNC_TOKEN`) from the push-back token (`GIT_TOKEN` ← `secrets.GITHUB_TOKEN`).
- `.github/scripts/sync-gists.js` — Node automation that reads `skills/gist-map.json`, diffs modified skills, and creates/updates Gists via the GitHub API (`fetch`); commits the updated map back to `main` with `[skip ci]`.
- `skills/gist-map.json` — seeded as an empty map `{}`.

---

## Branch 5 — HITL Gate Worker

**PR #10 · `feat/hitl-gate` → `v2` · 2026-05-23**
**Branch:** `feat/hitl-gate`
**Agent:** Claude (build) + Jules (validation) + HITL review

### Added
- `workers/hitl-gate/index.js` — D1-backed (SQLite) event log for human-in-the-loop review checkpoints. Bootstraps its `events` table on first hit; lazy 30-day TTL on read. Supports GET/POST/PATCH, Bearer-token auth (401), JSON 404s, and CORS. Parameterized SQL.
- `workers/hitl-gate/wrangler.toml`.

### Notes
- Worker URL (validation): `https://quirgs-hitl-gate.elbrigante9.workers.dev`. No secrets in config; no `src/` or `public/guides/` modifications.

---

## Branch 4 — Registry API Worker

**PR #9 · `feat/registry-api` → `v2` · 2026-05-23**
**Branch:** `feat/registry-api`
**Agent:** Claude (build) + Jules (validation) + HITL review

### Added
- `workers/registry-api/index.js` — KV-backed read API for the skill catalog. `GET /skills` → `[]`, `GET /skills/:slug` → 404 (unseeded), token-gated `POST /skills/:slug` (401 without auth, 200 with), `OPTIONS` CORS preflight → 204, unknown routes → JSON 404.
- `workers/registry-api/wrangler.toml`.

### Notes
- Worker URL (validation): `https://quirgs-registry-api.elbrigante9.workers.dev`. Only worker files added; no prohibited files.

---

## Branch 3 — Bundle Page

**PR #5 · `feat/bundle-page` → `v2` · 2026-05-22**
**Branch:** `feat/bundle-page`
**Agent:** Jules (build & route checks) + HITL approval

### Added
- `src/pages/bundle/index.astro` — terminal-style install screen for the Quirgs compliance bundle. Reuses the terminal-illusion tokens and `JetBrains Mono`; terminal title `admin@quirgs: ~/install`; back-navigation directory tree linking `/`, `/skills/`, `/guides/`; package-manager sequence (`/get-bundle.sh quirgs-compliance`) and the 7-skill list.

### Notes
- `[DOWNLOAD]` row stubbed as **Coming Soon** with non-interactive tags — no dead links/404s.

---

## Branch 2 — Skills Content Layer

**PR #4 · `feat/skills-content` → `v2` · 2026-05-22**
**Branch:** `feat/skills-content`
**Agents:** Claude (B2a content) + Gemini/Antigravity (B2b pages) + HITL approval

### Added
- `src/content.config.ts` — Astro 6 content collection schema (glob loader, `z.coerce.date()`).
- 7 skill MDX files in `src/content/skills/` — `eu-ai-act-classifier`, `nist-ai-rmf-checkpoint`, `hitl-compliance-gate`, `ai-transparency-writer`, `pii-exposure-checker`, `iso-42001-audit-prep`, `incident-response-logger`.
- `src/layouts/BaseLayout.astro` — terminal-styled layout wrapper with copy-to-clipboard script and typography styles.
- `src/pages/skills/index.astro` — `/skills/` listing in `ls -la` terminal format.
- `src/pages/skills/[slug].astro` — `/skills/[slug]/` dynamic skill detail page.
- `src/pages/guides/index.astro` — `/guides/` listing for preserved legacy guides.

### Removed
- `public/guides/index.html` — deleted to avoid route conflicts with the new `/guides/` page.

### Notes
- `gistUrl` omitted from frontmatter — populated later by `sync-gists.yml`.
- Install block rendered conditionally by the page template from `installCmd` / `gistUrl`, not authored in MDX bodies.

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
