# Metadata Standards Reference

Field definitions, format specifications, and validation rules for music catalog metadata.

---

## Core Identifiers

### ISRC — International Standard Recording Code
**Format:** `CC-XXX-YY-NNNNN`
- `CC` — 2-letter ISO 3166-1 country code of registrant (e.g., US, GB, DE)
- `XXX` — 3-character alphanumeric registrant code (assigned by national ISRC agency)
- `YY` — 2-digit year of registration (not release year)
- `NNNNN` — 5-digit designation number (sequential, assigned by registrant)

**Regex validation:** `^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$`

**Key rules:**
- One ISRC per unique recording. A remix, edit, or re-record requires a new ISRC.
- ISRCs are permanent — they never expire and should not be reused.
- Assign before distribution. Most distributors will assign one if not provided; this creates registrant codes that may not match the publisher's own registrant code.

**Registration:** Via the national ISRC agency (RIAA in the US: usisrc.org). Free if you register directly. Distributors also issue ISRCs — check which registrant code they use.

---

### ISWC — International Standard Musical Work Code
**Format:** `T-XXXXXXXXX-C` (T followed by 9 digits and a check character)

Identifies a musical composition (words + music), distinct from the sound recording (ISRC). A single composition may have thousands of recordings, all with different ISRCs but sharing the same ISWC.

**Registration:** Assigned by the first PRO where the composition is registered. Search existing ISWCs via iswc.org or your PRO's online work registry.

**Why it matters:** Without an ISWC, automated matching of composition royalties to recordings breaks down. PROs rely on ISWC to route mechanical and performance payments correctly.

---

### UPC / EAN — Universal Product Code / European Article Number
**Format:** 12-digit (UPC-A) or 13-digit (EAN-13)

Identifies a release (album, EP, single) rather than an individual track. Required by all major digital storefronts.

**Check digit validation:** EAN-13 check digit = mod-10 algorithm. Most distributors validate this automatically, but it's worth verifying for catalog-level audits.

**Assignment:** Issued by GS1 (gs1.org) or by the distributor. If issued by the distributor, the UPC is tied to that distributor — a catalog migration may require new UPCs.

---

## Title Fields

### track_title
The canonical title of the recording as it should appear on all platforms.

**Formatting rules:**
- Title case (capitalize all words except articles and prepositions of 3 or fewer letters, unless they open the title)
- No trailing whitespace
- Permitted special characters: `( ) , - : . ' & /`
- Version indicators go in parentheses: `Song Title (Radio Edit)`, `Song Title (feat. Artist Name)`
- Do not include the artist name in the track title field

### release_title
The title of the album, EP, or single release containing the track. For standalone singles, this is often the same as `track_title`.

---

## Contributor Fields

### artist
The primary performing artist as it should appear on platform pages. For featured artists, use the `featuring` field or append `(feat. Artist Name)` per platform convention. Do not use all-caps.

### composer
The songwriter(s) — the person(s) who wrote the words and/or music. Use legal names, not stage names. If multiple composers, separate with `;` (semicolon). This is the field used for mechanical licensing and PRO registration.

### publisher
The music publishing company that administers the composition rights. If self-published, use the artist's publishing entity name (e.g., `John Smith Music` or `Self-Published`). Required for sync licensing and PRO matching.

---

## Classification Fields

### genre
Use one of the following top-level genre tags as the primary genre. Append a sub-genre in a secondary field if available.

Standard primary genres: `Pop`, `Rock`, `Hip-Hop/Rap`, `R&B/Soul`, `Country`, `Electronic/Dance`, `Jazz`, `Classical`, `Folk/Acoustic`, `Latin`, `Reggae`, `Metal`, `Gospel/Christian`, `Blues`, `Ambient`, `World`, `Soundtrack`, `Alternative`, `Indie`, `Other`

Platforms have their own genre taxonomies — map from this standardized list to platform-specific values during distribution.

### language
ISO 639-1 two-letter language code of the primary vocal language. For instrumental tracks, use `zxx` (no linguistic content). Common values: `en` (English), `es` (Spanish), `fr` (French), `pt` (Portuguese), `de` (German), `ja` (Japanese), `ko` (Korean).

### explicit
Boolean (`true` / `false`). Set to `true` if the track contains explicit language per platform content guidelines. When in doubt, flag as explicit — a clean label on an explicit track causes fewer problems than an explicit track without a flag.

---

## Technical Fields

### duration
Format: `HH:MM:SS` or total seconds as integer. Must match the actual audio file to within ±2 seconds to avoid rejection.

**Key thresholds:**
- < 30 seconds: ineligible for streaming royalty on Spotify, Apple Music, Amazon
- > 10 minutes: flag for review — not invalid but uncommon; may indicate a data entry error

### bpm
Beats per minute as a decimal (e.g., `128.0`). Used by sync supervisors, playlist curators, and DJ tools. Not required for distribution but important for sync licensing marketplaces.

---

## Copyright Fields

### copyright_year
The year the sound recording copyright was established (usually the year of recording or first release). Used in the P-line.

### p_line
Sound recording copyright notice: `℗ [YEAR] [Owner Name]`. Example: `℗ 2024 Indie Label LLC`.

### c_line
Composition copyright notice: `© [YEAR] [Owner Name]`. Example: `© 2024 John Smith Music`.
