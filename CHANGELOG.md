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

## Surface release provenance on /transparency/ (feat/transparency-releases-link)

**Branch:** `feat/transparency-releases-link` (2026-07-06)

Trust-surfacing follow-up from the release plan: the `/transparency/` page gains
a "Release Provenance" section linking the GitHub Releases feed — CalVer
provenance visible to humans and crawlers on the site itself, not just on
GitHub. The section also states the existing version-integrity chain in plain
terms: skill/bundle versions on `/skills/` derive at build time from the plugin
manifests (PRs #105/#106) and are verified against the live site and registry by
the scheduled integrity check (PR #113) — the displayed, installed, and released
version are the same number by construction.

### Changed
- `src/pages/transparency.astro` — added "Release Provenance" section (releases
  feed link + version-derivation/integrity explanation) ahead of the support
  footer line.

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
