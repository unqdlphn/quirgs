# Jules Validation Brief — Branch 5: `feat/hitl-gate`

**Assigned by:** HITL (Torrey Adams)  
**Branch:** `feat/hitl-gate` → merge target: `v2`  
**Repo:** `github.com/unqdlphn/quirgs`  
**Validate against:** Cloudflare Pages preview URL (pages.dev) for repo hygiene; Worker `workers.dev` URL for API tests — both included in PR description  
**Report to:** PR comments — HITL will not merge without Jules sign-off

---

## What This Branch Does

Branch 5 adds the **HITL Gate Worker** — a Cloudflare Worker backed by D1 (SQLite) that serves as the event log for human-in-the-loop review checkpoints.

Two files are added. Nothing else is modified:

```
workers/
└── hitl-gate/
    ├── index.js        ← The Worker (D1-backed event log)
    └── wrangler.toml   ← Cloudflare Worker config (D1 binding: HITL_DB)
```

The Worker is deployed separately via `wrangler deploy` and accessible at `quirgs-hitl-gate.workers.dev`. The Cloudflare Pages site is unchanged from B4.

---

## Step 0 — Confirm Both URLs Are Available

Before running any checks, confirm the PR description includes:

1. **Cloudflare Pages preview URL** — format: `https://feat-hitl-gate.quirgs-[hash].pages.dev`
2. **Worker URL** — format: `https://quirgs-hitl-gate.[account].workers.dev`

If either URL is missing: comment on the PR requesting both before proceeding.

---

## Validation Checklist

Work through each item in order. Report each as ✅ pass or ❌ fail with specifics.

---

### 1. Build Health — Pages Preview

- [ ] Cloudflare Pages build completed with **zero errors** (check Pages dashboard build log)
- [ ] `curl -I https://feat-hitl-gate.quirgs-[hash].pages.dev` → HTTP 200
- [ ] No new TypeScript, Astro, or build errors introduced by this branch

---

### 2. Worker Deployment Health

```bash
curl -I https://quirgs-hitl-gate.[account].workers.dev/events
```

- [ ] Returns HTTP 200 (not 404, not 500, not connection refused)
- [ ] `Content-Type: application/json` header present in response
- [ ] Response body is a valid JSON array (empty `[]` is expected on a fresh deployment)

---

### 3. `GET /events` — List Events

```bash
curl -s https://quirgs-hitl-gate.[account].workers.dev/events
```

- [ ] HTTP 200
- [ ] Valid JSON array in response body
- [ ] Empty array `[]` is acceptable — confirms D1 connection is live and table initialized

---

### 4. `POST /events` — Auth Gate

**No token (should fail):**

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://quirgs-hitl-gate.[account].workers.dev/events \
  -H "Content-Type: application/json" \
  -d '{"type":"test","payload":{}}'
```

- [ ] Returns HTTP **401**

**Wrong token (should fail):**

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://quirgs-hitl-gate.[account].workers.dev/events \
  -H "Authorization: Bearer wrongtoken" \
  -H "Content-Type: application/json" \
  -d '{"type":"test","payload":{}}'
```

- [ ] Returns HTTP **401**

---

### 5. `POST /events` — Valid Event Creation

```bash
curl -s -X POST \
  https://quirgs-hitl-gate.[account].workers.dev/events \
  -H "Authorization: Bearer <HITL_WRITE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"type":"blog-deploy-gate","payload":{"post":"test-post","status":"ready"}}'
```

- [ ] Returns HTTP **201**
- [ ] Response body contains `{"ok": true, "id": "<uuid>"}` — `id` is a valid UUID string
- [ ] Save the returned `id` for use in Steps 6, 7, and 8

---

### 6. `GET /events/:id` — Retrieve Created Event

Using the `id` from Step 5:

```bash
curl -s https://quirgs-hitl-gate.[account].workers.dev/events/<id>
```

- [ ] Returns HTTP **200**
- [ ] Response body contains the event with `"status": "pending"`
- [ ] `type` matches `"blog-deploy-gate"`
- [ ] `payload` matches the submitted payload
- [ ] `created_at` and `updated_at` are present and are integers (Unix timestamps)

---

### 7. `GET /events` — Event Appears in Listing

```bash
curl -s https://quirgs-hitl-gate.[account].workers.dev/events
```

- [ ] Returns HTTP **200**
- [ ] The event from Step 5 is present in the array
- [ ] Array contains exactly the events created during this validation (no phantom data)

---

### 8. `PATCH /events/:id` — Status Update

