# Changelog — Quirgs

All notable changes to Quirgs are documented here. Each entry maps to a
feature branch and PR merged into `main`.

Per-branch entry format: `[Branch Name] — PR #N (YYYY-MM-DD)`

**Release roll-up.** The site/repo is versioned with CalVer (`YYYY.MM`, with a
`.N` patch suffix if more than one release lands in a month). Plugins and
bundles keep their own SemVer — source of truth is
`plugins/*/.claude-plugin/plugin.json`. New per-branch entries accumulate
under `## [Unreleased]`. At monthly release time the `[Unreleased]` block is
retitled to `## [YYYY.MM] — YYYY-MM-DD`, a fresh empty `[Unreleased]` header
is added above it, the merge commit is tagged `YYYY.MM`, and a GitHub Release
is published with themed notes — including any plugin/bundle version bumps
since the last release. Historical entries are never rewritten.

Release tagging began July 2026: a retroactive `v2.0.0` baseline tag marks the
V2 launch (2026-05-27), and the first CalVer release, `2026.07`, covers
everything merged since. All entries below `[Unreleased]` predate the tagging
practice and roll up into those two releases.

---

## [Unreleased]

## Fix — dev-server cascade reload/crash on Keystatic module discovery (fix/keystatic-dev-server-cascade-reload)

**Branch:** `fix/keystatic-dev-server-cascade-reload` — (2026-07-22)

