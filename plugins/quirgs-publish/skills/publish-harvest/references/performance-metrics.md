# Performance Metrics Reference

Key metrics for evaluating music catalog performance across streaming, sync, mechanical, and PRO revenue streams.

---

## Streaming Metrics

### Total Streams
The gross play count across all DSPs for a given period. A "stream" is typically defined as a play of 30 seconds or more (Spotify, Apple, Amazon, Tidal). YouTube counts all plays regardless of length for video; YouTube Music has its own threshold.

**Why it matters:** Stream count is the top-of-funnel indicator for a track's audience reach. It does not directly translate to revenue without knowing the per-stream rate.

**Limitation:** Streams from fraudulent or bot activity inflate counts without generating real revenue. A large discrepancy between stream count and revenue may indicate fraud or platform manipulation.

### Revenue per Stream (Effective Rate)
`total_streaming_revenue / total_streams`

Compare against benchmark rates from `publish-income/references/reconciliation-logic.md`. An effective rate significantly below benchmark suggests heavy weighting toward ad-supported streams or bot activity.

### DSP Revenue Mix
What percentage of streaming revenue comes from each platform?

A healthy independent catalog typically shows: Spotify 40–60%, Apple Music 15–25%, YouTube 10–20%, Amazon/Other 5–15%. A catalog over-indexed on YouTube ad-supported streams will have a lower effective rate than one with a higher Apple Music share.

### Monthly Active Listeners (MAL)
Where available (Spotify for Artists, Apple Music for Artists): the number of unique listeners in a 30-day window. This is a leading indicator of audience health — a track with declining streams may still have a healthy MAL if the decline is seasonal rather than churn.

---

## PRO Metrics

### Performance Royalty Income
Royalties paid by ASCAP, BMI, SESAC, or equivalent PROs for public performance of the composition (radio, TV, film exhibition, live venues, streaming).

**Note on lag:** PRO distributions lag 9–18 months for broadcast (radio/TV) but 2–4 months for streaming (digital performance royalties). A quarter's PRO income does not represent that quarter's performances.

### Per-Work PRO Income
For catalogs with multiple tracks, break down PRO income by work to identify which compositions are generating performance royalties. Tracks with high streaming numbers but zero PRO income may indicate a registration gap.

### PRO Income Mix
What percentage of PRO income is from streaming vs. broadcast vs. live?
- Streaming-heavy PRO income is stable but modest
- Broadcast income (radio, TV) is the highest-value PRO royalty — one well-placed radio play on a national station can generate more than 100,000 streams

---

## Sync Metrics

### Sync License Income
Revenue from one-time sync license fees for use of a composition and/or sound recording in film, TV, advertising, video games, or other audiovisual content.

**Characteristics:** Sync income is lumpy — most catalogs generate sync fees inconsistently. A single sync placement in a major TV series can equal years of streaming income. Track sync placements separately from recurring royalties.

### Sync Conversion Rate
`sync_placements / sync_pitches`

For catalogs that track their outbound pitches: how many pitches result in placements? Typical ranges for quality catalogs: 2–10%. Below 1% indicates a catalog-to-brief mismatch or pitch quality issue.

### Average Sync Fee
`total_sync_income / number_of_sync_placements`

Benchmark ranges:
| Placement type | Typical fee range |
|---|---|
| Student film / indie short | $0–$500 |
| Independent feature film | $1,000–$10,000 |
| Cable TV series (per episode use) | $2,000–$15,000 |
| Network TV (per episode use) | $10,000–$50,000 |
| National advertising (6-month, non-exclusive) | $15,000–$75,000+ |
| Global advertising (1 year, exclusive) | $50,000–$500,000+ |

---

## Mechanical Metrics (US)

### MLC Distribution
Mechanical royalties paid by the Mechanical Licensing Collective for streaming and download uses of compositions in the United States. Distributed quarterly.

**Benchmark rate (statutory mechanical, Phonorecords IV):** ~15.1% of revenue after deductions, distributed to publishers. Effective per-stream mechanical rate typically $0.001–$0.002.

### Mechanical Collection Gaps
Tracks earning streaming income but not registered with the MLC will accumulate royalties in the MLC's "unmatched" pool. These funds are eventually distributed based on market share if not claimed. Registration before distribution is the correct practice.

---

## Catalog Health Indicators

### Revenue Concentration Ratio
`revenue_from_top_10%_of_tracks / total_revenue`

A ratio above 70% indicates high concentration risk — the catalog is heavily dependent on a small number of tracks. Diversification (new releases, sync development of mid-tier tracks) reduces this risk.

### Dormancy Rate
`dormant_tracks / total_tracks`

Tracks with zero revenue for 2+ consecutive quarters. A dormancy rate above 50% suggests an aging catalog that needs refreshing or active sync pitch activity.

### Revenue per Track (Average)
`total_revenue / active_track_count`

A simple benchmark for catalog efficiency. Compare quarter-over-quarter to track whether catalog growth is translating into proportional revenue growth.

### Sync Pipeline Coverage
`tracks_actively_pitched_for_sync / total_tracks`

Most independent catalogs have < 20% of their tracks in active sync pitch pipelines. Increasing this ratio is often the highest-leverage action for revenue growth.

---

## Reporting Lag Reference

| Revenue type | Reporting lag | Notes |
|---|---|---|
| Spotify (via distributor) | 2–3 months | |
| Apple Music | 2–3 months | |
| YouTube (Content ID) | 2–3 months | |
| PRO (streaming digital) | 2–4 months | |
| PRO (radio/TV broadcast) | 9–18 months | |
| MLC (mechanical) | 3–6 months | |
| Sync license fees | Immediate on execution | Royalties from sync use follow PRO lag |

A Q2 harvest report will typically contain Q1 streaming data, Q4 (prior year) PRO broadcast data, and Q3–Q4 (prior year) mechanical data.
