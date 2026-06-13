# Statement Formats Reference

Common royalty statement formats by source type. Use this reference to map non-standard column names to canonical ledger fields before reconciliation.

---

## DSP Direct Statements

### Spotify for Artists (Monthly)
Delivered as CSV via the Spotify for Artists dashboard or through a distributor.

Key columns: `Track Name`, `ISRC`, `Streams`, `Stream Source`, `Country`, `Royalty` (USD).

Notes: Spotify does not publish per-stream rates in direct exports. Rate is implied by `Royalty / Streams`. Rates vary by country and listener tier (Premium vs. Free). Expect $0.003–$0.005 per stream for Premium; significantly lower for ad-supported.

### Apple Music / iTunes
Delivered monthly via iTunes Connect or distributor.

Key columns: `Title`, `ISRC`, `Units`, `Begin Date`, `End Date`, `Vendor Identifier`, `UPC`, `Territory`, `Royalty Price`, `Royalty Currency`, `Earned`.

Notes: `Units` = downloads for paid tracks; `Streams` reported separately. Convert non-USD currencies to USD using statement exchange rate (listed at bottom of file).

### YouTube Content ID / YouTube Music
Delivered monthly via YouTube Studio (Content ID) or distributor.

Key columns: `Asset Title`, `Asset ID`, `ISRC`, `Claim Type` (`Sound Recording`, `Composition`), `Views`, `Revenue` (USD), `Policy` (`Monetize`, `Track`).

Notes: Content ID revenue is split between SR (sound recording) and Comp (composition). Ensure both sides are captured. Revenue fluctuates significantly with ad market seasonality (Q4 typically 30–50% higher than Q1).

### Amazon Music
Delivered monthly via distributor; no direct publisher portal.

Key columns: `Recording Title`, `ISRC`, `Streams`, `Territory`, `Earnings` (USD).

---

## Distributor Statements

### DistroKid
CSV export from the DistroKid dashboard (`Bank` section).

Key columns: `Date`, `Title`, `ISRC`, `UPC`, `Reporting Date`, `Sales Month`, `Store`, `Country of Sale`, `Quantity`, `Song Royalty USD`, `Before DistroKid Fee`, `DistroKid Fee`, `Your Earnings`.

Notes: `Your Earnings` = net after DistroKid annual plan fee allocation. `Song Royalty USD` = gross before fee. Use `Song Royalty USD` for gross-side reconciliation.

### TuneCore
CSV export from TuneCore dashboard.

Key columns: `Store`, `Country`, `Title`, `ISRC`, `UPC`, `Start Date`, `End Date`, `Units`, `Earnings (USD)`.

Notes: TuneCore applies a flat annual distribution fee (not per-transaction). `Earnings (USD)` is gross; deduct annual plan cost separately for net calculation.

### CD Baby
CSV export; also provides detailed PDF statements.

Key columns: `Sales Date`, `Store`, `Country`, `Type`, `Title`, `ISRC`, `Quantity`, `Retail Price`, `CD Baby Commission`, `Your Earnings`.

Notes: CD Baby takes a 9% commission on digital distribution (no annual fee model). `Your Earnings` = net after commission. Cross-check `CD Baby Commission` rate against contract if > 9%.

### AWAL / Kobalt
Detailed CSV; Kobalt also provides per-track revenue splits.

Key columns: `Reporting Period`, `Track`, `ISRC`, `Territory`, `DSP`, `Net Revenue`, `Currency`, `Exchange Rate`, `Net Revenue USD`.

Notes: AWAL/Kobalt statements are typically the most detailed. `Net Revenue USD` is the canonical field after FX conversion.

---

## PRO Statements

### ASCAP
Downloaded from ASCAP member portal as XLSX or CSV.

Key columns: `Work Title`, `ISRC`, `IPI/ISWC`, `Performance Date`, `Performance Source`, `Usage Type`, `Domestic/Foreign`, `Royalty Amount`.

Notes: ASCAP distributes quarterly (Feb, May, Aug, Nov) for most performance types. Radio and TV royalties lag 9–18 months. `Work Title` may differ from the recorded track title — match by ISWC if available.

### BMI
Downloaded from BMI portal as CSV.

Key columns: `Song Title`, `BMI Work #`, `ISRC`, `Performance Date`, `Licensee`, `Royalty Amount`, `Performance Type`.

Notes: BMI distributes quarterly. `BMI Work #` is their internal ID; map to ISWC for cross-platform reconciliation.

### SESAC
Delivered via SESAC portal (smaller statement volume).

Key columns: `Title`, `Registration #`, `Performance Date`, `Licensee`, `Net Royalty`.

Notes: SESAC is an invitation-only society. Statements are less granular than ASCAP/BMI. Contact your SESAC rep for line-item detail.

---

## Currency Handling

All non-USD amounts must be converted using the exchange rate published in the statement footer, not real-time FX. Reconcile in USD. Flag any statement that doesn't include an exchange rate for manual review.

Common currencies in music royalty statements: EUR, GBP, CAD, AUD, JPY, SEK, NOK, DKK. Note: streaming royalties from Japan (JPY) and Scandinavia (SEK/NOK) often have higher per-stream rates than US averages.
