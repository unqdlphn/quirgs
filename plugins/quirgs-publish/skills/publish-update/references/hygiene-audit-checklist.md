# Catalog Hygiene Audit Checklist

Common error patterns in music catalog metadata. Use as a detection reference during the audit pass.

---

## Hard Errors — Block Distribution

These errors must be resolved before the catalog can be distributed or re-distributed.

### H1 — Invalid ISRC format
- ISRC does not match `^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$`
- Common causes: dashes stripped, lowercase letters, copied incorrectly from a statement
- Fix: reformat or reissue

### H2 — Duplicate ISRC
- The same ISRC code assigned to two or more distinct recordings
- Common cause: batch import error, accidental copy-paste in a spreadsheet
- Fix: one track gets the original ISRC; the other(s) need new ISRCs issued

### H3 — Invalid UPC check digit
- The final digit of the UPC does not pass the mod-10 check
- Common cause: typo in the last digit
- Fix: recalculate correct check digit or request a new UPC from the distributor

### H4 — Missing required field
- `track_title`, `isrc`, `artist`, `upc`, or `release_date` is empty or null
- Fix: fill with correct value before re-submitting

### H5 — Future release date on distributed track
- `release_date` is set to a date after today on a track already live on platforms
- Common cause: placeholder date never updated, or date was entered in wrong format
- Fix: update to the actual live date

### H6 — Duration mismatch
- Metadata duration differs from audio file duration by > 10 seconds
- Common cause: re-rendered audio file without updating metadata
- Fix: update metadata duration to match actual file

---

## Quality Errors — Reduce Royalty Accuracy and Discoverability

These errors don't block distribution but cause revenue and visibility problems.

### Q1 — Missing ISWC
- No ISWC in the composition field
- Impact: PRO royalties may not flow; mechanical licensing database matching fails
- Fix: look up via iswc.org, ASCAP/BMI work registry, or PRS online

### Q2 — Missing composer
- Composer field is empty or contains only the artist name without split information
- Impact: mechanical royalties may not be properly attributed; sync licensing requires composer credits
- Fix: fill with legal name(s) of songwriter(s)

### Q3 — Missing publisher
- Publisher field is empty
- Impact: sync licensing submissions incomplete; PRO matching may fail
- Fix: enter publishing entity name (or "Self-Published" if applicable)

### Q4 — Missing BPM
- BPM field is empty
- Impact: sync licensing platform rejection; BPM-filtered playlist tools skip the track
- Fix: calculate from audio file or look up on Spotify API / Tunebat

### Q5 — Missing or incorrect explicit flag
- Explicit content not flagged (or clean content flagged as explicit)
- Impact: Apple Music / Spotify may restrict distribution; parental advisory issues
- Fix: listen to the track; flag accurately

### Q6 — Genre missing or non-standard
- Genre field is empty, or uses a non-standard value (e.g., "Music", "Other", "N/A")
- Impact: reduced algorithmic playlist placement; streaming platform categorization errors
- Fix: apply a standard primary genre from the approved genre list

### Q7 — Missing P-line or C-line
- Sound recording or composition copyright notices absent
- Impact: platform display incomplete; required for catalog sale due diligence
- Fix: populate with `℗ [YEAR] [Owner]` and `© [YEAR] [Owner]`

---

## Structural Errors — Indicate Catalog Management Problems

### S1 — Title inconsistency within release
- Tracks on the same album have different stylistic title formats (e.g., some all-caps, some title-case)
- Fix: standardize to title case across the release

### S2 — Artist name variant
- The same artist appears under multiple name formats (e.g., `The Artist`, `the artist`, `ARTIST`)
- Common cause: data entry inconsistency across multiple upload sessions
- Fix: pick canonical form and standardize

### S3 — Release date inconsistency within album
- Tracks on the same album have different release dates
- May be legitimate (bonus tracks added later) or an error
- Fix: confirm intentional vs. error; if error, align to original release date

### S4 — Near-duplicate track title
- Two tracks have very similar names (e.g., `Song Title` and `Song Title (Radio Edit)`) with the same ISRC
- Common cause: version variant not given its own ISRC
- Fix: assign a new ISRC to the version

### S5 — Duration outlier
- Track duration < 30 seconds (royalty threshold issue) or > 20 minutes (likely data error unless confirmed long-form)
- Fix: verify audio file; if correct, flag as intentional

---

## Enrichment Priority Order

When triaging a large catalog for hygiene work, address in this order:

1. Hard errors (H1–H6) — distribution is blocked
2. Missing ISWC (Q1) — highest royalty impact
3. Missing composer/publisher (Q2–Q3) — licensing prerequisite
4. Missing BPM (Q4) — sync revenue impact
5. Explicit flag (Q5) — compliance risk
6. Genre / P-line / C-line (Q6–Q7) — quality and due diligence
7. Structural errors (S1–S5) — catalog professionalism
