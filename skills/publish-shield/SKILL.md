---
name: publish-shield
description: >
  Run a pre-release platform compliance check and generate an AI governance policy
  for a music publishing operation. Use this skill whenever someone says "platform
  compliance check", "is my release compliant", "check platform policies for AI music",
  "AI governance policy for my catalog", "write an AI policy for my label", "pre-release
  gate", "am I allowed to release this on Spotify", "does YouTube allow AI music",
  "check my release against platform rules", "can I distribute AI-generated music",
  "write a label AI policy", or any request to verify that a release meets current
  platform content policies and AI governance requirements before distribution.
  Also trigger when a publisher wants a documented internal AI policy to govern their
  creative operations. Outputs a platform-by-platform compliance checklist and an
  AI governance policy draft ready for internal review.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-shield@quirgs-publish`

# Publish Shield — Platform Compliance + AI Governance

Pre-release compliance gate for platform content policies and AI governance documentation for music publishing operations.

---

## Module A — Pre-Release Platform Compliance Check

### Step A1 — Identify the Release and its AI Involvement Tier

Ask for or confirm:
1. **Release title and format** (single, EP, album)
2. **AI Involvement Tier** (from `publish-provenance` output, or assess now)
3. **Distribution targets** — which platforms is this releasing on?
4. **Release type** — general distribution, targeted content category (children's, classical, podcast music)?

Load `references/platform-ai-policies.md` for the current policy summary per platform.

**If the AI Involvement Tier is not provided:** do not assume Tier 0. Ask which AI tools were used, then infer the tier using these rules:

| If the tool… | Assign |
|---|---|
| Only processes existing human audio (mastering, noise reduction, pitch correction, stem separation) — e.g., iZotope Ozone, LANDR, Auto-Tune, Moises, LALAL.AI | Tier 1 |
| Generates musical content (melody, chords, lyrics, audio stems) that appears in the final work with significant human modification — e.g., Suno, Udio, AIVA, Soundraw, ChatGPT lyrics | Tier 2 |
| Generates content used near-as-is with minimal human modification | Tier 3 |
| Clones or synthesizes the voice of a real, identifiable person without a signed consent/license agreement — e.g., So-Vits-SVC, RVC, unauthorized ElevenLabs clone | **Tier 4 — override all other factors** |
| Tool not listed + generates new creative content | Tier 2 minimum |
| Tool not listed + processes existing human audio only | Tier 1 |

Assign the highest tier across all tools used. Note the inferred tier in the compliance report as "Tier [N] — inferred from tool disclosure; confirm with publish-provenance output."

### Step A2 — Run the Platform Compliance Checklist

Load `references/pre-release-compliance-checklist.md` for the full checklist.

For each target platform, check:

| Check | Applies to |
|---|---|
| AI content disclosure flag set in distributor | Tier 2+ |
| AI-generated content label applied where required | Platform-specific |
| Explicit flag accurate | All tiers |
| ISRC and UPC valid | All tiers |
| Release date confirmed | All tiers |
| Copyright claims cleared (samples, interpolations) | All tiers |
| Performer rights cleared (if covers) | All tiers |
| No prohibited content (per platform rules) | All tiers |
| No trademark infringement in track/release title | All tiers |
| Cover art original or properly licensed | All tiers |

### Step A3 — Output the Compliance Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PRE-RELEASE COMPLIANCE REPORT
Release: [Title]
AI Involvement Tier: [0–4]
Generated: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
Platform policies on AI-generated content are evolving rapidly. This report
reflects published policies as known at the time of generation. Verify against
each platform's current creator documentation before distribution. This output
does not constitute legal advice.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLATFORM STATUS
───────────────

Spotify
  AI Disclosure required:  [Yes / No / N/A for this tier]
  Labeling requirement:    [Requirement or None]
  Prohibited content check: [Pass / Review needed]
  Status:                  ✅ Clear / ⚠️ Action required / ❌ Blocked

Apple Music
  AI Disclosure required:  [Yes / No / N/A]
  Labeling requirement:    [Requirement or None]
  Status:                  ✅ Clear / ⚠️ Action required / ❌ Blocked

YouTube / Content ID
  AI Disclosure required:  [Yes / No / N/A]
  Labeling requirement:    [Yes — "Made with AI" label]
  Content ID eligibility:  [Note if AI content may affect eligibility]
  Status:                  ✅ Clear / ⚠️ Action required / ❌ Blocked

TikTok
  AI Disclosure required:  [Yes / No / N/A]
  Labeling requirement:    [Yes — AI-generated music label]
  Status:                  ✅ Clear / ⚠️ Action required / ❌ Blocked

DistroKid / Distributor
  AI checkbox:             [Confirm checked if Tier 2+]
  Status:                  ✅ Clear / ⚠️ Action required

GENERAL CHECKS
──────────────
[ ] ISRC valid format
[ ] UPC valid
[ ] Explicit flag accurate
[ ] Cover art original or licensed
[ ] Title does not infringe trademark
[ ] No uncleared samples or interpolations
[ ] Performer rights cleared (if cover)

OVERALL STATUS
──────────────
☐ Ready to distribute — all platforms clear
☐ Conditional — resolve action items before distribution
☐ Blocked — one or more platforms require resolution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Module B — AI Governance Policy Generator

Run this module when the user wants an internal AI policy for their label, publisher, or catalog operation.

### Step B1 — Gather Policy Scope

Ask:
1. **Organization type** — independent artist, small label, mid-size publisher, larger publishing company?
2. **AI use cases in current operation** — which AI tools are used and for what?
3. **Catalog AI involvement level** — what percentage of the catalog involves AI at Tier 2+?
4. **Key concerns** — copyright risk, platform compliance, reputational risk, songwriter relations?

Load `references/governance-policy-template.md` for the standard policy structure.

### Step B2 — Generate the Policy

Produce a customized AI governance policy using the template, adapted to the organization's size and use case profile.

### Step B3 — Output the Policy

Deliver the policy as a formatted document. Offer to save as `.md` or `.docx`.

Include a recommended review schedule (every 6 months, or on any major platform policy change).

---

## Key Principles

- **Run Module A before every release with AI involvement.** It takes less time to check than to deal with a post-release platform removal.
- **Platform policies are volatile.** This skill's reference data is a snapshot — always verify at the platform's creator documentation before distributing.
- **Module B is a draft, not a legal document.** The generated governance policy is a starting point for internal use. It should be reviewed by the organization's legal counsel before being formally adopted.
- **Advisory notice applies to both modules.** AI content policies are active regulatory territory — neither module constitutes legal advice.
