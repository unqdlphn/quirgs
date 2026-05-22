# Jules Validation Brief — Branch 2: `feat/skills-content`

**Assigned by:** HITL (Torrey Adams)  
**Branch:** `feat/skills-content` → merge target: `v2`  
**Repo:** `github.com/unqdlphn/quirgs`  
**Validate against:** Cloudflare Pages preview URL (included in PR description)  
**Report to:** PR comments — HITL will not merge without Jules sign-off  

---

## What This Branch Does

Branch 2 adds the content layer and three new pages to the Astro site:

- **Content collection** — `src/content.config.ts` (Astro 6 schema, glob loader) + 7 MDX skill files in `src/content/skills/`
- **`/skills/`** — terminal `ls -la` listing of all 7 compliance skills
- **`/skills/[slug]`** — individual skill detail pages (7 dynamic routes, MDX body rendered)
- **`/guides/`** — legacy guides archive with links to 7 preserved HTML files

The terminal landing page (`/`) and all legacy guide files are unchanged from Branch 1. Validate that nothing from B1 was broken.

**Cloudflare Pages deploys this automatically.** Every push to `feat/skills-content` generates a preview URL. Validate against that URL, not a local build.

---

## Validation Checklist

Work through each item against the Cloudflare preview URL in the PR description. Report each item as ✅ pass or ❌ fail with specifics.

### 1. Build Health

- [ ] Cloudflare Pages build completed with **zero errors** (check Pages dashboard build log)
- [ ] No TypeScript or content collection schema errors in build output
- [ ] All 9 expected routes generated in `dist/`: `/skills/`, 7 skill slug pages, `/guides/`

### 2. `/skills/` — Listing Page

- [ ] `/skills/` loads and returns HTTP 200
- [ ] All 7 skill rows are visible
- [ ] Rows appear in **drop schedule order** (top to bottom):
  1. `pii-exposure-checker`
  2. `iso-42001-audit-prep`
  3. `hitl-compliance-gate`
  4. `incident-response-logger`
  5. `eu-ai-act-classifier`
  6. `nist-ai-rmf-checkpoint`
  7. `ai-transparency-writer`
- [ ] Each row displays: slug, version (`v1.0`), status badge (`[live]`), and tagline
- [ ] Each slug is a working hyperlink — click all 7, confirm each lands on the correct `/skills/[slug]` page
- [ ] No broken or 404 links in the listing
- [ ] `<title>` is `Skills | Quirgs`
- [ ] Terminal aesthetic matches the landing page (same font, color variables, terminal chrome)

### 3. `/skills/[slug]` — Detail Pages (all 7)

Check each of the following URLs returns HTTP 200 and renders correctly:

- [ ] `/skills/pii-exposure-checker`
- [ ] `/skills/iso-42001-audit-prep`
- [ ] `/skills/hitl-compliance-gate`
- [ ] `/skills/incident-response-logger`
- [ ] `/skills/eu-ai-act-classifier`
- [ ] `/skills/nist-ai-rmf-checkpoint`
- [ ] `/skills/ai-transparency-writer`

For **at least two** detail pages (one from each end of the drop order), verify the following:

- [ ] MDX body renders as HTML — not raw markdown, not raw frontmatter
- [ ] All four body sections present: `## What it does`, `## Frameworks covered`, `## When to use it`, `## Example output (abbreviated)`
- [ ] Title, tagline, version, and status badge visible in the header block
- [ ] **Install block is absent** — neither `gistUrl` nor `installCmd` are populated yet; no install block should render anywhere on the page
- [ ] Back navigation link present (returns to `/skills/`)
- [ ] `<title>` follows pattern `[Skill Title] | Quirgs Skills`
- [ ] Terminal aesthetic consistent with listing page and landing page

### 4. `/guides/` — Archive Page

