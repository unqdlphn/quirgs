# Jules Validation — Phase 1: Schema Update
**Branch:** Push to your current feature branch and validate against its Cloudflare preview URL.  
**Scope:** `src/content.config.ts` + 7 MDX skill files in `src/content/skills/`  
**Date prepared:** 2026-05-25

---

## What changed

### `src/content.config.ts`
Three new fields added to the Zod collection schema:

| Field | Type | Default | Purpose |
|---|---|---|---|
| `pillar` | `z.enum(['Inventory','Checkpoints','Standards Alignment'])` | required | Maps each skill to one of the three Quirgs governance pillars |
| `interoperates_with` | `z.array(z.string()).default([])` | `[]` | Skill slugs this skill hands off to or receives from |
| `triggers` | `z.array(z.string()).default([])` | `[]` | Exact Cowork trigger phrases |
| `example_prompts` | `z.array(z.string()).default([])` | `[]` | Example prompts shown in the skill detail drawer |

### All 7 MDX files in `src/content/skills/`
Each file now includes the four new frontmatter fields. No body content was changed.

| Skill slug | Pillar assigned |
|---|---|
| `eu-ai-act-classifier` | Inventory |
| `pii-exposure-checker` | Inventory |
| `hitl-compliance-gate` | Checkpoints |
| `incident-response-logger` | Checkpoints |
| `nist-ai-rmf-checkpoint` | Standards Alignment |
| `iso-42001-audit-prep` | Standards Alignment |
| `ai-transparency-writer` | Standards Alignment |

---

## Validation checklist

### 1. Astro build
Run against the Cloudflare preview URL for this branch. The build must complete without errors.

```bash
npm run build
```

**Pass:** Build completes, `dist/` populated, no Zod schema errors in terminal output.  
**Fail:** Any `ZodError`, `type error`, or content collection parse failure.

---

### 2. Content schema validation
After build, confirm all 7 skills parsed correctly. You should see no content collection errors in the build output. If checking manually:

```bash
npx astro check
```

Confirm zero errors related to `pillar`, `interoperates_with`, `triggers`, or `example_prompts`.

**Pass:** No schema validation errors for any of the 7 MDX files.  
**Fail:** Any missing required field error or enum mismatch (e.g. pillar value not in `['Inventory','Checkpoints','Standards Alignment']`).

---

### 3. Interoperates_with slug integrity
All slugs referenced in `interoperates_with` must resolve to real skills in the collection. Confirm each slug below exists as an MDX file in `src/content/skills/`:

- `eu-ai-act-classifier` ✓
- `pii-exposure-checker` ✓
- `hitl-compliance-gate` ✓
- `incident-response-logger` ✓
- `nist-ai-rmf-checkpoint` ✓
- `iso-42001-audit-prep` ✓
- `ai-transparency-writer` ✓

**Pass:** All 7 slugs have a corresponding `.mdx` file.  
**Fail:** Any slug in `interoperates_with` has no matching file.

---

### 4. Page routes — skills
Navigate to the following routes on the Cloudflare preview URL and confirm each renders without a 404 or build error:

- `/skills/` — skills index listing
- `/skills/eu-ai-act-classifier`
- `/skills/pii-exposure-checker`
- `/skills/hitl-compliance-gate`
- `/skills/incident-response-logger`
- `/skills/nist-ai-rmf-checkpoint`
- `/skills/iso-42001-audit-prep`
- `/skills/ai-transparency-writer`

**Pass:** All 9 routes return HTTP 200 and render content.  
**Fail:** Any 404, 500, or blank page.

---

### 5. No regressions on existing routes
Confirm the following routes are unaffected:

- `/` — landing page terminal illusion
- `/bundle/` — bundle install page
- `/guides/` — legacy guides index
- One legacy guide (e.g. `/guides/ai_prompt_engineering.html`)

**Pass:** All 4 routes render correctly, no visible change from pre-branch state.  
**Fail:** Any route broken or visually degraded.

---

## Pass criteria summary

| Check | Required to merge |
|---|---|
| Astro build succeeds | ✅ Yes — blocking |
| Content schema validates (all 7 files) | ✅ Yes — blocking |
| interoperates_with slugs all resolve | ✅ Yes — blocking |
| All 9 skill routes render | ✅ Yes — blocking |
| No regressions on existing routes | ✅ Yes — blocking |

**All checks must pass before this branch is merged to `main`.** Report any failure with the route, error message, and build log excerpt.

---

## Files changed (for reference)

```
src/content.config.ts
src/content/skills/eu-ai-act-classifier.mdx
src/content/skills/pii-exposure-checker.mdx
src/content/skills/hitl-compliance-gate.mdx
src/content/skills/incident-response-logger.mdx
src/content/skills/nist-ai-rmf-checkpoint.mdx
src/content/skills/iso-42001-audit-prep.mdx
src/content/skills/ai-transparency-writer.mdx
```

No other files were modified. No new files were created. No `public/` or `workers/` changes.