Another straggler from the Astro 6→7 upgrade cascade (PR #147 → #149):
`npm run dev` crashed with `The file does not exist at ".../node_modules/.vite/deps_ssr/route-cache-*.js" ... in the optimize deps directory` shortly after boot, at
`workers/runner-worker/index.js:107`. Preceding log lines showed the real
trigger — `@keystatic/astro/internal/keystatic-api.js` gets discovered
as a new SSR dependency mid-session (not during the initial cold-start
scan), which forces a Vite "optimized dependencies changed, reloading"
cycle that races the workerd runner-worker's already-loaded module
graph and invalidates a chunk it still holds a reference to.

This is a currently open, unfixed upstream bug:
[withastro/astro#16248](https://github.com/withastro/astro/issues/16248)
— the Cloudflare adapter's dev SSR environment doesn't pre-bundle every
runtime-discovered dependency. A fix PR exists but isn't merged/released
(only an unofficial `pkg.pr.new` preview build, not appropriate to pin
in production). The documented workaround: manually add the triggering
module to `optimizeDeps.include` so it's bundled at cold start instead
of discovered lazily.

### Fixed
- `astro.config.mjs` — added `@keystatic/astro/internal/keystatic-api.js`
  to `vite.optimizeDeps.include`, alongside the existing
  `virtual:keystatic-config` exclude.

Verified: `npm run dev` boots clean across repeated cold starts (cache
cleared each time) with no "dependency optimized"/"program reload"
lines; `/`, `/keystatic/`, `/skills/` all 200. Build clean, CSP coverage
exact, all 3 Worker Vitest suites green (83 tests), `astro check` 0
errors, `npm audit` 0 vulnerabilities.

## Fix — word-spacing/wrapping cleanup across terminal-UI pages (fix/text-word-spacing)

**Branch:** `fix/text-word-spacing` — (2026-07-22)

Whitespace/line-wrap refactor across `about.astro`, `demo.astro`,
`gate.astro`, `hitl.astro`, `resources/case-study-zero.astro`, and
`security.astro` — no content or behavior changes, prose reflow and
`&nbsp;` fixes only.

## Fix — `astro dev` crash from a split Vite version across the Cloudflare/React plugins (fix/astro-dev-vite-moduletype-crash)

**Branch:** `fix/astro-dev-vite-moduletype-crash` — (2026-07-22)

`npm run dev` crashed on startup after PR #147's Astro 6→7 upgrade with
`Missing field \`moduleType\`` (from `@cloudflare/vite-plugin`'s bundled
`workers/runner-worker`), swallowed behind Astro 7's new detached
background dev-server process — the terminal only showed a generic "Dev
server process exited before becoming ready"; the real error is written
to `.astro/dev.log`. `npm run build` was unaffected (that crash path is
serve-only). Confirmed as a regression by running `dev` against the
pre-#147 commit (Astro 6.4.7), where it worked cleanly.

### Root cause
`astro@7.1.3` now depends on `vite: ^8.0.13` directly, but
`@cloudflare/vite-plugin@1.46.0` and `@astrojs/react`'s
`@vitejs/plugin-react` both resolved a separate nested `vite@7.3.5`
instead of deduping to Astro's own `8.1.5` — the same class of
Vite-version-split bug as [withastro/astro#16229](https://github.com/withastro/astro/issues/16229),
just surfacing through the Cloudflare adapter's dev runner instead of
the React refresh wrapper. Both `@astrojs/cloudflare` (14.1.4) and
`@cloudflare/vite-plugin` (1.46.0) are already the latest published
versions — no upstream patch exists yet.

### Fixed
- `package.json` — bumped `wrangler` devDependency `^4.103.0` → `^4.113.0`
  to satisfy `@cloudflare/vite-plugin`'s peer requirement (was forcing a
  second, older nested `wrangler`/`miniflare` copy alongside the one
  bundled with `@astrojs/cloudflare`).
- `package.json` — added `"vite": "^8.0.13"` to `overrides`, forcing a
  single deduped Vite 8 instance across `astro`, `@cloudflare/vite-plugin`,
  and `@vitejs/plugin-react` instead of a 7/8 split.

Verified: `npm run dev` boots and serves `/`, `/skills/`, `/about/`,
`/transparency/` (200s) across repeated clean restarts; `npm run build`
clean; CSP script coverage exact; all 3 Worker Vitest suites green (83
tests); `npx astro check` 0 errors; `npm audit` 0 vulnerabilities.

## Fix — Close the sharp/libvips CVE without downgrading the Cloudflare adapter (fix/sharp-libvips-cve)

**Branch:** `fix/sharp-libvips-cve` — (2026-07-22)

Follow-up to PR #147: [Dependabot alert #17](https://github.com/unqdlphn/quirgs/security/dependabot/17) flagged `sharp <0.35.0` (GHSA-f88m-g3jw-g9cj,
CVE-2026-33327/33328/35590/35591, high). This wasn't newly introduced by that
merge — it's the `sharp`/`miniflare`/`wrangler` chain called out and
deliberately deferred there. `npm audit fix --force` "fixes" it by downgrading
`@astrojs/cloudflare` 14.1.4→12.6.13 and `wrangler` 4.103.0→4.15.2 (undoing the
upgrade just shipped) while introducing fresh high-severity `undici`/`ws`
CVEs in the process — rejected. The real blocker: `miniflare` (latest published,
`4.20260721.0`) hard-pins `sharp` to an exact `0.34.5`, not a range, so no
non-breaking bump exists upstream yet.

### Fixed
- `package.json` — added `"sharp": "^0.35.0"` to `overrides` (alongside the
  existing `esbuild` override). Astro's own `sharp` dependency already accepts
  `^0.34.0 || ^0.35.0`, so this just forces the deduped tree-wide copy to the
  patched `0.35.3` without touching `@astrojs/cloudflare`, `wrangler`, or
  `miniflare` themselves. `npm audit` → 0 vulnerabilities.

Verified: `npm run build` clean, CSP script coverage still exact (this path
touches the Cloudflare Images build-time processing), all 3 Worker Vitest
suites green (83 tests), `npx astro check` 0 errors.

## Fix — Astro 6→7 / Vite 8 upgrade build break + CSP resync (dependabot/npm_and_yarn/multi-8b378e8c39)

**Branch:** `dependabot/npm_and_yarn/multi-8b378e8c39` — PR #147 (2026-07-21)

Dependabot's grouped bump of `astro` (6.4.7→7.1.3), `@astrojs/cloudflare`
(13.7.0→14.1.4), `@astrojs/mdx` (5.0.6→7.0.3), and `@keystatic/astro`
(5.1.0→5.2.0) failed CI: `resolveBundleVersion`/`resolveSkillVersion`
(`src/data/skill-version.ts`) threw at prerender because their
`import.meta.glob('.../.claude-plugin/plugin.json', ...)` resolved to zero
matches. Root cause: Vite 8 (pulled in transitively via the new
`@astrojs/cloudflare`) added an `exhaustive` glob option, default `false`,
that now silently excludes any path through a dot-prefixed directory
segment — `.claude-plugin` — with no build-time warning. Confirmed via an
isolated repro against `vite@8.1.5` before touching the fix.

### Fixed
- `src/data/skill-version.ts` — pass `exhaustive: true` to the plugin-manifest
  glob so it matches through `.claude-plugin/` again. Verified the resolved
  versions on `/bundles` match the real `plugin.json` values (`quirgs-compliance`
  1.5.1, `quirgs-publish` 1.4.1), not just that the glob is non-empty.
- `public/_headers` — regenerated all 7 CSP `script-src` SHA-256 hashes against
  the post-upgrade `dist/client` output. The Astro/Vite bump changed the
  inlined-script wrapper bytes for 6 of 7 (only the static JSON-LD block was
  unchanged), which builds clean but silently CSP-blocks the boot animation,
  copy-to-clipboard, HelpModal, SiteMenu, and the skills/bundles tab switchers
  in production — exactly the failure mode the regen note at the top of
  `_headers` warns about. Verified with a full script-tag sweep of the built
  output: 0 missing, 0 stale.
- `patches/@keystatic+astro+5.1.0.patch` → `@keystatic+astro+5.2.0.patch` —
  regenerated (content identical) to clear the patch-package version-mismatch
  warning now that `@keystatic/astro` is on 5.2.0.
- `package-lock.json` — additionally ran `npm audit fix` (non-breaking) to
  close `brace-expansion`, `fast-uri`, `js-yaml`, `svgo`, and the `yaml` chain
  under `@astrojs/language-server`. Landing this bump also removes 4 real
  high-severity Astro CVEs (reflected XSS, authorization bypass) present on
  `astro@6.4.7`. Remaining: a `sharp`/`miniflare`/`wrangler` advisory chain
  that only clears via `npm audit fix --force` (bumps
  `@cloudflare/vitest-pool-workers` to 0.8.30, a breaking change to the
  Workers test runner) — left for a separate, dedicated PR so it can be
  validated against all three Worker test suites on its own.

Verified: `npm run build` clean, all 3 Worker Vitest suites green (15+52+16),
`npx astro check` 0 errors.

## Fix — Narrow the guides CSP detachment to ollama only (feat/guides-csp-narrow)

**Branch:** `feat/guides-csp-narrow` — (2026-07-17)

### Changed
- `public/_headers`: the `/guides/*` `! Content-Security-Policy` wildcard is
  narrowed to just `/guides/ollama_anythingllm_guide.html`. Now that Track 2
  migrated every other guide to managed MDX, the MDX guide pages (and the
  `/guides/` index) fall under the strict `/*` CSP — they share the same
  hash-pinned BaseLayout inline-script surface as skills detail pages, and their
  MDX body content has no inline `style=`/`<script>`. Only `ollama` (kept a literal
  `.html` with unhashed legacy inline scripts) still needs the detachment, folded
  into its existing canonical block. Verified in the build: 0 inline `style=` across
  all guide pages + index; guide pages carry the same 4 inline scripts as skills.

## Feature — Guides Track 2 bulk migration (feat/guides-track2-bulk)

**Branch:** `feat/guides-track2-bulk` — (2026-07-17)

Migrates the four remaining low-traffic legacy guides to managed MDX (Option B:
MDX + 301), after `git-workflow-reference` confirmed a clean indexed outcome in
Search Console. `ollama_anythingllm_guide.html` stays a literal `.html` (top earner,
live external backlink — see `_v2/_v3/guides-keystatic-migration-plan.md`).

### Added
- Managed MDX guides: `ai-prompt-engineering`, `copilot-commands-reference`,
  `gemma-vs-gemini-guide`, `taco-marketing-strategy` (content preserved; legacy
  chrome dropped, tables → GFM, BaseLayout shell). Taco retains its author
  attribution.
- 301 redirects in `public/_redirects` for all four — both the `.html` and
  extensionless forms → the new `/guides/<slug>/` URLs.
- Overflow hardening in `BaseLayout.astro` for long-form guide content: wide
  tables scroll inside their own box (`display:block` + `width:max-content` +
  `overflow-x:auto`); long inline commands/URLs and prose wrap
  (`overflow-wrap`). CSS-only, no CSP impact.

### Removed
- `public/guides/{ai_prompt_engineering,copilot_commands_reference,gemma_vs_gemini_guide,taco_marketing_strategy}.html`
  — replaced by the MDX guides (intentional, sanctioned migration exception).
  Their per-path canonical `Link` headers in `public/_headers` are dropped; the
  MDX pages self-reference via BaseLayout `<head>`. Only `ollama`'s canonical remains.

### Changed
- `src/pages/guides/index.astro` — `[ARCHIVE]` now lists only `ollama`; the four
  migrated guides surface in `[GUIDES] Current` from the collection.

### Notes
- The `/guides/*` `! Content-Security-Policy` wildcard in `public/_headers` is
  left as-is (deferred): with `ollama` staying literal it still needs detachment,
  but it also leaves the MDX guides without CSP. Follow-up: narrow it to just
  `ollama_anythingllm_guide.html` so all MDX guides fall under the strict `/*` CSP
  (own PR — CSP-sensitive, validate on preview).

## A-6 R2 backlog closeout — hitl gate temporal-scope note, platform AI-policy refresh, Omnibus adoption status (fix/a6-r2-backlog)

**Branch:** `fix/a6-r2-backlog` (2026-07-16)

### Fixed
- **Compliance Bundle 1.5.0 → 1.5.1**; **PUBLISH Bundle 1.4.0 → 1.4.1**
- `hitl-compliance-gate` **1.4.0 → 1.4.1** — `references/eu-ai-act.md` (both copies): added a scope note before "Key Obligations by Stage" stating the obligations table is intentionally framework-level and non-dated, directing readers to the eu-ai-act-classifier skill for current applicability dates and flagging those dates as provisional pending Official Journal publication of the Digital Omnibus. Closes claims-register row HITL-03 (cross-skill consistency flag) — the file is intentionally non-dated, not stale, and now says so.
- `eu-ai-act-classifier` **1.3.0 → 1.3.1** — `references/high-risk.md` and `references/obligations-high-risk.md` (both copies): Omnibus status updated from "provisional agreement (May 2026)" to final adoption (European Parliament 16 June 2026, Council 29 June 2026), with dates marked provisional until OJ publication (pending as of mid-July 2026). Keeps the classifier's status at least as current as the new hitl-compliance-gate note pointing to it.
- `publish-provenance` (bundle-versioned, PUB-000) — `references/ai-involvement-tiers.md` and SKILL.md checklist line (both copies): replaced stale "as of 2024–2025" platform-disclosure claims with verified mid-2026 state — Spotify AI Credits (DDEX metadata, voluntary beta since 2026-04-16), Apple Music Transparency Tags (announced 2026-03-04, optional/self-declared), YouTube automatic AI-detection + labeling (May–June 2026), TikTok required label backed by C2PA detection; crosswalk table refreshed. Closes register row PV-07 (platform-policy portion; copyright-guidance citations left as-extracted for SME).
- `publish-shield` (bundle-versioned, PUB-000) — `references/platform-ai-policies.md`: re-dated to July 2026 and refreshed per-platform — Spotify AI Credits program (voluntary, DistroKid first partner, Believe/CD Baby/FUGA/IDOL/Amuse/Empire onboarding), Apple Music Transparency Tags four-category framework (optional, not a delivery mandate despite "required" headlines), YouTube's shift from self-disclosure to automatic detection with a single simplified label (no monetization impact), TikTok C2PA-backed auto-labeling note. Amazon Music and distributor sections verified unchanged. Closes register row PS-08.

### Notes
- Closes the A-6 R2 backlog (register rows HITL-03, PV-07, PS-08) ahead of the SME review package. All platform and legislative claims re-verified against live sources 2026-07-16; the A-6 verification doc's "Apple tags became a delivery requirement" claim did **not** verify and was not adopted. Post-merge: `npm run seed:registry` (A-9 CI goes red until reseeded — by design), confirm Gist sync ran for `publish-provenance`, and check the Pillar 1 AI Inventory artifact (four version bumps).

## Regulatory claim hotfix — EU AI Act Article 73 numbering + notification deadlines, NIST/ISO label fixes (fix/a6-hotfix)

**Branch:** `fix/a6-hotfix` (2026-07-16)

### Fixed
- **Compliance Bundle 1.4.0 → 1.5.0**
- `incident-response-logger` **1.2.0 → 1.3.0** — corrected all EU AI Act serious-incident citations from Article 62 (proposal-stage numbering) to Article 73 (Regulation (EU) 2024/1689 adopted numbering) across SKILL.md (all three copies), the plugin manifest description, both reference files, and the site MDX entry; renamed `references/article-62-thresholds.md` → `article-73-thresholds.md`. Corrected the notification deadlines to Article 73(2)–(4)'s actual tiers — 15 days (general), 10 days (death of a person), 2 days (widespread infringement or serious and irreversible critical-infrastructure disruption) — previously misstated as "15 working days (2 days for death/serious harm)".
- `ai-transparency-writer` **1.2.0 → 1.3.0** — model-card template: removed the incorrect "GOVERN 6.1 (transparency policies)" mapping (GV-6.1 concerns third-party/supply-chain risk); now cites GOVERN 1.1 and GOVERN 1.2 with their correct subcategory descriptions. Final mapping flagged for SME confirmation under A-6.
- `hitl-compliance-gate` **1.3.0 → 1.4.0** — ISO 42001 reference: corrected Annex A objective labels — A.8 now reads "Information for interested parties of AI systems" (was "Information security"); A.9 now reads "Use of AI systems" (was "Responsible AI principles").
- `iso-42001-audit-prep` **1.3.0 → 1.4.0** — Annex A reference: A.8 heading aligned to official wording "Information for interested parties of AI systems" (was the near-miss "Information for Users of AI Systems").

### Notes
- Remediates the AF-1 accuracy failures confirmed during A-6 pre-SME verification (claims register rows INC-02/INC-03, ATW-06, HITL-06; AIMS-03 backlog item closed). Companion updates to internal governance docs (EVAL-001 grader allowance removed, IR fixture expectations updated, IMP-001 S5 deadline phrasing corrected) live in local `_v2/` and are not part of this repo's diff.

## Fix guides page listing spacing (fix/guides-page-spacing)

**Branch:** `fix/guides-page-spacing` (2026-07-14)

### Fixed
- `src/pages/guides/index.astro` — corrected inconsistent spacing between the
  `drwxr-xr-x`/`-rw-r--r--` file-mode markers and the filename links in the
  `[GUIDES]` and `[ARCHIVE]` listings by adding explicit `&nbsp;` separators.

## Add metrics-api Worker for live Cloudflare monitoring (feat/metrics-api)

**Branch:** `feat/metrics-api` (2026-07-14)

Adds a third standalone Worker, `workers/metrics-api/` (`metrics.quirgs.com`),
so a Cowork artifact (`quirgs-cloudflare-metrics`) can display zone traffic,
security/firewall events, AI-crawler traffic to `/skills*` and `/guides/*`,
and registry-api/hitl-gate health — without ever putting a full-scope
Cloudflare API token client-side. The Worker holds a read-only,
Analytics/Firewall/Workers-scoped `CF_API_TOKEN` as a secret and proxies to
Cloudflare's GraphQL Analytics API; callers authenticate with a separate,
low-value `METRICS_READ_TOKEN`. D1/KV/R2 storage metrics are read directly by
the artifact via the Cloudflare connector's existing MCP tools — no proxy
needed there.

Cowork artifacts cannot make outbound `fetch()` calls to external domains
(sandbox restriction, not CORS), so the artifact doesn't call this Worker
directly — a daily scheduled task (`quirgs-cloudflare-metrics-refresh`, 6:08
AM local) calls it from a real shell and bakes the result into the artifact's
HTML via `update_artifact`. A manual "Refresh Now" button in the artifact
triggers the same task on demand.

### Added
- `workers/metrics-api/index.js` — `GET /traffic`, `/security`, `/ai-bots`,
  `/workers`, `/health`. `/ai-bots` classifies `/skills*` + `/guides/*` traffic
  against a known AI-crawler user-agent list (GPTBot, ClaudeBot, PerplexityBot,
  CCBot, Google-Extended, etc.) and returns matched bots plus top unmatched
  agents so the list can be extended. All authenticated routes accept
  `?hours=` (default 24, max 168).
- `workers/metrics-api/wrangler.toml`, `.dev.vars`, `vitest.config.js`,
  `test/index.spec.js` — 16 tests covering routing, auth, CORS, and the
  misconfiguration guard (GraphQL-dependent routes need live Cloudflare
  credentials and are verified manually via `wrangler dev`, not in the suite).
- `npm run test:metrics` script; `npm test` now runs all three Worker suites
  (83 tests total).

### Changed
- `README.md` — Stack table, repo tree, "Backend workers" section, and Tests
  section updated for the third Worker.
- `CLAUDE.md` — "three deploy units" framing, Workers-are-independent list,
  and the stale "no test scripts" line corrected.

### Fixed (after first live run, 2026-07-14)
- `/traffic` — dropped `uniq { uniques }`; not a valid field on
  `httpRequestsAdaptiveGroups`. /traffic no longer reports unique visitors.
- `/workers` — dataset is `workersInvocationsAdaptive`, not
  `workersInvocationsAdaptiveGroups` (the latter doesn't exist).
- `metrics.quirgs.com` had to be added to the zone's existing Super Bot Fight
  Mode WAF skip rule (the one already covering `api.quirgs.com`/
  `gate.quirgs.com`) — without it, non-browser callers (curl, the scheduled
  task) get Managed-Challenged before reaching the Worker. Dashboard-only
  change, not in this diff.

### Added (same session, after first live run)
- `/traffic` — top-15 requested-paths breakdown (`topPaths`).
- `/workers` — now also reports the main site Worker (`quirgs`), alongside
  `registry-api` and `hitl-gate`.
- AI-bot user-agent list expanded from a screenshot of Cloudflare's own
  bot-traffic dashboard: `Applebot`, `Claude-User`, `Claude-SearchBot`,
  `DuckAssistBot`, `FacebookBot`, `MistralAI-User`, `Googlebot`,
  `Google-CloudVertexBot`.
- Artifact: new "Worth Checking" panel (operational anomalies only — 5xx
  spikes, 401 spikes, low cache-hit-ratio, Worker errors, CPU tail latency,
  day-over-day traffic/5xx swings via a `history` array the scheduled task
  now maintains, capped at 14 entries). Deliberately excludes security/threat
  signals, which Cloudflare's own notifications already cover.
- Artifact: sampling-caveat footnote, added after `httpRequestsAdaptiveGroups`
  produced a phantom 2,058-count "504" spike absent from Cloudflare's own
  dashboard for the same window (root cause: Adaptive datasets are sampled/
  extrapolated, unreliable for rare events on a low-traffic hostname).
- Removed the "Unique visitors" card — not available on this dataset
  (`uniq` isn't a real field; see Fixed above). Page views/unique visitors
  would require Cloudflare Web Analytics (a separate RUM/beacon product with
  its own site token), deliberately not pursued — confirm with the user
  first if that's wanted later.

### Security (dashboard-only, not in this diff)
- Tightened the zone's Super Bot Fight Mode WAF skip rule for
  `metrics.quirgs.com`: previously an unconditional hostname skip (matching
  `api.quirgs.com`/`gate.quirgs.com`), now requires the request's
  `Authorization` header to match the real `METRICS_READ_TOKEN` value.
  Triggered by 206 `.env`-file-scanning 401s in 24h — confirmed via a
  Cloudflare Traffic report filtered to 401s to be routine Certificate-
  Transparency-driven background scanning, not a targeted attack, but the
  user wanted the noise filtered at the edge rather than reaching the
  Worker's own auth check. `api.quirgs.com`/`gate.quirgs.com` keep their
  unconditional skip (legitimate unauthenticated traffic on those hosts).
  Rotating `METRICS_READ_TOKEN` requires updating this rule's literal token
  value by hand — not automated.

`httpRequestsAdaptiveGroups` and `firewallEventsAdaptiveGroups` field names
verified correct against live production data — no further changes needed
there.

## Align landing page with HITL Gate outreach campaign (feat/landing-gate-feature)

**Branch:** `feat/landing-gate-feature` (2026-07-13)

Realigns the landing page's "Featuring" content and primary navigation
with the "Dev validation program" outreach campaign (see README.md
"Dev validation program — early access"), which pitches the HITL Gate
rather than the guides archive.

### Changed
- `src/pages/index.astro` — boot-sequence "Featuring" block: replaced the
  `[GUIDES]` line with a `[CASE STUDY]` line citing the Case Study Zero
  stress-test result (25/25 checks, ~10s to first approval), linking to
  `/resources/case-study-zero/`. `[BUNDLE]` line unchanged.
- `src/data/routes.ts` — NavBlock primary row now surfaces `demo/` (dropped
  `bundles/` and `gate/` from the compact row); moved `hitl/` into the
  `resources` group for consistency with `demo/`/`gate/`/`review/`; moved
  the `/resources/` case-studies route into the `docs` group so its
  section header in the `[≡]` site menu no longer duplicates its own
  label (`resources` group containing a `resources/` entry).
- `public/_headers` — recomputed the CSP `script-src` hash for the
  landing terminal boot script (bundled bytes changed with the copy
  update above); the other 6 pinned hashes are unchanged.

## Add real Open Graph / Twitter card images ahead of outreach (feat/og-images)

**Branch:** `feat/og-images` (2026-07-13)

`src/components/Seo.astro` previously pointed `og:image`/`twitter:image` at
`favicon.svg` — a poor social-preview asset, and SVG isn't reliably rendered
by Facebook/Twitter/LinkedIn/Slack crawlers anyway.

### Added
- `public/og-image.png` (1200x630) and `public/og-image-square.png`
  (1080x1080) — the standard landscape OG size plus a square fallback for
  clients that prefer it.

### Changed
- `src/components/Seo.astro` — `og:image` now emits both the landscape and
  square PNGs (OG spec allows repeated `og:image` blocks; each carries its
  own `og:image:width`/`height`/`type`/`alt`). `twitter:card` upgraded from
  `summary` to `summary_large_image` to match the landscape asset.
  `twitter:image` now points at the landscape PNG.

Note: Cloudflare Hotlink Protection (enabled 2026-07-13) only blocks image
requests whose `Referer` is a *different* domain — requests with no
`Referer` (how Facebook/Twitter/Slack/LinkedIn crawlers typically fetch
`og:image`) are allowed through, so this should not block social previews.
Worth spot-checking with each platform's card-debugger tool after the
Cloudflare branch preview goes live.

## Close remaining brand style-guide UI audit findings (fix/ui-audit-cleanup-round2)

**Branch:** `fix/ui-audit-cleanup-round2` (2026-07-10)

Closes the 3 findings left open after the round-2 extended audit (see
`fix/ui-audit-cleanup`, PR #16, 2026-05-25, and the round-2 additions):
the dead `slug` frontmatter, the `guides-v2.css` font-mono ordering, and
the undocumented `--purple` token.

### Removed
- `src/content/skills/*.mdx` (all 15 files) — removed the redundant
  `slug: "..."` frontmatter line. The `slug` field is optional in
  `content.config.ts`/`keystatic.config.ts` (required there only so
  Keystatic's `slugField: 'slug'` mechanism has a field to bind to — see
  `CLAUDE.md`), but the value itself is never read by any template
  (canonical slug is `entry.id`) and Keystatic strips it from frontmatter
  on every save regardless. Schema fields are unchanged — do not
  re-require `slug`, per the existing `content.config.ts` comment.
- `public/css/guides-v2.css` — removed the unused `--purple: #a78bfa`
  custom property. Confirmed zero references anywhere in `public/`.

### Changed
- `public/css/guides-v2.css` — `--font-mono` now leads with
  `'JetBrains Mono'` (matching the terminal UI's primary mono face in
  `src/layouts/BaseLayout.astro`), falling back to the previous
  `'Fira Code'` and the rest of the original stack. Neither face is
  loaded via a web font import today, so both currently render as system
  monospace — this only matters once a font import is added.

## Move /review/ into the resources group in the site menu (fix/sitemenu-review-in-resources)

**Branch:** `fix/sitemenu-review-in-resources` (2026-07-10)

- `/review/` was grouped under `site` in [src/data/routes.ts](src/data/routes.ts),
  landing it in the sitemap overlay ([SiteMenu.astro](src/components/SiteMenu.astro))
  next to `/support/`, `/privacy/`, and `/terms/` instead of its fellow HITL Gate
  pages. Regrouped it under `resources`, alongside `/gate/` and `/demo/`. README
  `Routes` table row order updated to match.

## Add dev validation program early-access section to README (feat/readme-dev-program)

**Branch:** `feat/readme-dev-program` (2026-07-09)

- New `## Dev validation program — early access` README section after the
  install instructions: the 25/25 stress-test result and measured ~10s
  integration test (both traced to Case Study Zero), the three recruitment
  scenarios (compliance sign-off · publish gate · incident escalation),
  program terms, and entry points (`/gate/` or a repo issue). Phase 4
  checkpoint 6 outreach deliverable, copy HITL-approved 2026-07-09. No
  plugin/bundle version changes.

## Sync README with hitl-gate email notification and current test counts (docs/readme-email-notify-tests)

**Branch:** `docs/readme-email-notify-tests` (2026-07-09)

- `README.md` backend-workers section still described the hitl-gate Worker's
  outbound notification as webhook-only; documented the email notification
  path added in PR #128 (`EMAIL` send_email binding → `GATE_NOTIFY_TO`, sent
  from `notify.quirgs.com`, CRLF-stripped fields, additive to `WEBHOOK_URL`).
- Updated the Vitest counts (61 → 67: 15 registry-api + 52 hitl-gate) to
  include the email-notification suite added in PR #128.
- Docs-only — no code, site, or Worker changes.

## Fix mobile text wrapping in terminal `.line` blocks (fix/line-prewrap-mobile-wrap)

**Branch:** `fix/line-prewrap-mobile-wrap` (2026-07-09)

- `src/layouts/BaseLayout.astro`: removed `white-space: pre-wrap` from the
  `.line` class. It's a CSS-inherited property, so any prose sitting inside a
  `.line` div (directly or via a nested `<p>`) preserved the literal newline
  characters from the `.astro` source file's line-wrapping as forced line
  breaks — correct-looking on wide desktop viewports, ragged and
  mid-sentence-broken on mobile. Affected `/gate/` (RESUMPTION block) and
  `/hitl/` (WHO IT'S FOR / RUN YOUR OWN GATE list items). No markup changes
  needed — text now reflows normally per viewport width.

## Add Case Study Zero — Phase 4 production stress test writeup (feat/case-study-zero)

**Branch:** `feat/case-study-zero` (2026-07-09)

- New `/resources/case-study-zero/` page: publishes the full Phase 4
  production stress test — Track A (14/14, full HITL gate loop) and Track B
  (11/11, dev onboarding funnel), both run against live production
  (`quirgs.com`, `gate.quirgs.com`), not staging. Source data:
  `PHASE4-trackA-results-2026-07-07.md`, `PHASE4-trackB-results-2026-07-09.md`.
- Covers the measured `/hitl/` 90-second integration test (~10s to first
  successful POST) and the three real issues found and fixed during the
  run: missing `checkpoint_summary` on `/review/` (+ stored-XSS hardening,
  PR #127), the notification gap after the test webhook expired (email
  notification via Cloudflare Email Service, PR #128), and a WCAG AA
  color-contrast failure across the funnel (PR #129).
- Added to the `/resources/` index and cross-linked from `/gate/`'s early-
  access section.
- `/gate/`'s "HOW IT WORKS" list ended at "Agent reads the decision and
  proceeds" — reads as automatic resumption, but the actual mechanism is
  conversational (the agent's turn ends after posting; a human relays the
  reviewer's decision back to resume it — no polling, no webhook-to-agent
  callback today). Added a `[RESUMPTION]` callout clarifying this, linked to
  `/hitl/`'s already-precise "WIRE IT TO AN AGENT" six-step breakdown (added
  an anchor id there to support the deep link).

## Fix low-contrast text in shared nav/menu/footer components (feat/a11y-funnel-contrast)

**Branch:** `feat/a11y-funnel-contrast` (2026-07-09)

- Fixes a Track B stress-test finding (`PHASE4-trackB-results-2026-07-09.md`,
  Lighthouse accessibility 95/100 on `/gate/`, `/hitl/`, `/demo/`): several
  shared components used a hardcoded `#71717a` for real, meaningful text
  (`NavBlock.astro` tab-key hint and `[+N more]` trigger, `HelpModal.astro`
  title/close button, `SiteMenu.astro` title/close button/route descriptions)
  — 4.12:1 / 3.67:1 contrast against the theme's two backgrounds, both below
  the WCAG AA 4.5:1 body-text bar. Swapped to the existing `--text-main`
  design token (`#a1a1aa`, 6.91:1–7.76:1) instead of introducing a new color.
- A second hardcoded gray, `#3f3f46` (`Footer.astro` `.footer-sep` middle-dot
  separators, `SiteMenu.astro` `.menu-branch` ASCII tree-drawing connectors),
  failed far worse (1.91:1 / 1.70:1) but is purely decorative glyphs with no
  semantic content — marked `aria-hidden="true"` on those spans instead of
  recoloring, preserving the intentionally faint tree-diagram aesthetic.
- No inline `<script>` bytes touched — CSS/markup only — so the CSP hashes
  pinned in `public/_headers` are unaffected.

## Add email notification to HITL Gate Worker via Cloudflare Email Service (feat/hitl-gate-email-notify)

**Branch:** `feat/hitl-gate-email-notify` (2026-07-09)

- HITL Gate Worker now sends an email notification on every successful `POST /events`, via Cloudflare Email Service. Configurable via the `EMAIL` send_email binding and `GATE_NOTIFY_TO` secret/var.
- Sent from a dedicated `notify.quirgs.com` subdomain — scoped DNS records only, apex `quirgs.com` null-mail hardening unaffected.
- Additive to the existing `WEBHOOK_URL` path, not a replacement. Non-blocking; email errors do not affect event creation.
- Added comprehensive Vitest test coverage for the email notification path.
- Updated `quirgs.com/security/` documentation to reflect the new isolated subdomain configuration.

## Surface checkpoint_summary on /review/ and harden card rendering (feat/review-checkpoint-summary)

**Branch:** `feat/review-checkpoint-summary` (2026-07-08)

- Fixes a Track A stress-test observation (`PHASE4-trackA-results-2026-07-07.md`,
  Obs-2): the `/review/` queue card showed type/item/stage/frameworks/received
  but not `payload.checkpoint_summary` — the mandatory sign-off questions a
  reviewer is supposed to read before approving or rejecting. It rendered only
  in the full-payload view (e.g. the maintenance artifact), not on the card a
  reviewer actually acts from. Added a `Sign-off:` row that renders
  `checkpoint_summary` when present, preserving line breaks for its typical
  multi-line GOVERN/MAP/MEASURE/MANAGE format.
- **Hardening while in the file:** `public/js/review.js` interpolated
  `event.type`, `payload.item`, `payload.stage`, `payload.frameworks`, and the
  formatted date directly into `innerHTML` with no escaping. Since any caller
  holding the write token can POST arbitrary payload text (including through
  `hitl-compliance-gate`'s Step 3.5, or direct curl), this was a stored-XSS
  surface scoped to the `/review/` page itself. Added an `escapeHtml()` helper
  and applied it to every interpolated field, including the new
  `checkpoint_summary` row.
- No Worker (`workers/hitl-gate/index.js`) or D1 schema change — read-side
  fix only, uses data already returned by `GET /events`.

## Close direct-D1 admin bypass on hitl-gate (feat/hitl-gate-maintenance-artifact-cors)

**Branch:** `feat/hitl-gate-maintenance-artifact-cors` (2026-07-08)

- Closes risk R-012 on the AI Risk Register: `quirgs-site-maintenance` (Cowork
  ops dashboard, not in this repo) was writing `quirgs-hitl-db` directly via
  the Cloudflare MCP D1 tool to approve/reject HITL events, bypassing this
  Worker's `PATCH /events/:id` auth check, `pending`-only state guard, and
  webhook fire entirely.
- **Attempted fix (reverted same day):** widened `ALLOWED_ORIGINS` to admit
  `cowork-artifact://local` and then `null`, intending to rebuild the artifact
  to call this Worker's authenticated API via `fetch()` instead. Deployed and
  verified server-side correct (direct curl preflight matched), but the
  artifact still failed with "Failed to fetch." A live diagnostic (fetching a
  wildcard-CORS external test site from the same artifact) confirmed the
  actual cause: Cowork artifacts cannot make outbound `fetch()` calls to any
  external domain — not a CORS problem, so no `ALLOWED_ORIGINS` value could
  have fixed it. `ALLOWED_ORIGINS` reverted to its original value; no benefit
  to keeping it widened.
- **Actual fix:** `quirgs-site-maintenance` rebuilt to read `quirgs-hitl-db`
  read-only via the Cloudflare MCP D1 tool (non-mutating, so no state-machine
  bypass) and removed its Approve/Reject buttons entirely. HITL actions now
  happen exclusively at `quirgs.com/review/`, a real browser page that already
  calls this Worker's authenticated `PATCH /events/:id` correctly (PR #70).
- No Worker deploy required for the final state — `ALLOWED_ORIGINS` is back to
  what was already live in production before this branch.

## Add Agent Skills Discovery index and RFC 9727 API catalog (feat/agent-ready-op5-op10)

**Branch:** `feat/agent-ready-op5-op10` (2026-07-08)

- Added `/.well-known/agent-skills/index.json` (Agent Skills Discovery RFC
  v0.2.0) — closes OP-10 from the Cloudflare Agent Ready audit. Generated at
  Astro build time (`src/pages/.well-known/agent-skills/index.json.ts` and
  `[slug]/SKILL.md.ts`) directly from `skills/*/SKILL.md` via
  `import.meta.glob`, so the `sha256:` digest of each entry can never drift
  from the self-hosted `SKILL.md` copy it describes — no new file to keep
  in lockstep.
- Added `/.well-known/api-catalog` (RFC 9727, `application/linkset+json`)
  covering `api.quirgs.com` and `gate.quirgs.com` — closes OP-05.

## Add agent-discovery Link headers and Content Signals (feat/agent-ready-link-content-signal)

**Branch:** `feat/agent-ready-link-content-signal` (2026-07-07)

- Added `Link` response headers on the homepage (`public/_headers`) pointing
  agents at the ARD catalog (`rel="api-catalog"`) and `/llms.txt`
  (`rel="service-doc"`), per RFC 8288 — closes OP-01 from the Cloudflare
  Agent Ready audit (`_v2/results/cf-agent-ready-results-2026-07-04.md`).
- Added a `Content-Signal` line to `public/robots.txt` declaring
  `search=yes, ai-input=yes, ai-train=no` — closes OP-04 from the same audit.

## Update /gate/ positioning to Gödel/NIST framing (feat/gate-godel-messaging)

**Branch:** `feat/gate-godel-messaging` (2026-07-07)

- Replaced the `/gate/` page hook with "Static guardrails are provably
  insufficient," backed by a new "WHY STATIC GUARDRAILS FAIL" section citing
  Gödel's incompleteness theorems and the NIST AI RMF pivot to continuous
  runtime oversight. "Skills teach governance. The gate enforces it." is
  retained as a secondary line.
- Added a link to the "Risk Profile case study" under the demo link in the
  footer link list.

## Add "The Quirgs AI Risk Profile" self-assessment case study (feat/ai-risk-profile-case-study)

**Branch:** `feat/ai-risk-profile-case-study` — PR #121 (2026-07-08)

Public-facing case study distilling the internal AI Risk Profile self-
assessment (`_v2/governance/`, local-only) into a summary resource: the
NIST AI RMF / EU AI Act / ISO 42001 governance assessment, and both
skill-validation eval waves (compliance bundle Wave 1, publish bundle
Wave 2 — 15 skills, 2 bundles, 88 fixtures total). Highlights the
blocked-release fix that failed its first re-verification and only held
after a second, independently-verified round, and a model-drift finding
from re-running the NIST checkpoint skill under a newer Claude model.
Internal methodology detail (contamination rules, PR numbers, file paths,
model version names) intentionally abstracted out — public version states
the findings and the process, not the internal plumbing.

### Added
- `src/pages/resources/ai-risk-profile-case-study.astro` — new case-study
  page, terminal-UI styling matching `publish-bundle-stress-test.astro`'s
  conventions.

### Changed
- `src/pages/resources/index.astro` — registered the new case study in the
  `caseStudies` listing (newest-first sort).

## Fix Wave 2 refix-verify findings: Blocked-gate hedge, disclaimer reliability (fix/publish-refix-round2)

**Branch:** `fix/publish-refix-round2` — PR #120 (2026-07-08)

A clean-room refix-verify of PRs #118/#119 (`evals/runs/2026-07-08-wave2-refix-verify.md`)
confirmed 7 of 9 targeted checks now hold — including the voice-clone-override
fix (the eval's own top-priority check) and the harvest dormancy gate. Three
findings remained open, fixed here.

### publish-workflow — Blocked-gate hedge, still failing after round 1

PR #119's fix added an exception clause for "genuine per-platform breakdowns,"
which turned out to give the model room to construct its own per-platform
reading from the user's phrasing alone (e.g., "one platform requires action")
and float a partial-distribution suggestion anyway — the exact defect PR #119
was meant to close. Fixed by removing the interpretive exception entirely:
the options list for a Blocked release now contains exactly one item
(resolve, then re-run publish-shield), and per-platform statuses may only be
reflected if publish-shield's actual report is quoted verbatim in context —
never inferred from a description.

### publish-license — AF-2 still failing on all 5 fixtures

PR #118's Standing Disclaimer section (a standalone instruction) did not
reliably fire on the two per-agent output templates (Brief Decode, Catalog
Match Results) where it mattered most — including on L-01/L-02's terminal
hard-stop rulings. Fixed by moving the disclaimer line directly into both
templates, matching the pattern PR #119 already used for
`publish-broadcast`/`publish-harvest`. Also added an explicit `EXCLUDED`
section to the Catalog Match Results template and a new Key Principle
codifying the clearance/voice-clone hard-stop rule — that behavior was
already working but had never been stated explicitly, the same
undocumented-emergent-behavior risk found in the tier-override defect.

### publish-broadcast — newly-surfaced AF-2 gap on DDEX-only output

Not targeted by PR #119, but the refix-verify found the DDEX ERN Packet
template (Step 3, used when no PRO registration is requested) has never
carried a disclaimer — a pre-existing gap, not a regression. Fixed with the
same template-level reinforcement pattern.

### Changed
- `skills/publish-workflow/SKILL.md` + plugin copy — Blocked-gate rule
  rewritten: single-option response, no inferred per-platform exceptions.
- `skills/publish-license/SKILL.md` + plugin copy — disclaimer line added to
  both Agent 1/Agent 2 templates; `EXCLUDED` section added to Catalog Match
  Results; new Key Principle on the clearance/voice-clone hard stop.
- `skills/publish-broadcast/SKILL.md` + plugin copy — disclaimer line added
  to the DDEX ERN Packet template.
- `plugins/quirgs-publish/.claude-plugin/plugin.json` — version 1.3.0 → 1.4.0.

All 3 touched skills verified byte-identical across copies post-fix.

### Not yet done

Per the eval plan, needs another clean-room re-run + re-grade before R-011
can be re-rated — separate fresh session, this session read the refix-verify
findings and is contaminated for verification.

## Fix Wave 2 substance defects: tier-override, Blocked-gate, field validation, dormancy gate (fix/publish-substance-defects)

**Branch:** `fix/publish-substance-defects` — PR #119 (2026-07-07)

Follow-up to `fix/publish-af2-disclaimer` (PR #118): the same Wave 2 eval run
(governance risk R-011) found four genuine substance-level defects beyond the
AF-2 disclaimer gap. This branch fixes all four plus resolves a pre-existing
lockstep drift discovered while investigating the first one.

### publish-provenance / publish-shield — voice-clone tier-override miscalculation

The eval's own top-priority check: an unauthorized voice clone of a real
person must force AI Involvement Tier 4 regardless of any other factor. Both
skills correctly identified the legal red flag in prose but computed the wrong
numeric tier. Root cause: `publish-provenance/references/ai-tool-tier-map.md`
states the override rule clearly — twice — but the ElevenLabs table row shows
"Default tier: 2" prominently, with the override condition in an adjacent
column and the strongest statement of the hard rule below the entire table. A
model doing a quick lookup can land on "2" before reaching the override
language.

Also discovered while investigating: `publish-provenance` and `publish-shield`
were already out of lockstep between their `skills/` and
`plugins/quirgs-publish/skills/` copies (unrelated to AF-2) — the bundle copy
referenced the external tier-map file; the `skills/` Gist-sync copy still had
an older inline table. Resolved as part of this fix.

#### Changed
- `plugins/quirgs-publish/skills/publish-provenance/references/ai-tool-tier-map.md`
  — added a mandatory "Step 0" voice-clone override gate at the top of the
  file, checked before any table lookup; added inline reinforcement at the
  ElevenLabs/voice-cloning table rows; restated the hard rule at point of use.
- `skills/publish-provenance/SKILL.md` + plugin copy — Step 3 now explicitly
  instructs doing Step 0 first, before any per-tool tier lookup.
- `skills/publish-shield/SKILL.md` + plugin copy — Step A1 same instruction;
  also resolves the lockstep drift (both copies now reference the external
  tier map with identical instruction text — the `skills/` copy previously
  carried the old inline table).

### publish-workflow — Blocked-gate partial-distribution hedge

W-02 (the fixture's own "highest stakes" case): the orchestrator's own quoted
rule says a Blocked publish-shield status "stops the release. Period," but the
model floated a hedged partial-distribution workaround anyway. Fixed by
making the rule explicit: no partial/conditional distribution path may be
suggested on the orchestrator's own initiative; the only exception is
reflecting a genuine per-platform breakdown publish-shield's own report
already stated. A non-platform-specific block (e.g., an uncleared sample)
holds the entire release.

### publish-broadcast — field-validation gaps

Two field-validation misses (B-01, B-03) were investigated against the raw
outputs. B-03 is a genuine defect: P-line/C-line are correctly listed as
required in `references/ddex-ern-fields.md`, but Step 3's validation
instruction was too generic to reliably surface them as blocking — fixed by
enumerating the release- and track-level required fields explicitly at the
point of validation. **B-01 is likely a fixture-design issue, not a skill
defect** — the skill's own SUBMISSION STATUS template only gates readiness on
IPI and ISWC; the model's caution about missing territory/linked-recording
data is a reasonable extension beyond the skill's own defined checklist, not
clearly wrong. Flagged for owner/A-6 review rather than "fixed."

### publish-harvest — Tier D dormancy gate

H-04: the fixture built specifically to test "a single quarter of $0 ≠
automatically Dormant" got exactly that wrong, despite the same run correctly
asking for missing data on sibling fixtures. Fixed by making the 2+-
consecutive-quarter requirement explicit and adding a fallback: without
confirmed prior-period history, a $0 track goes to Tier C (Underperformer)
with dormancy explicitly noted as unconfirmed, not silently Tier D.

### Other

- `plugins/quirgs-publish/.claude-plugin/plugin.json` — version 1.2.0 → 1.3.0.
- All 5 touched skills verified byte-identical between `skills/` and
  `plugins/quirgs-publish/skills/` copies post-fix.

### Not yet done

Per the eval plan, these fixes need clean-room re-run + re-grade before R-011
can be re-rated — scoped as a separate session (this session authored/read the
Wave 2 reference answers and grading, so it's contaminated for verification).
Owner ruling already made (2026-07-06): publish-shield's S-03 tier-label
consistency question — label required, not just the right practical outcome.

## Propagate standing-disclaimer requirement to the publish bundle (fix/publish-af2-disclaimer)

**Branch:** `fix/publish-af2-disclaimer` — PR #118 (2026-07-07)

Wave 2 of the skill-validation eval (governance risk R-011) graded the
`quirgs-publish` bundle for the first time and found 6 of 8 skills missing
their advisory disclaimer on non-terminal turns (clarifying questions, hard-stop
decisions, partial answers) — the same AF-2 gap Wave 1 found and fixed for the
compliance bundle in `fix/af2-standing-disclaimer` (PR #111, "standing
disclaimer on every turn"). That fix was never propagated to the publish
bundle when it shipped. `publish-license` was the worst case: it had **no**
advisory-notice block anywhere in its templates, missing on all 5 graded
fixtures including full terminal hard-stop rulings.

This is a text-only propagation of an already-approved fix, not a new policy
decision. Substance-level defects the same eval run surfaced (publish-provenance's
voice-clone-tier-override miscalculation, publish-workflow's Blocked-gate hedge,
publish-broadcast's field-validation misses, publish-harvest's dormancy-gate
miss) are tracked separately and NOT addressed in this branch — those need
individual skill-logic fixes, scoped as a dedicated follow-up.

### Changed
- `skills/{publish-income,publish-broadcast,publish-provenance,publish-shield,
  publish-harvest,publish-license}/SKILL.md` and their
  `plugins/quirgs-publish/skills/<same>/SKILL.md` counterparts — added a
  "Standing Disclaimer" section (Wave 1 PR #111 wording pattern, adapted per
  skill's domain) requiring the short-form advisory line on every non-terminal
  response.
- `skills/publish-license/SKILL.md` (+ plugin copy) — additionally added a full
  boxed ADVISORY NOTICE to the Step 3b Final Pitch Document output, matching
  the convention already used by the other 7 skills (this skill previously had
  no notice block at all).
- `plugins/quirgs-publish/.claude-plugin/plugin.json` — version 1.1.0 → 1.2.0.

### Notes
- `publish-update` and `publish-workflow` were not touched: `publish-update`
  graded PASS outright; `publish-workflow`'s AF-2 is explicitly scoped out of
  routing-only turns by its own fixture header and was clean in the Wave 2 grade.
- A pre-existing, unrelated lockstep drift was found (not fixed here) between
  `publish-provenance`/`publish-shield`'s two copies — the bundle copy
  references an external `references/ai-tool-tier-map.md` file for AI-tool
  tier lookups; the `skills/` Gist-sync copy still has the older inline table.
  Left untouched pending the Track 2 substance fix, which will resolve both
  the voice-clone-override defect and this lockstep gap together.

## Link every skill to SECURITY.md — output-proximate issue reporting (feat/a8-skill-report-links)

**Branch:** `feat/a8-skill-report-links` — PR #117 (2026-07-06)

Governance action A-8 (user feedback/error channel), step 2 of 2 — closes A-8.
Every published skill now carries a **Reporting Issues** section pointing to
`SECURITY.md` (the skill-output-issue lane from step 1 / PR #115), and instructs
that every full formatted report end with a one-line report-an-issue pointer —
the output-proximate report path IRP-001 §3 named as the gap. Applied in
lockstep to all copies of all 15 skills (7 compliance × 3 copies + 8 publish
× 2 copies = 37 `SKILL.md` files), block verified byte-identical via per-block
hash. Note for eval grading (EVAL-001 AF-4): the required output format now
includes this trailing line on full reports.

### Changed
- All 37 `SKILL.md` copies — appended the uniform **Reporting Issues** section.
- Plugin version bumps (registry reseed required post-merge):
  `ai-transparency-writer` 1.1.0 → 1.2.0, `eu-ai-act-classifier` 1.2.0 → 1.3.0,
  `hitl-compliance-gate` 1.2.0 → 1.3.0, `incident-response-logger` 1.1.0 → 1.2.0,
  `iso-42001-audit-prep` 1.2.0 → 1.3.0, `nist-ai-rmf-checkpoint` 1.1.0 → 1.2.0,
  `pii-exposure-checker` 1.1.0 → 1.2.0, `quirgs-compliance` bundle 1.3.0 → 1.4.0,
  `quirgs-publish` bundle 1.0.0 → 1.1.0.

## Add SECURITY.md — two-lane reporting policy (feat/security-md)

**Branch:** `feat/security-md` — PR #115 (2026-07-06)

Governance action A-8 (user feedback/error channel), step 1 of 2: the repo gains
a root `SECURITY.md` (surfaced in GitHub's Security tab) that routes reports down
two lanes — Lane A, security vulnerabilities → the private advisory form (same
canonical contact as `/.well-known/security.txt`); Lane B, **skill-output
issues** (wrong tier/clause, invented obligation, stale guidance) → regular
GitHub Issues (structured issue form), feeding the internal AI incident
playbook's severity triage. The Lane B "what happens to your report" promises
follow the approved playbook (immediate pull on confirmed harm; prompt
fix-or-pull on wrong regulatory substance — the internal clock stays 48h per
IRP-001, stated publicly as "promptly" per owner decision; CHANGELOG entry for
every fix; clean-room re-verification before re-publish). Step 2 (linking every
skill to this doc — the 3-copy lockstep edit + version bumps + registry reseed)
is a separate planned session.

### Added
- `SECURITY.md` — two-lane policy: vulnerability disclosure (advisories) +
  skill-output issue reporting (issue form → incident triage); supported-versions
  note; posture pointer to quirgs.com/security.
- `.github/ISSUE_TEMPLATE/skill-output-issue.yml` — structured form for Lane B
  (skill+version, install method, run context, input summary with a no-personal-
  data caution, why-wrong with citation prompt); labels reports
  `skill-output-issue`.

## Release workflow — changelog roll-up + README sync (feat/changelog-release-workflow)

**Branch:** `feat/changelog-release-workflow` (2026-07-06)

Phase B of the release & versioning plan: the repo adopts CalVer releases
(`YYYY.MM`) for the site/repo with monthly roll-ups of this changelog,
alongside the existing plugin/bundle SemVer. Also brings the README current —
it was last synced 2026-06-25 and predated the version-derivation, custom
domains, hitl-gate hardening/retention, and live-integrity CI work.
Documentation only — no code changes.

### Changed
- `CHANGELOG.md` — header retitled from "Quirgs V2 Build" and now documents
  the release roll-up workflow: entries accumulate under `## [Unreleased]`,
  are retitled to `## [YYYY.MM] — date` at monthly release time, and the merge
  commit is tagged with a GitHub Release published from it. Historical entries
  unchanged.
- `README.md` — release/versioning: "Working in this repo" documents the
  versioning model (CalVer site releases, SemVer plugins/bundles) and the
  changelog `[Unreleased]` convention; "Related" links the GitHub Releases feed.
- `README.md` — staleness sync: content model no longer claims a `version`
  frontmatter field (derived at build time from plugin manifests since
  #105/#106); skill-update checklists cover the three hand-maintained skill
  copies, plugin-manifest version bumps, and the post-merge
  `npm run seed:registry` step; workers section reflects custom domains
  (`api.quirgs.com`/`gate.quirgs.com`), full Bearer auth incl. reads,
  `/health`, pagination, migrations, and the 30-day archive / 60-day delete
  retention cron; CI section documents `live-integrity.yml` alongside
  `sync-gists.yml` (no longer "the only workflow"); repository layout adds
  `src/data/`, `scripts/`, `Seo.astro`/`SiteMenu.astro`, `llms.txt`,
  `provenance.json`, `_redirects`; landing-page route description no longer
  says it lists the seven skills; test count corrected 39 → 61.

## Live published-metadata integrity CI (feat/live-integrity-check)

**Branch:** `feat/live-integrity-check` (2026-07-05)

Closes governance action A-9 (MS-2.8 / MS-4.2): the build-time version
derivation (#105/#106) guaranteed the *build* can't drift from the plugin
manifests, but nothing verified the LIVE surfaces post-deploy. Now CI does.

### Added
- `scripts/check-live-integrity.mjs` — asserts (A) every `api.quirgs.com/skills`
  registry entry matches the seeder's canonical 11-field entries, (B) each live
  skill page's version badge matches its plugin manifest, and (C) the bundles
  page's `quirgs-compliance`/`quirgs-publish` versions match the bundle
  manifests. Targets the site's workers.dev host (same deployed Worker) because
  quirgs.com serves CI clients a bot challenge. Run locally:
  `npm run check:integrity`.
- `.github/workflows/live-integrity.yml` — runs the check on push to `main`
  (with ~10 min of retries to absorb Cloudflare deploy lag), on a daily cron
  (drift catch), and on manual dispatch.
- `scripts/lib/registry-entries.mjs` — canonical registry-entry builder,
  extracted from `seed-registry.mjs` and shared with the checker so the check
  always compares against exactly what the seeder writes.

### Changed
- `scripts/seed-registry.mjs` — now imports the shared entry builder;
  behavior unchanged (verified with `--dry-run`).

## Fix eu-ai-act-classifier's Art. 5 role-question reflex (fix/eu-03-art5-role-reflex)

**Branch:** `fix/eu-03-art5-role-reflex` (2026-07-04)

Wave 1 eval grading (`_v2/governance/evals/runs/2026-07-04-wave1-graded-record.md`,
EU-03 fixture) found the skill never reached a PROHIBITED classification for a
clear Article 5 social-scoring case — it asked for role and EU scope and stopped.
Role is legally irrelevant to a prohibited-practice determination (Art. 5 bans the
practice for every actor in the value chain); this was a template reflex from
Step 1's blanket "ask before classifying" rule, not correct reasoning.

### Changed
- `eu-ai-act-classifier` (standalone + `quirgs-compliance` bundle, all 3 SKILL.md
  copies) — Step 1 now gates classification on EU scope only; role is deferred to
  Step 4 (obligations) and no longer blocks a tier call. Step 2b states explicitly
  that Article 5 checks are role-irrelevant. Step 4 adds a PROHIBITED branch
  (parallel to OUT OF SCOPE) that skips the obligations checklist.
- EU-03 fixture (`_v2/governance/stubs/fixtures/eu-ai-act-classifier-fixtures.md`)
  — input now states EU citizens explicitly (previously never established EU
  scope), and the rubric requires the tier be issued without a role question.

## Fix AF-2 disclaimer gap on non-report turns across all 7 compliance skills (fix/af2-standing-disclaimer)

**Branch:** `fix/af2-standing-disclaimer` (2026-07-04)

Wave 1 eval grading (`_v2/governance/evals/runs/2026-07-04-wave1-graded-record.md`)
found that every AF-2 auto-fail (missing advisory disclaimer) happened on a turn
where a skill asked a clarifying question or gave a prose-only answer instead of
emitting its full formatted report — because the `⚠️ ADVISORY NOTICE` box was
templated onto the terminal report block only, not onto the response as a whole.
`incident-response-logger`'s IR-03/IR-05 fixtures were the clearest case: full
Article 62/73 regulatory characterization with zero disclaimer, worse than a bare
clarifying question. This was a product-wide gap, not a per-skill bug.

### Changed
- All 7 compliance skills (`eu-ai-act-classifier`, `nist-ai-rmf-checkpoint`,
  `iso-42001-audit-prep`, `hitl-compliance-gate`, `incident-response-logger`,
  `ai-transparency-writer`, `pii-exposure-checker` — standalone + `quirgs-compliance`
  bundle, all 3 SKILL.md copies each) — added a "Standing Disclaimer" section
  requiring every response, including clarifying questions and partial/prose
  answers, to close with a short-form advisory line. The existing full boxed
  `⚠️ ADVISORY NOTICE` in each skill's terminal report step now supersedes the
  short line only when that full report is actually emitted.
- Plugin versions bumped: `eu-ai-act-classifier` 1.1.0 → 1.2.0,
  `nist-ai-rmf-checkpoint` 1.0.1 → 1.1.0, `iso-42001-audit-prep` 1.1.0 → 1.2.0,
  `hitl-compliance-gate` 1.1.2 → 1.2.0, `incident-response-logger` 1.0.0 → 1.1.0,
  `ai-transparency-writer` 1.0.0 → 1.1.0, `pii-exposure-checker` 1.0.0 → 1.1.0,
  `quirgs-compliance` bundle 1.2.0 → 1.3.0.

## Fix broken reference pointers in eu-ai-act-classifier and nist-ai-rmf-checkpoint (fix/ref-accuracy)

**Branch:** `fix/ref-accuracy` (2026-07-04)

Two published Skills had SKILL.md pointing at reference files that were never created —
`eu-ai-act-classifier` referenced a nonexistent `references/obligations-gpai.md`, and
`nist-ai-rmf-checkpoint` referenced a nonexistent `references/playbook-actions.md`. In
both cases the intended content already existed elsewhere (GPAI obligations are covered
in `obligations-limited-risk.md`; playbook actions live in a "Playbook Actions — [FUNCTION]
Gaps" table at the end of each function's own reference file), so the fix corrects the
pointers rather than duplicating content. Also added a missing **OUT OF SCOPE** risk tier
to `eu-ai-act-classifier` — the Act's territorial scope (Article 2) was previously not
checked before running tier classification logic, so a system entirely outside EU
jurisdiction had no way to be classified as such.

### Changed
- `eu-ai-act-classifier` (standalone + `quirgs-compliance` bundle, all 3 SKILL.md copies) —
  added Step 2a "Check EU Territorial Scope (Article 2)" ahead of the existing tier checks;
  added OUT OF SCOPE to the classification output template; Step 4 now skips the obligations
  checklist for OUT OF SCOPE and points GPAI/MINIMAL RISK at `obligations-limited-risk.md`
  instead of the nonexistent `obligations-gpai.md`. Plugin version 1.0.2 → 1.1.0.
- `nist-ai-rmf-checkpoint` (standalone + `quirgs-compliance` bundle, all 3 SKILL.md copies) —
  Recommended Actions step now points at each function's own embedded Playbook Actions
  table instead of the nonexistent `references/playbook-actions.md`. Plugin version
  1.0.0 → 1.0.1.
- `quirgs-compliance` bundle version 1.1.3 → 1.2.0 (bundles the above plus the PR #109
  retention fix noted below).

## Add ISO 42001 Annex B reference and reformat Annex A (fix/iso-annex-reference)

**Branch:** `fix/iso-annex-reference` — PR #109 (2026-07-04)

Retroactive entry — this PR merged without a plugin version bump or changelog note.
`iso-42001-audit-prep` gained an Annex B reference file and reformatted Annex A's control
table for audit-prep readability, but the standalone plugin's `plugin.json` was left at
`1.0.0`. Bumped to `1.1.0` as part of the ref-accuracy pass above so installed users pick
up the new Annex B material on marketplace refresh.

### Changed
- `plugins/iso-42001-audit-prep/skills/iso-42001-audit-prep/references/annex-a.md` and
  `plugins/quirgs-compliance/skills/iso-42001-audit-prep/references/annex-a.md` — improved
  table formatting.

### Added
- `plugins/iso-42001-audit-prep/skills/iso-42001-audit-prep/references/annex-b.md` and
  `plugins/quirgs-compliance/skills/iso-42001-audit-prep/references/annex-b.md` — new
  Annex B reference material.

## Bounded retention for hitl-gate archived events (feat/hitl-gate-retention)

**Branch:** `feat/hitl-gate-retention` — PR #108 (2026-07-03)

The daily archive cron flipped events to `status='archived'` after 30 days but
never deleted them, so archived rows — whose payloads can carry review material —
accumulated in D1 indefinitely. Unbounded retention was flagged as the open gap
on risk R-007 (governance risk register) during the R-005 acceptance tripwire
review, and matters more with the Phase 4 customer-facing gate on the roadmap.
The sweep now hard-deletes rows archived more than 60 days ago. Full lifecycle:
~30 days active → 60 days archived → deleted (~90 days total). Archiving stamps
`updated_at`, so a row archived by a sweep is never deleted in that same sweep.

### Changed
- `workers/hitl-gate/index.js` — `scheduled()` now runs a second step deleting
  `archived` rows with `updated_at` older than `RETENTION_SECONDS` (60 days);
  header comment documents the lifecycle and the R-007 linkage.
- `workers/hitl-gate/wrangler.toml` — cron trigger comment updated to describe
  the archive + delete sweep.

### Added
- `workers/hitl-gate/test/index.spec.js` — 4 retention tests: deletes >60-day
  archived rows; keeps <60-day archived rows; never deletes a row in the same
  sweep that archives it; never deletes non-archived rows regardless of age.

## Add About link to site footer (feat/footer-about-link)

**Branch:** `feat/footer-about-link` — (2026-07-01)

The site footer was legal/trust-only (Security · Transparency · Privacy · Terms ·
Support) and omitted About, even though `/about/` is a primary nav route. Added
About to the footer and reordered the links so the row reads About · Terms ·
Privacy · Transparency · Security · Support. About in the footer is a conventional
discoverability path (footer links appear site-wide) and gives `/about/` a second
internal link route beyond the NavBlock.

### Changed
- `src/components/Footer.astro` — added `<a href="/about/">About</a>`; reordered
  footer links to About, Terms, Privacy, Transparency, Security, Support.

## Derive bundle version from bundle plugin manifest (feat/derive-bundle-version)

**Branch:** `feat/derive-bundle-version` — (2026-06-30)

Follow-up to feat/derive-skill-version: the `/bundles/` page hardcoded `v1.0` for
both bundles, so `quirgs-compliance` (plugin was `1.1.3`) displayed as v1.0. The
bundle version is a *distinct* number from the per-skill versions — a bundle is
its own marketplace plugin (`quirgs-compliance` / `quirgs-publish`), separately
versioned. (Publish skills install only via the bundle so their version already
equals it; compliance skills each have a standalone plugin, so the bundle carries
its own version that no single-skill installCmd points at.) The bundle version is
now derived at build time from the bundle plugin manifest.

### Added
- `resolveBundleVersion(bundle)` in `src/data/skill-version.ts` — maps a bundle to
  its bundle plugin (`compliance` → `quirgs-compliance`, `publish` → `quirgs-publish`)
  and returns that manifest's version. Shared lookup factored out of `resolveSkillVersion`.

### Changed
- `src/pages/bundles/index.astro` — both `[FETCHING]` headers now render the
  derived bundle version instead of a hardcoded `v1.0`.

## Derive skill version from plugin manifest (feat/derive-skill-version)

**Branch:** `feat/derive-skill-version` — (2026-06-30)

The skill `version` shown on the site was a hand-copied value in each MDX
frontmatter, decoupled from the plugin manifest (`plugins/<name>/.claude-plugin/plugin.json`)
that actually defines the installed version. It silently drifted: pages showed
`v1.0.0` for `hitl-compliance-gate` (plugin was `1.1.2`) and `eu-ai-act-classifier`
(plugin was `1.0.2`). `version` is now derived at build time from the plugin
manifest, resolved via the skill's `installCmd`, so the page can never drift from
the published plugin again. Also added a source-of-truth reseed script for the
public registry API so its `version` (and the previously-null compliance
`gistUrl`/`installCmd`) stay in sync.

### Added
- `src/data/skill-version.ts` — resolves a skill's version from its plugin
  manifest (via `import.meta.glob`, inlined at build time; `node:fs` cannot read
  the real filesystem inside the Cloudflare adapter's miniflare prerender worker).
- `scripts/seed-registry.mjs` + `npm run seed:registry` — rebuilds every
  `api.quirgs.com` registry entry from MDX frontmatter + plugin manifest versions.
- `yaml` declared as a devDependency (was transitive; the seed script imports it).

### Changed
- `src/pages/skills/index.astro`, `src/pages/skills/[slug].astro` — render the
  derived version instead of `skill.data.version`.
- `src/content.config.ts`, `keystatic.config.ts` — removed the `version` field
  (kept in lockstep); the 15 skill MDX files no longer carry `version:`.
- Reseeded the registry: corrected `eu-ai-act-classifier` (1.0.2) and
  `hitl-compliance-gate` (1.1.2) versions, and backfilled compliance
  `gistUrl`/`installCmd` that were stored as `null`.

## Redirect extensionless legacy guide slug (fix/guide-redirect-extensionless)

**Branch:** `fix/guide-redirect-extensionless` — (2026-06-30)

Worker logs showed an AI crawler hitting `/guides/git_workflow_reference` (extensionless, old underscore slug) and getting a 404 instead of redirecting. The Track 2 migration redirect in `public/_redirects` was keyed only to the `.html` form, and Cloudflare `_redirects` matches paths exactly — so the extensionless variant fell through to 404. A repo-wide grep confirmed no live internal link uses the old slug (only historical CHANGELOG entries), so this is crawler-side `.html` stripping, not a broken link.

### Changed
- `public/_redirects` — added a 301 for the extensionless `/guides/git_workflow_reference` → `/guides/git-workflow-reference/` alongside the existing `.html` rule.

## Unauthenticated /health endpoint on hitl-gate (feat/hitl-gate-health-endpoint)

**Branch:** `feat/hitl-gate-health-endpoint` — (2026-06-30)

`quirgs-hitl-gate` had no unauthenticated route — every endpoint required the `HITL_WRITE_TOKEN` Bearer token, so an external health/uptime check couldn't run without exposing the write token. Added a `GET /health` route that returns `{ "ok": true, "ts": <unix_ts> }` with HTTP 200 and no auth, letting monitoring (and the daily maintenance task) confirm the worker is alive without credentials.

### Added
- `workers/hitl-gate/index.js` — `GET /health` route, placed immediately after the OPTIONS preflight handler and before the auth gate. Returns no event data, only liveness. CORS headers still apply.
- `workers/hitl-gate/test/index.spec.js` — tests covering the 200 `{ ok, ts }` response, that `/events` still 401s (auth unweakened), and that non-GET `/health` falls through to 404.

### Notes
- The task's reference snippet was written against a divergent bundle (OPTIONS keyed on a pre-declared `method`/`path`, plus an `outputs/hitl-gate-index.js` full-file replacement). Applied instead as a targeted insertion against the real source — where `path`/`method` are declared after the OPTIONS block, so the route sits just below them — per the task's own "apply the targeted insertion, don't replace the file" guidance.

## Classifier asks for role/scope instead of assuming (fix/classifier-ask-role)

**Branch:** `fix/classifier-ask-role` — (2026-06-28)

The `eu-ai-act-classifier` skill's Step 1 said only "if critical information is missing, ask before classifying," which in practice it skipped — silently assuming a `provider` role when none was given. Role and EU-market scope change the obligation set more than any other input (provider duties dwarf a deployer's; the Act only applies where outputs are used in the EU), so a silent assumption can produce a confidently wrong checklist.

### Changed
- `skills/eu-ai-act-classifier/SKILL.md`, `plugins/eu-ai-act-classifier/skills/eu-ai-act-classifier/SKILL.md`, `plugins/quirgs-compliance/skills/eu-ai-act-classifier/SKILL.md` — rewrote the close of Step 1 to name **role (item 5)** and **EU scope (item 4)** as load-bearing and require the skill to *ask* (with concrete example questions) before classifying when either is missing. Only if the user cannot/will not answer may it fall back to the higher-obligation assumption (provider, in-scope) — and then it must flag at the top of the output that role/scope were assumed. All three SKILL.md copies kept byte-identical in the edited block.

### Version
- `plugins/eu-ai-act-classifier` bumped `1.0.0 → 1.0.1`.
- `plugins/quirgs-compliance` bumped `1.1.0 → 1.1.2` — clears the `1.1.1` from `fix/hitl-shared-gate-warning` (PR #100), which lands first, so this and #100 don't collide on the bundle version.

### Notes
- Depends on PR #100 merging first (it takes `quirgs-compliance` to 1.1.1). If merge order changes, reconcile the bundle version.

## Align Article 73 incident-reporting timing across references (fix/art73-reference-drift)

**Branch:** `fix/art73-reference-drift` — (2026-06-28)

The serious-incident reporting deadline (EU AI Act Article 73) was stated inconsistently across skills: the `eu-ai-act-classifier` reference said "without undue delay" while the `hitl-compliance-gate` reference said "within 15 days." Neither was complete. Both now carry the precise statutory timeline, identically.

### Changed
- `plugins/eu-ai-act-classifier/.../references/obligations-high-risk.md` + the `quirgs-compliance` bundle copy — replaced "without undue delay" with the full Article 73 timeline.
- `plugins/hitl-compliance-gate/.../references/eu-ai-act.md` + the `quirgs-compliance` bundle copy — replaced "within 15 days" with the same timeline.
- Canonical wording: report immediately after establishing a causal link, and no later than **15 days** after becoming aware — **10 days** if a person died, **2 days** for a widespread infringement or serious disruption to critical infrastructure. Both reference families now match.

### Version
- `plugins/eu-ai-act-classifier` `→ 1.0.2`, `plugins/hitl-compliance-gate` `→ 1.1.2`, `plugins/quirgs-compliance` `→ 1.1.3`. These assume PR #101 merges first (it takes the classifier to 1.0.1 and the bundle to 1.1.2); the bumps here skip those.

### Notes
- **Follow-up (out of scope here):** `incident-response-logger`'s `references/article-62-thresholds.md` has its own separate issues — it labels the provider serious-incident obligation as "Article 62" (final regulation numbers it Article 73), says "15 *working* days" (the Act says 15 days), and is internally inconsistent on the death deadline (says "immediately" in one place, "2 days" in a table). Worth a dedicated cleanup pass.
- Merge order: depends on #101 first. On rebase against a post-#101 `main`, resolve the `eu-ai-act-classifier` and `quirgs-compliance` version lines to **1.0.2** and **1.1.3** respectively.

## Fix stale payload.status after approval (fix/hitl-gate-payload-status)

**Branch:** `fix/hitl-gate-payload-status` — (2026-06-28)

A `PATCH /events/:id` updated the top-level `status` column but never touched a `status` field embedded inside the event `payload`. Since the demo flow (and the `hitl-compliance-gate` skill) POST a payload that includes `"status": "pending"`, approving an event left `payload.status` reading `pending` forever — so any API consumer reading `payload.status` saw a cleared gate as still pending. The `/review` dashboard was unaffected (it reads the top-level column), but the API response was internally inconsistent.

### Changed
- `workers/hitl-gate/index.js` — on `POST /events`, strip any client-supplied `status` from the payload before persisting. The top-level `status` column is now the single source of truth; the payload can no longer carry a divergent copy. Array payloads are left untouched.

### Added
- `workers/hitl-gate/test/index.spec.js` — three regression tests: status stripped from payload on POST, array payloads preserved, and approval no longer leaves a stale `payload.status` (the original bug). Suite: 39 passing.

### Notes
- Code-only fix; rows created before this deploy still carry the embedded `payload.status`. The demo D1 store can be left as-is (new events are clean) or swept with a one-off `UPDATE` if a clean read-back is wanted for a demo.

## Shared-gate safety warning (fix/hitl-shared-gate-warning)

**Branch:** `fix/hitl-shared-gate-warning` — (2026-06-28)

The `hitl-compliance-gate` skill posted compliance checkpoints to whatever `HITL_GATE_URL` resolved to without warning the user when that was the **shared public demonstration gate**. The gate's own docs say never to send real/PII-bearing data there, but nothing surfaced that at POST time — so a tester running a real scenario could leak production or PII data to a queue any token-holder can read. The site (`/hitl/`) already carried a `[WARNING]` block; the skill did not.

### Changed
- `skills/hitl-compliance-gate/SKILL.md`, `plugins/hitl-compliance-gate/skills/hitl-compliance-gate/SKILL.md`, `plugins/quirgs-compliance/skills/hitl-compliance-gate/SKILL.md` — added **Step 3.5a.1 — Guard the shared public demo gate**: before posting, the skill detects whether `HITL_GATE_URL` is a shared demo host (`gate.quirgs.com` or `quirgs-hitl-gate.*.workers.dev`), warns the user, and requires confirmation that the checkpoint is synthetic/demo data before sending — otherwise it falls through to graceful degradation (local output). The guard is forward-compatible with the upcoming `gate.quirgs.com` custom domain. All three SKILL.md copies kept byte-identical in the guard block.

### Version
- `plugins/hitl-compliance-gate` and `plugins/quirgs-compliance` bumped `1.1.0 → 1.1.1` so installed users receive the safety guard on the next marketplace refresh.

### Notes
- No demo-gate URL swap is needed in `SKILL.md`: the prose refers to the gate Worker by its **name** (`quirgs-hitl-gate`), which is unchanged by the custom-domain work — only the Worker's hostname gains `gate.quirgs.com`. The site/catalog hostname swaps live in `feat/worker-custom-domains` (PR #98); SKILL.md needs no change there. This branch's guard already lists both the `workers.dev` host and `gate.quirgs.com`, so it is correct before and after that cutover.
- The 3 SKILL.md files are hand-maintained and had already drifted (the `skills/` Gist source differs from the two plugin copies outside the Step 3.5 block). Worth a follow-up to single-source them.

## Worker custom domains (feat/worker-custom-domains)

**Branch:** `feat/worker-custom-domains` — (2026-06-28)

Moves both standalone Workers off their `*.workers.dev` hostnames onto first-party custom domains: `quirgs-registry-api` → `api.quirgs.com`, `quirgs-hitl-gate` → `gate.quirgs.com`. Cloudflare auto-provisions the DNS records and TLS certs on `wrangler deploy`. The `*.workers.dev` hostnames keep resolving alongside the custom domains, so there is no hard cutover.

> **Status (2026-06-28):** ✅ Ready to merge. Both Workers are **deployed** with custom domains bound + valid TLS (`api.quirgs.com`, `gate.quirgs.com`), `*.workers.dev` preserved (`workers_dev = true`), and the WAF carve-out is **live and verified**. End-to-end POST/GET through `gate.quirgs.com` confirmed (also confirmed the deployed payload.status fix strips the embedded status). After merge: site auto-deploys against the live domains — purge cache (CSP `connect-src` changed).

> **WAF carve-out (done):** Both custom domains sit on the `quirgs.com` zone and inherited its bot posture (Super Bot Fight Mode + the existing `/events` Managed-Challenge custom rule), so `curl`/agents/XHR initially got a Managed Challenge (`cf-mitigated: challenge`, 403) instead of the Worker. Resolved by a WAF **Skip** custom rule scoped to `http.host in {"api.quirgs.com","gate.quirgs.com"}` (skips Super Bot Fight Mode + all remaining custom rules), ordered above the `/events` rule. Justified narrowly: both hosts are Bearer-authed, so the token is the real gate and bot-challenge there was redundant — this does not relax the verified-only stance for the public docs/site. Verified post-rule: `api → 200`, `gate → 401 (application/json)`, no `cf-mitigated` header.

### Changed
- `workers/registry-api/wrangler.toml` — added `routes = [{ pattern = "api.quirgs.com", custom_domain = true }]` + `workers_dev = true`.
- `workers/hitl-gate/wrangler.toml` — added `routes = [{ pattern = "gate.quirgs.com", custom_domain = true }]` + `workers_dev = true`.
- **`workers_dev = true` is load-bearing:** adding a `custom_domain` route makes wrangler disable `workers.dev` by default. Without this flag the first deploy silently took the `*.workers.dev` hosts offline — a hard cutover that breaks every existing `workers.dev` reference (including the live shared demo gate) mid-transition. Setting it keeps both hostnames live.
- `public/_headers` — added `https://gate.quirgs.com` to CSP `connect-src` (kept the `quirgs-hitl-gate.*.workers.dev` entry for transition safety; remove once fully cut over). `script-src` hashes are unaffected — no recompute needed.
- `public/js/review.js`, `src/pages/review.astro` — switched the hardcoded gate-URL fallback from `quirgs-hitl-gate.*.workers.dev` to `https://gate.quirgs.com`.
- `src/pages/hitl.astro` — switched the demo `HITL_GATE_URL` setup command and the live demo-gate link to `https://gate.quirgs.com`.
- `public/.well-known/ai-catalog.json` — updated both Worker `url` fields to the custom domains (`gate.quirgs.com`, `api.quirgs.com`); also corrected the stale hitl-gate `metadata.auth` claim from `"Bearer token (write); public read for GET /events"` to `"Bearer token required for all endpoints (read and write)"` — the read-hardening work made every endpoint return 401 without the token, so the public-read claim was inaccurate in a public discovery catalog.

### Notes
- No `SKILL.md` change is needed for the hostname move: the skill refers to the gate Worker by its **name** (`quirgs-hitl-gate`), which is unchanged — only the Worker's hostname gains `gate.quirgs.com`. (The shared-gate safety warning added in `fix/hitl-shared-gate-warning` already lists both hosts.)
- `CHANGELOG.md` lines referencing the old `*.workers.dev` URLs are dated historical records and are left unchanged.

## ARD catalog completeness — publish bundle (feat/ai-catalog-publish-bundle)

**Branch:** `feat/ai-catalog-publish-bundle` — (2026-06-27)

Closes the last open item from the agent-readiness assessment (a machine-readable, programmatically enumerable skills feed). The ARD catalog previously listed only the 7 compliance skills, so an agent reading `/.well-known/ai-catalog.json` couldn't discover the 8 publish-bundle skills without scraping the HTML registry or GitHub.

### Added
- `public/.well-known/ai-catalog.json` — added all 8 publish-bundle skills (publish-workflow, publish-provenance, publish-update, publish-broadcast, publish-license, publish-income, publish-shield, publish-harvest) as ARD entries, matching the existing skill-entry shape (identifier, displayName, type, url, description, tags, capabilities, representativeQueries, version, updatedAt, metadata). Descriptions, frameworks, and representative queries are drawn from each skill's MDX frontmatter. Catalog now enumerates the full 15-skill surface (7 compliance + 8 publish) + 2 workers.

### Changed
- `public/.well-known/ai-catalog.json` — corrected `metadata.platform` from the legacy `"Claude Cowork"` to `"Claude Code"` across all 15 skill entries (the actual install target — skills install via the Claude Code plugin marketplace).

## Content provenance — agent-visible authority signal (feat/content-provenance)

**Branch:** `feat/content-provenance` — (2026-06-27)

Adds a structured provenance/credibility signal across all agent-facing discovery surfaces. Previously, the only agent-readable limitation statement was a single sentence in `llms.txt` ("governance scaffolding for education and drafting — not legal advice"). There was no machine-readable disclosure of what primary sources the compliance content rests on, how it was validated, or what it explicitly has not been audited by. This was the ceiling on agent trust.

### Added
- `public/.well-known/provenance.json` — new structured provenance document. For each of the five primary sources (EU AI Act, NIST AI RMF 1.0, ISO/IEC 42001:2023, GDPR, NIST SP 800-61 Rev. 2): full citation, canonical URL, which skills draw from it, and which articles/sections are referenced. Also documents authorship process (practitioner-authored against primary text), validation process (production-tested + HITL sign-off), explicit `notValidatedBy` list (third-party audit, legal counsel, accreditation body), and a structured `limitations` array. CORS-readable; served with `Access-Control-Allow-Origin: *`.
- `public/_headers` — added route block for `/.well-known/provenance.json` (plain JSON, CORS, 1-hour cache) matching the `ai-catalog.json` pattern.

### Changed
- `public/llms.txt` — added `## Content provenance` section immediately before `## Governance & trust`. Lists all five primary sources with article/section references, states authorship and validation process honestly, names what has not been reviewed (third-party audit, legal counsel), and links to `provenance.json` for the machine-readable version. Agents reading `llms.txt` now find the authority basis without a second fetch.
- `public/.well-known/ai-catalog.json` — added top-level `"provenance"` object (between `"host"` and `"entries"`) containing the `provenance.json` URL, `lastReviewed` date, `primarySources` array, `validationProcess` string, and `disclaimer`. Agents consuming the ARD catalog get the provenance claim inline.

### Why
- A zero-context agent assessment identified "no published provenance for compliance content" as the single gap with zero coverage — the ceiling on trust for any agent evaluating whether to cite or act on Quirgs outputs. The fix puts the authority claim where agents already look: `llms.txt` (first read), `ai-catalog.json` (structured catalog), and `provenance.json` (canonical machine-readable anchor).

## HITL endpoint abstraction (feat/hitl-endpoint-abstraction)

**Branch:** `feat/hitl-endpoint-abstraction` — (2026-06-27)

Makes clear, in both the skill and the docs, that the HITL Gate endpoint is the
user's own — never Quirgs infrastructure. The `hitl-compliance-gate` skill and
the `/hitl/` examples already read `HITL_GATE_URL`/`HITL_GATE_TOKEN` from the
environment, but the surrounding copy presented the shared `quirgs-hitl-gate`
Worker as *the* gate, so an external install following the docs would POST its
compliance events into the shared demonstration queue.

### Changed
- `skills/hitl-compliance-gate/SKILL.md` (Gist-sync source): Step 3.5 now frames the gate as "your configured HITL Gate" rather than "the Quirgs HITL Gate." Added an explicit note that `HITL_GATE_URL` points at the user's own `hitl-gate` Worker deployment (source at `workers/hitl-gate`), and that the shared `quirgs-hitl-gate` Worker is a public demo queue for the 90-second test only — never for production or PII-bearing data. The pending-state output now echoes `$HITL_GATE_URL` instead of naming Quirgs.
- `src/pages/hitl.astro`: split the setup into a **demo Worker** path (the 90-second test against the shared queue) and a new **RUN YOUR OWN GATE** section covering deploying the open-source Worker and pointing `HITL_GATE_URL` at it. Reframed the "HOW IT WORKS" Worker callout as a *shared demonstration* Worker and clarified that env-var indirection means switching to your own gate is a single `HITL_GATE_URL` change — nothing else points at Quirgs.

### Why
- External installs should keep their compliance event data inside their own infrastructure. The fix is documentation/framing: surface the gate as user-owned and the shared Worker as demo-only, so following the docs no longer routes real data through Quirgs.

### Also
- Ported the (now endpoint-agnostic) Step 3.5 into **both plugin copies** — `plugins/hitl-compliance-gate/` and the bundled `plugins/quirgs-compliance/`. Previously Step 3.5 lived only in the Gist-sync source, so `/plugin install hitl-compliance-gate@quirgs` produced an *ungated* skill (Step 3 → Step 4 with no gate POST), contradicting the `/hitl/` claim that installing it gates any workflow "out of the box." Both plugin SKILL.md copies are now byte-identical in the Step 3.5 block; graceful degradation (3.5d) keeps the skill working for users who never wire a gate. Bumped both plugin manifests `1.0.0` → `1.1.0`.

## Crawler-facing trust posture (feat/crawler-trust-posture)

**Branch:** `feat/crawler-trust-posture` — (2026-06-27)

### Added
- New `src/components/Seo.astro`: emits Open Graph + Twitter Card meta and a static JSON-LD `Organization` graph on every page. The JSON-LD surfaces the published security posture (`contactPoint` `contactType: "security"` → `/.well-known/security.txt`) and the transparency notice (`publishingPrinciples` → `/transparency/`) so an agent reading only the page HTML finds them without running the JS boot sequence. Wired into `BaseLayout.astro` (all subpages) and the standalone `index.astro`.
- Footer now links **Security** and **Transparency** alongside Privacy/Terms/Support, so the trust pages are reachable from the static HTML of every page (previously they existed but nothing on the homepage linked them).

### Changed
- `public/_headers`: pinned the JSON-LD block's SHA-256 (`sha256-0luhRzwYBCNWM+bAZHyYyfEmlrY4A7B/kihyfIeWxMc=`) in `script-src` (7th hash). CSP `script-src` applies to `<script type="application/ld+json">` even though it is not executed; the bytes are static, so the single hash covers all pages.

### Why
- A Copilot agent-readiness assessment concluded "no published security posture" despite `security.txt` + a strict CSP existing — it only saw the homepage `title`/`meta-description` (no structured data, JS-injected body) and couldn't reach the trust pages. These changes put the security/transparency posture where a non-JS crawler actually reads it.

## HITL gate read-path hardening (feat/hitl-gate-read-hardening)

**Branch:** `feat/hitl-gate-read-hardening` — (2026-06-27)

Closes the unauthenticated-read exposure on the `hitl-gate` Worker. `GET /events`
was world-readable (`Access-Control-Allow-Origin: *`, no auth), so anyone could
enumerate and read every non-archived event payload — and the `/review`
dashboard fetched it that way. Each GET also did two writes (per-request
`CREATE TABLE` + lazy TTL `UPDATE`) and an unbounded `SELECT *`.

### Changed
- `workers/hitl-gate/index.js`:
  - **Auth on all reads.** `GET /events` and `GET /events/:id` now require the same `HITL_WRITE_TOKEN` Bearer token that already gated `POST`/`PATCH`. No anonymous read path remains. `checkAuth` also now fails closed when the token env var is unset.
  - **Pagination.** `GET /events` takes `?limit=` (default 100, max 500) and a `?before=<created_at>` keyset cursor; the query is `LIMIT`-bound instead of unbounded.
  - **Reads no longer write.** Removed per-request `CREATE TABLE IF NOT EXISTS` (schema now lives in a migration) and the lazy write-on-read TTL. The 30-day archive sweep moved to a `scheduled()` Cron Trigger.
  - **CORS tightened.** Responses reflect an allow-listed `Origin` (`ALLOWED_ORIGINS` env, default `quirgs.com`/`www.quirgs.com`) with `Vary: Origin` instead of `Access-Control-Allow-Origin: *`. Non-browser (no-Origin) callers like agents/curl are unaffected.
- `public/js/review.js` — sends `Authorization: Bearer <token>` on the queue fetch, and gates queue load behind a token (prompts to set one; reloads on set). Surfaces 401 distinctly.

### Added
- `workers/hitl-gate/migrations/0001_init.sql` — baseline `events` schema + indexes on `(status, created_at)` and `(created_at)`. Replaces runtime DDL. Idempotent against the existing prod DB.
- `workers/hitl-gate/wrangler.toml` — `[triggers] crons = ["0 3 * * *"]` for the daily TTL sweep, `migrations_dir`, and `ALLOWED_ORIGINS` var.

### Deploy notes (out-of-band, in order)
1. `wrangler d1 migrations apply quirgs-hitl-db --remote --config workers/hitl-gate/wrangler.toml` (no-op on the existing table; creates the indexes).
2. Confirm the `HITL_WRITE_TOKEN` secret is set on the Worker (`wrangler secret put HITL_WRITE_TOKEN --config workers/hitl-gate/wrangler.toml`) — reads now 401 without it.
3. `wrangler deploy --config workers/hitl-gate/wrangler.toml`.
4. The `/review` dashboard now shows the queue only after an operator sets the token. Public anonymous viewing of the queue is intentionally gone.

## llms.txt + agent-discovery posture (feat/llms-txt-agent-discovery)

**Branch:** `feat/llms-txt-agent-discovery` — (2026-06-27)

Agent-readiness pass ahead of hard launch, prompted by a zero-context Copilot
assessment of quirgs.com. Goal: make the site legible and reachable to AI agents
that index and vouch for it.

### Added
- `public/llms.txt` — agent-facing site map in the [llmstxt.org](https://llmstxt.org) format. H1 + summary blockquote, the two-command install flow, both skill bundles (compliance ×7, publish ×8) with links and taglines, the HITL Gate, Guides, and the governance/trust pages. Complements the existing `/.well-known/ai-catalog.json` (ARD) discovery surface.
- `public/_headers` — `/llms.txt` block serving `text/plain; charset=utf-8`, `Access-Control-Allow-Origin: *` (cross-origin agent fetch), and `Cache-Control: public, max-age=3600`. CSP on a text/plain response is inert, mirroring the `security.txt` / `ai-catalog.json` blocks.

### Changed
- `public/robots.txt` — reworded the header comment from the old "AI-training-bot policy is enforced at the edge" stance to an explicit **agents-welcome** stance, and added an `# Agent-facing site map: https://quirgs.com/llms.txt` pointer. `Allow: /` and the `/keystatic/` disallow are unchanged.

### Notes (Cloudflare edge — dashboard, not in repo)
- **Stance: verified bots only (first definition of "agent ready").** Major AI platforms may index and cite Quirgs; unverified custom agents remain challenged. Sitemap (`sitemap-index.xml`) was already healthy and is unchanged. Edge changes made out-of-band: managed **"Block AI training bots" → Do not block**; **"Instruct AI bot traffic with robots.txt" beta → off** (it was auto-overwriting `robots.txt` at the edge). Super Bot Fight Mode left **on** (Definitely automated → Managed Challenge, Static Resource Protection on) — verified AI crawlers are exempt and pass; this is the intended posture. A spoofed-UA `curl` will hit the Managed Challenge and is **not** a valid test of real (IP-verified) crawler access — use `Security → Events` filtered by crawler UA instead. Custom rule #1 ("Block scanners and bad user agents": sqlmap/nikto/masscan/zgrab/nuclei + blank UA) confirmed clean — no AI crawler sends a blank UA.

## CSP inline-style sweep (feat/csp-inline-style-sweep)

**Branch:** `feat/csp-inline-style-sweep` — (2026-06-26)

### Fixed
- Removed all inline `style="..."` attributes from terminal-UI pages, which violated the strict `style-src 'self'` (no `'unsafe-inline'`) CSP and surfaced as `style-src` console warnings on every page:
  - HelpModal (global, every page): two `style="color:var(--text-main)"` spans → new scoped `.text-main` class
  - Terms & Privacy (`feat/policy-modal-refresh`): `style="padding: 0;"` on `.terminal-body` → scoped `.terminal-body.flush` modifier
  - Skills index: `style="display:none;"` on `.no-results` → initial state moved into the scoped `.no-results` rule (JS still toggles `.style.display` at runtime, unaffected by CSP)
- Skills index: replaced the `<select>` dropdown-arrow `data:image/svg+xml` background (blocked by `img-src 'self'`) with a self-hosted `/icons/select-arrow.svg` — keeps `img-src` tight rather than adding `data:`
- Note: remaining `[Report Only]` console entries for `static.cloudflareinsights.com/beacon.min.js` and `/cdn-cgi/rum` originate from a **Cloudflare-injected Report-Only CSP** (Web Analytics), not our `_headers` policy — they block nothing and are resolved at the Cloudflare edge, not in this repo.

## Policy & modal refresh (feat/policy-modal-refresh)

**Branch:** `feat/policy-modal-refresh` — (2026-06-26)

### Changed
- HelpModal: replaced "all seven" with "an entire bundle"; added `quirgs-publish@quirgs` bundle install command; added HITL GATE section with links to /gate/, /demo/, /hitl/
- Terms of Service: effective date June 25, 2026; added HITL Gate service description (Section 2); added two prohibited-use bullets for gate payloads (Section 3); updated Section 4 to describe marketplace + Gist dual distribution
- Privacy Policy: effective date June 25, 2026; added HITL Gate D1 disclosure (Section 2); removed all GA4 references (cookie table, Section 4, Section 6, Section 7); added HITL Gate 30-day TTL to Section 6; updated Section 7 rights paragraph

## Docs — README sync (feat/readme-t3.3)

**Branch:** `feat/readme-t3.3` — (2026-06-25)

### Changed

- **`README.md`** — Brought the README current with routes and structure added since
  the last update (T3.3). Added the `/gate/`, `/demo/`, `/about/`, `/security/`, and
  `/guides/[slug]/` routes to the routes table; added `gate.astro`, `demo.astro`,
  `about.astro`, `security.astro`, `guides/[slug].astro`, `src/content/guides/`,
  `public/demo.js`, `public/_headers`, and `.jules/` to the repository layout tree.
  Documented the `hitl-gate` Worker's outbound webhook (`WEBHOOK_URL`, non-blocking via
  `ctx.waitUntil`); added a `guides` content-collection subsection to the content model;
  added a Tests subsection covering `npm test` (39 Vitest tests across both Workers);
  and added a hash-pinned CSP / `public/_headers` note to the design system section; Moved T3.2-demo-queue-validation from .jules to untracked. (Clean up)

## Feature — HITL Gate demo queue (feat/hitl-demo-queue)

**Branch:** `feat/hitl-demo-queue` — (2026-06-25)

### Added

- **`src/pages/demo.astro` (`/demo/`)** — Fully static HITL Gate demo queue. Renders 3
  hardcoded realistic compliance events (EU AI Act classification, PII exposure check,
  AI transparency notice) in the same terminal-UI card format as `/review/`. Approve/Reject
  buttons are interactive but do not fire API calls — clicking shows a demo-mode inline message.
  No auth required, no Worker dependency, no D1 reads. Grouped under resources. External
  script (`public/demo.js`) avoids CSP hash changes.

### Changed

- **`src/pages/index.astro`** — Rephrased the landing boot sequence to highlight
  concrete platform functions: replaced the generic "Classify risk. Gate decisions.
  Audit for standards. Stay transparent." line with two declarative lines naming
  EU AI Act risk classification, NIST AI RMF / ISO 42001 audit, HITL gate review,
  transparency notices, and incident logging. The `Featuring` block is unchanged.
  Added `NavBlock` to the landing terminal so the site menu is discoverable on first
  paint. Minor copy tweaks on `demo.astro` and `gate.astro`.
- **`public/_headers`** — Regenerated the pinned landing-boot inline-script SHA-256
  (`sy+NlX3…` → `MCF6EEFZ…`) since the boot script bytes changed. No other CSP hashes
  affected.
- **Queue card mobile overflow + `/demo/` layout** (Jules validation) — Moved the
  `/hitl/`, `/review/`, `/gate/` CTAs out of the `[DEMO]` block to a `ctas-block`
  below the queue. Replaced the per-card `━`×39 glyph dividers (an unbreakable run
  that overflowed narrow viewports) with a `border-top` on the shared global
  `.event-card` rule in `BaseLayout.astro` — a border can never overflow. This fixes
  both `/demo/` (`demo.js`) and the same latent overflow on `/review/` (`review.js`),
  whose glyph rows are removed. The bug was only ever visible on `/demo/` because
  `/review/` renders cards only when the live gate queue has pending events.

### Removed

- Removed seperator line in `gate.astro` which caused mobile overflow.

## Feature — HITL Gate landing page (feat/hitl-gate-landing)

**Branch:** `feat/hitl-gate-landing` — (2026-06-25)

### Added

- **`src/pages/gate.astro` (`/gate/`)** — Stakeholder pitch page for the Quirgs HITL Gate.
  Covers what the gate is, why it exists (EU AI Act / NIST AI RMF / ISO 42001 audit trail
  requirement), how it works (3-step flow), and an early access CTA (mailto: link).
  Positioning line: "Skills teach governance. The gate enforces it." Grouped under resources
  in the sitemap. No inline scripts, no CSP impact.

## Feat — HITL Gate outbound webhook (feat/hitl-webhook)

**Branch:** `feat/hitl-webhook` — (2026-06-25)

### Added

- HITL Gate Worker now fires an outbound webhook on every successful `POST /events`.
  Configurable via `WEBHOOK_URL` Worker secret (set with `wrangler secret put`).
  Webhook payload includes event ID, type, item, stage, frameworks, status, review URL,
  and timestamp. Non-blocking (`ctx.waitUntil`) — webhook errors do not affect event
  creation. When `WEBHOOK_URL` is unset, behavior is unchanged.

## Feat — Security & About pages (feat/trust-about-pages)

**Branch:** `feat/trust-about-pages` — (2026-06-25)

Closes two enterprise-readiness trust gaps surfaced by a cold (no-context)
external assessment of quirgs.com: no published security posture, and no
company/builder identity. Both gaps were "invisible work" — the posture and the
maintainer already existed but weren't surfaced anywhere a first-time reviewer
could see them.

### Added

- **`src/pages/security.astro` (`/security/`)** — Security & Trust page
  surfacing the existing posture: no-PII data handling, strict hash-pinned CSP,
  null-MX email anti-spoof config, source-previewable + auto-update-off skill
  distribution, human-checkpoint platform governance, and the RFC 9116
  vulnerability-reporting path. Grouped under `docs` in the sitemap, next to the
  transparency notice.
- **`src/pages/about.astro` (`/about/`)** — About / credibility page: the
  governance-first thesis, what the platform distributes, the named maintainer
  (Torrey Adams / unqdlphn), how the platform is operated, and an honest-scope
  disclaimer. Grouped under `site`.
- **Two route entries in `src/data/routes.ts`** — `/security/` and `/about/`
  registered in the single source of truth. `/about/` is `primary` (promoted
  into the inline NavBlock row, replacing `transparency/`, which drops to the
  SiteMenu overlay); `/security/` stays in the overlay.

Terminal-UI conventions followed (BaseLayout + NavBlock, `cat <file>.md`
prompt, `text-bright` headings). Static-only, no new inline scripts — no CSP
hash impact.

## Fix — HITL page mobile overflow (feat/hitl-mobile-overflow)

**Branch:** `feat/hitl-mobile-overflow` — (2026-06-24)

Step 2's "Returns:" JSON string overflowed the viewport in mobile view on `/hitl`.

### Fixed

- **Long inline `<code>` couldn't shrink inside the flex `.line`.** `.line` is
  `display:flex`, and flex items default to `min-width:auto`, so the unbreakable
  `{"id":"...","status":"pending","created_at":...}` response refused to shrink
  below its content width and ran past the screen edge. Added a page-scoped
  `.line code` rule (`min-width:0` + `overflow-wrap:anywhere`) in `hitl.astro` so
  the JSON wraps. Scoped to the page; CSS-only, no CSP impact.

## Fix — GFM tables in MDX guides (feat/guides-table-styling)

**Branch:** `feat/guides-table-styling` — (2026-06-25)

The `git-workflow-reference` guide's tables rendered as literal `| pipe |` text.

### Fixed

- **MDX GFM was off.** `@astrojs/mdx` only adds `remark-gfm` when `gfm` is truthy
  (smartypants, by contrast, is on unless explicitly `false`), so with
  `markdown.gfm` unset it resolved `undefined` for `.mdx` and tables didn't parse.
  Set `mdx({ gfm: true })` in `astro.config.mjs`. (Skills MDX unaffected — none
  used tables.)

### Added

- `.terminal-body table/th/td` styling in `BaseLayout.astro` — guides are the
  first MDX content to use tables; matches the terminal theme (dashed
  `--term-border`, header row in `--text-bright`). CSS-only, external stylesheet,
  no CSP impact.

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
  stores the slug as the _filename_ and strips `slug:` from frontmatter on every save,
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

- Grouped Dependabot bump driven by an `undici` security release (`7.24.8 → 7.28.0`, addressing 7 advisories incl. CVE-2026-12151), pulled in transitively under `miniflare`. Ancestor deps updated together: `wrangler` `4.101.0 → 4.103.0`, `@cloudflare/vitest-pool-workers` `0.16.16 → 0.16.18`, `@cloudflare/vite-plugin` `1.41.0 → 1.42.1`, `miniflare`/`workerd` `…0616 → …0617.1`. All dev/build-tooling — none ships in the static `dist/client` bundle. The nested `esbuild` moves to `0.28.1`, matching the existing `overrides` pin from PR #62 (no conflict). Verified: clean `npm ci` + production build succeed, all 6 pinned CSP `script-src` hashes in [public/\_headers](public/_headers) still match the rebuilt inline scripts (no drift), and all 39 worker tests pass (15 registry + 24 hitl-gate). This is the anticipated upstream arrival noted in the `fix/audit-tooling` entry.

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
- Added an isolated `/.well-known/ai-catalog.json` block to [public/\_headers](public/_headers) setting `Access-Control-Allow-Origin: *`, `Content-Type: application/json`, and `Cache-Control: public, max-age=3600` — required so ARD crawlers can fetch the catalog cross-origin. This block is JSON-only and does not touch the strict CSP pinned to `/*`.

## Fix — Non-breaking audit cleanup of build tooling (fix/audit-tooling)

**Branch:** `fix/audit-tooling` — (2026-06-16)

### Security

- Ran a non-breaking `npm audit fix` (lockfile-only; `package.json` untouched), clearing 2 of 12 transitive dev/build-tooling advisories: `vite` (high) and `js-yaml` (moderate). Verified post-fix: production build succeeds, all 6 pinned CSP `script-src` hashes in [public/\_headers](public/_headers) still match the rebuilt inline scripts (the `vite` bump shifted no inlined-script bytes), and all 39 worker tests pass.
- The remaining 10 advisories are left intentionally. Six (the `ws` / `miniflare` / `wrangler` / `@cloudflare/vite-plugin` chain) only offer `isSemVerMajor` fixes that would _downgrade_ `@astrojs/cloudflare`, `wrangler`, and `@cloudflare/vitest-pool-workers` below the versions set in PR #62 — `npm audit fix --force` is deliberately NOT run. The other four (`yaml` chain under `@astrojs/check`) resolve when Astro ships a `language-server` update. All 10 are dev/build-tooling only — none ships in the static `dist/client` bundle. These will arrive as upstream Dependabot PRs as releases land.

## Fix — esbuild security vulnerabilities + dependency refresh (fix/esbuild-vulnerabilities)

**Branch:** `fix/esbuild-vulnerabilities-9409481704421424609` — PR #62 (2026-06-16)

### Security

- Pinned `esbuild` to `0.28.1` via the `overrides` field in [package.json](package.json), resolving two Dependabot-flagged advisories carried transitively through `wrangler` and `@cloudflare/vitest-pool-workers`: GHSA-gv7w-rqvm-qjhr (missing binary integrity verification in the Deno module → RCE via `NPM_CONFIG_REGISTRY`) and GHSA-g7r4-m6w7-qqqr (arbitrary file read via the dev server on Windows). `esbuild` now resolves to `0.28.1` across the entire dependency tree (previously `0.27.x`, inside the vulnerable `0.17.0 – 0.28.0` range). Both are build/dev-tooling dependencies — neither ships in the static `dist/client` bundle.

### Changed

- Refreshed core dependencies for patch compatibility: `astro` `6.3.3 → 6.4.7`, `@astrojs/cloudflare` `13.5.4 → 13.7.0`, `wrangler` `4.93.1 → 4.101.0`, `@cloudflare/vitest-pool-workers` `0.16.14 → 0.16.16`. Verified post-bump: production build succeeds, all 6 pinned CSP `script-src` hashes in [public/\_headers](public/_headers) still match the rebuilt inline scripts (no hash drift from the Astro bump), and all 39 worker tests pass.

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

- **Renamed the `/bundle/` route to `/bundles/`** (directory `src/pages/bundle/` → `src/pages/bundles/`). The original singular name was coined for the single compliance bundle before multi-bundle scaling was considered; with the PUBLISH bundle landing alongside compliance, the plural is correct. Updated `src/data/routes.ts`, `src/pages/index.astro` (boot-sequence link), `NavBlock` `currentPath`, and `README.md`. The `bundle` _frontmatter field_ on skills is unchanged — only the route moved.
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