- [ ] `/guides/` loads and returns HTTP 200
- [ ] Exactly **6 guide links** are visible (not 7 — `index.html` is excluded per spec)
- [ ] All 6 links are present and correctly labeled:
  - [ ] `ai_prompt_engineering.html` → "AI Prompt Engineering"
  - [ ] `copilot_commands_reference.html` → "Copilot Commands Reference"
  - [ ] `gemma_vs_gemini_guide.html` → "Gemma vs Gemini"
  - [ ] `git_workflow_reference.html` → "Git Workflow Reference"
  - [ ] `ollama_anythingllm_guide.html` → "Ollama + AnythingLLM"
  - [ ] `taco_marketing_strategy.html` → "Taco Marketing Strategy"
- [ ] Each link resolves to HTTP 200 at its exact `/guides/[filename]` path
- [ ] Archive note present below the listing (text references V1 preservation and directs new content to `/skills/`)
- [ ] `<title>` is `Guides Archive | Quirgs`
- [ ] Terminal aesthetic consistent with rest of site

### 5. Landing Page — Regression Check

- [ ] `/` still loads and returns HTTP 200
- [ ] Terminal animation still plays correctly — full sequence runs without errors
- [ ] No JavaScript console errors on landing page load
- [ ] `<title>` still `Quirgs | AI Governance Skills`
- [ ] Logo and favicon unchanged

### 6. Legacy Guide URLs — Regression Check (Critical)

These are SEO-indexed. They must still resolve at exact historical paths:

- [ ] `/guides/index.html` → 200
- [ ] `/guides/ai_prompt_engineering.html` → 200
- [ ] `/guides/copilot_commands_reference.html` → 200
- [ ] `/guides/gemma_vs_gemini_guide.html` → 200
- [ ] `/guides/git_workflow_reference.html` → 200
- [ ] `/guides/ollama_anythingllm_guide.html` → 200
- [ ] `/guides/taco_marketing_strategy.html` → 200
- [ ] `/css/styles.css` → 200

Open at least one guide and confirm it renders the original content — not a blank or error page.

### 7. Repo Hygiene — PR Diff Checks

Review the PR diff. These must NOT be present:

- [ ] `src/pages/index.astro` is **unmodified** from B1 — zero changes to the landing page
- [ ] No file in `public/guides/` modified — legacy guide content is verbatim
- [ ] No `keystatic.config.ts` added (Branch 7)
- [ ] No `workers/` directory added (Branches 4 and 5)
- [ ] No `.github/workflows/` added (Branch 6)
- [ ] No `CNAME` file in repo root
- [ ] No `.env` file committed

### 8. Content Collection — Schema Checks

Review the PR diff for `src/content.config.ts`:

- [ ] Config is at `src/content.config.ts` — **not** `src/content/config.ts` (legacy path is a fatal Astro 6 error)
- [ ] Uses `glob()` loader from `astro/loaders`
- [ ] Uses `z.coerce.date()` for `lastUpdated` — not `z.date()`
- [ ] `gistUrl` field is `optional()` in schema

Spot-check one MDX file in `src/content/skills/`:

- [ ] Frontmatter contains all required fields: `title`, `slug`, `tagline`, `framework`, `status`, `version`, `lastUpdated`, `installCmd`, `tags`
- [ ] `gistUrl` is **absent** from frontmatter (CI populates this later — must not be hardcoded)
- [ ] No `## Install` section in the MDX body

---

## Vulnerability Checks

- [ ] No hardcoded secrets, tokens, or API keys in any committed file
- [ ] No `.env` file committed to the repo
- [ ] `src/content.config.ts` does not expose any server-side credentials
- [ ] No external fetch calls introduced in this branch (content is static)

---

## Pass Criteria

**All items checked ✅ with no failures** = leave a comment on the PR:

`Jules: Branch 2 validation passed. All checklist items confirmed. Ready for HITL merge approval.`

---

## Fail Criteria

Any ❌ failure = leave a comment on the PR listing each failed item with specifics (exact URL that returned 404, exact field missing from frontmatter, exact file modified unexpectedly). Do not approve. HITL will route back to Antigravity for a fix.

---

## What Jules Does NOT Do Here

- Does not merge the PR — that is HITL only
- Does not test the production `main` branch or `v2` — preview URL only
- Does not evaluate visual design or brand quality beyond terminal aesthetic consistency
- Does not validate later branches (B3–B7 have separate briefs)
