# Reconciliation Logic Reference

Rules, thresholds, and discrepancy classification for Statement-to-Ledger reconciliation.

---

## Matching Priority

Match statement rows to ledger entries in this order:

1. **ISRC match** (primary) — exact string match on ISRC code. This is the canonical identifier. A match here is definitive.
2. **UPC + Track Title match** (secondary) — if ISRC is missing from statement but UPC and title match a ledger entry, flag as `ISRC-unconfirmed` and proceed.
3. **Track Title + Period match** (tertiary fallback) — title match within the same reporting period. Flag as `low-confidence`, require human review before accepting.
4. **No match** — flag as either `NEW` (in statement, not in ledger) or `MISSING` (in ledger, not in statement).

---

## Discrepancy Codes

| Code | Category | Definition | Threshold |
|---|---|---|---|
| D1 | Minor variance | Net received differs from expected by < 5% | Informational only |
| D2 | Moderate variance | Net received differs by 5–20% | Flag for review |
| D3 | Significant variance | Net received differs by > 20% | Flag for dispute |
| D4 | Missing payment | Track is in ledger with expected > $0, no payment received | Always escalate |
| D5 | Unexpected income | Payment received for track not in ledger | Add to ledger or investigate |
| D6 | ISRC mismatch | Payment received under a different ISRC than ledger records | Correct in distribution system |
| D7 | Territory anomaly | Payment from territory not in approved distribution list | Verify licensing scope |
| D8 | Rate anomaly | Calculated per-stream rate falls outside expected range | Flag for platform verification |

---

## Expected Rate Ranges (2025–2026 benchmarks)

Use these as sanity checks when verifying D8 flags. These are approximate and vary by listener tier, territory, and platform licensing agreements.

| Platform | Per-stream range (USD) | Notes |
|---|---|---|
| Spotify Premium | $0.003 – $0.005 | Ad-supported: $0.0003–$0.001 |
| Apple Music | $0.006 – $0.010 | Higher than Spotify; no free tier |
| YouTube Music (Premium) | $0.006 – $0.008 | Ad-supported: $0.0005–$0.002 |
| YouTube Content ID (ad rev) | $0.001 – $0.005 | Highly variable with ad market |
| Amazon Music Unlimited | $0.004 – $0.007 | |
| Tidal (HiFi) | $0.009 – $0.013 | Higher per-stream due to smaller base |
| Deezer | $0.0035 – $0.006 | |

Per-stream rate calculation: `Net Revenue / Streams = Rate`. Compare against the range above. A rate significantly outside the range suggests a calculation error or a territory-level anomaly.

---

## Variance Calculation

```
variance_pct = (received - expected) / expected × 100

If variance_pct < 0:   underpayment (flag D2/D3/D4)
If variance_pct > 0:   overpayment (flag D2/D3 — may require return)
If expected = 0:       flag D5 (unexpected income)
```

For PRO royalties, expected revenue is harder to predict (performance-based). Apply a looser threshold:
- D1: < 15% variance
- D2: 15–40% variance
- D3: > 40% variance

---

## Dispute Thresholds

Recommend filing a formal dispute when:
- Any D4 (missing payment) is present and period is > 60 days past statement date.
- A D3 variance represents > $50 total underpayment.
- A D6 mismatch has been present across two consecutive statement periods.

Do not recommend disputes for D1 variances — rounding differences of a few cents are normal across all platforms.

---

## Multi-Source Consolidation Rules

When aggregating multiple statements for the same catalog period:

1. Sum `net_revenue` by ISRC across all sources.
2. De-duplicate: if the same ISRC appears in both a DSP statement and a distributor statement for the same streams, keep only the distributor figure (DSPs pay distributors, not publishers directly, in most cases).
3. Exception: if a publisher has a direct deal with a DSP (e.g., direct Spotify deal), keep the DSP figure and exclude the distributor line for that ISRC.
4. Flag any ISRC that appears in both a direct DSP statement and a distributor statement — this double-count requires human resolution.

---

## Statement Period Lag Reference

Royalties are not paid in real time. Expected lag between performance period and payment:

| Source | Typical lag |
|---|---|
| Spotify (via distributor) | 2–3 months |
| Apple Music (via distributor) | 2–3 months |
| YouTube Content ID | 2–3 months |
| DistroKid / TuneCore | 1–2 months after DSP pays |
| ASCAP (radio/TV) | 9–18 months |
| BMI (radio/TV) | 9–18 months |
| SESAC | 6–12 months |

Use lag reference when flagging D4 (missing payments) — a missing payment within the lag window is not yet a discrepancy.
