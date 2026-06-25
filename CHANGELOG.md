# Changelog — Quirgs V2 Build

All notable changes to the Quirgs V2 Astro migration are documented here.
Each entry maps to a feature branch and PR merge into the build pipeline.

Format: `[Branch Name] — PR #N (YYYY-MM-DD)`

---

## [Unreleased]

## Feature — Guides Track 2: first legacy migration + new guide (feat/new-guide)

**Branch:** `feat/new-guide` — (2026-06-24)

First Track 2 legacy-guide migration (Option B: migrate to MDX + 301), plus a new
authored guide. See `_v2/_v3/guides-keystatic-migration-plan.md`.

### Added
- `src/content/guides/git-workflow-reference.mdx` — `git_workflow_reference.html`
  migrated to managed MDX at `/guides/git-workflow-reference/`. Legacy chrome
  (hamburger nav, in-page search, read-more expandables, footer) dropped; BaseLayout
  provides the shell. Content preserved (tables → GFM, flowchart → ordered steps).
- `src/content/guides/vetting-ai-agent-skills.mdx` — new guide (currently `draft`,
  so not yet built/listed).
- 301 in `public/_redirects`: `/guides/git_workflow_reference.html` →
  `/guides/git-workflow-reference/`.

### Removed
- `public/guides/git_workflow_reference.html` — replaced by the MDX guide above
  (intentional, sanctioned exception to the "never modify public/guides/" guardrail;
  verify in Search Console post-deploy). Its per-path canonical `Link` in
  `public/_headers` is dropped — the MDX page self-references via BaseLayout `<head>`.

### Changed
- `src/pages/guides/index.astro` — dropped `git_workflow_reference.html` from the
  `[ARCHIVE]` list; it now surfaces in `[GUIDES] Current` from the collection.

## Feature — Keystatic-managed guides collection, Track 1 (feat/guides-keystatic)

**Branch:** `feat/guides-keystatic` — (2026-06-24)

Track 1 of the guides → Keystatic migration (see
`_v2/_v3/guides-keystatic-migration-plan.md`): stand up net-new guides as
Keystatic-managed MDX at clean `/guides/<slug>/` URLs, the same proven pattern
skills use. The 6 legacy `public/guides/*.html` archive entries are untouched —
they migrate later, one at a time, gated on Search Console.

### Added
- `guides` content collection in `src/content.config.ts` (lean schema: `title`,
  optional `slug`, `description`, `status`, `lastUpdated`, `tags`). `slug` stays
  optional for the same `slugField`-strips-frontmatter reason as skills.
- Matching `guides` collection in `keystatic.config.ts`, field-for-field in
  lockstep with the content schema.
- `src/pages/guides/[slug].astro` — renders MDX guides in the terminal UI via
  `BaseLayout`; drafts are excluded from `getStaticPaths`.
- `src/content/guides/example-guide.mdx` — scaffold guide exercising the pipeline
  end-to-end. Replace or delete once a real guide ships.
- Keystatic sidebar `ui.navigation` section heading "⚠ Edit on a branch — never
  main" as a persistent reminder (Keystatic commits to the selected branch).
  Lists both `skills` and `guides` — required, since setting `navigation` renders
  only listed collections.

### Changed
- `src/pages/guides/index.astro` now lists current MDX guides (newest first) in a
  `[GUIDES] Current` section above the existing `[ARCHIVE]` legacy listing.

## Feature — Keystatic Cloud storage mode (feat/keystatic-cloud)

**Branch:** `feat/keystatic-cloud` — (2026-06-24)

### Changed
- `keystatic.config.ts` storage switched from `github` to `cloud` mode
  (`cloud.project: 'quirgs-admin/quirgs'`). Auth is offloaded to Keystatic Cloud;
  the Worker no longer needs `KEYSTATIC_GITHUB_CLIENT_ID` / `_SECRET`.
- Bumped `@keystatic/astro` `5.0.6 → 5.1.0` (adds Astro 6 to peer deps).

### Fixed
- `/api/keystatic/*` 500 on Astro 6 + Cloudflare. The adapter's API handler reads
  `context.locals.runtime.env` unconditionally (every request, all storage modes),
  and Astro 6's removed-getter throws on access — `cloud` mode does not avoid it.
  Added `patch-package` (`patches/@keystatic+astro+5.1.0.patch`) wrapping that read
  in the file's existing `tryOrUndefined` helper; values resolve to `undefined`
  harmlessly in cloud mode. `postinstall: patch-package` re-applies on every build.
