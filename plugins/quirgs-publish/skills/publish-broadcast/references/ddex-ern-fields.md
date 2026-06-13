# DDEX ERN Field Requirements

Required and optional fields for DDEX ERN (Electronic Release Notification) submissions. Based on DDEX ERN 4.x schema as implemented by major distributors.

---

## What is DDEX ERN?

DDEX (Digital Data Exchange) ERN is the industry standard message format for delivering release metadata and audio assets to digital service providers (DSPs). Most distributors handle DDEX generation internally, but publishers with direct DSP deals or large catalog operations may interface with DDEX directly.

This reference covers the data fields required, not the XML schema syntax. For XML schema documentation, see: ddex.net/standard/ern.

---

## Release-Level Required Fields

| Field | Notes |
|---|---|
| `ReleaseId > ICPN` | The UPC/EAN of the release (12 or 13 digits) |
| `ReferenceTitle > TitleText` | The canonical release title |
| `ReleaseDate` | ISO 8601 format (YYYY-MM-DD). Must be the actual live date. |
| `ReleaseType` | Valid values: `Album`, `Single`, `EP`, `Compilation`, `Bundle` |
| `PLine` | Sound recording copyright notice: `℗ YYYY Rights Holder` |
| `CLine` | Composition copyright notice: `© YYYY Rights Holder` |
| `LabelName` | The label or rights holder name as it appears on release |
| `TerritoryCode` | ISO 3166-1 alpha-2 or `Worldwide` |
| `DealTerms > CommercialModelType` | Valid values: `SubscriptionModel`, `PayAsYouGoModel`, `FreeOfChargeModel` |

---

## Track-Level Required Fields (per ResourceList SoundRecording)

| Field | Notes |
|---|---|
| `SoundRecordingId > ISRC` | ISRC of the recording (format: CC-XXX-YY-NNNNN) |
| `ReferenceTitle > TitleText` | Track title |
| `Duration` | ISO 8601 duration format: `PT3M45S` (3 minutes 45 seconds) |
| `DisplayArtist > PartyName > FullName` | Primary artist name |
| `SoundRecordingType` | Typically `MusicalWorkSoundRecording` |
| `PLine` | Track-level P-line (may differ from release-level for compilations) |
| `TerritoryCode` | Can inherit from release or be track-specific |
| `DisplayLanguageSpecificData` | Language code (ISO 639-1) of the primary language |

---

## Track-Level Recommended Fields

| Field | Benefit |
|---|---|
| `ParentalWarningType` | `Explicit`, `NotExplicit`, or `Unknown`. Required by Apple Music and some DSPs. |
| `Genre` | Used for DSP categorization and playlist placement |
| `SubGenre` | Secondary genre tag |
| `Keywords` | Aids DSP search indexing |
| `Raga` / `Tala` | For classical Indian music |
| `FeaturedArtist > PartyName` | Separate field from DisplayArtist for feat. credits |
| `Contributor` | Producers, remixers, engineers — enhances credits display |

---

## Work-Level Fields (for Composition Registration)

Note: DDEX ERN includes a `MusicalWork` resource type that links the sound recording to the underlying composition. This is distinct from the PRO registration but complements it.

| Field | Notes |
|---|---|
| `MusicalWorkId > ISWC` | If ISWC is known; optional but strongly recommended |
| `ReferenceTitle > TitleText` | Composition title (may differ from recording title for covers) |
| `Composer > PartyName` | Legal name(s) of songwriter(s) |
| `Lyricist > PartyName` | If different from composer |
| `MusicPublisher > PartyName` | Name of administering publisher |

---

## DDEX ERN Version Notes

**ERN 4.x** is the current standard. ERN 3.x is legacy and being phased out. Key differences:
- ERN 4 uses `NewReleaseMessage` as the root element (vs. `NewReleaseMessage` with different namespace in ERN 3)
- ERN 4 separates `Release` and `Resource` more cleanly
- ERN 4 adds better support for bundled releases and pre-release messaging

Most major distributors (DistroKid, TuneCore, CD Baby, AWAL) handle ERN generation internally. Direct DDEX participants (labels with direct DSP deals) typically use DDEX-certified middleware.

---

## Common DDEX Rejection Reasons

1. ISRC format invalid or missing
2. UPC check digit error
3. Duration format incorrect (must be ISO 8601 — `PT3M45S`, not `3:45`)
4. Release date in the past for a "new release" message
5. P-line format non-standard (must include ℗ symbol)
6. TerritoryCode invalid (must be ISO 3166-1 alpha-2 or `Worldwide`)
7. Missing `PLine` at release or track level
