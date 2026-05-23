# Branch 6 — Jules Validation Brief
**Branch:** `feat/gist-sync`  
**Preview URL pattern:** `https://feat-gist-sync.quirgs-[hash].pages.dev`  
**Validation scope:** Repo hygiene + workflow file syntax + gist-map structure  
**Session date:** 2026-05-23  

> **Note:** B6 is a CI/automation branch. It adds no new pages or routes. Jules cannot validate the workflow execution (that requires an actual push to `main` with the PAT in place), but can validate the repo is clean, the files are structurally correct, and nothing was broken.

---

## Pre-Validation — Confirm Build Deployed

```bash
curl -I https://feat-gist-sync.quirgs-[hash].pages.dev
```

- HTTP 200 → proceed
- HTTP 4xx / 5xx → report build failure, include status code, stop

If the build failed, check the Cloudflare Pages build log before anything else. A failed build in B6 is most likely a dependency issue in `package.json` or a syntax error in `sync-gists.js` being picked up by the Astro build.

---

## Checklist

### 1. Site Integrity — No Regressions

| Check | Method | Pass Condition |
|---|---|---|
| Landing page loads | `curl -s [preview-url]/` | HTTP 200; terminal illusion content present |
| Skills index loads | `curl -s [preview-url]/skills/` | HTTP 200 |
| Bundle page loads | `curl -s [preview-url]/bundle/` | HTTP 200 |
| Legacy guides preserved | `curl -I [preview-url]/guides/ai_prompt_engineering.html` | HTTP 200 |
| Legacy guides preserved | `curl -I [preview-url]/guides/copilot_commands_reference.html` | HTTP 200 |

### 2. New Files — Present and Correct

| Check | Method | Pass Condition |
|---|---|---|
| `sync-gists.yml` exists | PR diff | File present at `.github/workflows/sync-gists.yml` |
| `sync-gists.js` exists | PR diff | File present at `.github/scripts/sync-gists.js` |
| `gist-map.json` exists | PR diff | File present at `skills/gist-map.json` |
| `gist-map.json` is empty map | Read file content | Content is exactly `{}` |

### 3. Workflow Syntax — `sync-gists.yml`

| Check | Method | Pass Condition |
|---|---|---|
| Trigger is `push` to `main` | Read file | `on.push.branches: [main]` |
| Path filter is `skills/*/SKILL.md` | Read file | `paths: ['skills/*/SKILL.md']` |
| `GIST_TOKEN` env var set to PAT secret | Read file | `env.GIST_TOKEN: ${{ secrets.GIST_SYNC_TOKEN }}` |
| `GIT_TOKEN` env var set to built-in token | Read file | `env.GIT_TOKEN: ${{ secrets.GITHUB_TOKEN }}` |
| Script call is correct | Read file | `run: node .github/scripts/sync-gists.js` |
| No deploy.yml present | PR diff | `.github/workflows/deploy.yml` does NOT exist |

### 4. Script Structure — `sync-gists.js`

| Check | Method | Pass Condition |
|---|---|---|
| Reads `skills/gist-map.json` | Read file | `gist-map.json` is referenced in the script |
| Handles create path (no ID) | Read file | Branch for missing Gist ID → POST /gists |
| Handles update path (ID exists) | Read file | Branch for existing Gist ID → PATCH /gists/{id} |
| Writes ID back to map | Read file | Updated map is committed back after Gist creation |
| Uses `GIST_TOKEN` for Gist API auth | Read file | `process.env.GIST_TOKEN` used in Gist API `Authorization: Bearer` header — NOT `GIT_TOKEN` |
| Uses `GIT_TOKEN` for git push-back | Read file | `process.env.GIT_TOKEN` used for git operations — NOT `GIST_TOKEN` |
| Map write-back commit has `[skip ci]` | Read file | Commit message is `chore: update gist-map.json [skip ci]` |
| Sets public: true on create | Read file | `"public": true` on Gist creation call |

### 5. Repo Hygiene — Hard Rules

| Check | Method | Pass Condition |
|---|---|---|
| No `deploy.yml` | PR diff | File does NOT exist at `.github/workflows/deploy.yml` |
| No `CNAME` file | PR diff | `CNAME` does NOT exist at repo root |
| No `public/guides/` edits | PR diff | Zero changes to any file under `public/guides/` |
| No `src/pages/index.astro` edits | PR diff | File unchanged |
| PR targets `v2` (not `main`) | PR metadata | Base branch is `v2` |

### 6. Content Schema — gistUrl Field

| Check | Method | Pass Condition |
|---|---|---|
| `gistUrl` field in content schema | Read `src/content/config.ts` (or content.config.ts) | `gistUrl: z.string().url().optional()` is present |

> This field was specified in the architecture doc as auto-populated by `sync-gists.yml`. If it's missing from the schema, flag it — Agy needs to add it.

---

## Known Limitations — Jules Cannot Validate

The following items require a live run against `main` with the PAT in place. Jules flags these as "deferred to HITL smoke test" — not failures:

- Actual Gist creation (requires `GIST_SYNC_TOKEN` secret to be live)
- `gist-map.json` auto-update on first push (requires workflow to execute)
- Cloudflare Pages env var for `GIST_SYNC_TOKEN` (HITL-only, not testable via preview URL)
- `REGISTRY_WRITE_TOKEN` GitHub Actions secret (HITL-only)

---

## Report Format

**All items pass:**
```
Jules: [Branch 6] validation passed. All checklist items confirmed. No regressions. Gist sync files present and structurally correct. Ready for HITL merge approval.
Note: Gist creation and map write-back require a live run against main — deferred to HITL smoke test post-merge.
```

**Failures present:**
```
Jules: [Branch 6] validation — [N] item(s) failed.

❌ [Item] — [specific detail]

[Fixed items:]
🔧 Fixed: [description]

Remaining failures require HITL review before this PR can be approved.
```

---

## Post-Merge HITL Smoke Test (Torrey)

After Jules passes and Torrey merges `feat/gist-sync` → `v2`, then `v2` → `main`:

1. **Workflow triggered** — go to repo → Actions tab → confirm `Sync Skills to Gists` run appears for the merge commit
2. **Workflow completed without error** — open the run, check both the Gist API step and the git push step for errors
3. **Write-back commit is clean** — confirm a second commit appears on `main` with message `chore: update gist-map.json [skip ci]` and that it did NOT trigger another workflow run
4. **`gist-map.json` updated** — open `skills/gist-map.json` on `main` and confirm Gist IDs are populated for the skills whose SKILL.md files were included in the merge commit
5. **Gist is live and public** — open one of the Gist URLs from the map; confirm the skill content is correct, the Gist is public, and the filename matches the skill slug (e.g. `eu-ai-act-classifier.md`)
6. **No runaway recursion** — confirm only one workflow run was triggered by the merge; the `[skip ci]` write-back commit should show no associated Actions run

---

*Validate against the Cloudflare branch preview URL only — never against quirgs.com (production).*
