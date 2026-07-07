---
name: publish-provenance
description: >
  Generate a creation log and AI involvement assessment for a music release, documenting
  the degree of human authorship and AI contribution using the Provenance Triangle
  framework. Use this skill whenever someone says "document my AI use", "log how I made
  this", "create a provenance record", "AI transparency for my release", "copyright
  declaration for AI music", "how do I disclose AI in my music", "creation log",
  "AI involvement assessment", "Provenance Triangle", "document my creative process",
  "is my music copyrightable if I used AI", or any request to create a formal record of
  how a track was made and what role AI played in its creation. Also trigger when a
  publisher or artist is preparing a release and needs to meet transparency or copyright
  requirements related to AI-generated content. Outputs a structured creation log and
  Provenance Triangle assessment with a copyright-readiness determination.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-provenance@quirgs-publish`

# Publish Provenance — Creation Log + AI Involvement Assessment

Documents the creative process behind a music release, assesses the degree of AI involvement using the Provenance Triangle framework, and produces a formal provenance record supporting copyright claims and platform transparency requirements.

---

## Standing Disclaimer

Every response this skill produces — including clarifying questions, partial or
prose-only answers, and any output that is not the full formatted creation log —
must end with this line:

> ⚠️ *Advisory only — this is not a legal determination of copyright or authorship; consult IP counsel before relying on it.*

The full boxed ADVISORY NOTICE in Step 4 replaces this short line only when the
complete creation log is emitted.

---

## Step 1 — Gather Creation Details

Ask the user for the following information about the track or release. If they're unsure of specific details, note them as "undocumented" rather than leaving blank.

### Track Information
- Track title and ISRC
- Artist / creator name
- Release date (or intended release date)

### Creation Questions
1. **Did a human write the melody?** (Yes / No / Partially)
2. **Did a human write the lyrics?** (Yes / No / Partially / Instrumental)
3. **Did a human arrange or produce the track?** (Yes / No / Partially)
4. **Did a human perform any instruments or vocals?** (List which)
5. **Was AI used at any stage?** If yes:
   - What AI tools were used? (tool name, version if known)
   - At what stage? (composition, lyrics, production, mixing, mastering, artwork)
   - What was the AI's specific contribution? (generated a melody, suggested chord progressions, wrote a verse, created stems, processed audio, etc.)
   - How much was the AI output modified by a human? (used as-is / significantly edited / used as inspiration only)
6. **Is there original creative expression from a human author?** (Yes / No / Uncertain)
7. **Was the creative process documented anywhere?** (DAW session files, version history, notes, emails, contracts)

---

## Step 2 — Assess the Provenance Triangle

Load `references/provenance-triangle.md` for the full framework.

The Provenance Triangle has three axes:

```
            HUMAN AUTHORSHIP
                  ▲
                  │
                  │
