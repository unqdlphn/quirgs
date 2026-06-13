# Master Royalty Ledger Template

Standard structure for the canonical catalog income ledger. Use this as the target schema when building or updating the master ledger from incoming statements.

---

## Ledger Schema

Each row represents one track × one reporting period × one source.

| Field | Type | Required | Description |
|---|---|---|---|
| `track_title` | string | Yes | Canonical release title |
| `isrc` | string | Yes | International Standard Recording Code (format: CC-XXX-YY-NNNNN) |
| `upc` | string | No | UPC/EAN of the parent release |
| `iswc` | string | No | ISWC of the underlying composition (for PRO reconciliation) |
| `artist` | string | Yes | Primary artist / rights holder name |
| `release_title` | string | No | Album or EP title if applicable |
| `period_start` | date | Yes | Start of reporting period (YYYY-MM-DD) |
| `period_end` | date | Yes | End of reporting period (YYYY-MM-DD) |
| `source` | string | Yes | Platform or PRO name (e.g., Spotify, ASCAP, DistroKid) |
| `territory` | string | No | ISO 3166-1 alpha-2 country code or `WORLDWIDE` |
| `streams` | integer | No | Unit count (streams, downloads, plays) |
| `rate` | decimal | No | Per-unit rate (USD) |
| `gross_revenue` | decimal | Yes | Gross amount before fees (USD) |
| `fees` | decimal | No | Distributor or PRO deductions (USD) |
| `net_revenue` | decimal | Yes | Net amount received (USD) |
| `expected_revenue` | decimal | No | Internal expected amount (USD) — used for reconciliation |
| `variance` | decimal | No | `net_revenue - expected_revenue` (auto-calculated) |
| `variance_pct` | decimal | No | `variance / expected_revenue × 100` (auto-calculated) |
| `discrepancy_code` | string | No | D1–D8 from reconciliation logic |
| `status` | string | Yes | `clean`, `review`, `dispute`, `resolved` |
| `notes` | string | No | Free-text notes for accounting review |

---

## Status Definitions

- `clean` — reconciled, no discrepancy or D1 only
- `review` — D2 variance present, requires accountant review
- `dispute` — D3/D4 present, dispute initiated or recommended
- `resolved` — previously disputed; resolved and confirmed

---

## CSV Header Row

```
track_title,isrc,upc,iswc,artist,release_title,period_start,period_end,source,territory,streams,rate,gross_revenue,fees,net_revenue,expected_revenue,variance,variance_pct,discrepancy_code,status,notes
```

---

## Ledger Aggregation Views

When summarizing the ledger for reporting, produce these three views:

### 1. By Track (YTD or period total)
Aggregate `net_revenue` by `isrc` across all sources and territories for the selected period. Sort descending by `net_revenue`.

### 2. By Source
Aggregate `net_revenue` by `source`. Useful for evaluating distributor performance or DSP revenue split.

### 3. Discrepancy Summary
Filter rows where `discrepancy_code` is not null and `status` ≠ `resolved`. Group by `discrepancy_code`. Show count and total variance amount per code.

---

## Ledger Maintenance Rules

1. **Never delete rows** — mark status as `resolved` instead.
2. **One row per track × period × source** — do not aggregate before writing to the ledger.
3. **Always include an advisory line** in any exported view: *"This ledger is an administrative tracking tool. Figures require verification against source statements before use in financial reporting."*
4. **Archive old periods** — at year-end, export and archive rows from the prior year to a separate file. Keep the active ledger to the current and prior year only.
5. **Lock expected_revenue** before each reconciliation cycle — expected values should not change mid-cycle.
