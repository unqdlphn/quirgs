# Jules Validation Brief — Branch 3: `feat/bundle-page`

**Assigned by:** HITL (Torrey Adams)  
**Branch:** `feat/bundle-page` → merge target: `v2`  
**Repo:** `github.com/unqdlphn/quirgs`  
**Validate against:** Cloudflare Pages preview URL (included in PR description)  
**Report to:** PR comments — HITL will not merge without Jules sign-off  

---

## What This Branch Does

Branch 3 adds a single new page to the Astro site:

- **`/bundle/`** — terminal-style package install screen for the Quirgs Compliance Bundle. Lists all 7 compliance skills, renders a `[DOWNLOAD]` line clearly labeled as "Coming Soon" with no live download link, and links each skill slug to its future `/skills/[slug]` detail page.

The terminal landing page (`/`), the guides archive, and all legacy guide files are unchanged from Branch 1. Validate that nothing from B1 was broken.

**This branch does not include the Registry API.** The skill list is static copy. Dynamic data wiring comes in B4.

**Cloudflare Pages deploys this automatically.** Every push to `feat/bundle-page` generates a preview URL. Validate against that URL, not a local build.

---

## Validation Checklist

Work through each item against the Cloudflare preview URL in the PR description. Report each item as ✅ pass or ❌ fail with specifics.

### 1. Build Health

- [ ] Cloudflare Pages build completed with **zero errors** (check Pages dashboard build log)
- [ ] No TypeScript errors in build output
- [ ] `dist/bundle/index.html` generated in build output

### 2. `/bundle/` — Page Render

- [ ] `/bundle/` loads and returns HTTP 200
- [ ] Terminal aesthetic matches the landing page — same font family, same color variables, same `.terminal-window` / `.terminal-header` / `.terminal-body` chrome structure
- [ ] Terminal prompt line visible: `admin@quirgs ~/install $ ./get-bundle.sh quirgs-compliance`
- [ ] `[FETCHING]` line visible with bundle name and version: `quirgs-compliance v1.0 (7 skills)`

### 3. `/bundle/` — Skills Listing

- [ ] `[CONTENTS]` block is present and lists all **7 skills**:
  1. `eu-ai-act-classifier`
  2. `nist-ai-rmf-checkpoint`
  3. `hitl-compliance-gate`
  4. `ai-transparency-writer`
  5. `pii-exposure-checker`
  6. `iso-42001-audit-prep`
  7. `incident-response-logger`
- [ ] Each skill name is a hyperlink pointing to `/skills/[slug]` — inspect the `href` attribute on each link
- [ ] Links may 404 (B2 pages are not built yet) — **this is acceptable and expected**. Validate that hrefs are correctly formed, not that destinations resolve.
- [ ] No skill is missing or misspelled

### 4. `/bundle/` — Download CTA

This is the most critical check on this branch.

- [ ] `[DOWNLOAD]` line is present
- [ ] The filename `quirgs-compliance.plugin` is visible in the line
- [ ] A `↓` symbol is present
- [ ] "Coming Soon" text is clearly visible — it must be unambiguous to a user that no download is available
- [ ] **The plugin filename is NOT wrapped in an `<a>` tag** — inspect the DOM. A dead `<a href>` pointing to a non-existent file would return a 404 and is a hard failure.
- [ ] **No live download link anywhere on the page** — there must be zero `<a>` tags whose `href` references `.plugin`, `/downloads/`, or any file path that could 404

### 5. `/bundle/` — Navigation

- [ ] A back navigation element is present — either a full `ls` directory listing or a single `← back to /skills/` line above the terminal sequence
- [ ] Navigation is styled consistently with the terminal aesthetic — not a standard HTML link or button
- [ ] `<title>` is `Quirgs Compliance Bundle | AI Governance Skills`

### 6. Landing Page — Regression Check

- [ ] `/` still loads and returns HTTP 200
- [ ] Terminal animation still plays correctly — full sequence runs without errors
- [ ] No JavaScript console errors on landing page load
- [ ] `<title>` still `Quirgs | AI Governance Skills`
- [ ] Logo and favicon unchanged

### 7. Legacy Guide URLs — Regression Check (Critical)

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

### 8. Repo Hygiene — PR Diff Checks

Review the PR diff. These must NOT be present:

- [ ] `src/pages/index.astro` is **unmodified** from B1 — zero changes to the landing page
- [ ] No file in `public/guides/` modified — legacy guide content is verbatim
- [ ] No `src/content.config.ts` added (Branch 2)
- [ ] No files in `src/content/skills/` added (Branch 2)
- [ ] No `keystatic.config.ts` added (Branch 7)
- [ ] No `workers/` directory added (Branches 4 and 5)
- [ ] No `.github/workflows/` added (Branch 6)
- [ ] No `CNAME` file in repo root
- [ ] No `.env` file committed
- [ ] Only one new file in the diff: `src/pages/bundle/index.astro` (plus any shared layout or component files if Antigravity extracted one)

---

## Vulnerability Checks

- [ ] No hardcoded secrets, tokens, or API keys in any committed file
- [ ] No `.env` file committed to the repo
- [ ] No external fetch calls introduced in this branch (page is fully static)
- [ ] No `<a href>` pointing to a non-existent resource (especially the `.plugin` file)

---

## Pass Criteria

**All items checked ✅ with no failures** = leave a comment on the PR:

`Jules: Branch 3 validation passed. All checklist items confirmed. Ready for HITL merge approval.`

---

## Fail Criteria

Any ❌ failure = leave a comment on the PR listing each failed item with specifics (exact DOM element that wraps the download link, exact skill missing from the listing, exact file modified unexpectedly). Do not approve. HITL will route back to Antigravity for a fix.

**Auto-fail conditions — these are hard failures regardless of everything else passing:**

- A live `<a href>` tag wraps `quirgs-compliance.plugin` or any download path — this is a broken link waiting to be discovered by users and search crawlers
- Any legacy guide URL returns anything other than 200
- `src/pages/index.astro` has any diff from B1

---

## What Jules Does NOT Do Here

- Does not merge the PR — that is HITL only
- Does not test the production `main` branch or `v2` — preview URL only
- Does not evaluate whether the `/skills/[slug]` links resolve (they will 404 until B2 merges — this is expected and acceptable)
- Does not evaluate visual design or brand quality beyond terminal aesthetic consistency
- Does not validate B2 content (skills pages, MDX rendering, content collection) — those have their own brief
