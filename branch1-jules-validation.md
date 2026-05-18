# Jules Validation Brief — Branch 1: `feat/astro-scaffold`

**Assigned by:** HITL (Torrey Adams)  
**Branch:** `feat/astro-scaffold` → merge target: `main`  
**Repo:** `github.com/unqdlphn/quirgs`  
**Validate against:** Cloudflare Pages preview URL (included in PR description)  
**Report to:** PR comments — HITL will not merge without Jules sign-off  

---

## What This Branch Does

Branch 1 migrates quirgs.com from a single vanilla HTML file to an Astro static site. It is purely structural — no new features, no CMS, no content beyond what the current site has. The terminal illusion landing page must be preserved exactly. Seven legacy HTML guide files must remain at their exact URLs unchanged.

**Cloudflare Pages deploys this automatically.** Every push to `feat/astro-scaffold` generates a preview URL. Validate against that URL, not a local build.

---

## Validation Checklist

Work through each item against the Cloudflare preview URL in the PR description. Report each item as ✅ pass or ❌ fail with specifics.

### 1. Build Health

- [ ] Cloudflare Pages build completed with **zero errors** (check Pages dashboard build log)
- [ ] No TypeScript errors in build output
- [ ] No missing dependency warnings that affect the build

### 2. Landing Page — Terminal Illusion

- [ ] Root `/` loads and returns HTTP 200
- [ ] Terminal animation plays in browser — the full 4-act sequence runs (shutdown → build → skills listing → install CTA)
- [ ] No JavaScript console errors on page load
- [ ] `<title>` is `Quirgs | AI Governance Skills`
- [ ] Logo renders at correct position (top-left or as specified in original design)
- [ ] Favicon appears in browser tab

### 3. Asset Path Verification

The 3 asset paths that changed in the Astro port — verify each resolves correctly in the preview:

- [ ] `/favicon.ico` → 200 (not 404)
- [ ] `/favicon.svg` → 200 (not 404)
- [ ] `/assets/logo.png` → 200, logo renders on landing page

### 4. Legacy Guides — URL Preservation (Critical)

These files are SEO-indexed. They must be accessible at their exact historical paths. Check each URL in the preview:

- [ ] `/guides/index.html` → 200
- [ ] `/guides/ai_prompt_engineering.html` → 200
- [ ] `/guides/copilot_commands_reference.html` → 200
- [ ] `/guides/gemma_vs_gemini_guide.html` → 200
- [ ] `/guides/git_workflow_reference.html` → 200
- [ ] `/guides/ollama_anythingllm_guide.html` → 200
- [ ] `/guides/taco_marketing_strategy.html` → 200
- [ ] `/css/styles.css` → 200 (guides depend on this stylesheet)

Also verify: **content of at least one guide file is unmodified** — open `/guides/ai_prompt_engineering.html` and confirm it renders the original guide, not a blank or error page.

### 5. Repo Hygiene

Check the PR diff for these — they must NOT be present:

- [ ] No `CNAME` file in repo root (should have been deleted — Cloudflare manages domain)
- [ ] No `index_old.html` in repo root (should have been deleted)
- [ ] No `.github/workflows/deploy.yml` added (Cloudflare deploys natively — no deploy workflow needed)
- [ ] `_v2/` directory untouched (architecture docs only — no files modified inside it)

### 6. Astro Config Correctness

Review `astro.config.mjs` in the PR diff:

- [ ] `output: 'static'` is set
- [ ] `site: 'https://quirgs.com'` is set
- [ ] No extra integrations added (this branch is minimal — no Keystatic, no MDX, no React)

### 7. Scope Check — Nothing Extra Added

This branch must not contain work from later branches. Flag and block if any of the following appear in the diff:

- [ ] No `src/content/` directory (skills MDX — Branch 2)
- [ ] No `src/pages/skills/` (Branch 2)
- [ ] No `src/pages/bundle/` (Branch 3)
- [ ] No `workers/` directory (Branches 4 and 5)
- [ ] No `keystatic.config.ts` (Branch 7)
- [ ] No `skills/` directory (Branch 2)

---

## Vulnerability Checks

- [ ] No hardcoded secrets, tokens, or API keys in any committed file
- [ ] No `.env` file committed to the repo
- [ ] `package.json` dependencies are current Astro stable — no known CVEs in build toolchain

---

## Pass Criteria

**All items checked ✅ with no failures** = leave a comment on the PR: `Jules: Branch 1 validation passed. All checklist items confirmed. Ready for HITL merge approval.`

---

## Fail Criteria

Any ❌ failure = leave a comment on the PR listing each failed item with specifics (exact URL that returned 404, exact file that was modified unexpectedly, etc.). Do not approve. HITL will route back to Antigravity for a fix.

---

## What Jules Does NOT Do Here

- Does not merge the PR — that is HITL only
- Does not test the production `main` branch — preview URL only
- Does not evaluate visual design or brand quality
- Does not validate later branches (B2–B7 have separate briefs)
