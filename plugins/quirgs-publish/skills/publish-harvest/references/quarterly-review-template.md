# Quarterly Review Template

Standard structure and formatting for the Publish Harvest quarterly catalog report.

---

## Report Components

A complete quarterly harvest report contains:

1. **Cover page** — period, catalog size, key headline numbers
2. **Revenue summary** — total by source and comparison to prior period
3. **Catalog tier analysis** — A/B/C/D tier breakdown with per-track data
4. **Trend highlights** — top movers, breakout candidates, significant declines
5. **Catalog gap analysis** — structural issues and opportunities
6. **Recommended actions** — prioritized list of next steps
7. **Archive note** — file reference for record-keeping

---

## Performance Tier Criteria

Adapt thresholds to catalog size:

### For catalogs < 20 tracks
| Tier | Revenue threshold |
|---|---|
| A | > $500/quarter OR any sync placement |
| B | $50–$500/quarter |
| C | $1–$50/quarter |
| D | $0/quarter (or < $1) |

### For catalogs 20–100 tracks
| Tier | Criteria |
|---|---|
| A | Top 20% by revenue |
| B | 21st–60th percentile by revenue |
| C | 61st–100th percentile, with at least some activity |
| D | Zero activity for 2+ consecutive quarters |

### For catalogs > 100 tracks
| Tier | Criteria |
|---|---|
| A | Top 10% by revenue |
| B | 11th–40th percentile |
| C | 41st–80th percentile, with activity |
| D | Bottom 20% and/or zero activity 2+ quarters |

---

## Trend Highlight Criteria

Flag a track for the Trend Highlights section if it meets any of these signals:

**Breakout candidate:** Revenue or streams up > 50% vs. prior period without an obvious external cause (e.g., a new release or promotion)

**Significant decline:** Revenue or streams down > 30% vs. prior period for a track previously in Tier A or B

**New sync placement:** Any track that received a sync fee this quarter, regardless of tier

**PRO surprise:** Any track that received PRO income significantly out of proportion with its streaming numbers (indicator of broadcast or TV placement)

**Dormancy break:** A Tier D track that received activity this quarter after 2+ dormant quarters

---

## Catalog Gap Analysis Questions

Answer each question during the gap analysis section:

1. **Concentration risk:** What percentage of total revenue comes from the top 3 tracks? If > 60%, flag.
2. **Sync pipeline gap:** How many Tier A tracks are NOT in an active sync pitch pipeline?
3. **Registration gap:** Any tracks earning streaming revenue but with zero PRO income that should have PRO income?
4. **Metadata gap:** Any Tier C/D tracks with known metadata quality issues (missing BPM, ISWC, genre)?
5. **Seasonal adjustment:** Is any decline explained by seasonal trends (Q1 streaming typically lower than Q4)?
6. **New release uplift:** Did any new releases this quarter create halo effects on older catalog tracks?

---

## Recommended Actions Format

Structure recommendations in three categories:

### Immediate (this quarter)
Actions the publisher can take now with no external dependencies:
- Run `publish-update` for tracks with metadata gaps
- Run `publish-license` to build sync pitches for identified opportunities
- Register unregistered compositions with PRO/MLC
- Investigate specific revenue anomalies

### Near-term (next quarter)
Actions that require preparation or external coordination:
- Pitch specific tracks to sync opportunities identified in the gap analysis
- Commission new recordings or remixes to address catalog gaps
- Plan a re-release or re-promotion campaign for Tier D tracks with sync potential

### Strategic (next 2–4 quarters)
Longer-range recommendations based on catalog trajectory:
- Catalog diversification opportunities
- Genre or mood gaps to fill with new acquisitions or signing
- Platform-specific strategy (e.g., podcast licensing via Spotify/SoundCloud, game licensing)

---

## Archive Note Format

Each completed quarterly report should be filed with:

```
ARCHIVE NOTE
─────────────
Report type:      Quarterly Harvest Report
Period:           Q[#] [Year]
Catalog:          [Name or identifier]
File location:    [Path / system]
Completed by:     [Name]
Date:             [YYYY-MM-DD]
Next review due:  [YYYY-MM-DD — one quarter forward]
Key headline:     [One sentence summary: e.g., "Q2 revenue up 15% YoY; sync income doubled"]
```

---

## Quarterly Review Calendar

| Quarter | Statement availability | Review target date |
|---|---|---|
| Q1 (Jan–Mar) | DSP statements by May; PRO by August | Late May |
| Q2 (Apr–Jun) | DSP by August; PRO by November | Late August |
| Q3 (Jul–Sep) | DSP by November; PRO by February | Late November |
| Q4 (Oct–Dec) | DSP by February; PRO by May | Late February |

PRO distributions for broadcast royalties follow separate timelines (see `performance-metrics.md`). The quarterly review focuses on available data and notes pending distributions.
