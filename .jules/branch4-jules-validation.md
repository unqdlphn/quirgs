# Jules Validation Brief — Branch 4: `feat/registry-api`

**Assigned by:** HITL (Torrey Adams)  
**Branch:** `feat/registry-api` → merge target: `v2`  
**Repo:** `github.com/unqdlphn/quirgs`  
**Validate against:** Cloudflare Pages preview URL (included in PR description)  
**Report to:** PR comments — HITL will not merge without Jules sign-off  

---

## What This Branch Does

Branch 4 adds a Cloudflare Worker backed by KV storage — the **Registry API** — that serves as the skill catalog for quirgs.com. The Worker handles runtime GET reads and token-gated POST writes.

**Two files added. Nothing else changed.**

```
workers/
└── registry-api/
    ├── index.js        ← The Worker
    └── wrangler.toml   ← Cloudflare Worker config (KV binding: QUIRGS_REGISTRY)
```

No Astro pages are modified. No `public/` files are modified. No `src/` files are modified. If any of those change, flag it as a scope violation.

**This branch does not seed KV data.** All GET responses to skill-specific routes will return 404 until HITL seeds the data post-merge. That is expected and not a failure.

---

## Pre-Validation: Build Health

```bash
curl -I https://[branch-preview-url]
```

- HTTP 200 → proceed
- HTTP 4xx / 5xx → report build failure and stop

Also check the Cloudflare Pages build log for build errors before testing routes.

---

## Validation Checklist

The Worker is deployed as a Cloudflare Worker — it is accessed at a Workers URL, not at the Pages preview URL. The Worker URL will be in the PR description or in `wrangler.toml`. Validate against the Worker URL.

If no Worker URL is provided, check the PR description and Cloudflare Workers dashboard. If still not found, comment on the PR requesting the URL before proceeding.

---

### 1. Repo Hygiene

- [ ] Only `workers/registry-api/index.js` and `workers/registry-api/wrangler.toml` are added in the PR diff
- [ ] No files in `src/`, `public/`, `astro.config.mjs`, `package.json` are modified
- [ ] No CNAME file present in repo root or `public/` — if found, flag immediately (hard rule: do not add)
- [ ] No `deploy.yml` file added to `.github/workflows/` — Cloudflare deploys natively

---

### 2. Worker — `GET /skills`

```bash
curl -s https://[worker-url]/skills
```

- [ ] HTTP 200
- [ ] Response body is valid JSON
- [ ] If KV is empty (unseeded), body is `[]` — this is correct, not a failure
- [ ] `Content-Type: application/json` header present
- [ ] `Cache-Control: max-age=60` header present

---

### 3. Worker — `GET /skills/:slug` (Not Found)

```bash
curl -s -o /dev/null -w "%{http_code}" https://[worker-url]/skills/eu-ai-act-classifier
```

- [ ] HTTP 404 (KV is not seeded yet — 404 is the correct response)
- [ ] Response body is valid JSON: `{"error": "not found"}` or equivalent

---

### 4. Worker — `POST /skills/:slug` Without Auth Token

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST https://[worker-url]/skills/test \
  -H "Content-Type: application/json" \
  -d '{"title": "test"}'
```

- [ ] HTTP 401
- [ ] Response body indicates unauthorized (any form: `{"error": "unauthorized"}` or equivalent)
- [ ] No data written to KV

---

### 5. Worker — `POST /skills/:slug` With Auth Token

**Note:** Jules does not have access to the actual `REGISTRY_WRITE_TOKEN` value. HITL must provide the token for this test, or confirm that this step was manually validated by HITL before requesting Jules sign-off. If the token is not provided, flag this item as ⏳ HITL Required and do not fail the entire validation on this basis.

If the token is provided:

```bash
curl -s -X POST https://[worker-url]/skills/test \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Skill", "slug": "test"}'
```

- [ ] HTTP 200
- [ ] Response body: `{"ok": true}` or equivalent

Then confirm the write persisted:

```bash
curl -s https://[worker-url]/skills/test
```

- [ ] HTTP 200
- [ ] Response body contains the data that was written

---

### 6. Worker — Unknown Route

```bash
curl -s -o /dev/null -w "%{http_code}" https://[worker-url]/unknown-path
```

- [ ] HTTP 404
- [ ] Response body is JSON (not an HTML error page)

---

### 7. CORS Headers

```bash
curl -s -I -X OPTIONS https://[worker-url]/skills \
  -H "Origin: https://quirgs.com" \
  -H "Access-Control-Request-Method: GET"
```

- [ ] `Access-Control-Allow-Origin` header present in response
- [ ] `Access-Control-Allow-Methods` includes `GET` and `POST`

---

### 8. Existing Site — Regression Check

Validate against the Pages preview URL (not the Worker URL) to confirm B1/B2/B3 are untouched.

```bash
curl -I https://[pages-preview-url]/
curl -I https://[pages-preview-url]/skills/
curl -I https://[pages-preview-url]/bundle/
```

- [ ] `/` → HTTP 200
- [ ] `/skills/` → HTTP 200
- [ ] `/bundle/` → HTTP 200
- [ ] No JavaScript console errors on any of the above pages
- [ ] Terminal aesthetic unchanged — same font, same color variables, same chrome structure

---

## Pass / Fail Reporting

**All items pass:**
```
Jules: [Branch 4] validation passed. All checklist items confirmed. Ready for HITL merge approval.
```

**One or more failures:**
```
Jules: [Branch 4] validation — [N] item(s) failed.

❌ [Item] — [specific detail]

[If Jules pushed a self-correction:]
🔧 Fixed: [description]

Remaining failures require HITL review before this PR can be approved.
```

**Token test not runnable:**
```
Jules: [Branch 4] validation — POST auth test requires REGISTRY_WRITE_TOKEN. ⏳ HITL: please confirm this was manually validated or provide the token value for testing.
```

---

## Hard Rules (Reminder)

- **Never merge a PR.** Merge is HITL-only.
- **Never modify files in `public/guides/`.** SEO-indexed — zero content changes.
- **Never modify `src/pages/index.astro`** unless the PR explicitly targets the landing page.
- **Never push to `main` directly.** All work on feature branches merging to `v2`.
- **Never add a `deploy.yml` workflow.** Cloudflare Pages deploys natively.
- **Validate against preview URL only** — never against `quirgs.com` (production).
- **Never add a CNAME file.** Cloudflare manages domain binding. This has been incorrectly added and removed multiple times — treat any CNAME file as an automatic failure.
