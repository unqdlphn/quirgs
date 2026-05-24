# Branch 7 — Jules Validation Brief
**Branch:** `feat/keystatic`  
**Preview URL pattern:** `https://feat-keystatic.quirgs-[hash].pages.dev`  
**Validation scope:** Hybrid mode regression check + Keystatic route + repo hygiene  
**Session date:** 2026-05-23  

> **Note:** B7 switches Astro output mode from `static` to `hybrid`. The primary validation concern is that all existing public routes still render correctly as static pages. The Keystatic admin UI at `/keystatic/` is the one new server-rendered route to verify. OAuth is HITL-configured via Cloudflare env vars — Jules cannot validate the full OAuth flow, only that the route responds.

---

## Pre-Validation — Confirm Build Deployed

```bash
curl -I https://feat-keystatic.quirgs-[hash].pages.dev
```

- HTTP 200 → proceed
- HTTP 4xx / 5xx → report build failure, include status code, stop

If the build failed, check the Cloudflare Pages build log first. A failed build in B7 is most likely one of:
- Missing `@astrojs/cloudflare` adapter (install step incomplete)
- `output: 'hybrid'` set without the adapter (Astro will error — adapter is required)
- Keystatic config syntax error in `keystatic.config.ts`

---

## Checklist

### 1. Site Integrity — No Regressions from Hybrid Mode Switch

This is the highest-priority check. All existing routes must still return HTTP 200.

| Check | Method | Pass Condition |
|---|---|---|
| Landing page loads | `curl -s [preview-url]/` | HTTP 200; terminal illusion content present |
| Skills index loads | `curl -s [preview-url]/skills/` | HTTP 200 |
| At least one skill detail page loads | `curl -s [preview-url]/skills/eu-ai-act-classifier/` | HTTP 200 |
| Bundle page loads | `curl -s [preview-url]/bundle/` | HTTP 200 |
| Guides index loads | `curl -s [preview-url]/guides/` | HTTP 200 |
| Legacy guide preserved | `curl -I [preview-url]/guides/ai_prompt_engineering.html` | HTTP 200 |
| Legacy guide preserved | `curl -I [preview-url]/guides/copilot_commands_reference.html` | HTTP 200 |

### 2. Keystatic Admin UI — New Server Route

| Check | Method | Pass Condition |
|---|---|---|
| Keystatic admin route responds | `curl -I [preview-url]/keystatic/` | HTTP 200 (or 302 redirect to login) — any non-5xx is acceptable |

> **Note:** The Keystatic admin UI requires a logged-in GitHub session to use. Jules is not expected to complete the OAuth flow — confirming the route is reachable and returns a non-error status is sufficient.

### 3. New / Modified Files — Present and Correct

| Check | Method | Pass Condition |
|---|---|---|
| `keystatic.config.ts` present at repo root | PR diff | File exists at `/keystatic.config.ts` |
| `astro.config.mjs` updated | PR diff | File is modified in PR |
| `package.json` updated | PR diff | Three new deps present: `@keystatic/core`, `@keystatic/astro`, `@astrojs/cloudflare` |
| `package-lock.json` updated | PR diff | Lock file reflects new installs |

### 4. `astro.config.mjs` — Correctness

| Check | Method | Pass Condition |
|---|---|---|
| `output` is `'hybrid'` | Read file | `output: 'hybrid'` present |
| Cloudflare adapter imported and used | Read file | `import cloudflare from '@astrojs/cloudflare'` + `adapter: cloudflare()` |
| Keystatic integration imported and added | Read file | `import keystatic from '@keystatic/astro'` + `keystatic()` in integrations array |
| MDX integration still present | Read file | `mdx()` still present in integrations array — must not be removed |
| `site` still set | Read file | `site: 'https://quirgs.com'` unchanged |

### 5. `keystatic.config.ts` — Correctness

| Check | Method | Pass Condition |
|---|---|---|
| Storage mode is `github` | Read file | `storage: { kind: 'github', repo: 'unqdlphn/quirgs' }` |
| Collection is `skills` | Read file | `collections: { skills: collection({...}) }` |
| `slugField` is `'slug'` | Read file | `slugField: 'slug'` |
| `path` targets skills content dir | Read file | `path: 'src/content/skills/*'` |
| All schema fields present | Read file | `title`, `tagline`, `framework`, `status`, `version`, `lastUpdated`, `gistUrl`, `installCmd`, `tags`, `content` all defined |
| `content` field is `fields.mdx()` | Read file | `content: fields.mdx({ label: 'Content' })` |
| `status` options are correct | Read file | Options include `live`, `draft`, `deprecated` |

### 6. Repo Hygiene — Hard Rules

| Check | Method | Pass Condition |
|---|---|---|
| No `deploy.yml` | PR diff | `.github/workflows/deploy.yml` does NOT exist |
| No `CNAME` file | PR diff | `CNAME` does NOT exist at repo root |
| No `public/guides/` edits | PR diff | Zero changes to any file under `public/guides/` |
| No `src/content/config.ts` edits | PR diff | File unchanged — content schema is B2 scope, not B7 |
| PR targets `v2` (not `main`) | PR metadata | Base branch is `v2` |

---

## Known Limitations — Jules Cannot Validate

The following require HITL action or a live run against `main`. Jules flags these as "deferred to HITL smoke test" — not failures:

- Keystatic OAuth flow (requires `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` / `KEYSTATIC_SECRET` env vars set in Cloudflare, plus an authenticated GitHub session)
- Actual content editing via Keystatic admin UI (requires OAuth + GitHub write access)
- Cloudflare Pages env vars (HITL-only — set under Workers & Pages → quirgs → Settings → Build → Variables and secrets)

---

## Report Format

**All items pass:**
```
Jules: [Branch 7] validation passed. All checklist items confirmed. Existing routes unaffected by hybrid mode switch. Keystatic route reachable. Config files correct. Repo hygiene clean. Ready for HITL merge approval.
Note: Keystatic OAuth flow and content editing require env vars set in Cloudflare — deferred to HITL smoke test post-merge.
```

**Failures present:**
```
Jules: [Branch 7] validation — [N] item(s) failed.

❌ [Item] — [specific detail]

[Fixed items:]
🔧 Fixed: [description]

Remaining failures require HITL review before this PR can be approved.
```

---

## Post-Merge HITL Smoke Test (Torrey)

After Jules passes and the PR is merged to `v2`, then `v2` → `main`:

1. **Cloudflare env vars confirmed** — verify `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, and `KEYSTATIC_SECRET` are set in Cloudflare Pages → Settings → Environment variables
2. **Production deploy triggered** — confirm Cloudflare Pages auto-deploys `main` after the merge
3. **Keystatic admin accessible** — visit `https://quirgs.com/keystatic/` and confirm the GitHub login prompt appears
4. **OAuth flow completes** — log in with GitHub; confirm redirect back to Keystatic admin at `https://quirgs.com/keystatic/`
5. **Skills collection visible** — confirm the `skills` collection appears in the Keystatic admin UI with all 7 skill entries
6. **Existing pages unaffected** — spot-check `quirgs.com/`, `quirgs.com/skills/`, `quirgs.com/bundle/` on production

---

*Validate against the Cloudflare branch preview URL only — never against quirgs.com (production).*