- Keystatic schema drift: `keystatic.config.ts` was missing `pillar`,
  `interoperates_with`, `triggers`, and `example_prompts` — fields present in the
  live skill frontmatter and in `src/content.config.ts`. Keystatic's strict parser
  rejected every skill (`Field validation failed: ... "pillar" is not allowed`).
  Added the four fields to the Keystatic schema, mirroring the Zod enum/array types.
- Keystatic/`slugField` vs. content-schema conflict: Keystatic's `slugField: 'slug'`
  stores the slug as the *filename* and strips `slug:` from frontmatter on every save,
  but `src/content.config.ts` required `slug` in frontmatter — so the first Keystatic
  edit broke the production build (`InvalidContentEntryDataError: slug: Required`).
  Made `slug` optional in the Zod schema; the canonical slug is `entry.id` (the
  filename), which all site code already uses. No rendered output changes.

### Notes
- The `module is not defined` 500 seen under `astro dev` is a Vite SSR-runner
  artifact only; the bundled production Worker (`npm run preview` on workerd) serves
  the keystatic API route cleanly. Validate the full auth + edit→PR round-trip on the
  Cloudflare preview URL, not `astro dev`.

## Feature — Add /review/ page — HITL Gate review UI (feat/hitl-review-ui)

**Branch:** `feat/hitl-review-ui` — (2026-06-22)

### Added
- `/review/` page — client-side HITL Gate review queue. Loads pending events from
  the gate Worker, displays context (type, item, stage, frameworks, timestamp), and
  provides Approve / Reject actions. Write token entered once per session via token
  input; stored in sessionStorage. Route registered in `src/data/routes.ts` (site group).

### Changed
- `/review/` no longer hard-codes the gate Worker URL in `review.js`. The endpoint
  is resolved at build time from `HITL_GATE_URL` (the same env var the `/hitl/`
  workflow documents), falls back to the production Worker, and is passed to the
  script via `data-gate-url` on `#queue-container`. The write token stays
  user-supplied per session — it is never injected into the static build.

### Fixed
- Approve / Reject buttons on `/review/` rendered with browser-default styling
  instead of the terminal-UI button language. The styles lived in a page-scoped
  `<style>` block on `review.astro`, but `review.js` builds the event cards (and
  their buttons) at runtime via `innerHTML`, so those nodes never received
  Astro's scoped `data-astro-*` hash and the rules never applied. Moved the
  review queue styles into the global `<style is:global>` block in
  `BaseLayout.astro` — alongside the canonical `.copy-btn` / `.help-trigger` TUI
  button styles — so they reach the JS-injected DOM and stay consistent with the
  rest of the terminal UI.

## Feature — Env-var abstraction for HITL Gate URL + token (feat/hitl-env-abstraction)

**Branch:** `feat/hitl-env-abstraction` — (2026-06-20)

### Changed

- `hitl-compliance-gate` skill and `/hitl/` page now read the gate endpoint and
  write token from two environment variables — `HITL_GATE_URL` and
  `HITL_GATE_TOKEN` — instead of hard-coding the Worker URL and using
  `QUIRGS_HITL_WRITE_TOKEN`. This abstracts the gate location for external
  customers during usage validation (Option A); a multi-tenant gate is deferred
  until real usage justifies it. Graceful degradation now triggers when either
  variable is unset.

## Feature — Add /hitl/ page (feat/hitl-page)

**Branch:** `feat/hitl-page` — (2026-06-20)

### Added

- `/hitl/` page — terminal-style documentation for the Quirgs HITL Gate.
  Explains what the gate is, who it's for, and how to wire an agent to it.
  Includes a three-step curl walkthrough to fire a live test event in under
  90 seconds. Route registered in `src/data/routes.ts` (docs group).
  
## Security — Dependabot grouped bump: undici + Cloudflare toolchain (dependabot/npm_and_yarn/multi-ee874d03c0)

**Branch:** `dependabot/npm_and_yarn/multi-ee874d03c0` — PR #67 (2026-06-20)

### Security

- Grouped Dependabot bump driven by an `undici` security release (`7.24.8 → 7.28.0`, addressing 7 advisories incl. CVE-2026-12151), pulled in transitively under `miniflare`. Ancestor deps updated together: `wrangler` `4.101.0 → 4.103.0`, `@cloudflare/vitest-pool-workers` `0.16.16 → 0.16.18`, `@cloudflare/vite-plugin` `1.41.0 → 1.42.1`, `miniflare`/`workerd` `…0616 → …0617.1`. All dev/build-tooling — none ships in the static `dist/client` bundle. The nested `esbuild` moves to `0.28.1`, matching the existing `overrides` pin from PR #62 (no conflict). Verified: clean `npm ci` + production build succeed, all 6 pinned CSP `script-src` hashes in [public/_headers](public/_headers) still match the rebuilt inline scripts (no drift), and all 39 worker tests pass (15 registry + 24 hitl-gate). This is the anticipated upstream arrival noted in the `fix/audit-tooling` entry.

