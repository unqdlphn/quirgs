# Catalog Matching Criteria

Scoring system and matching logic for ranking catalog tracks against a sync brief.

---

## Scoring Rubric

Score each track on six criteria. Multiply by the criteria weight. Sum to get the total match score (0–100).

| Criteria | Weight | 0 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| Mood match | 30% | Opposite mood | Partial fit | Strong fit | Exact match |
| Tempo match | 20% | > 20 BPM outside range | 10–20 BPM outside | Within range | At target BPM |
| Energy match | 15% | Wrong level (> 3 points off) | 2–3 points off | 1 point off | Exact match |
| Instrumentation | 15% | Has a "must avoid" instrument | Neutral (no positive or negative signals) | Has 1+ "nice to have" | Has all required; has no avoided |
| Genre match | 10% | Wrong genre | Adjacent genre | Fits the genre | Preferred genre exact match |
| Vocal match | 10% | Wrong type (vocal when instrumental needed) | Acceptable but not ideal | Fits the requirement | Exact match (vocal/instrumental, gender, lyrical theme) |

**Score calculation:**
```
raw = Σ (weight × score_value) for each criteria
where score_value maps: 0=0, 1=0.33, 2=0.67, 3=1.0

total_score = raw × 100 (yields 0–100)
```

---

## Score Interpretation

| Score | Interpretation | Action |
|---|---|---|
| 90–100 | Exceptional match | Lead with this track; high confidence pitch |
| 75–89 | Strong match | Include in submission; clearly articulate the fit |
| 60–74 | Moderate match | Include if top-2 slots are filled; note any gaps |
| 40–59 | Weak match | Include only if catalog is small and no stronger options exist |
| < 40 | Poor match | Do not pitch; a bad-fit submission damages credibility |

**Minimum recommendation:** Only pitch tracks scoring 60+. If no tracks exceed 60, inform the user and flag it as a catalog gap.

---

## Matching Priority Rules

### Hard Disqualifiers (score = 0 on that criteria, pitch not recommended)
- Track has an instrument the brief explicitly says to avoid
- Track is vocal when the brief requires instrumental (or vice versa)
- Track BPM is more than 30 BPM outside the stated range
- Track has explicit content when the placement is for a family-rated project

### Tie-Breakers (when two tracks score equally)
1. Better tempo match wins
2. Better instrumentation fit wins
3. Track with existing sync history in similar media wins (supervisor confidence)
4. Track with better licensing availability wins (clear title, no co-writer disputes)

---

## Catalog Gap Analysis

When no tracks score above 60, produce a gap analysis:

**Gap report format:**
```
CATALOG GAP ANALYSIS
═════════════════════
Brief requires:     [Criteria that couldn't be met]
Best available:     [Track name] | Score: [X]/100
Gap:                [What the catalog is missing]
Recommendation:     [Acquire/commission/pass on this brief]
```

Common catalog gaps:
- **No instrumentals** — many publishers have vocal-heavy catalogs; a brief requiring instrumental has no matches
- **BPM cluster problem** — all tracks in one tempo range (e.g., all 80–90 BPM), missing uptempo or slow options
- **Mood gap** — catalog is upbeat/positive; brief needs dark/tense
- **Genre gap** — catalog is one genre; brief needs something adjacent or different
- **Instrumentation gap** — all tracks are electronic; brief needs acoustic/organic

---

## Licensing Availability Check

Before finalizing the shortlist, verify licensing availability for each candidate:

| Check | Status |
|---|---|
| Track is fully owned / cleared | Required |
| No sample clearance pending | Required |
| Co-writer disputes resolved | Required |
| Previous licenses don't conflict with this use | Required |
| Stems / multitracks available if requested | Recommended |
| Track has existing sync history in same media type | Note (may help or hurt) |

Flag any track with an unresolved co-writer dispute or pending sample clearance — it cannot be pitched until those are resolved.

---

## Catalog Database Minimum Fields for Matching

For the Catalog Matcher to score accurately, each catalog track should have at minimum:

- `track_title`
- `isrc`
- `bpm`
- `genre`
- `mood_tags` (at least 2–3 tags)
- `vocal_type` (`vocal_male`, `vocal_female`, `vocal_group`, `instrumental`)
- `instrumentation_tags` (key instruments: guitar, piano, strings, drums, etc.)
- `energy_level` (1–10 scale)
- `duration`
- `explicit` (boolean)
- `licensing_status` (`available`, `not-available`, `pending-clearance`)

If BPM, mood tags, or instrumentation tags are missing from the catalog, run `publish-update` first to enrich the catalog before running the license pipeline.
