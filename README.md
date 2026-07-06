```
   __ _ _   _(_)_ __ __ _ ___
  / _` | | | | | '__/ _` / __|
 | (_| | |_| | | | | (_| \__ \
  \__, |\__,_|_|_|  \__, |___/
     |_|            |___/

 Governance first. Build accordingly.
```

# Quirgs

Quirgs is a platform for building AI products responsibly. The site at
[quirgs.com](https://quirgs.com) ships governance tooling — skills, guides, and
operational workflows — to the people writing the code, not the people reading
the PDFs.

This repository is the production source for the public site, the skill catalog
behind it, and the workers that back human-in-the-loop review.

> Quirgs is not a knowledge base. It is not a tutorial site for local LLM
> deployments. It is not a sysadmin resource. Those descriptions belong to a
> legacy that no longer exists.

---

## The product unit

A **quirg** (lowercase) is the unit Quirgs ships. Every quirg belongs to one of
three formats:

| Format | What it is |
| --- | --- |
| **Skill** | Installable Claude Code skill, distributed through the `quirgs` plugin marketplace. Executes a governance workflow inside an AI environment. |
| **Guide** | Structured how-to reference. Teaches a principle, standard, or implementation pattern in depth. |
| **Tool** | Reusable SOP, workflow, or automation system. Operational — meant to be run, not just read. |

The current production catalog is **15 Skills** across two bundles:
**`quirgs-compliance`** (7 Skills — EU AI Act, NIST AI RMF, ISO/IEC 42001, HITL
gating, PII exposure, incident response, AI transparency disclosure) and
**`quirgs-publish`** (8 Skills — distribution, provenance, and licensing
workflows). See [`src/content/skills/`](src/content/skills/).

---

## Installing the skills

The Skills are distributed as a [Claude Code plugin
marketplace](https://code.claude.com/docs/en/plugin-marketplaces). The
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) at the repo
root lists **9 plugins** — the two bundles (`quirgs-compliance`, `quirgs-publish`)
plus one single-skill plugin for each of the 7 compliance Skills. The 8 publish
Skills install via the `quirgs-publish` bundle. Each plugin's source lives under
[`plugins/`](plugins/) with its full `SKILL.md` and `references/` committed so
they survive install.

Inside Claude Code, add the marketplace once, then install:

```
/plugin marketplace add unqdlphn/quirgs
/plugin install quirgs-compliance@quirgs        # all 7 compliance skills
/plugin install quirgs-publish@quirgs           # all 8 publish skills
/plugin install eu-ai-act-classifier@quirgs     # or a single compliance skill
```

> The marketplace is added by its repo (`unqdlphn/quirgs`) but plugins install
> with the marketplace **name** suffix (`@quirgs`, the `name` field in
> `marketplace.json`).

> **Auto-update note:** Third-party marketplaces have auto-update disabled by default. To pull new skill versions after install, run `/plugin marketplace update quirgs`.

The public [Gists](https://gist.github.com/unqdlphn) carry each `SKILL.md` for
discovery, SEO, and read-only preview — they are **not** an install path, since
a Gist cannot deliver a Skill's `references/` directory.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Astro 6](https://astro.build) — static output |
| Adapter | `@astrojs/cloudflare` → Cloudflare Workers |
| Content | Astro Content Collections + MDX, edited via [Keystatic](https://keystatic.com) (Keystatic **Cloud** storage) at `/keystatic/` |
| Hosting | Cloudflare (production domain: `quirgs.com`) |
| Backend services | Cloudflare Workers — KV + D1 (`api.quirgs.com`, `gate.quirgs.com`) |
| CI | GitHub Actions (`sync-gists.yml`, `live-integrity.yml`) |
| Node | `>=22.12.0` (see [package.json](package.json)) |

---

## Repository layout

```
quirgs/
├── src/
│   ├── pages/                  # Astro routes
│   │   ├── index.astro         # Terminal landing — boot sequence + skill ls
│   │   ├── skills/             # /skills/ index + dynamic [slug] detail pages
│   │   ├── bundles/            # /bundles/ — skill bundle install page
│   │   ├── guides/             # /guides/ — archive index + [slug].astro MDX detail pages
│   │   ├── resources/          # /resources/ — resource pages
│   │   ├── gate.astro          # /gate/ — HITL Gate stakeholder pitch
│   │   ├── demo.astro          # /demo/ — fully static HITL Gate demo queue
│   │   ├── hitl.astro          # /hitl/ — HITL Gate docs + 90-second test
│   │   ├── review.astro        # /review/ — HITL Gate review queue UI
│   │   ├── about.astro         # /about/ — what Quirgs is + who builds it
│   │   ├── security.astro      # /security/ — security & trust posture
│   │   ├── transparency.astro  # AI transparency notice
│   │   ├── support.astro       # Contact + community
│   │   ├── privacy.astro       # Privacy notice
│   │   ├── terms.astro         # Terms
│   │   └── 404.astro           # Terminal-UI 404
│   ├── layouts/
│   │   └── BaseLayout.astro    # Terminal-frame shell + design tokens
│   ├── components/
│   │   ├── NavBlock.astro      # Terminal-style site nav (tab-completion row)
│   │   ├── SiteMenu.astro      # [≡] sitemap overlay — full route tree
│   │   ├── Footer.astro        # Footer block
│   │   ├── HelpModal.astro     # [?] help dialog
│   │   └── Seo.astro           # OG/Twitter meta + JSON-LD Organization graph
│   ├── data/
│   │   ├── routes.ts           # Single source of truth for site routes
│   │   └── skill-version.ts    # Build-time skill/bundle version derivation from plugin manifests
│   ├── content/
│   │   ├── skills/             # 15 .mdx skill entries — SITE pipeline source
│   │   └── guides/             # net-new .mdx guides — Keystatic-managed, rendered at /guides/<slug>/
│   └── content.config.ts       # Zod schema for the skills + guides collections
├── .claude-plugin/
│   └── marketplace.json        # Plugin marketplace catalog (name: quirgs) — manual
├── plugins/                    # Installable Claude Code plugins (9: 2 bundles + 7 single)
│   ├── quirgs-compliance/      # Bundle — 7 compliance skills
│   ├── quirgs-publish/         # Bundle — 8 publish skills
│   └── <slug>/                 # One single-skill plugin per compliance Skill
├── public/
│   ├── assets/                 # Logos, favicon assets
│   ├── css/                    # Static stylesheets
│   ├── guides/                 # Legacy V1 HTML guides (SEO URLs preserved)
│   ├── demo.js                 # External script powering the /demo/ static queue
│   ├── js/review.js            # External script powering the /review/ queue
│   ├── llms.txt                # Agent-facing site map (llmstxt.org format)
│   ├── robots.txt              # Crawl allow + sitemap pointer
│   ├── _redirects              # Cloudflare redirects (legacy slugs, /bundle → /bundles)
│   ├── _headers                # Cloudflare headers — strict hash-pinned CSP (see note below)
│   └── .well-known/            # ai-catalog.json (ARD), provenance.json, security.txt
├── workers/
│   ├── registry-api/           # KV-backed skill catalog API — api.quirgs.com
│   └── hitl-gate/              # D1-backed HITL review event log — gate.quirgs.com
├── skills/                     # DISTRIBUTION pipeline — SKILL.md sources synced to Gists
│   └── gist-map.json           # slug → Gist id map (auto-updated by sync-gists)
├── scripts/
│   ├── seed-registry.mjs       # Rebuilds api.quirgs.com entries from MDX + plugin manifests
│   ├── check-live-integrity.mjs# Asserts live surfaces match plugin manifests (CI + local)
│   └── lib/registry-entries.mjs# Canonical registry-entry builder shared by both
├── .github/
│   ├── workflows/sync-gists.yml
│   ├── workflows/live-integrity.yml
│   └── scripts/sync-gists.js
├── .jules/                     # Tracked validation briefs + agent rules for this repo
├── keystatic.config.ts         # CMS config — collections + Keystatic Cloud storage
├── astro.config.mjs            # Static output + Cloudflare adapter
├── wrangler.jsonc              # Workers deployment config for the site
└── _v2/                        # Build planning, session prompts, handoffs (gitignored; incl. _v3/)
```

> **Two skill directories, two pipelines.** [`src/content/skills/`](src/content/skills/)
> (MDX) drives the **site** and is Keystatic-managed. [`skills/`](skills/) (`SKILL.md`)
> is the **distribution** source synced to Gists. They are separate — see
> [Updating skills](#updating-skills--two-pipelines) below.

---

## Routes

| Path | Source | Purpose |
| --- | --- | --- |
| `/` | [src/pages/index.astro](src/pages/index.astro) | Animated terminal boot sequence. JS-injected DOM, no CSS keyframe drift-ins. Declarative platform intro linking the registry, bundles, and docs (it intentionally does not enumerate the skills — the registry does that). |
| `/skills/` | [src/pages/skills/index.astro](src/pages/skills/index.astro) | Skill registry. Reads the `skills` content collection, sorts by drop order, renders an aligned `ls -la` listing. |
| `/skills/[slug]/` | [src/pages/skills/[slug].astro](src/pages/skills/[slug].astro) | Per-skill detail page rendered from MDX with badges, install block, and interop references. |
| `/bundles/` | [src/pages/bundles/index.astro](src/pages/bundles/index.astro) | Skill bundle install page — marketplace install commands for the `quirgs-compliance` (7 Skills) and `quirgs-publish` (8 Skills) bundles. |
| `/guides/` | [src/pages/guides/index.astro](src/pages/guides/index.astro) | Index of legacy V1 guides, served verbatim from `/public/guides/`. URLs preserved for SEO. |
| `/guides/[slug]/` | [src/pages/guides/[slug].astro](src/pages/guides/[slug].astro) | Per-guide detail page rendered from the `guides` MDX collection (Keystatic-managed). Clean URLs — no collision with the legacy `.html` archive. |
| `/gate/` | [src/pages/gate.astro](src/pages/gate.astro) | HITL Gate stakeholder pitch — the case for human oversight infrastructure between an AI agent and any action it cannot take autonomously. |
| `/demo/` | [src/pages/demo.astro](src/pages/demo.astro) | Fully static HITL Gate demo queue. No Worker/D1 dependency — three events hardcoded in [public/demo.js](public/demo.js), rendered client-side. Approve/Reject fire a demo-mode message only, never a fetch. |
| `/hitl/` | [src/pages/hitl.astro](src/pages/hitl.astro) | HITL Gate docs + 90-second test. Backed by the `hitl-gate` Worker. |
| `/review/` | [src/pages/review.astro](src/pages/review.astro) | HITL Gate review queue — loads pending events, Approve/Reject. Write token entered per session. |
| `/resources/` | [src/pages/resources/index.astro](src/pages/resources/index.astro) | Resource pages. |
| `/about/` | [src/pages/about.astro](src/pages/about.astro) | What Quirgs is, the governance-first thesis, who builds it, and how the platform is operated. |
| `/security/` | [src/pages/security.astro](src/pages/security.astro) | Security & trust posture — CSP, data handling, skill distribution, vulnerability reporting, and the governance controls applied to the platform itself. |
| `/transparency/` | [src/pages/transparency.astro](src/pages/transparency.astro) | AI transparency notice — disclosure of AI-generated content, AI-assisted development, and platform governance posture. |
| `/support/` | [src/pages/support.astro](src/pages/support.astro) | GitHub Issues + social channels. |
| `/privacy/`, `/terms/` | [src/pages/privacy.astro](src/pages/privacy.astro), [src/pages/terms.astro](src/pages/terms.astro) | Legal. |
| `/keystatic/` | Provided by `@keystatic/astro` | CMS dashboard (Keystatic Cloud). Edit on a **branch**, never `main` — saves commit to the selected branch. |

---

## Content model

The `skills` collection is defined in
[src/content.config.ts](src/content.config.ts) and lives in
[src/content/skills/](src/content/skills/). Each entry is one MDX file with a
typed frontmatter contract:

- **Identity** — `title`, `slug`, `tagline`
- **Governance structure** — `pillar` (Inventory, Checkpoints, Standards
  Alignment), `framework[]`, `interoperates_with[]`
- **Invocation** — `triggers[]`, `example_prompts[]`
- **Publication state** — `status` (`live` / `draft` / `deprecated`),
  `lastUpdated`. There is **no `version` field** — the displayed skill version
  is derived at build time from the plugin manifest
  (`plugins/<name>/.claude-plugin/plugin.json`, resolved via the skill's
  `installCmd` in [src/data/skill-version.ts](src/data/skill-version.ts));
  bundle versions on `/bundles/` derive the same way. Do not re-add one.
- **Distribution** — `gistUrl` (read-only Gist preview), `marketplaceCmd` and
  `installCmd` (the two-step `/plugin` install rendered on the detail page)
- **Discovery** — `tags[]`

[Keystatic](keystatic.config.ts) is wired against the same files with **Keystatic
Cloud** storage (`quirgs-admin/quirgs`), so edits round-trip through PRs rather
than a separate database. The Keystatic schema in `keystatic.config.ts` must stay
field-for-field in lockstep with the Zod schema in `content.config.ts`, or
Keystatic refuses to open entries.

> **`slug` is intentionally optional** in `content.config.ts`. Keystatic's
> `slugField: 'slug'` stores the slug as the *filename* and strips `slug:` from
> frontmatter on save; the canonical slug is `entry.id`. Do not re-require it.

### The `guides` collection

A second collection — `guides` — is defined in the same
[src/content.config.ts](src/content.config.ts) and lives in
[src/content/guides/](src/content/guides/). These are net-new MDX guides
(Track 1 of the guides → Keystatic migration), rendered at clean
`/guides/<slug>/` URLs with no collision against the legacy `public/guides/*.html`
archive. Frontmatter contract: `title`, `slug` (optional — same Keystatic
`slugField` caveat as skills), `description`, `status` (`live` / `draft` /
`deprecated` — drafts get no built page), `lastUpdated`, `tags[]`.

Like `skills`, the `guides` schema is Keystatic-managed and must stay
field-for-field in lockstep with [keystatic.config.ts](keystatic.config.ts), and
`slug` must remain optional for the same reason.

---

## Updating skills — two pipelines

Skills live in **two independent directories** that do not talk to each other.
Keystatic only ever edits the first.

| | Site pipeline | Distribution pipeline |
| --- | --- | --- |
| Source | `src/content/skills/*.mdx` | `skills/*/SKILL.md` |
| Edited by | **Keystatic** (or by hand) | **By hand only** |
| Produces | quirgs.com skill pages | Gists + marketplace plugins |
| Automation | Cloudflare rebuild on merge | `sync-gists.yml` on `SKILL.md` change |

What is and isn't automated:

- **`sync-gists.yml` is auto, but only fires on `skills/*/SKILL.md` changes** — *not*
  on Keystatic/MDX frontmatter edits. It pushes the Gist and auto-commits
  `skills/gist-map.json`; it never writes back to MDX frontmatter.
- **`marketplace.json` is NOT automated** — no workflow touches it. New plugins are
  added by hand.
- **`lastUpdated` in MDX frontmatter is site-display only** and hand-maintained.
  The skill **version is automated**: pages derive it at build time from the
  plugin manifest, so the site can never drift from the published plugin. The
  public registry (`api.quirgs.com`) is **not** build-coupled — reseed it with
  `npm run seed:registry` after version-affecting merges (the `live-integrity`
  CI goes red until you do; that's the reminder).

### Checklist — updating an existing skill

1. **Edit every copy of the skill body** on a branch. Each skill's `SKILL.md`
   (and `references/`) exists in up to three hand-maintained copies with no
   sync between them: `skills/<slug>/` (Gist source), `plugins/<slug>/` (the
   standalone plugin, compliance skills only), and the bundle copy under
   `plugins/quirgs-compliance/` or `plugins/quirgs-publish/`. Merge to `main`
   fires `sync-gists.yml` for the Gist copy automatically.
2. **Bump the plugin manifest version(s)** — the standalone plugin's and/or the
   bundle's `.claude-plugin/plugin.json`. The site's version badges derive from
   these at build time.
3. **Edit `src/content/skills/<slug>.mdx` frontmatter** in Keystatic (bump
   `lastUpdated` and anything else changed) — **on a branch in Keystatic, never
   `main`.**
4. Distribution fields (`gistUrl`, `marketplaceCmd`, `installCmd`) are **hand-maintained**
   — update them in the MDX frontmatter if the Gist/install changes.
5. **After merge, run `npm run seed:registry`** to push the new versions to
   `api.quirgs.com` — the `live-integrity` workflow fails until the registry
   matches the manifests.

### Checklist — adding a new skill

In addition to the steps above:

6. Add the skill to the `dropOrder` array in
   [src/pages/skills/index.astro](src/pages/skills/index.astro) (it is not derived
   from frontmatter — missing skills sort to position `-1`).
7. Register the new plugin in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)
   and add its `plugins/<slug>/` directory (both manual).

---

## Backend workers

Two Cloudflare Workers run alongside the site as independent services. Each has
its own `wrangler.toml` under [workers/](workers/) and is deployed separately
from the Astro build. Both are bound to first-party custom domains (with their
`*.workers.dev` hostnames kept alive alongside).

### `workers/registry-api` — `api.quirgs.com`
KV-backed (`QUIRGS_REGISTRY`) read API for the skill catalog. Exposes the skill
list and per-skill metadata to clients that need it outside the static build.
Writes are Bearer-token gated. Entries are seeded/reseeded from MDX frontmatter
+ plugin manifests via `npm run seed:registry`.

### `workers/hitl-gate` — `gate.quirgs.com`
D1-backed (`HITL_DB`) event log for human-in-the-loop review checkpoints.
Stores `id`, `type`, `payload`, `status`, `created_at`, `updated_at`; schema
lives in `workers/hitl-gate/migrations/` (no runtime DDL). Exposes
`POST` / `GET` / `PATCH /events` — **all** of them Bearer-token gated, reads
included — plus an unauthenticated `GET /health` liveness check. `GET /events`
is paginated (`?limit=`, `?before=` keyset cursor). A daily cron archives
events after ~30 days and hard-deletes archived rows 60 days later (~90-day
total lifecycle). CORS reflects an allow-listed `Origin` only.

On every successful `POST /events` it also fires an outbound webhook to the
`WEBHOOK_URL` Worker secret (if set), carrying the event id, type, item, stage,
frameworks, status, and a `review_url`. The webhook is non-blocking
(`ctx.waitUntil`) and fire-and-forget — a webhook failure never fails the event
POST.

Both workers are plain ES modules (`index.js`) with CORS preflight and JSON
response helpers, covered by the Vitest suites below.

---

## CI

Two GitHub Actions workflows:

[`.github/workflows/sync-gists.yml`](.github/workflows/sync-gists.yml) watches
`skills/*/SKILL.md` on `main` and publishes each changed skill to its
corresponding public Gist via `.github/scripts/sync-gists.js`, auto-committing
[`skills/gist-map.json`](skills/gist-map.json) (with `[skip ci]`) when a new Gist
is created. Note that it does **not** fire on Keystatic/MDX frontmatter edits —
only on `SKILL.md` changes — and the `gistUrl`, `marketplaceCmd`, and
`installCmd` fields in each skill's MDX frontmatter are maintained by hand. See
[Updating skills](#updating-skills--two-pipelines) for the full pipeline split.

[`.github/workflows/live-integrity.yml`](.github/workflows/live-integrity.yml)
runs [`scripts/check-live-integrity.mjs`](scripts/check-live-integrity.mjs) on
every push to `main` (with retries to absorb Cloudflare deploy lag), on a daily
cron, and on manual dispatch. It asserts the **live** surfaces match the plugin
manifests: every `api.quirgs.com/skills` registry entry matches the seeder's
canonical output, each live skill page's version badge matches its plugin
manifest, and the bundles page's versions match the bundle manifests. Run it
locally with `npm run check:integrity`. A version-bump merge goes **red by
design** until `npm run seed:registry` updates the registry.

Cloudflare builds the Astro site on push and posts a preview URL per branch.
Validate against the branch preview URL, never against production.

---

## Local development

```bash
npm install
npm run dev          # astro dev — http://localhost:4321
npm run build        # astro build — emits to ./dist
npm run preview      # astro preview — preview the built site
```

The Cloudflare adapter targets static output. The site builds to `./dist` and
is served by Workers per [wrangler.jsonc](wrangler.jsonc).

Workers are developed and deployed from their own subdirectories with the
`wrangler` CLI — they do not share the Astro build pipeline.

### Tests

The Workers are covered by [Vitest](https://vitest.dev) (61 tests: 15
registry-api + 46 hitl-gate). Run them before opening a Worker PR:

```bash
npm test              # both Worker suites
npm run test:registry # registry-api only
npm run test:hitl     # hitl-gate only
```

There are no tests for the Astro site itself — the suites cover the two Workers.

---

## Design system

The terminal interface is the primary brand surface. Design tokens are declared
in [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) `:root` and
mirrored on the landing page. They are the authoritative source — do not
substitute alternate values.

```css
--bg-color:       #09090b;   /* page background       */
--term-bg:        #18181b;   /* terminal surface      */
--term-border:    #27272a;   /* borders, dividers     */
--text-main:      #a1a1aa;   /* body / dim            */
--text-bright:    #f4f4f5;   /* foreground emphasis   */
--accent-green:   #4ade80;   /* prompt, success       */
--accent-blue:    #60a5fa;   /* path, link, info      */
--accent-yellow:  #facc15;   /* warning, prerequisite */
--accent-red:     #f87171;   /* error, critical       */
```

Typography stack: `'JetBrains Mono', 'Courier New', Courier, monospace` for
the terminal interface; system UI for `/guides/` long-form. Full conventions
are in `brand/style guide/Quirgs Brand Style Guide.md`.

> **CSP is hash-pinned — [public/_headers](public/_headers).** The site ships a
> strict Content-Security-Policy with **no `'unsafe-inline'`** for `script-src`;
> the bundled inline scripts are pinned by SHA-256 hash. Changing any bundled
> script (or bumping Astro/Vite, which can rewrite the inline wrapper) goes
> stale silently with no build error — the affected script just gets CSP-blocked.
> Recompute the hashes per the instructions at the top of `public/_headers`
> whenever that happens.

---

## Working in this repo

- `main` is production. Cloudflare deploys it on push.
- Feature work branches off `main` as `feat/<scope>` and PRs back to `main`.
  Each `feat/*` branch gets its own Cloudflare preview URL — validate there,
  never against production. See `_v2/` for build plans and handoffs.
- HITL review is required at every stage where AI output influences a
  published deliverable. No AI-generated code or content reaches `main` without
  explicit human sign-off.
- Every `feat/*` / `fix/*` branch adds its entry to
  [CHANGELOG.md](CHANGELOG.md) under `## [Unreleased]` as part of the feature
  commit.
- Releases: the site/repo is versioned with CalVer (`YYYY.MM`) via git tags
  and [GitHub Releases](https://github.com/unqdlphn/quirgs/releases) — a
  monthly roll-up of the changelog's `[Unreleased]` entries. Plugins and
  bundles keep their own SemVer in `plugins/*/.claude-plugin/plugin.json`
  (surfaced on the site at build time); plugin version bumps are called out in
  the monthly release notes. `v2.0.0` is a retroactive baseline tag marking
  the V2 launch (2026-05-27); release tagging began July 2026.

---

## Related

- **Production site:** [quirgs.com](https://quirgs.com)
- **YouTube:** [@quirgs](https://youtube.com/@quirgs)
- **Issues:** [github.com/unqdlphn/quirgs/issues](https://github.com/unqdlphn/quirgs/issues)
- **Releases:** [github.com/unqdlphn/quirgs/releases](https://github.com/unqdlphn/quirgs/releases)
- **License:** see [LICENSE](LICENSE)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

*Governance first. Build accordingly.*