**No token (should fail):**

```bash
curl -s -o /dev/null -w "%{http_code}" -X PATCH \
  https://quirgs-hitl-gate.[account].workers.dev/events/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

- [ ] Returns HTTP **401**

**Valid token, valid status update:**

```bash
curl -s -X PATCH \
  https://quirgs-hitl-gate.[account].workers.dev/events/<id> \
  -H "Authorization: Bearer <HITL_WRITE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}'
```

- [ ] Returns HTTP **200**
- [ ] Response body: `{"ok": true}`

**Confirm status updated:**

```bash
curl -s https://quirgs-hitl-gate.[account].workers.dev/events/<id>
```

- [ ] `"status"` is now `"approved"`
- [ ] `updated_at` is greater than `created_at` (timestamp updated)

---

### 9. `GET /events/:id` — Not Found

```bash
curl -s -o /dev/null -w "%{http_code}" \
  https://quirgs-hitl-gate.[account].workers.dev/events/nonexistent-id-xyz
```

- [ ] Returns HTTP **404**

---

### 10. Invalid Route

```bash
curl -s -o /dev/null -w "%{http_code}" \
  https://quirgs-hitl-gate.[account].workers.dev/notaroute
```

- [ ] Returns HTTP **404**

---

### 11. CORS Headers

```bash
curl -s -I -X OPTIONS \
  https://quirgs-hitl-gate.[account].workers.dev/events \
  -H "Origin: https://quirgs.com" \
  -H "Access-Control-Request-Method: POST"
```

- [ ] Response includes `Access-Control-Allow-Origin: *`
- [ ] Response includes `Access-Control-Allow-Methods` containing `GET`, `POST`, `PATCH`

---

### 12. Regression — Landing Page Unchanged

```bash
curl -I https://feat-hitl-gate.quirgs-[hash].pages.dev/
```

- [ ] HTTP 200
- [ ] Landing page loads and terminal animation is intact (spot check page source for terminal sequence)

---

### 13. Regression — Legacy Guides Unchanged

```bash
curl -I https://feat-hitl-gate.quirgs-[hash].pages.dev/guides/ai_prompt_engineering.html
curl -I https://feat-hitl-gate.quirgs-[hash].pages.dev/guides/git_workflow_reference.html
```

- [ ] Both return HTTP 200
- [ ] Content unchanged (legacy HTML preserved verbatim)

---

### 14. Repo Hygiene — PR Diff Checks

Review the PR diff. These must be true:

- [ ] **Only two files added**: `workers/hitl-gate/index.js` and `workers/hitl-gate/wrangler.toml`
- [ ] `wrangler.toml` contains `binding = "HITL_DB"` and `database_name = "quirgs-hitl-db"`
- [ ] `wrangler.toml` does **not** contain a hardcoded `HITL_WRITE_TOKEN` value — token is set as a Worker secret, not in config
- [ ] No file in `src/` modified
- [ ] No file in `public/guides/` modified
- [ ] `workers/registry-api/` files are **unmodified** from B4
- [ ] No `CNAME` file added
- [ ] No `deploy.yml` added or modified
- [ ] No `.env` file committed
- [ ] No hardcoded secrets or tokens in `index.js` — `HITL_WRITE_TOKEN` referenced only as `env.HITL_WRITE_TOKEN`
- [ ] Branch merges to `v2`, not `main`

---

### 15. Vulnerability Checks

- [ ] No hardcoded secrets, tokens, or API keys in any committed file
- [ ] `HITL_WRITE_TOKEN` is consumed from `env.HITL_WRITE_TOKEN` (Worker environment), never hardcoded
- [ ] No `console.log` statements that would expose token values in Worker logs
- [ ] D1 queries use parameterized statements — no raw string interpolation into SQL

---

## Pass Criteria

**All items checked ✅ with no failures** → leave a comment on the PR:

```
Jules: Branch 5 validation passed. All checklist items confirmed. Ready for HITL merge approval.
```

---

## Fail Criteria

Any ❌ failure → leave a comment on the PR listing each failed item with specifics (exact URL, exact HTTP code returned, exact field missing). Do not approve. HITL will route back to Antigravity for a fix.

---

## What Jules Does NOT Do Here

- Does not merge the PR — that is HITL only
- Does not create or modify the D1 database — that is HITL only
- Does not set or retrieve the `HITL_WRITE_TOKEN` — HITL provides it before validation begins
- Does not test `main` or production `quirgs.com` — Pages preview and Worker `workers.dev` URL only
- Does not validate B6 or any other branch
