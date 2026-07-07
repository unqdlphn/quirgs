# AI Tool Tier Map

Lookup table mapping specific AI tools to their default AI Involvement Tier. Used by `publish-provenance` during tier assignment and by `publish-shield` when tier context is not provided by the user.

Cross-reference with `ai-involvement-tiers.md` for full tier definitions and copyright implications.

---

## ⚠️ STEP 0 — Voice-Clone Override Check (MANDATORY, do this BEFORE the table below)

**Before looking up any tool in the Tool Reference Table, answer this question first:**

> Does any tool used on this track clone or synthesize the voice of a real,
> identifiable person, without a signed consent or licensing agreement from
> that person?

**If yes: assign Tier 4 immediately and stop.** Do not proceed to the Tool
Reference Table for that tool, do not average it against other tools' tiers,
and do not let a lower "default tier" shown in the table below change this —
the table's per-tool default-tier values (e.g., ElevenLabs shows "Default
tier: 2") describe *authorized/consensual* use only. An unauthorized voice
clone is Tier 4 regardless of what the table's default column says, regardless
of how minor the voice element is in the final mix, and regardless of how
human-authored every other element of the track is. This is a hard override,
not a factor to weigh — do not perform Provenance Triangle averaging on it.

Only proceed to the Tool Reference Table below once Step 0 has confirmed "no"
for every tool used, or for any tool whose voice-cloning use was properly
consented/licensed.

---

## How to Use (after Step 0 above)

1. Find the tool(s) used in the **Tool Reference Table** below.
2. Note the **Default Tier** and any **Usage Condition** — some tools produce different tiers depending on how heavily the AI output was modified.
3. When multiple tools are used, assign the **highest tier** across all tools.
4. If a tool is not listed, apply the **Default Classification Rules** at the bottom of this file.

---

## Tool Reference Table

### Mastering, Mixing & Audio Processing — Tier 1

These tools process existing human-created audio. They do not generate new musical content.

| Tool | Use case | Default tier | Notes |
|---|---|---|---|
| iZotope Ozone (AI assist) | AI-powered mastering | 1 | Does not generate creative content |
| LANDR | Automated mastering | 1 | |
| eMastered | Automated mastering | 1 | |
| iZotope RX | Noise reduction, audio restoration | 1 | |
| iZotope Neutron (AI assist) | AI-assisted mixing suggestions | 1 | Suggestions applied by human |
| Accusonus ERA | AI noise/reverb reduction | 1 | |
| Sonible smart:EQ | AI-assisted EQ | 1 | |
| Sonible smart:comp | AI-assisted compression | 1 | |
| Dolby Atmos mastering | Automated spatial mastering | 1 | |
| Waves plugins (general) | Processing plugins | 1 | Non-generative; treat as Tier 0 unless a specific Waves AI generation feature is used |

### Pitch Correction & Vocal Tuning — Tier 1

These tools correct or modify human performances. They do not replace human vocals with AI-generated content.

| Tool | Use case | Default tier | Notes |
|---|---|---|---|
| Auto-Tune | Pitch correction | 1 | Corrects human performance; no new content generated |
| Melodyne | Pitch/timing editing | 1 | **Exception:** If used to generate new notes or harmonies not performed by a human, treat as Tier 2 |
| Waves Tune | Pitch correction | 1 | |
| Antares Harmony Engine | Harmony generation from human vocal | 1 | Generated harmonies are derived from a human performance |

### Stem Separation & Audio Analysis — Tier 1

| Tool | Use case | Default tier | Notes |
|---|---|---|---|
| Moises | Stem separation | 1 | Separates existing audio; no generation |
| LALAL.AI | Stem separation | 1 | |
| RipX | Stem separation | 1 | |
| Spleeter (Deezer) | Stem separation | 1 | Open-source |
| Demucs (Meta) | Stem separation | 1 | Open-source |

### AI Composition & Music Generation — Tier 2 or 4

These tools generate musical content (melody, harmony, rhythm, audio). Tier depends on extent of human modification to the output.

| Tool | Use case | Default tier | Upgrade to Tier 4 if… |
|---|---|---|---|
| Suno | Full song/track generation | 2 | Output released with no substantial human modification |
| Udio | Full song/track generation | 2 | Output released with no substantial human modification |
| AIVA | AI composition | 2 | AI-composed score used largely as-is |
| Soundraw | AI beat/loop generation | 2 | |
| Beatoven.ai | Mood-based music generation | 2 | |
| Mubert | Generative background music | 2 | Typically near-as-is; often Tier 3–4 in practice |
| Stable Audio (Stability AI) | Text-to-audio generation | 2 | Output used near-as-is |
| AudioCraft / MusicGen (Meta) | Text-to-audio generation | 2 | Output used near-as-is; open-source |
| Amper Music | AI music generation | 2 | |
| Splash Pro | AI beat generation | 2 | |
| Google MusicFX / MusicLM | Text-to-music generation | 2 | |
| Endel | Adaptive generative music | 2 | Near-fully AI-generated soundscape |
| Boomy | AI song generation | 2 | Boomy tracks released as-is → Tier 4 |
| Soundful | AI music generation | 2 | |

**Default Tier 2 condition:** A human substantially modified the AI output — changed the melody, re-arranged structure, rewrote lyrics, or otherwise created a work that departs meaningfully from the raw AI output.

