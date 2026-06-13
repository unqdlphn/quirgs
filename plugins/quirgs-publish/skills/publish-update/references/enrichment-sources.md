# Enrichment Sources Reference

Where to find authoritative metadata values for gaps identified during the hygiene audit.

---

## ISRC Lookup and Assignment

**If the ISRC was previously assigned:**
1. Check the original distributor dashboard — all major distributors store the ISRC they assigned or accepted at upload
2. Check the ISRC search tool at usisrc.org (US registrations) or the national ISRC agency for non-US tracks
3. Check ASCAP, BMI, or PRO work registry — some registrations include the linked ISRC

**If no ISRC was ever assigned:**
- Register as an ISRC registrant via usisrc.org (free for US-based rights holders)
- Or request ISRC assignment from your current distributor before the next distribution

---

## ISWC Lookup

**Primary sources (authoritative):**
- iswc.org — ISWC International Agency lookup (search by title and composer)
- ASCAP Repertory (ascap.com/music/repertory) — search by song title, composer, or publisher
- BMI Repertoire (repertoire.bmi.com) — same approach
- PRS for Music (prsformusic.com) — work search for UK/European registrations

**Notes:**
- ISWC is assigned when the composition is first registered with a PRO
- If the composition has never been registered, it has no ISWC — PRO registration creates the ISWC
- A single composition may appear under different titles at different PROs — always confirm by composer name + title combination, not title alone

---

## BPM Lookup

**From audio file (most accurate):**
- Audacity (free): Beat Finder tool
- Logic Pro / Ableton: Smart Tempo analysis
- Rekordbox / Serato: auto-analyze
- Python: `librosa.beat.beat_track()` for batch processing

**Without audio file:**
- Spotify Web API (`audio-features` endpoint): returns `tempo` (BPM) for any track with a Spotify ID. Requires a free Spotify developer account and OAuth token.
- Tunebat.com: BPM + key lookup by track name / Spotify URL. Covers most commercially released tracks.
- GetSongBPM.com: alternative lookup tool with similar coverage.

**For unreleased tracks:** BPM must come from the audio file or DAW session. No external source can provide it.

---

## Composer and Publisher Lookup

**Primary sources:**
- PRO work registry (ASCAP/BMI/SESAC) — search by song title; results include composer and publisher splits
- Original contract documentation (co-write agreements, publishing admin agreements)
- Liner notes from original release (physical or digital booklet)
- Songtrust, Songfile (HFA), or DistroKid's publishing admin tools (if enrolled)

**Notes:**
- Composer names in PRO databases use legal names (not stage names) — verify against ID documentation if there's ambiguity
- Publisher names may differ from the trading name: look for the legal entity name registered with the PRO
- Co-writes: each co-writer's share must sum to 100% across all songwriter splits (publisher side separately)

---

## Genre Classification

**Approach:**
1. Check the artist's primary genre on Spotify (artist page → Genre tags listed under the name)
2. Check AllMusic (allmusic.com) — genre and subgenre listed on every artist and album page
3. Check Discogs (discogs.com) — genre and style tags on release pages
4. For new/unsigned artists: classify based on sonic characteristics relative to genre definitions

**Platform-specific mapping:**

| Standard genre | Spotify genre | Apple Music genre | YouTube category |
|---|---|---|---|
| Hip-Hop/Rap | Hip-Hop | Hip-Hop/Rap | Music |
| Electronic/Dance | Dance/Electronic | Electronic | Music |
| R&B/Soul | R&B | R&B/Soul | Music |
| Classical | Classical | Classical | Music |
| Latin | Latin | Latino | Music |

---

## Duration Lookup

**From audio file:** Read embedded ID3/Vorbis tag `duration` field, or measure directly in any DAW or audio editor.

**Without audio file:**
- Spotify Web API (`tracks` endpoint): returns `duration_ms` for any track with a Spotify ID. Divide by 1000 for seconds.
- Apple Music API (public catalog search): returns `durationInMillis`.
- Tidal / YouTube Music track pages: display duration in the track listing.

**Note:** Always convert to `HH:MM:SS` for the canonical metadata field, but store the raw seconds value separately for calculations.

---

## Copyright Holder Lookup

**For the P-line (sound recording):**
- The P-line holder is the entity that funded and owns the sound recording (typically a label or, for independent artists, themselves)
- Check the original recording contract or the artist's own documentation
- For catalog acquisitions: check the acquisition agreement for the rights transfer date and new P-line holder name

**For the C-line (composition):**
- The C-line holder is the music publisher or, for self-published works, the songwriter
- Check the PRO registration or original co-publishing agreement

**Copyright year:**
- For first-release tracks: the year the recording was first commercially released
- For unreleased recordings: the year the recording was made (fixed in tangible form)
