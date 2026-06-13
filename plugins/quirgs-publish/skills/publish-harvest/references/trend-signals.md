# Trend Signals Reference

How to interpret streaming and revenue performance data: what patterns mean, what to act on, and what to watch.

---

## Revenue Trend Interpretation

### Consistent Growth (> 10% QoQ for 3+ quarters)
**Signal:** Organic audience development or sustained playlist placement.
**Action:** Protect this growth. Ensure the track is in a sync licensing pipeline (Tier A candidates are attractive to supervisors). Consider a re-release or remix to extend the growth curve.

### Spike + Drop
**Signal:** A playlist placement, influencer use, or viral moment drove a spike. The drop-off is the placement ending.
**Action:** Identify the source of the spike (often visible in Spotify for Artists audience data). If it was a playlist, pitch for re-inclusion. If it was user-generated content on TikTok/IG, identify the content type and consider engaging it directly.

### Gradual Decline (> 15% QoQ for 2+ quarters)
**Signal:** The track is aging out of its initial discovery cycle. Normal for releases > 2 years old.
**Action:** Assess sync potential. Streaming decline does not mean sync unviability — often the opposite. Tracks whose streaming has plateaued are in the "library music" phase and become attractive for catalog sync licensing.

### Sudden Revenue Drop Without Stream Drop
**Signal:** Platform royalty rate change, currency exchange rate shift, or territory-specific change.
**Action:** Check per-stream effective rate. Compare against benchmark. If the rate dropped, investigate which platform or territory is driving the change. Cross-reference with `publish-income` reconciliation.

### Sudden Revenue with Zero Streams
**Signal:** PRO income (which is separate from streaming) or a sync fee was distributed this quarter.
**Action:** Identify the source in the statement breakdown. If it's PRO broadcast income, identify what show or station used the track — this is a sync lead.

---

## Streaming Anomalies

### Streams Without Revenue
**Possible causes:**
1. Distributor payment lag — statements are 2–3 months behind the streaming period
2. Streams are below the distributor's minimum payout threshold — accumulating for the next period
3. Bot/fraudulent streams — platform may have audited and reversed the revenue
4. Track is not monetized on the platform (possible policy flag or content issue)

**Action:** Check the streaming period against the statement period. If the lag explains it, note and monitor. If streams are real but revenue is absent beyond the lag window, open a distributor inquiry.

### Very High Streams from One Country
**Signal:** Country-specific viral moment, playlist placement, or cultural tie-in. Also a potential bot traffic flag for certain countries known for stream manipulation.
**Action:** Check the country's per-stream rate (some are much lower than US). Calculate the effective rate for that country's streams. If the rate is appropriate and the streams are from a real territory, this is a positive signal. If the streams are from a known bot-risk territory with zero real audience, flag for investigation.

### Sudden Spike in PRO Income
**Signal:** A broadcast performance was detected and reported. Could be a TV sync, radio airplay, or a performance licensing event.
**Action:** Contact your PRO to identify the specific usage. This is a sync lead — find out who is using the track and build a relationship.

---

## Catalog Health Signals

### High Revenue Concentration
If the top 3 tracks generate > 60% of total revenue:
**Signal:** Dependency risk. If any one of those tracks loses playlist support or sync activity, portfolio income drops significantly.
**Action:** Actively develop the next tier. Use `publish-license` to build sync pipelines for Tier B tracks. Consider commissioning new recordings in styles adjacent to the top performers.

### Growing Dormancy Rate
If the percentage of Tier D (dormant) tracks increases quarter-over-quarter:
**Signal:** New releases are not replacing the revenue of aging catalog; or the active distribution / pitch program is not keeping pace with catalog growth.
**Action:** Audit whether dormant tracks have been pitched for sync. Many dormant streaming tracks have untapped sync value. Run `publish-license` on dormant tracks before marking them as archive candidates.

### PRO Income Growing Faster Than Streaming
**Signal:** Broadcast use is increasing — likely TV, film, or commercial licensing activity. This is the highest-value signal in the catalog.
**Action:** Identify the specific broadcasts through your PRO's performance reports. Build a relationship with the music supervisors involved. Pitch adjacent tracks from the same catalog.

### Mechanical Income Gap
If streaming revenue is significant but MLC mechanical income is zero or minimal:
**Signal:** Either MLC registration is missing, or the US streaming share is low.
**Action:** Verify MLC registration for all US-distributed tracks. If registered and still missing, contact the MLC to investigate.

---

## Seasonal Adjustment Reference

Music industry streaming revenue follows predictable seasonal patterns. Adjust expectations accordingly:

| Quarter | Streaming benchmark | Notes |
|---|---|---|
| Q1 (Jan–Mar) | -10 to -20% vs. Q4 | Post-holiday hangover; lower ad rates |
| Q2 (Apr–Jun) | Recovery; roughly flat to slight growth | |
| Q3 (Jul–Sep) | Modest growth | Summer playlisting activity |
| Q4 (Oct–Dec) | +20 to +30% vs. Q1 | Holiday ad market, year-end playlisting, gift subscriptions |

A Q1 revenue decline of 15% vs. Q4 is normal and not a signal of catalog decline. Adjust period-over-period comparisons to year-over-year where possible to eliminate seasonal noise.

---

## Sync Activity Signals

### Repeat Use by Same Licensee
**Signal:** A supervisor or brand is building an ongoing relationship with a specific track or artist.
**Action:** Reach out to the supervisor proactively. Offer a preferred rate for their next project. Introduce adjacent tracks from the catalog.

### Multiple Briefs in Same Genre/Mood
**Signal:** Market demand for a specific sound that aligns with the catalog.
**Action:** Run `publish-license` aggressively for that genre/mood segment. Consider commissioning new recordings specifically targeting the demand area.

### Zero Sync Activity for Tier A Streaming Tracks
**Signal:** Strong streaming tracks are not being pitched for sync, or are not landing. This is a missed revenue opportunity.
**Action:** Assess why: are the tracks being pitched? Are they getting through to supervisors? Is there a mismatch between streaming audience and sync market? Use `publish-license` to run a systematic brief matching pass on all Tier A tracks.
