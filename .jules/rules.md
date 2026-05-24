# Jules Validation Rules — quirgs.com

## Trigger

Run this workflow on every PR opened against `v2` or `main`.

---

## Step 1 — Find the Cloudflare Branch Preview URL

Locate the **Branch Preview URL** in the PR comments. Cloudflare Pages posts it automatically after each push. The URL format is:

```
https://feat-[branch-name].quirgs-[hash].pages.dev
```

Use the Branch Preview URL — not the commit-specific URL. It stays stable as fixes are pushed and allows re-validation without a new URL.

If no preview URL is posted yet, wait for the Cloudflare Pages build to complete before proceeding. Check the Pages dashboard build log for build errors first — if the build failed, report that immediately and stop.

---

## Step 2 — Confirm the Build Deployed Successfully

```bash
curl -I https://feat-[branch-name].quirgs-[hash].pages.dev
```

- HTTP 200 → proceed to Step 3
- HTTP 4xx / 5xx / connection refused → report build failure, include the status code, stop validation

---

## Step 3 — Load the Branch Validation Checklist

Read the file at:

```
[branch-name]-jules-validation.md
```

Replace `[branch-name]` with the sanitised branch name (e.g. `feat/skills-content` → `branch2`).

Current validation files:
| Branch | File |
|---|---|
| `feat/astro-scaffold` | `branch1-jules-validation.md` |
| `feat/skills-content` | `branch2-jules-validation.md` |
| `feat/bundle-page` | `branch3-jules-validation.md` |
| `feat/registry-api` | `branch4-jules-validation.md` |
| `feat/hitl-gate` | `branch5-jules-validation.md` |
| `feat/gist-sync` | `branch6-jules-validation.md` |
| `feat/keystatic` | `branch7-jules-validation.md` |

If no validation file exists for the branch, comment on the PR:
`Jules: No validation file found for this branch. HITL — please provide a validation brief before Jules can proceed.`

---

## Step 4 — Work the Checklist

Work through every item in the validation file against the Branch Preview URL:

- Use `curl -I [url]` to check HTTP status codes
- Use `curl -s [url]` and inspect response body to verify page content, titles, and key elements
- Check the PR diff directly for repo hygiene items (files modified, files that must not be present)
- For each item: mark ✅ pass or ❌ fail with specifics

If a ❌ failure is found:
1. Check the recent PR diff for the likely cause
2. If the fix is within scope (code error, missing file, wrong path) — fix it, push to the branch, and re-run validation against the updated preview URL
3. If the fix requires a HITL decision (content change, architecture question, scope issue) — do not attempt a fix; flag it in the report

---

## Step 5 — Report in PR Comments

**All items pass:**
```
Jules: [Branch N] validation passed. All checklist items confirmed. Ready for HITL merge approval.
```

**One or more failures (after attempting self-correction):**
```
Jules: [Branch N] validation — [N] item(s) failed.

❌ [Item description] — [specific detail, e.g. exact URL that returned 404]
❌ [Item description] — [specific detail]

[Fixed items should be noted if Jules pushed a correction:]
🔧 Fixed: [description of what was corrected and pushed]

Remaining failures require HITL review before this PR can be approved.
```

---

## Hard Rules

- **Never merge a PR.** Merge is HITL-only.
- **Never modify files in `public/guides/`.** SEO-indexed — zero content changes.
- **Never modify `src/pages/index.astro`** unless the PR explicitly targets the landing page.
- **Never push to `main` directly.** All work is on feature branches merging to `v2`.
- **Never add a `deploy.yml` workflow.** Cloudflare Pages deploys natively.
- **Validate against the preview URL only** — never against `quirgs.com` (production).
