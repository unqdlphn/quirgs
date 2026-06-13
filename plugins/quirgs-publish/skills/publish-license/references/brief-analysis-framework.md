# Brief Analysis Framework

A structured system for decoding sync licensing briefs into matchable criteria.

---

## Brief Types

Sync briefs arrive in several forms. Identify the type before parsing:

| Type | Description | What to extract |
|---|---|---|
| **Formal written brief** | Sent by supervisor or music editor via email or brief service | All signal categories — most complete |
| **Scene description** | A paragraph describing a scene, moment, or sequence | Mood, pacing, instrumentation signals |
| **Reference track list** | A list of tracks or artists as examples | Reverse-engineer the criteria from the references |
| **Verbal description** | The user describes what they heard or what was asked for | Ask clarifying questions — fill gaps before scoring |
| **Platform brief** | From sync licensing platforms (Musicbed, Artlist, Musicbed, Pond5, etc.) | Platform-specific fields; map to standard criteria |

---

## Signal Categories — Detailed

### Mood / Emotion

Primary and secondary moods. Sync supervisors and ad agencies use specific vocabulary — map to this list:

**Positive moods:** hopeful, triumphant, inspirational, nostalgic, joyful, playful, romantic, warm, tender, whimsical, dreamy, uplifting, empowering, celebratory

**Neutral / tension moods:** contemplative, introspective, mysterious, suspenseful, tense, urgent, building, cinematic, epic, anthemic, dramatic

**Dark / negative moods:** melancholic, haunting, dark, ominous, anxious, lonely, somber, bittersweet, raw, aggressive, chaotic

**Emotional arc signals:**
- "Builds to a climax" → needs a track with clear dynamic build
- "Quiet intimacy" → low energy, minimal arrangement throughout
- "Emotional payoff" → track should have a release moment (drop, bridge, chorus)

---

### Tempo

Convert qualitative descriptions to BPM ranges:

| Qualitative | BPM range |
|---|---|
| Slow / dirge | 40–70 |
| Ballad / mid-slow | 70–90 |
| Mid-tempo | 90–110 |
| Uptempo / moderate | 110–130 |
| Driving / energetic | 130–150 |
| Fast / aggressive | 150+ |

When a brief specifies a scene action (running, fighting, slow walk), infer tempo from the natural pace of that action.

---

### Energy Level Scale (1–10)

| Level | Description | Typical arrangement |
|---|---|---|
| 1–2 | Near silent, ambient | Solo piano, sparse acoustic guitar, field recording |
| 3–4 | Quiet, intimate | Acoustic instruments, minimal percussion, voice |
| 5–6 | Mid-energy, present | Full instrumentation but restrained; moderate drums |
| 7–8 | High energy, impactful | Full band, prominent drums and bass, dynamic range |
| 9–10 | Maximum energy, explosive | Wall of sound, distortion, aggressive rhythm |

---

### Instrumentation Signals

**Required / avoid signals to parse:**

- "No lyrics" / "instrumental only" → flag vocal tracks as disqualified
- "Acoustic" → acoustic guitar, piano, strings preferred; avoid electronic production
- "Electronic / synthetic" → synthesizers, 808s, programmed drums preferred
- "Live drums" → programmed/electronic drums are a negative signal
- "Orchestral" → strings, brass, woodwinds required
- "Guitar-driven" → electric guitar as lead or rhythm instrument
- "Piano-led" → piano as primary melodic/harmonic instrument
- "Avoid horns" / "no trumpet" → direct exclusion; flag any tracks with that instrument

---

### Lyrical Theme Analysis

When lyrics are relevant (vocal track required), analyze the lyrical theme for fit:

1. What is the song's story or message?
2. Does any lyric directly conflict with the brand or scene? (e.g., a funeral scene using an upbeat love song is usually acceptable; a car ad using a song about a fatal car crash is not)
3. Are there any lyrical red flags? (explicit content, brand-conflicting references, competitor product mentions)

---

### Budget Tier Reference

| Tier | Typical sync fee range | Common use cases |
|---|---|---|
| Micro / gratis | $0–$500 | Student films, small social media, non-profits |
| Indie | $500–$5,000 | Independent films, regional TV, small web campaigns |
| Mid-range | $5,000–$25,000 | National TV spots, streaming series, major web campaigns |
| Premium | $25,000–$100,000+ | Network TV, major theatrical film, global advertising campaigns |

Budget tier affects which catalog tracks are realistic pitches. High-value catalog from major artists is not worth pitching to a micro-budget placement.

---

### Reference Track Analysis

When the brief includes reference tracks:

1. Identify the genre, BPM, mood, energy, and instrumentation of each reference
2. Look for the common denominator across all references (that's the core criteria)
3. Note where references diverge — this is ambiguity in the brief; surface it to the user
4. Do not pitch a track that sounds too similar to a named reference — the supervisor already licensed that sound or knows it; they want something adjacent but distinct

---

## Questions to Ask When Brief Is Incomplete

If the brief is missing key signals, ask:

1. "Is this for a vocal or instrumental track?" (often unspecified)
2. "Is there a BPM requirement or tempo reference?" (often unspecified in written briefs)
3. "Is the use for a specific scene — can you describe what's happening on screen?"
4. "Is the license non-exclusive, or do they need exclusivity?"
5. "What's the usage territory — national, regional, or worldwide?"
6. "Is there a deadline for submissions?"
