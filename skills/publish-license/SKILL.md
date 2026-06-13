---
name: publish-license
description: >
  Run a three-agent sync licensing pipeline — Brief Analyst, Catalog Matcher, and Pitch
  Writer — to identify the best catalog candidates for a sync opportunity and produce a
  client-ready pitch. Use this skill whenever someone says "pitch a sync license",
  "find tracks for this brief", "match my catalog to a brief", "I have a sync
  opportunity", "write a sync pitch", "help me respond to a music supervisor",
  "find music for this scene", "match tracks to a placement", "license my music for
  sync", "prepare a sync submission", or any request to identify catalog tracks that
  fit a creative brief and write a pitch to accompany the submission. Also trigger when
  a publisher or composer describes a specific media project (film, TV, ad, game) and
  asks which of their tracks would work. Outputs a scored catalog shortlist and a
  polished pitch document ready to send to a music supervisor.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-license@quirgs-publish`

# Publish License — Sync Licensing Pipeline

A three-agent workflow for matching catalog to sync opportunities and generating submission-ready pitches.

```
Brief Analyst → Catalog Matcher → Pitch Writer
```

---

## Agent 1 — Brief Analyst

**Input:** The sync brief (written description, mood board, reference tracks, or a direct description from the user)

**Goal:** Decode the brief into a structured set of matching criteria that Agent 2 (Catalog Matcher) can score against.

### Step 1a — Extract Brief Signals

Parse the brief for the following signals:

Load `references/brief-analysis-framework.md` for the full signal taxonomy.

| Signal category | What to extract |
|---|---|
| **Mood / Emotion** | primary emotion, secondary emotion, emotional arc (builds/drops) |
| **Tempo** | specific BPM range, or qualitative (slow / mid / uptempo / driving) |
| **Energy** | scale 1–10 or qualitative (quiet/intimate → explosive/anthemic) |
| **Genre** | preferred genre(s) or genre to avoid |
| **Instrumentation** | specific instruments required/preferred; instruments to avoid |
| **Vocal** | vocal or instrumental; gender preference if any; lyrical theme |
| **Duration** | required clip length (e.g., "30-second spot", "2-minute scene") |
| **Budget tier** | indie/micro, mid-range, premium, or unspecified |
| **Exclusivity** | exclusive license, non-exclusive, or unspecified |
| **Territory** | specific country, region, or worldwide |
| **Media type** | TV series, film, ad/commercial, video game, trailer, social media, podcast |
| **Audience** | the target demographic of the media project |
| **Reference tracks** | tracks mentioned as "sounds like" or examples of what they want |

### Step 1b — Produce the Brief Decode

Output a structured brief decode before proceeding to catalog matching:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 BRIEF DECODE
Project: [Name or description]
Media type: [Type]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary mood:       [Value]
Secondary mood:     [Value]
Tempo range:        [BPM range or qualitative]
Energy level:       [1–10]
Genre fit:          [Genre(s)]
Instrumentation:    [Must have / Nice to have / Avoid]
Vocal requirement:  [Yes/No/Either] | [Gender preference]
Lyrical theme:      [If relevant]
Duration needed:    [Value]
Budget tier:        [If known]
Exclusivity:        [If specified]
Territory:          [If specified]
Media type:         [Value]
Reference tracks:   [List]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask the user to confirm the decode before proceeding. If any signals are missing, note them as assumptions.

---

## Agent 2 — Catalog Matcher

**Input:** The brief decode from Agent 1 + the user's catalog (list of tracks with metadata)

**Goal:** Score each track against the brief and produce a ranked shortlist of the top candidates.

Load `references/catalog-matching-criteria.md` for the scoring rubric.

### Step 2a — Score Each Track

For each track in the catalog, calculate a match score:

| Criteria | Weight | Score (0–3) |
|---|---|---|
| Mood match | 30% | 0=no match, 1=partial, 2=strong, 3=exact |
| Tempo match | 20% | 0=out of range, 1=edge of range, 2=within range, 3=target BPM |
| Energy match | 15% | 0=wrong level, 1=adjacent, 2=close, 3=exact |
| Instrumentation match | 15% | 0=has avoid instruments, 1=neutral, 2=has nice-to-haves, 3=ideal |
| Genre match | 10% | 0=wrong genre, 1=adjacent, 2=fits, 3=preferred genre |
| Vocal match | 10% | 0=wrong type, 1=acceptable, 2=fits, 3=exact requirement |

```
Total score = Σ (weight × score) / (max_possible × 100) × 100
```

### Step 2b — Output the Shortlist

Rank tracks by score. Present the top 3–5 candidates:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 CATALOG MATCH RESULTS
Project: [Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#1 — [Track Title] | Score: [X]/100
   ISRC: [Value]
   Why it fits: [2–3 sentence match rationale]
   Potential concern: [If any]

#2 — [Track Title] | Score: [X]/100
   ...

NOTES ON GAPS
─────────────
[If no track scores > 70 on mood, note this as a catalog gap]
[If brief requires instrumentation not present in catalog, flag it]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask the user to confirm the shortlist before writing pitches.

---

## Agent 3 — Pitch Writer

**Input:** The confirmed shortlist + the brief decode

**Goal:** Write a polished pitch for each shortlisted track, ready to send to the music supervisor.

Load `references/pitch-writing-guide.md` for pitch structure and tone guidelines.

### Step 3a — Write the Pitch

For each track in the confirmed shortlist, produce a pitch in this structure:

```
Subject: [Track Title] — [One-line hook tied to the brief]

Hi [Supervisor name / "there" if unknown],

[Opening: 1–2 sentences acknowledging the project and why you're reaching out]

[Track paragraph: title, artist, why it fits this specific brief — reference the
brief's own language back to them. Include BPM, key, duration, mood. No generic
superlatives.]

[Availability paragraph: confirm the track is available for sync, territory, and
exclusivity. Include any relevant licensing notes.]

[Link / delivery: streaming link, download link, or attachment. Watermarked stems
available on request if applicable.]

[Closing: brief, professional. One sentence. Name + contact.]
```

### Step 3b — Produce the Final Pitch Document

Compile the pitches into a single submission document. Offer to save as `.md` or format as a ready-to-send email.

---

## Key Principles

- **One supervisor, one email.** Never send a mass-blast pitch to a list. Each pitch should feel tailored.
- **Brief decode first.** Do not start matching until the brief decode is confirmed. A wrong assumption in Agent 1 cascades through the entire pipeline.
- **Score honestly.** If the top match scores below 60, flag it. A low-confidence submission wastes the supervisor's time.
- **Match the brief's language.** Supervisors describe what they need in specific ways — echo their vocabulary back in the pitch.
- **Advisory notice applies to licensing.** This skill does not produce a legal license agreement. All license terms must be formalized through a sync licensing agreement.
