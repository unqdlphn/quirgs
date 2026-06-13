# The Provenance Triangle

A three-axis framework for assessing and documenting the creative provenance of AI-involved music works.

---

## Framework Overview

The Provenance Triangle maps a work's creative origins across three independent axes. Unlike a binary "AI-made / human-made" distinction, the triangle captures the nuance of collaborative human-AI creation.

```
            HUMAN AUTHORSHIP (H)
                  ▲
                  │
                  │         High H, Low A, High T:
                  │         Traditional human work,
                  │         AI tools for production only
                  │
                  │
   Low H, High A  │──────────────────────── High H, Low A
   Low T:         │                         High T:
   Fully AI-gen,  │     [WORK POSITION]      AI-assisted,
   undocumented   │                          well-documented
                  │
                  └──────────────────────────────────────►
AI CONTRIBUTION (A)                        TOOL TRANSPARENCY (T)
```

Every work occupies a position within the triangle. The goal is not to maximize Human Authorship (which would exclude all AI tools) but to understand and accurately document where a work sits.

---

## Axis Definitions

### Axis H — Human Authorship

Measures the degree of original, creative decision-making contributed by a human author.

**What increases H:**
- Human wrote the original melody (not from AI generation)
- Human wrote the lyrics from their own creative expression
- Human made deliberate arrangement and structural choices
- Human performed instruments or vocals
- Human significantly modified AI-generated material (more than surface edits)
- Human selected from a range of AI outputs based on creative vision (curation counts but at lower weight)

**What does not increase H:**
- Providing a text prompt to an AI generator
- Clicking "generate" or "randomize"
- Minor parameter adjustments without intent (e.g., changing a tempo slider without a specific musical reason)
- Uploading a reference track and accepting AI output without modification

**Scoring reference:**
10 = fully human-authored by any established creative standard
0 = zero human creative contribution (prompt only, accepted without modification)

---

### Axis A — AI Contribution

Measures how significantly AI-generated content appears in the final work.

**What increases A:**
- AI generated the melody or harmonic content that appears in the release
- AI generated the lyrics that appear in the release
- AI generated stems, samples, or audio that appear in the mix
- AI generated the full arrangement or production
- AI mastered or significantly processed the final audio in a way that affected the musical content

**What does not increase A:**
- Using AI for non-creative automation (e.g., AI-powered noise reduction, AI stem splitter for remixing)
- AI-powered distribution or metadata tools
- AI used to analyze references for inspiration (without generating content used in the track)
- Algorithmic tools in a DAW (quantize, auto-tune used subtly) — these are standard production tools, not AI generation in the provenance sense

**Scoring reference:**
10 = the final work is entirely AI-generated from input prompt to audio output
0 = no AI-generated content present in the final work

---

### Axis T — Tool Transparency

Measures how well the AI tools and their specific uses are documented.

**What increases T:**
- All AI tools identified by name and version
- Specific use case documented for each tool (what it generated, at what stage)
- AI output and human modifications both documented (e.g., "AI generated a 4-bar piano motif; we transposed it, changed the rhythm, and extended it to 16 bars")
- DAW session files retained
- Prompt text retained (for generative tools)

**What decreases T:**
- AI tools used but not remembered or documented
- General statements like "we used some AI" without specifics
- No record of which AI outputs were used vs. discarded

**Scoring reference:**
10 = complete documentation exists for every AI tool interaction
0 = no documentation of any AI tool use

---

## Composite Interpretation

The three axes interact. Common profiles:

### High H + Low A + High T
Traditional human-authored work with modern AI production tools (e.g., iZotope for mastering).
**Typical tier:** 0–1. Full copyright expected.

### High H + Medium A + High T
Songwriter used AI to generate chord progressions or suggest melodies, then significantly rewrote and arranged the output.
**Typical tier:** 2. Copyright likely with documentation; disclose AI assistance.

### Medium H + High A + High T
Human curated, selected, and arranged AI-generated content. The creative selection process is the human contribution.
**Typical tier:** 3. Copyright uncertain; human curation argument applicable but not settled law.

### Low H + High A + Low T
Prompt-to-output generation; minimal documentation.
**Typical tier:** 4. Copyright very unlikely; transparency required by platforms.

---

## Why Documentation Matters

A work at Tier 3 with excellent documentation (High T) is in a better legal and commercial position than the same work with no documentation. Documentation supports:

1. **Copyright registration** — the Copyright Office's current guidance requires human authorship; documentation of human creative decisions is evidence of that authorship
2. **Platform compliance** — platforms require disclosure of AI content; documented provenance supports compliance
3. **Licensing** — sync buyers and publishers conduct due diligence; documented provenance reduces liability risk
4. **Future legal developments** — as AI copyright law evolves, documented provenance will be a key factor in determining rights — having records from creation time is valuable regardless of how law develops

---

## Provenance Registry (Recommended Practice)

For publishers managing a catalog with multiple AI-involvement tiers, maintain a provenance registry:

| Track Title | ISRC | Log Date | H Score | A Score | T Score | Tier | Legal Review |
|---|---|---|---|---|---|---|---|
| [Title] | [ISRC] | [Date] | [0–10] | [0–10] | [0–10] | [0–4] | [Required/Clear] |

The registry provides an at-a-glance view of catalog-wide AI exposure and tracks which works need legal review before commercial licensing.
