# Jules Validation Rules — quirgs.com

## Trigger

Run this workflow when HITL asks Jules to validate a branch or PR. Jules may be pointed at a PR, a branch preview URL, or both. Follow whichever instructions HITL provides.

---

## Step 1 — Find the Cloudflare Branch Preview URL

Locate the **Branch Preview URL** for the branch being validated. Cloudflare Pages generates one automatically for every push. The URL format is:

```
https://[branch-slug].quirgs-[hash].pages.dev
```

If HITL provides the URL directly, use it. If not, check the PR comments — Cloudflare Pages posts it there automatically after each build.

Use the Branch Preview URL — not a commit-specific URL. It stays stable as fixes are pushed and allows re-validation without a new URL.

If no preview URL is available yet, wait for the Cloudflare Pages build to complete. Check the Pages dashboard build log for errors first — if the build failed, report that immediately and stop.

---

## Step 2 — Confirm the Build Deployed Successfully

```bash
curl -I [preview-url]
```

- HTTP 200 → proceed to Step 3
- HTTP 4xx / 5xx / connection refused → report build failure with the status code, stop validation

---

## Step 3 — Load the Validation Checklist

HITL will provide a validation file or reference one by name. Read the file from the `.jules/` directory.

If no validation file is provided or referenced, respond:
`Jules: No validation brief provided. HITL — please supply a validation file or specify what to check before Jules proceeds.`

Do not infer or guess what to validate. Wait for a brief.

---

## Step 4 — Work the Checklist

Work through every item in the validation file against the Branch Preview URL:

- Use `curl -I [url]` to check HTTP status codes
- Use `curl -s [url]` and inspect response body to verify page content, titles, and key elements
- Check the branch diff for repo hygiene items (files modified, files that must not be present)
- For each item: mark ✅ pass or ❌ fail with specifics

If a ❌ failure is found:
1. Check the recent diff for the likely cause
2. If the fix is clearly within scope (code error, missing file, wrong path) — fix it, push to the branch, re-run validation against the updated preview URL
3. If the fix requires a HITL decision (content change, architecture question, scope issue) — do not attempt a fix; flag it in the report

---

## Step 5 — Report

**All items pass:**
```
Jules: Validation passed. All checklist items confirmed. Ready for HITL review.
```

**One or more failures (after attempting self-correction):**
```
Jules: Validation — [N] item(s) failed.

❌ [Item description] — [specific detail, e.g. exact URL that returned 404]
❌ [Item description] — [specific detail]

🔧 Fixed: [description of what was corrected and pushed, if applicable]

Remaining failures require HITL review.
```

---

## Hard Rules

- **Never merge a PR.** Merge is HITL-only.
- **Never modify files in `public/guides/`.** SEO-indexed — zero content changes.
- **Never modify `src/pages/index.astro`** unless the validation brief explicitly includes it.
- **Never push to `main` directly.** All work is on feature branches. Merges to `main` are HITL-approved only.
- **Never add a `deploy.yml` workflow.** Cloudflare deploys via native GitHub integration — no workflow file is needed or wanted.
- **Never add a `CNAME` file.** Domain binding is managed in the Cloudflare dashboard. This file has been deleted deliberately — do not restore it.
- **Never add a `.nojekyll` file.** GitHub Pages is decommissioned. `.nojekyll` was added and removed during the launch incident — do not restore it.
- **Validate against the preview URL for feature branches.** `feat/*` → v2 PRs generate branch preview URLs — always validate there. `v2 → main` deploys directly to production with no preview — smoke tests for that merge run against `quirgs.com`.
- **Do not infer what to validate.** Always work from a provided validation brief.
