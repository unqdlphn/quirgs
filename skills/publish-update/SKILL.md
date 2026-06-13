---
name: publish-update
description: >
  Audit a music catalog for metadata gaps and errors, then enrich missing or incorrect
  fields from authoritative sources. Use this skill whenever someone says "fix my
  catalog metadata", "my ISRC is wrong", "update track metadata", "catalog hygiene audit",
  "find missing ISRCs", "metadata enrichment", "clean up my catalog", "find metadata
  errors", "update my UPCs", "fix the genre tags", or any request to systematically
  review and improve catalog data quality. Also trigger when a publisher is preparing
  a catalog for distribution, re-distribution, sync licensing, or sale — metadata
  accuracy is a prerequisite for all of these. Outputs a structured audit report with
  a field-by-field quality score, flagged errors, and enriched data ready to import
  into a distribution system.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-update@quirgs-publish`

# Publish Update — Catalog Metadata Hygiene

Audits music catalog metadata for completeness and accuracy, identifies gaps and errors, and enriches records from authoritative sources. Produces a structured hygiene report and an import-ready corrected data set.

---

## Step 1 — Receive the Catalog

Ask the user to provide catalog data in one of these formats:
- CSV or XLSX export from their distributor (DistroKid, TuneCore, CD Baby, etc.)
- A metadata spreadsheet they maintain internally
- A list of ISRCs or track titles pasted directly

If catalog is large (> 100 tracks), ask whether to run a full audit or a targeted scan (specific fields only, or a subset of tracks).

---

## Step 2 — Run the Hygiene Audit

Load `references/metadata-standards.md` for field definitions and validation rules.

Check each track record against the following required and recommended fields:

### Required Fields (blocking for distribution)
| Field | Validation rule |
|---|---|
| `track_title` | Non-empty; no trailing spaces; no special characters except `(),-:.'&` |
| `isrc` | Format: `CC-XXX-YY-NNNNN` (2-letter country code, 3-char registrant, 2-digit year, 5-digit designation). Validate with regex: `^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$` |
| `artist` | Non-empty primary artist name |
| `upc` | 12 or 13 digits (EAN-13 or UPC-A). Validate check digit if possible. |
| `release_date` | ISO 8601 format (YYYY-MM-DD). Must not be in the future for already-distributed tracks. |

### Recommended Fields (important for royalties and discoverability)
| Field | Issue if missing |
|---|---|
| `iswc` | PRO matching fails; composition royalties may not flow correctly |
| `composer` | Required for mechanical and performance licensing |
| `publisher` | Required for PRO registration and sync licensing |
| `genre` | Reduced playlist algorithmic placement |
| `bpm` | Sync licensing loss — supervisors filter by BPM |
| `language` | Required for some international distributors |
| `explicit` | Apple/Spotify may auto-flag incorrectly if not set |
| `copyright_year` | Required for catalog sale due diligence |
| `p_line` | Sound recording copyright notice |
| `c_line` | Composition copyright notice |
| `duration` | Mismatch between metadata and audio file causes distribution rejection |

### Quality Score per Track

```
required_present = count of required fields with valid values
recommended_present = count of recommended fields with valid values

quality_score = (required_present / 5 × 70) + (recommended_present / 11 × 30)
```

Output: score 0–100. Flag tracks below 70 as `needs-attention`; below 50 as `critical`.

---

## Step 3 — Identify Errors and Duplicates

In addition to missing fields, check for:

- **ISRC duplicates** — the same ISRC assigned to more than one track. This is a hard error.
- **UPC duplicates** — same UPC on more than one release.
- **Title variants** — near-duplicate titles (e.g., `Song (Radio Edit)` vs `Song - Radio Edit`) that may represent duplicate catalog entries.
- **Release date inconsistency** — tracks on the same album with different release dates.
- **Duration outliers** — tracks under 30 seconds (ineligible for streaming royalties on most platforms) or over 10 minutes without being a known long-form work.
- **Genre mismatch** — genre tag inconsistent with the rest of the artist's catalog (potential error vs. intentional genre pivot).

Load `references/hygiene-audit-checklist.md` for the full error pattern library.

---

## Step 4 — Enrich Missing Fields

Load `references/enrichment-sources.md` for lookup strategies.

For each flagged field gap:

| Missing field | Enrichment approach |
|---|---|
| `isrc` | Check with original distributor (all distributors assign or accept ISRCs at upload). Generate a new ISRC only if the track was self-released and none was ever assigned — requires registering as an ISRC registrant or using a PRO/distributor service. |
| `iswc` | Look up via ISWC International Agency (iswc.org), ASCAP/BMI work search, or PRS online. ISWC is assigned by the PRO where the composition was first registered. |
| `bpm` | If audio is available: calculate from the file. If not: look up on Spotify API (audio features endpoint), Tunebat.com, or GetSongBPM.com. |
| `genre` | Infer from artist profile on Spotify, AllMusic, or Discogs. Use the primary genre the artist is cataloged under on the largest platform. |
| `composer` / `publisher` | Check PRO database (ASCAP/BMI work search), original contract documentation, or liner notes. |
| `duration` | Pull from audio file metadata if available; otherwise Spotify track API. |

**Important:** Do not invent values. If a field cannot be confidently sourced, flag it as `needs-human-lookup` in the report rather than filling with a guess.

---

## Step 5 — Output the Audit Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️ CATALOG METADATA AUDIT REPORT
Catalog size: [N] tracks
Audit scope: [Full / Targeted]
Generated: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
This output is generated by an AI skill for informational and administrative
purposes only. Metadata corrections should be verified against official registrar
records, original contracts, and distributor documentation before upload.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
───────
Critical (score < 50):     [N] tracks
Needs attention (< 70):    [N] tracks
Good (70–89):              [N] tracks
Excellent (90–100):        [N] tracks

HARD ERRORS (fix before distribution)
──────────────────────────────────────
[Track Title] | [ISRC] | Error: [description]
...

ENRICHED FIELDS
───────────────
[Track Title] | [ISRC] | Field: [field_name] | Old: [value] | New: [value] | Source: [source]
...

FIELDS REQUIRING HUMAN LOOKUP
──────────────────────────────
[Track Title] | [ISRC] | Field: [field_name] | Reason: [why it needs human resolution]
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

After the report, offer to output the corrected catalog as a CSV table ready to import into the user's distribution system.

---

## Key Principles

- **ISRC is permanent.** Once assigned to a recording, an ISRC should never change. If a track was re-recorded, it requires a new ISRC.
- **Never overwrite a field the user confirmed as correct**, even if it fails validation (e.g., a legitimate short-duration track under 30 seconds).
- **Flag before fixing.** Always show the user what will change before applying enrichments. No silent overwrites.
- **Distribution-blocking errors first.** Surface hard errors before quality scoring — a track with an invalid ISRC can't go anywhere regardless of its quality score.