AI CONTRIBUTION ◄─┼─► TOOL TRANSPARENCY
```

Assess the track on each axis:

### Axis 1 — Human Authorship (0–10)
| Score | Description |
|---|---|
| 9–10 | Fully human-authored: melody, lyrics, arrangement, performance all by a human |
| 7–8 | Primarily human: AI used for minor assistance (e.g., AI-assisted mastering only) |
| 5–6 | Mixed: significant human creative decisions but AI generated some material that was used |
| 3–4 | AI-dominant: human primarily curated and selected from AI-generated outputs |
| 1–2 | Near-fully AI: human provided prompts only; minimal creative selection beyond prompt |
| 0 | Fully AI-generated with no meaningful human creative contribution |

### Axis 2 — AI Contribution (0–10)
Rate the extent of AI's role in the final work:
| Score | Description |
|---|---|
| 0–1 | No AI used |
| 2–3 | AI used for non-creative tasks only (e.g., AI noise reduction, AI distribution tools) |
| 4–5 | AI assisted in creative decisions (chord suggestions, reference analysis) but all material created by humans |
| 6–7 | AI generated content that appears in the final work, but was significantly modified |
| 8–9 | AI generated content used largely as-is; human curated and arranged |
| 10 | AI generated the complete work from prompt to output |

### Axis 3 — Tool Transparency (0–10)
Rate how well-documented the AI tool usage is:
| Score | Description |
|---|---|
| 9–10 | All tools documented by name, version, and specific use case |
| 7–8 | Major tools documented; minor uses noted generically |
| 5–6 | Tools noted but use cases not fully specified |
| 3–4 | Some tools known; others undocumented |
| 1–2 | Vague recollection of AI use but specifics unknown |
| 0 | No documentation of tool use |

---

## Step 3 — Assign an AI Involvement Tier

Load `references/ai-involvement-tiers.md` for tier definitions and copyright implications.

Load `references/ai-tool-tier-map.md` and cross-check each tool named in Step 1 against the table. The tool map provides a default tier per tool and flags usage-dependent upgrades (e.g., Suno → Tier 2 if modified, Tier 4 if released as-is). Use the **highest tier** across all tools listed. If Triangle scores and tool map disagree, use the higher of the two and note the discrepancy in the log.

Based on the Provenance Triangle scores, assign one of five tiers:

| Tier | Label | Typical scores | Copyright status |
|---|---|---|---|
| 0 | No AI | AI Contribution = 0 | Full copyright — standard |
| 1 | AI-Assisted | AI Contribution 1–3; Human Authorship 8–10 | Full copyright expected |
| 2 | AI-Collaborative | AI Contribution 4–6; Human Authorship 6–9 | Copyright likely with documentation |
| 3 | AI-Directed | AI Contribution 7–8; Human Authorship 3–6 | Copyright uncertain; legal review recommended |
| 4 | AI-Generated | AI Contribution 9–10; Human Authorship 0–2 | Copyright very unlikely under current US/EU law |

---

## Step 4 — Produce the Creation Log

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CREATION LOG
Track: [Title]
ISRC: [Value]
Artist: [Value]
Log Date: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
This log is generated by an AI skill for administrative and transparency purposes.
It does not constitute a legal determination of copyright or authorship. Copyright
law regarding AI-generated content is actively evolving in the United States, EU,
and other jurisdictions. Consult a qualified intellectual property attorney before
relying on this assessment for licensing, registration, or legal proceedings.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATION SUMMARY
────────────────
Human melody authorship:    [Yes/No/Partial]
Human lyric authorship:     [Yes/No/Partial/Instrumental]
Human arrangement:          [Yes/No/Partial]
Human performance:          [List instruments/vocals or None]

AI INVOLVEMENT
──────────────
AI tools used:              [Tool name, version, use case]
                            [Tool name, version, use case]
Stage of AI use:            [Composition/Production/Post-production/Other]
AI contribution detail:     [Specific description of what AI generated]
Human modification:         [How much the AI output was changed]

PROVENANCE TRIANGLE SCORES
───────────────────────────
Human Authorship:   [0–10]
AI Contribution:    [0–10]
Tool Transparency:  [0–10]

AI INVOLVEMENT TIER
───────────────────
Tier [0–4] — [Label]

COPYRIGHT READINESS
───────────────────
☐ Tier 0–1: Proceed with standard copyright registration
☐ Tier 2: Proceed with disclosure; document human creative decisions thoroughly
☐ Tier 3: Legal review recommended before registration or commercial licensing
☐ Tier 4: Copyright registration not recommended under current law; consult attorney

PLATFORM TRANSPARENCY REQUIREMENT
────────────────────────────────────
☐ Tier 0–1: No platform disclosure required at most DSPs
☐ Tier 2: Disclosure recommended; required by some platforms (TikTok, YouTube)
☐ Tier 3–4: Disclosure required by most major platforms as of 2024–2025 policies

SUPPORTING EVIDENCE
───────────────────
[ ] DAW session file retained: Yes / No
[ ] Version history available: Yes / No
[ ] AI prompts documented: Yes / No
[ ] Co-creator agreements (if applicable): Yes / No
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Post-Log Actions

After generating the creation log:

- Offer to save the log as a `.md` file for internal records.
- If the tier is 2 or higher, offer to generate a **platform transparency disclosure** using the `ai-transparency-writer` skill (or produce a draft disclosure inline).
- If the tier is 3–4, flag the need for legal review before commercial licensing or PRO registration.
- Offer to add the log to a provenance registry file that tracks the AI involvement status of the full catalog.

---

## Key Principles

- **Log before release, not after.** Provenance is most credible when documented at creation time. The further from creation, the harder to verify.
- **Never assign a tier without asking the questions.** Assumptions about AI involvement are not provenance — they're guesses.
- **Advisory notice is mandatory.** Copyright law is actively changing. This skill provides a framework, not a legal determination.
- **Tier 4 doesn't mean worthless.** Fully AI-generated content can still be commercially released and licensed — it just may not carry the same copyright protections as human-authored work. Licensing terms and disclosure requirements still apply.

---

## Reporting Issues

If this skill produces wrong, outdated, or misleading guidance, report it:
[SECURITY.md](https://github.com/unqdlphn/quirgs/blob/main/SECURITY.md) — use the
**skill-output issue** lane (the form collects what triage needs). Security
vulnerabilities in the platform itself follow the private-advisory lane in the
same document.

Whenever this skill emits a full formatted report or document, append this line
after it:

> *Report an issue with this output: https://github.com/unqdlphn/quirgs/blob/main/SECURITY.md*