**Upgrade to Tier 4 condition:** The AI output was released with only minor edits (trim, volume, ordering) and a human did not originate any musical material.

### Lyric & Text Generation — Tier 2 or 3

| Tool | Use case | Default tier | Notes |
|---|---|---|---|
| ChatGPT / GPT-4 | Lyric drafting | 2 | Default assumes substantial human rewrite. If AI lyrics used as-is → Tier 3 |
| Claude (Anthropic) | Lyric drafting | 2 | Same as ChatGPT |
| Gemini (Google) | Lyric drafting | 2 | Same as ChatGPT |
| Llama (Meta) | Lyric drafting | 2 | Same as ChatGPT |
| Any LLM | Lyric generation | 2 | Assign Tier 3 if lyrics used near-as-is with no meaningful human rewrite |

### Vocal Synthesis & Voice Cloning — Tier 2, 3, or 4

**Have you completed Step 0 above for every tool in this section? If not, go
back and do it now before reading this table.**

These tools carry the highest compliance risk. Tier is determined primarily by **whether the voice being synthesized belongs to a real, identifiable person and whether consent was obtained**. The "Default tier" column below applies ONLY when Step 0 has already confirmed the voice use is either not a real-person clone, or is a real-person clone WITH signed consent — otherwise Step 0's Tier 4 override controls and this table does not apply.

| Tool | Use case | Default tier (consented/non-clone use only) | Upgrade conditions |
|---|---|---|---|
| ElevenLabs | Voice synthesis/cloning | 2 | → **Tier 4 (Step 0 override)** if cloning a real artist's voice without a signed consent/license agreement |
| ReSemble.AI | Voice synthesis/cloning | 2 | → **Tier 4 (Step 0 override)** if unauthorized voice clone |
| Kits.ai | Voice packs / voice cloning | 2 | → **Tier 4 (Step 0 override)** if cloning a real artist without consent |
| Voicemod (AI voice effects) | Real-time voice transformation | 2 | Transforms live human input; typically Tier 1–2 |
| Musicfy | AI voice covers | 3 | Default Tier 3 (AI cover of another artist's vocal style). → **Tier 4 (Step 0 override)** if voice clone without consent |
| So-Vits-SVC | Voice conversion | 4 | Near-exclusively used for unauthorized voice cloning; default Tier 4 |
| RVC (Retrieval-based Voice Conversion) | Voice conversion | 4 | Same as So-Vits-SVC; default Tier 4 unless using a fully licensed/synthetic voice |

**Tier 4 hard rule for voice cloning (same rule as Step 0 — repeated here for
visibility at the point of lookup):** Any use of a tool to replicate the voice
of a real, identifiable person without a signed consent or licensing agreement
is automatically Tier 4, regardless of all other factors, regardless of this
table's "Default tier" column, and regardless of how minor the voice element
is. This applies even if other elements of the track are human-authored.

### DAW Built-In AI Features — Tier 0 or 1

| Tool / Feature | Use case | Default tier | Notes |
|---|---|---|---|
| Logic Pro — Smart Tempo | Tempo analysis/matching | 0 | Algorithmic, not generative AI |
| Logic Pro — Drummer | AI-generated drum patterns | 1 | Pattern generator based on style selection; human directs |
| Logic Pro — Session Players (AI) | AI-generated bass/keyboard accompaniment | 2 | AI generates new musical content; human selects and arranges |
| Ableton Live — Max for Live AI tools | Varies | 1–2 | Assess on tool-by-tool basis |
| Studio One — Chord Track AI | Chord suggestions | 1 | Suggestions only; human performs and records |
| GarageBand — Smart Instruments | AI-assisted instrument | 1 | Human-directed; AI fills in accompaniment |

---

## Default Classification Rules

Apply these when a tool is not listed above.

| Question | Answer | Assign |
|---|---|---|
| Does the tool **generate new musical content** (melody, harmony, rhythm, audio waveforms, lyrics) that appears in the final work? | Yes | Tier 2 minimum |
| Does the tool **process or enhance existing human-created audio** without generating new creative material? | Yes | Tier 1 |
| Is the tool **a standard DAW, effects plugin, or instrument** with no AI generation capability? | Yes | Tier 0 |
| Was the AI-generated content used **near-as-is** with minimal human modification? | Yes | Upgrade to Tier 3 or 4 |
| Does the tool clone or synthesize **a real person's voice** without their consent? | Yes | Tier 4 (override all other factors) |
| Is the tool unknown and the extent of AI involvement unclear? | Yes | Flag for human review; do not self-assign tier |

---

## Multi-Tool Assignments

When a track was made using multiple tools from different tiers:

1. **Assign the highest tier** across all tools used.
2. **Exception:** Tier 4 voice cloning overrides all other tiers regardless of how minor the voice element is in the final mix. A track with Tier 1 mastering and Tier 4 unauthorized voice clone is Tier 4.
3. **Document each tool separately** in the Creation Log — do not collapse to a single tier without listing the contributing tools.

---

## Maintenance

This file reflects tool capabilities and platform policies as of **June 2026**. The AI music tool landscape changes rapidly.

**Review triggers:**
- A major new AI music tool releases (add to table within 30 days of release)
- A listed tool significantly changes its core capability (e.g., moves from processing to generation)
- A platform changes its AI content policy in a way that affects tier-to-platform mapping

**Owner:** Quirgs program maintainer. Update in both `publish-provenance/references/` and propagate to any downstream references.
