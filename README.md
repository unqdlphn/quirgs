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

The current production catalog is seven Skills covering the EU AI Act, NIST AI
RMF, ISO/IEC 42001, HITL gating, PII exposure, incident response, and AI
transparency disclosure. See [`src/content/skills/`](src/content/skills/).

---

## Installing the skills

The Skills are distributed as a [Claude Code plugin
marketplace](https://code.claude.com/docs/en/plugin-marketplaces). The
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) at the repo
root lists eight plugins — the seven-skill `quirgs-compliance` bundle plus one
single-skill plugin per Skill — and each plugin's source lives under
[`plugins/`](plugins/) with its full `SKILL.md` and `references/` committed so
they survive install.

Inside Claude Code, add the marketplace once, then install:

```
/plugin marketplace add unqdlphn/quirgs
/plugin install quirgs-compliance@quirgs        # all seven skills
/plugin install eu-ai-act-classifier@quirgs     # or a single skill
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
| Content | Astro Content Collections + MDX, edited via [Keystatic](https://keystatic.com) at `/keystatic/` |
| Hosting | Cloudflare (production domain: `quirgs.com`) |
| Backend services | Cloudflare Workers — KV + D1 |
| CI | GitHub Actions (`sync-gists.yml`) |
| Node | `>=22.12.0` (see [package.json](package.json)) |

---

## Repository layout

```
quirgs/
├── src/
│   ├── pages/                  # Astro routes
│   │   ├── index.astro         # Terminal landing — boot sequence + skill ls
│   │   ├── skills/             # /skills/ index + dynamic [slug] detail pages
│   │   ├── bundle/             # /bundle/ — compliance bundle install page
│   │   ├── guides/             # /guides/ — legacy archive index
│   │   ├── transparency.astro  # AI transparency notice
│   │   ├── support.astro       # Contact + community
│   │   ├── privacy.astro       # Privacy notice
│   │   └── terms.astro         # Terms
│   ├── layouts/
│   │   └── BaseLayout.astro    # Terminal-frame shell + design tokens
│   ├── components/
│   │   ├── NavBlock.astro      # Terminal-style site nav (ls listing)
│   │   ├── Footer.astro        # Footer block
│   │   └── HelpModal.astro     # [?] help dialog
│   ├── content/
│   │   └── skills/             # 7 .mdx skill entries — source of truth
│   └── content.config.ts       # Zod schema for the skills collection
├── .claude-plugin/
│   └── marketplace.json        # Plugin marketplace catalog (name: quirgs)
├── plugins/                    # Installable Claude Code plugins
│   ├── quirgs-compliance/      # Bundle — all 7 skills
│   └── <slug>/                 # One single-skill plugin per Skill
├── public/
│   ├── assets/                 # Logos, favicon assets
│   ├── css/                    # Static stylesheets
│   └── guides/                 # Legacy V1 HTML guides (SEO URLs preserved)
├── workers/
│   ├── registry-api/           # KV-backed skill catalog API
│   └── hitl-gate/              # D1-backed HITL review event log
├── skills/                     # Source-of-truth SKILL.md files (synced to Gists)
├── .github/
│   ├── workflows/sync-gists.yml
│   └── scripts/sync-gists.js
├── keystatic.config.ts         # CMS config — collections + GitHub storage
├── astro.config.mjs            # Static output + Cloudflare adapter
├── wrangler.jsonc              # Workers deployment config for the site
└── _v2/                        # Build planning, session prompts, handoffs
```

---

## Routes

| Path | Source | Purpose |
| --- | --- | --- |
| `/` | [src/pages/index.astro](src/pages/index.astro) | Animated terminal boot sequence. JS-injected DOM, no CSS keyframe drift-ins. Lists the seven Skills and links to bundle, guides, and skill detail pages. |
| `/skills/` | [src/pages/skills/index.astro](src/pages/skills/index.astro) | Skill registry. Reads the `skills` content collection, sorts by drop order, renders an aligned `ls -la` listing. |
| `/skills/[slug]/` | [src/pages/skills/[slug].astro](src/pages/skills/[slug].astro) | Per-skill detail page rendered from MDX with badges, install block, and interop references. |
| `/bundle/` | [src/pages/bundle/index.astro](src/pages/bundle/index.astro) | Compliance bundle install page — marketplace install commands for `quirgs-compliance` (7 Skills). |
| `/guides/` | [src/pages/guides/index.astro](src/pages/guides/index.astro) | Index of legacy V1 guides, served verbatim from `/public/guides/`. URLs preserved for SEO. |
| `/transparency/` | [src/pages/transparency.astro](src/pages/transparency.astro) | AI transparency notice — disclosure of AI-generated content, AI-assisted development, and platform governance posture. |
| `/support/` | [src/pages/support.astro](src/pages/support.astro) | GitHub Issues + social channels. |
| `/privacy/`, `/terms/` | [src/pages/privacy.astro](src/pages/privacy.astro), [src/pages/terms.astro](src/pages/terms.astro) | Legal. |
| `/keystatic/` | Provided by `@keystatic/astro` | CMS dashboard for editing the skills collection. |

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
- **Publication state** — `status` (`live` / `draft` / `deprecated`), `version`,
  `lastUpdated`
- **Distribution** — `gistUrl` (read-only Gist preview), `marketplaceCmd` and
  `installCmd` (the two-step `/plugin` install rendered on the detail page)
- **Discovery** — `tags[]`

[Keystatic](keystatic.config.ts) is wired against the same files with GitHub
storage at `unqdlphn/quirgs`, so edits round-trip through PRs rather than a
separate database.

---

## Backend workers

Two Cloudflare Workers run alongside the site as independent services. Each has
its own `wrangler.toml` under [workers/](workers/) and is deployed separately
from the Astro build.

### `workers/registry-api`
KV-backed (`QUIRGS_REGISTRY`) read API for the skill catalog. Exposes the skill
list and per-skill metadata to clients that need it outside the static build.

### `workers/hitl-gate`
D1-backed (`HITL_DB`) event log for human-in-the-loop review checkpoints. Lazy
30-day TTL on rows. Stores `id`, `type`, `payload`, `status`, `created_at`,
`updated_at`.

Both workers are scaffolded as plain ES modules (`index.js`) with CORS
preflight, JSON response helpers, and table bootstrapping on first hit.

---

## CI

[`.github/workflows/sync-gists.yml`](.github/workflows/sync-gists.yml) watches
`skills/*/SKILL.md` on `main` and publishes each changed skill to its
corresponding public Gist via `.github/scripts/sync-gists.js`, updating
[`skills/gist-map.json`](skills/gist-map.json) when a new Gist is created. The
`gistUrl`, `marketplaceCmd`, and `installCmd` fields in each skill's MDX
frontmatter are maintained by hand, not auto-populated by this workflow.

Cloudflare builds the Astro site on push and posts a preview URL per branch.
PR validation against the preview is documented in
[MAINTENANCE.md](MAINTENANCE.md).

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

---

## Working in this repo

- `main` is production. Cloudflare deploys it on push.
- Feature work branches off `main` as `feat/<scope>` and PRs back to `main`.
  Each `feat/*` branch gets its own Cloudflare preview URL — validate there,
  never against production. See `_v2/` for build plans and handoffs.
- HITL review is required at every stage where AI output influences a
  published deliverable. No AI-generated code or content reaches `main` without
  explicit human sign-off.

---

## Related

- **Production site:** [quirgs.com](https://quirgs.com)
- **YouTube:** [@quirgs](https://youtube.com/@quirgs)
- **Issues:** [github.com/unqdlphn/quirgs/issues](https://github.com/unqdlphn/quirgs/issues)
- **License:** see [LICENSE](LICENSE)
- **Maintenance / PR validation:** [MAINTENANCE.md](MAINTENANCE.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

*Governance first. Build accordingly.*