## Feature — Wire hitl-compliance-gate skill to HITL Gate Worker (feat/hitl-skill-gate)

**Branch:** `feat/hitl-skill-gate` — (2026-06-19)

### Added

- `hitl-compliance-gate` skill now posts pending events to the Quirgs HITL Gate Worker
  (Step 3.5). Output is held pending human sign-off when `QUIRGS_HITL_WRITE_TOKEN` is set.
  Graceful degradation when token is absent — skill functions as before with an advisory notice.

## Feature — Publish ARD ai-catalog.json at /.well-known/ (feat/ard-catalog)

**Branch:** `feat/ard-catalog` — (2026-06-18)

### Added

- Published an [Agentic Resource Discovery (ARD)](https://agenticresourcediscovery.org) catalog at [public/.well-known/ai-catalog.json](public/.well-known/ai-catalog.json) so any ARD-compliant agent can discover Quirgs capabilities without a prior relationship. The catalog lists 9 entries: the 7 compliance Skills (eu-ai-act-classifier, nist-ai-rmf-checkpoint, iso-42001-audit-prep, hitl-compliance-gate, ai-transparency-writer, pii-exposure-checker, incident-response-logger) each with semantic `representativeQueries`, plus the `quirgs-hitl-gate` and `quirgs-registry-api` Workers. Both Worker URLs verified live (200 at `/events` and `/skills` respectively).
- Added an isolated `/.well-known/ai-catalog.json` block to [public/_headers](public/_headers) setting `Access-Control-Allow-Origin: *`, `Content-Type: application/json`, and `Cache-Control: public, max-age=3600` — required so ARD crawlers can fetch the catalog cross-origin. This block is JSON-only and does not touch the strict CSP pinned to `/*`.

## Fix — Non-breaking audit cleanup of build tooling (fix/audit-tooling)

**Branch:** `fix/audit-tooling` — (2026-06-16)

### Security

- Ran a non-breaking `npm audit fix` (lockfile-only; `package.json` untouched), clearing 2 of 12 transitive dev/build-tooling advisories: `vite` (high) and `js-yaml` (moderate). Verified post-fix: production build succeeds, all 6 pinned CSP `script-src` hashes in [public/_headers](public/_headers) still match the rebuilt inline scripts (the `vite` bump shifted no inlined-script bytes), and all 39 worker tests pass.
- The remaining 10 advisories are left intentionally. Six (the `ws` / `miniflare` / `wrangler` / `@cloudflare/vite-plugin` chain) only offer `isSemVerMajor` fixes that would *downgrade* `@astrojs/cloudflare`, `wrangler`, and `@cloudflare/vitest-pool-workers` below the versions set in PR #62 — `npm audit fix --force` is deliberately NOT run. The other four (`yaml` chain under `@astrojs/check`) resolve when Astro ships a `language-server` update. All 10 are dev/build-tooling only — none ships in the static `dist/client` bundle. These will arrive as upstream Dependabot PRs as releases land.

## Fix — esbuild security vulnerabilities + dependency refresh (fix/esbuild-vulnerabilities)

**Branch:** `fix/esbuild-vulnerabilities-9409481704421424609` — PR #62 (2026-06-16)

### Security

- Pinned `esbuild` to `0.28.1` via the `overrides` field in [package.json](package.json), resolving two Dependabot-flagged advisories carried transitively through `wrangler` and `@cloudflare/vitest-pool-workers`: GHSA-gv7w-rqvm-qjhr (missing binary integrity verification in the Deno module → RCE via `NPM_CONFIG_REGISTRY`) and GHSA-g7r4-m6w7-qqqr (arbitrary file read via the dev server on Windows). `esbuild` now resolves to `0.28.1` across the entire dependency tree (previously `0.27.x`, inside the vulnerable `0.17.0 – 0.28.0` range). Both are build/dev-tooling dependencies — neither ships in the static `dist/client` bundle.

### Changed

- Refreshed core dependencies for patch compatibility: `astro` `6.3.3 → 6.4.7`, `@astrojs/cloudflare` `13.5.4 → 13.7.0`, `wrangler` `4.93.1 → 4.101.0`, `@cloudflare/vitest-pool-workers` `0.16.14 → 0.16.16`. Verified post-bump: production build succeeds, all 6 pinned CSP `script-src` hashes in [public/_headers](public/_headers) still match the rebuilt inline scripts (no hash drift from the Astro bump), and all 39 worker tests pass.

## Fix — Register quirgs-publish in marketplace (fix/marketplace-add-quirgs-publish)

**Branch:** `fix/marketplace-add-quirgs-publish` — (2026-06-13)

### Fixed

- Added the missing `quirgs-publish` entry to [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json). The PUBLISH bundle shipped its `plugins/quirgs-publish/` directory (and `plugin.json`) but was never registered in the marketplace manifest, so the bundle did not surface in the Claude Quirgs marketplace. Registered under `category: "productivity"` (music publishing, not security), placed after the `quirgs-compliance` bundle. All 9 `plugins/` directories now have parity with the manifest's `plugins[]` array.
- Corrected the `installCmd` on all 8 `src/content/skills/publish-*.mdx` files. They advertised `/plugin install <skill>@quirgs-publish` — broken two ways: the `@` segment must name the marketplace (`quirgs`, not `quirgs-publish`), and there is no standalone `publish-*` plugin to install (the skills ship bundle-only inside `quirgs-publish`). All 8 now point at the working bundle install: `/plugin install quirgs-publish@quirgs`.

## Resources section + first case study (feat/resources-case-studies)

**Branch:** `feat/resources-case-studies` — (2026-06-13)

### Added

- New `resources` nav group in [src/data/routes.ts](src/data/routes.ts) (ordered between `registry` and `docs`) plus a `/resources/` route. Non-`primary`, so it surfaces in the SiteMenu overlay tree only, keeping the inline NavBlock row short.
- [src/pages/resources/index.astro](src/pages/resources/index.astro) — case-studies listing in the shared terminal (TUI) aesthetic (`ls -lt resources/`), driven by a `caseStudies` array sorted newest-first. Adding a future writeup is one array entry plus one page file.
- [src/pages/resources/publish-bundle-stress-test.astro](src/pages/resources/publish-bundle-stress-test.astro) — first case study (PUBLISH Bundle stress test), mirroring the `/skills/[slug]` detail-page structure and typography. Internal "Private — client lead use only" handling banner intentionally omitted from the public page body.

## Fix — Publish skill Gist links (fix/publish-gist-links)

**Branch:** `fix/publish-gist-links` — (2026-06-13)

### Fixed

- Added the missing `gistUrl` frontmatter field to all 8 `src/content/skills/publish-*.mdx` files, sourced from `skills/gist-map.json`. The publish skill detail pages already carried `marketplaceCmd`/`installCmd` but no `gistUrl`, so the "View source Gist" link never rendered (the `/skills/[slug]` template only emits it when `gistUrl` is present). Compliance skills already had it.

### Notes

- The initial Gist-sync run after the PUBLISH bundle merge was blocked by a repo ruleset ("PR needed for merge") at the gist-map push-back step, so the freshly-created Gist IDs were never committed. The retry's bootstrap pass then created a second set of Gists — leaving 8 duplicate publish Gists. The duplicates not referenced in `gist-map.json` were deleted manually; the 8 surviving Gists were reconciled against the map (all match) before wiring `gistUrl` into the MDX.

**Branch:** `feat/publish-bundle` — (2026-06-12)

Eight-skill PUBLISH Bundle for music publishers, targeting the Quirgs Plugin Marketplace. Covers the full PUBLISH Loop: royalty reconciliation, catalog metadata hygiene, DDEX/PRO registration, sync licensing pipeline, AI provenance logging, platform compliance gating, quarterly catalog harvest, and a weekly OS orchestrator.

### Added

- `plugins/quirgs-publish/` — Full plugin directory following the `quirgs-compliance` pattern.
- `plugins/quirgs-publish/.claude-plugin/plugin.json` — Plugin manifest.
- `plugins/quirgs-publish/skills/publish-income/` — Royalty reconciliation (Statement-to-Ledger). References: `statement-formats.md`, `reconciliation-logic.md`, `ledger-template.md`.
- `plugins/quirgs-publish/skills/publish-update/` — Catalog metadata hygiene audit and enrichment. References: `metadata-standards.md`, `hygiene-audit-checklist.md`, `enrichment-sources.md`.
- `plugins/quirgs-publish/skills/publish-broadcast/` — DDEX ERN + PRO registration data extractor. References: `ddex-ern-fields.md`, `pro-registration-requirements.md`, `broadcast-data-template.md`.
- `plugins/quirgs-publish/skills/publish-license/` — 3-agent sync licensing pipeline (Brief Analyst → Catalog Matcher → Pitch Writer). References: `brief-analysis-framework.md`, `catalog-matching-criteria.md`, `pitch-writing-guide.md`.
- `plugins/quirgs-publish/skills/publish-provenance/` — AI involvement assessment + creation log generator (Provenance Triangle). References: `provenance-triangle.md`, `ai-involvement-tiers.md`, `creation-log-template.md`.
- `plugins/quirgs-publish/skills/publish-shield/` — Pre-release platform compliance gate + AI governance policy generator. References: `platform-ai-policies.md`, `governance-policy-template.md`, `pre-release-compliance-checklist.md`.
- `plugins/quirgs-publish/skills/publish-harvest/` — Quarterly catalog performance review. References: `performance-metrics.md`, `quarterly-review-template.md`, `trend-signals.md`.
- `plugins/quirgs-publish/skills/publish-workflow/` — PUBLISH Loop orchestrator (weekly publishing OS entry point).
- `skills/publish-income/SKILL.md` through `skills/publish-workflow/SKILL.md` — Gist-sync stubs for all 8 skills.
- `skills/gist-map.json` — Added 8 placeholder entries for publish skill Gist IDs (to be populated by sync pipeline on first run).

### Site — MDX skill pages + skills index UI

- `src/content/skills/publish-*.mdx` (8 files) — Skill detail pages for all PUBLISH Bundle skills, matching the compliance skill format: frontmatter + What it does / Frameworks covered / When to use it / Example output sections. Includes representative example output aligned with the stress test suite.
- `src/content.config.ts` — Added `bundle: z.enum(['compliance', 'publish'])` field to the skills schema for UI tab filtering.
- `src/content/skills/*.mdx` (7 compliance files) — Added `bundle: "compliance"` to all existing compliance skill frontmatter.
- `src/pages/skills/index.astro` — Redesigned for 15-skill scale. TUI-style tab switcher (ALL / COMPLIANCE / PUBLISH), pillar filter dropdown, CSS grid table layout with column headers, bundle-colored labels (blue for compliance, yellow for publish), client-side filter logic via bundled Astro script. Updated meta description and total count from 7 to 15.

### Fixed

- `plugins/quirgs-publish/skills/publish-provenance/references/ai-tool-tier-map.md` — New reference file. Maps ~50 specific AI tools to their default AI Involvement Tier (0–4). Closes a reasoning-layer gap where `publish-shield` relied on LLM model knowledge to classify tools like Suno as Tier 2. Tier assignment is now deterministic from the reference table. Includes usage-condition upgrade rules (e.g., Suno → Tier 2 if modified, Tier 4 if released as-is) and a Tier 4 hard-stop for unauthorized voice cloning regardless of other factors.
- `plugins/quirgs-publish/skills/publish-shield/SKILL.md` — Step A1 updated: if AI Involvement Tier is not provided, skill now loads `publish-provenance/references/ai-tool-tier-map.md` and infers tier from disclosed tool names rather than assuming Tier 0. Inferred tier is flagged in the compliance report.
- `plugins/quirgs-publish/skills/publish-provenance/SKILL.md` — Step 3 updated: loads `references/ai-tool-tier-map.md` alongside `ai-involvement-tiers.md` during tier assignment. Tool map takes precedence when Triangle scores and tool-table disagree; discrepancy is noted in the creation log.
- `public/_headers` — Pinned two new `script-src` SHA-256 hashes for the redesigned `/skills/` (tab + pillar filter) and `/bundle/` (tab switcher) inline scripts. Without them the strict CSP silently blocked both scripts on the Cloudflare preview — tabs and the pillar dropdown rendered but did nothing (worked in `npm run dev`, which does not enforce `_headers`).
- `keystatic.config.ts` — Added the `bundle` select field to mirror the new `bundle` enum in `content.config.ts`, per the dual-schema rule. (Keystatic remains dormant under Astro 6; this keeps the mirror honest for when support returns.)

### Changed

- **Renamed the `/bundle/` route to `/bundles/`** (directory `src/pages/bundle/` → `src/pages/bundles/`). The original singular name was coined for the single compliance bundle before multi-bundle scaling was considered; with the PUBLISH bundle landing alongside compliance, the plural is correct. Updated `src/data/routes.ts`, `src/pages/index.astro` (boot-sequence link), `NavBlock` `currentPath`, and `README.md`. The `bundle` *frontmatter field* on skills is unchanged — only the route moved.
- `public/_redirects` — New file. `301` from `/bundle` and `/bundle/` → `/bundles/` so the previously-published (discovered, not indexed) `quirgs.com/bundle` URL does not dead-end.
- `public/_headers` — Recomputed the pinned landing-terminal-boot `script-src` SHA-256 hash. The `/bundle/` → `/bundles/` href edit lives inside the JS-injected boot string in `index.astro`, which changed the inlined script bytes; the old hash would have CSP-blocked the boot animation. The other five inline-script hashes were verified unchanged.

---

## Feat — Scalable navigation (V3 prep)

**Branch:** `feat/nav-scale` — (2026-06-10)

Navigation redesign to absorb future plugin/menu pages without growing every page. The inline nav is now a fixed two lines regardless of how many routes exist; everything beyond the primary set lives in a sitemap overlay.

### Added

- `src/data/routes.ts` — single source of truth for site routes (path, label, description, group, primary flag). Adding a page is now a one-line change here; NavBlock and SiteMenu derive from it.
- `src/components/SiteMenu.astro` — terminal-themed sitemap overlay rendering all routes as a grouped `tree --dirsfirst` listing (registry / docs / site). Opened by the new `[≡]` button in the terminal header or NavBlock's `[+N more]` token; closes via `[×]`, backdrop click, or Escape. Same mechanics as HelpModal.
- `[≡]` site-menu trigger in the terminal header (BaseLayout and the standalone landing page), left of `[?]`. The landing boot sequence is untouched.

### Changed

- `NavBlock.astro` — rewritten from a one-line-per-route `ls` listing (6+ lines) to a bash tab-completion row (`$ cd <TAB>` + wrapping route tokens, 2 lines). Same `currentPath` prop; no consuming-page changes.
- `HelpModal.astro` — SITE LAYOUT section no longer hardcodes a second copy of the sitemap; it points at the `[≡]` menu instead.
- `public/_headers` — pinned the SiteMenu inline script hash (`sha256-S8s+X/FJ…`) in the CSP `script-src`; the three existing hashes are unchanged.

---

## Test — Worker test coverage (V3 prep)

**Branch:** `feat/worker-tests` — (2026-06-09)

First automated test coverage in the repo, targeting the two standalone Workers (the only runtime logic). 39 tests run in workerd via Vitest's Workers pool against real (local) KV and D1 bindings resolved from each Worker's own `wrangler.toml`.

### Added

- `workers/registry-api/test/index.spec.js` — 15 tests: CORS preflight/headers, `GET /skills` list + non-JSON KV passthrough, `GET /skills/:slug` 200/404 + cache headers, `POST /skills/:slug` auth gating (missing/wrong/non-Bearer token), malformed-body 400, KV round-trip and overwrite, unknown-route 404s.
- `workers/hitl-gate/test/index.spec.js` — 24 tests: CORS, lazy table bootstrap, event creation + field validation, newest-first listing with parsed payloads, PATCH state machine (pending→approved/rejected, no double transition, `archived` rejected as TTL-only, invalid status, 404), and the lazy 30-day TTL boundary (31 days archived + still fetchable by id, 29 days retained).
- `workers/*/vitest.config.js` — per-Worker configs using the vitest 4 `cloudflareTest()` plugin API; test-only `nodejs_compat` flag and `*_WRITE_TOKEN` bindings injected via miniflare overrides (deploy config untouched).
- `package.json` — `npm test` runs both suites (`test:registry`, `test:hitl`); `vitest` + `@cloudflare/vitest-pool-workers` added as devDependencies.

### Notes

- `@cloudflare/vitest-pool-workers@0.16.x` (vitest 4) removed both the `/config` import subpath and per-test `isolatedStorage`; suites reset their own KV/D1 state in `beforeEach`.

---

## Fix — Skills listing hardening + homepage canonical

**Branch:** `fix/skills-listing-hardening` — (2026-06-09)

### Fixed

- `src/pages/skills/index.astro` — `" ".repeat()` now clamps to `Math.max(0, 26 - slug.length)`, preventing a negative-count `RangeError` when a future skill slug reaches 26+ characters.
- `src/pages/skills/index.astro` — sort comparator maps `indexOf` result of `-1` to `Infinity` so skills absent from `dropOrder` fall to the bottom of the listing rather than the top.
- `src/pages/skills/index.astro` — removed dead `slugPadded` variable (was computed but never used in the rendered output).
- `src/pages/index.astro` — added `<link rel="canonical">` to the standalone homepage head; PR #52 wired canonicals via `BaseLayout` but the homepage bypasses `BaseLayout` and was missed.

---

## Fix — Legacy Guides Mobile Search Overflow

**Branch:** `fix/guides-search-mobile-overflow` — (2026-06-06)

Fixed a mobile overflow bug in the legacy `/guides/*` in-page search bar. When the input was tapped/focused and matches appeared, the flex input refused to shrink below its content width and pushed the prev/next/clear nav arrows off the right edge into horizontal overflow, making them unreachable.

### Fixed

- `public/css/guides-v2.css` — added `min-width: 0` to `#content-search-input` so the flex input shrinks instead of forcing overflow (root-cause fix, applies at all widths). The fix lives in the shared stylesheet, not in `public/guides/`, so the protected legacy HTML is untouched and all six guides are corrected at once.

---

## SEO — Self-Referencing Canonicals + robots.txt

**Branch:** `feat/seo-canonical-robots` — PR #52 (2026-06-03)

Fixed Google canonical/duplicate issues surfaced after adding the site to Search Console. The skills-page 403s turned out to be a stale crawl from before Cloudflare's "Allow verified bots" was enabled (live test now passes); the durable code fixes here close the canonical gaps that let `chatgpt.com` be credited as the canonical for legacy guides, and prevent www/apex duplication.

### Added

- `src/layouts/BaseLayout.astro` — self-referencing `<link rel="canonical">` derived from the configured `site` (`https://quirgs.com`) + `Astro.url.pathname`, emitted on every terminal/skills page.
- `public/_headers` — per-path `Link: …; rel="canonical"` headers for each legacy `/guides/*.html`, fixing the chatgpt.com canonical attribution without editing the protected guide files (HTTP `Link` is honored like the HTML tag).
- `public/robots.txt` — site-wide crawl allow, `Disallow: /keystatic/` (deferred admin), `Sitemap:` pointing at `sitemap-index.xml`.

### Notes

- Canonicals resolve to the apex production URL even when served from a Cloudflare branch-preview host (derived from `site`, not the request host), so previews self-canonicalize back to production and don't compete for indexing.
- AI-training-bot policy is enforced at the Cloudflare edge (Security → Bots), not in `robots.txt`. The www→apex 301 is a Cloudflare Redirect Rule, not a code change.

---

## CSP Tightening — Drop `'unsafe-inline'`

**Branch:** `feat/csp-tighten` — PR #46 (2026-06-01)

Replaced the temporary `script-src`/`style-src` `'unsafe-inline'` allowances (originally needed for the JS-injected terminal boot animation) with a hash-pinned, `self`-only Content-Security-Policy in `public/_headers`. Validated against the Cloudflare branch preview: site, skills + copy buttons, and legacy guides all load and function, with zero CSP violations in the devtools console.

### Added

- `public/_headers` — strict CSP for the main site: `script-src 'self'` + SHA-256 hashes of the three Astro-bundled inline scripts (HelpModal, landing terminal boot, delegated copy-to-clipboard) + `static.cloudflareinsights.com`; `style-src 'self'`; `connect-src 'self' https://cloudflareinsights.com` (Cloudflare Web Analytics beacon); plus `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`, `upgrade-insecure-requests`. Hash-regeneration steps are documented inline.
- Delegated copy-to-clipboard listener in `src/layouts/BaseLayout.astro` (replaces inline `onclick` handlers, which can't be hashed without `'unsafe-hashes'`).

### Changed

- `astro.config.mjs` — `build.inlineStylesheets: 'never'` (all component CSS emitted as external `'self'` stylesheets instead of inline `<style>`); `markdown.syntaxHighlight: false` (default Shiki emitted an inline `style=` on `<pre>`; all skill code fences are plaintext, so nothing is lost).
- `src/pages/bundle/index.astro` and `src/pages/skills/[slug].astro` — copy buttons use `[data-copy]` attributes instead of inline `onclick` handlers.
- `src/pages/index.astro` — removed the runtime-injected `style="font-weight: bold;"` fragments so `style-src 'self'` fires no violations; boot sequence content, order, and timing are unchanged.

### Removed

- Redundant `is:inline` footer-year script in `src/components/Footer.astro` (the year is already rendered at build time).

### Notes

- Legacy `/guides/*` keep their own inline scripts/styles; the strict policy is detached there (`! Content-Security-Policy`) so Cloudflare's `_headers` comma-join doesn't intersect it onto those pages and break them.
- The three `sha256` hashes are tied to the exact bundled inline-script bytes — recompute them if a bundled script changes or Astro/Vite is bumped.

---

## Plugin Packaging — Marketplace Distribution

**Branch:** `feat/plugin-packaging`

Made the 7 compliance skills installable via a Claude Code plugin marketplace, fixing the gap where Gist installs (and the abandoned `.plugin`/Releases approach) could not deliver each skill's runtime `references/` directory. Raw `.plugin` zips were rejected by Claude with "Plugin validation failed" — Claude installs plugins only from a git-repo marketplace, so the model was redesigned around `marketplace.json` + a committed plugin tree.

### Added

- `.claude-plugin/marketplace.json` (marketplace name `quirgs`) at the repo root, listing one plugin: `quirgs-compliance`.
- `plugins/quirgs-compliance/` — a Claude Code plugin (`.claude-plugin/plugin.json` + `skills/<slug>/{SKILL.md,references/}` for all 7 skills). The full `references/` are committed so they survive install. Verified with `claude plugin validate` and a real local install/uninstall round-trip.
- `marketplaceCmd` field in the skills content schema (`content.config.ts` + `keystatic.config.ts`) for the marketplace-add step, rendered as a `[STEP 1]` row on each skill detail page.
- Locked distribution model: **Gist** (`SKILL.md` only) = discovery / SEO / read-only preview; **marketplace plugin** (`quirgs-compliance`) = functional install with full `references/`, all 7 skills. Install: `/plugin marketplace add unqdlphn/quirgs` then `/plugin install quirgs-compliance@quirgs`.

### Changed

- `installCmd` in all 7 `src/content/skills/{slug}.mdx` now `/plugin install quirgs-compliance@quirgs`; each also gains `marketplaceCmd`. `gistUrl` retained (relabeled `[PREVIEW]` in the UI).
- Install line in all 7 Gist-source `skills/{slug}/SKILL.md` points at the marketplace commands (propagates to the Gists via `sync-gists.yml`).
- Skill detail install block (`src/pages/skills/[slug].astro`) renders two copy-able steps (`[STEP 1]` marketplace add, `[STEP 2]` install) plus a `[PREVIEW]` Gist link.

### Removed

- Abandoned the `.plugin`-on-GitHub-Releases approach (draft Release `v1.0.0` deleted). `.plugin` zips are not a valid Claude install format.

### Added (individual skill plugins)

- 7 single-skill plugins under `plugins/<slug>/` (`.claude-plugin/plugin.json` + self-contained `skills/<slug>/{SKILL.md,references/}`), so each skill can be installed on its own: `/plugin install <slug>@quirgs`. `marketplace.json` now lists 8 plugins (the bundle + 7 individuals). Validated and round-trip tested via `claude plugin install`.

### Changed (UX copy for the marketplace model)

- Per-skill `installCmd` in each `src/content/skills/{slug}.mdx` now installs that skill's own plugin (`/plugin install <slug>@quirgs`); the Gist-source `skills/{slug}/SKILL.md` install lines match. The bundle install (`quirgs-compliance@quirgs`) is surfaced on `/bundle/`.
- `HelpModal` (`src/components/HelpModal.astro`) rewritten: the "WHAT IS A QUIRG?" and "INSTALLING A SKILL" sections now describe the two-step marketplace flow instead of the abandoned `.plugin`/Cowork copy-paste model.
- `/bundle/` page (`src/pages/bundle/index.astro`) install block replaced the fake `.plugin` download + Cowork steps with the `[STEP 1]`/`[STEP 2]` marketplace commands.

---

## Gist Sync — Live Drop

**Merged to `main` via PR# 37-41 · 2026-05-29**
**Branch:** `feat/gist-sync-drop`

All 7 compliance skill SKILL.md files dropped into `skills/` and the Gist sync pipeline activated end-to-end for the first time.

### Added

- `skills/{slug}/SKILL.md` — all 7 compliance skills added: `ai-transparency-writer`, `eu-ai-act-classifier`, `hitl-compliance-gate`, `incident-response-logger`, `iso-42001-audit-prep`, `nist-ai-rmf-checkpoint`, `pii-exposure-checker`.
- `gistUrl` and `installCmd` added to all 7 skill MDX frontmatter files in `src/content/skills/` — install commands now render live on `/skills/[slug]/`.

### Fixed

- `sync-gists.js` converted from CommonJS (`require`) to ESM (`import`) — required because `package.json` declares `"type": "module"`. Added `fileURLToPath` shim for `__dirname`.
- `sync-gists.yml` — added `fetch-depth: 0` to `actions/checkout` so `git diff SHA~1` resolves on the runner.
- `sync-gists.yml` — added `permissions: contents: write` so the workflow can commit `gist-map.json` write-back.
- Bootstrap pass added to `sync-gists.js` — on every run, any skill directory not yet in `gist-map.json` is synced automatically, regardless of the git diff. Prevents partial syncs on multi-commit drops.
- `BaseLayout.astro` — added `word-break: break-all`, `overflow-wrap: anywhere`, and `min-width: 0` to `.install-block code` to prevent install command overflow on mobile.

### Changed

- `skills/gist-map.json` — populated with all 7 Gist IDs via automated write-back commit.
- `skills/eu-ai-act-classifier/SKILL.md` — advisory disclaimer added (classification output is informational, not legal advice).
- `skills/hitl-compliance-gate/SKILL.md` — advisory disclaimer tightened.

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
