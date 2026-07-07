---
name: publish-harvest
description: >
  Run a quarterly catalog performance review: pull key metrics from royalty statements,
  identify top performers, flag underperformers, surface licensing gaps, and produce a
  structured quarterly harvest report. Use this skill whenever someone says "quarterly
  review", "catalog performance review", "how is my catalog performing", "quarterly
  harvest", "which tracks are performing", "which tracks are underperforming", "catalog
  analysis", "analyze my streaming revenue", "identify sync opportunities in my catalog",
  "catalog health check", "review my publishing income for the quarter", or any request
  to assess catalog-wide performance over a defined period. Also trigger at the end of
  any quarter when the user has royalty statements available and wants a structured
  performance report. Outputs a tiered catalog performance report with actionable
  recommendations per performance segment.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-harvest@quirgs-publish`

# Publish Harvest — Quarterly Catalog Review

Analyzes catalog-wide performance across streaming, sync, and mechanical revenue streams. Identifies top performers, underperformers, and catalog gaps. Produces a structured quarterly harvest report with actionable recommendations.

---

## Standing Disclaimer

Every response this skill produces — including clarifying questions, partial or
prose-only answers, and any output that is not the full formatted harvest
report — must end with this line:

> ⚠️ *Advisory only — this is not financial, tax, or investment advice; verify figures against source statements.*

The full boxed ADVISORY NOTICE in Step 6 replaces this short line only when
the complete harvest report is emitted. This includes recommendations made on
partial data (e.g., a pending sync statement) — the short line still applies.

---

## Step 1 — Gather Input Data

Ask the user to provide:

1. **Royalty statements** for the quarter — DSP statements, distributor summaries, PRO distributions, or sync license income. Reference `publish-income` output if already reconciled.
2. **Catalog list** — all tracks in the active catalog with ISRC, title, and artist.
3. **Period** — which quarter (Q1/Q2/Q3/Q4 + year)?
4. **Prior period data** — prior quarter or year-ago data for comparison (optional but strongly recommended for trend analysis).
5. **Revenue targets** — are there per-track or total revenue targets for the period? (Optional)

Load `references/performance-metrics.md` for the metrics framework.

---

## Step 2 — Build the Performance Dataset

For each track in the catalog, compile the following for the quarter:

| Metric | Source |
|---|---|
| Total streams | DSP statements / distributor |
| Total net revenue (streaming) | Distributor statement |
| PRO income | ASCAP/BMI/SESAC distribution |
| Sync income | License agreements / statements |
| Mechanical income (US) | MLC distribution |
| Total revenue | Sum of all sources |
| Revenue change vs. prior period | Calculate: `(current - prior) / prior × 100` |
| Streams change vs. prior period | Calculate: same formula |
| New playlist placements | If known |
| Sync placements this quarter | Count from license log |

If data for some sources is not yet available (due to reporting lag), note the lag and proceed with available data.

---

## Step 3 — Tier the Catalog by Performance

Load `references/quarterly-review-template.md` for the standard tiering structure.

Segment tracks into four performance tiers based on total quarterly revenue:

| Tier | Label | Threshold (adapt to catalog size) |
|---|---|---|
| A | Top Performers | Top 20% by revenue |
| B | Mid Performers | 20–60% by revenue |
| C | Underperformers | Bottom 40% but with some activity |
| D | Dormant | Zero or near-zero revenue for **2+ consecutive quarters** |

For small catalogs (< 20 tracks), use absolute revenue thresholds rather than percentiles.

**Tier D requires 2+ consecutive quarters of history — a single quarter of $0
or near-zero revenue does NOT by itself qualify as Dormant, even on an
otherwise-zero track.** If prior-period data is unavailable (as in a first-time
review, or when the user hasn't supplied comparison data), you cannot confirm
the 2+-consecutive-quarter condition. In that case: do not place the track in
Tier D. Instead, place it in Tier C (Underperformer) and explicitly note that
dormancy status is unconfirmed pending prior-period history — do not silently
default to Tier D on a single quarter's data.

---

## Step 4 — Run Trend Analysis

Load `references/trend-signals.md` for signal interpretation.

For each tier, identify patterns:

### Tier A — Top Performers
- Is revenue growing, stable, or declining vs. prior period?
- What's driving performance: streaming, sync, or PRO?
- Are these tracks in sync licensing pipelines? If not, flag for `publish-license`.
- Any concentration risk? (e.g., if one track is > 50% of revenue, flag the dependency)

### Tier B — Mid Performers
- Are any mid-performers showing strong growth? Flag as "breakout candidates."
- Are any mid-performers declining? Flag for investigation.

### Tier C — Underperformers
- Are these tracks newer releases (< 6 months) that may still be building? Note separately.
- Are they missing metadata that could affect discoverability? Flag for `publish-update`.
- Have they ever had a sync placement? If the answer is "never pitched," flag for `publish-license`.

### Tier D — Dormant
- How long have these tracks been dormant?
- Are they eligible for sync licensing despite low streaming numbers? (Many sync-placed tracks have modest streaming histories.)
- Should these tracks be re-promoted, relicensed, or retired?

---

## Step 5 — Identify Catalog Gaps

Beyond individual track analysis, look for catalog-wide patterns:

1. **Revenue concentration** — what % of revenue comes from the top 10% of tracks?
2. **Genre gaps** — does the catalog have a genre not represented that could expand sync opportunities?
3. **Tempo/mood gaps** — based on sync briefs the catalog has received: what mood or tempo requirements couldn't be met?
4. **Sync pipeline status** — how many tracks are actively pitched in sync? How many have never been pitched?
5. **PRO registration gaps** — any tracks earning streaming revenue but not registered with a PRO (meaning composition royalties aren't flowing)?
6. **MLC registration gaps** — any US-distributed tracks not registered with the MLC?

---

## Step 6 — Output the Harvest Report

Load `references/quarterly-review-template.md` for the full report structure.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌾 QUARTERLY HARVEST REPORT
Period: [Q#] [Year]
Catalog size: [N] active tracks
Generated: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
This report is generated by an AI skill for administrative and strategic
planning purposes. Revenue figures should be verified against source statements.
This output does not constitute financial, tax, or investment advice.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVENUE SUMMARY
───────────────
Total streaming revenue (Q):  $[X]
Total PRO income (Q):          $[X]
Total sync income (Q):         $[X]
Total mechanical income (Q):   $[X]
Total portfolio revenue (Q):   $[X]
vs. prior period:              [+/- X%]
vs. year-ago quarter:          [+/- X%]  (if data available)

CATALOG TIERS
─────────────

TIER A — TOP PERFORMERS ([N] tracks)
  [Track Title] | $[X] | [streams] | [+/-X% vs prior]
  [Track Title] | $[X] | [streams] | [+/-X% vs prior]
  ...

TIER B — MID PERFORMERS ([N] tracks)
  [Track Title] | $[X] | Trend: [Up/Stable/Down]
  Breakout candidates: [Track(s) showing strong growth]

TIER C — UNDERPERFORMERS ([N] tracks)
  [Track Title] | $[X] | Flag: [New / Missing metadata / Never pitched for sync]
  ...

TIER D — DORMANT ([N] tracks)
  [Track Title] | Last activity: [Q#/Year] | Recommendation: [Re-pitch sync / Re-promote / Archive]

CATALOG GAPS
────────────
Revenue concentration: Top 10% of catalog = [X]% of revenue
[Other gaps identified]

RECOMMENDED ACTIONS
───────────────────
Immediate (this quarter):
  [ ] Run publish-update on [N] underperformers with metadata gaps
  [ ] Add [N] Tier A tracks to sync licensing pipeline (publish-license)
  [ ] Register [N] unregistered compositions with PRO / MLC
  [ ] Investigate revenue decline on: [Track(s)]

Next quarter planning:
  [ ] [Strategic recommendation based on trend analysis]
  [ ] [Gap-filling acquisition or commissioning suggestion]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 7 — Offer Follow-On Actions

After delivering the report:

- Offer to run `publish-income` for a full Statement-to-Ledger reconciliation if statements are available.
- Offer to run `publish-update` on flagged underperformers with metadata issues.
- Offer to run `publish-license` to build a sync pipeline for flagged Tier A/B tracks.
- Offer to save the harvest report as a `.md` file for the quarterly records archive.

---

## Key Principles

- **Quarterly cadence is the minimum.** Monthly data is available from most distributors; quarterly review is the practical rhythm for most independent publishers.
- **Streaming numbers lie without context.** A track with 10,000 streams from a single niche playlist is different from one with 10,000 streams from organic discovery. Note context where known.
- **Dormant doesn't mean dead.** Many catalog tracks earn significant sync fees years after their streaming peak. Never recommend deletion without considering sync potential.
- **Advisory notice is mandatory.** This is a planning tool, not a financial statement.

---

## Reporting Issues

If this skill produces wrong, outdated, or misleading guidance, report it:
[SECURITY.md](https://github.com/unqdlphn/quirgs/blob/main/SECURITY.md) — use the
**skill-output issue** lane (the form collects what triage needs). Security
vulnerabilities in the platform itself follow the private-advisory lane in the
same document.

Whenever this skill emits a full formatted report or document, append this line
after it:

> *Report an issue with this output: https://github.com/unqdlphn/quirgs/blob/main/SECURITY.md*
