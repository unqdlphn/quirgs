# AI Governance Policy Template

Internal AI governance policy for music publishing operations. Customize to your organization's size, AI use profile, and jurisdiction.

---

## [ORGANIZATION NAME] — AI Governance Policy for Music Publishing

**Version:** 1.0
**Effective Date:** [Date]
**Review Date:** [6 months from effective date]
**Owner:** [Name / Role]

---

### 1. Purpose

This policy governs how [Organization Name] uses artificial intelligence tools in its music creation, catalog management, distribution, and licensing operations. It establishes standards for disclosure, documentation, and compliance to protect the organization's rights, its artists' rights, and its relationships with distribution platforms and licensing partners.

---

### 2. Scope

This policy applies to:
- All employees and contractors who create, produce, or distribute music on behalf of [Organization Name]
- All AI tools used in the creative or operational process, including but not limited to: generative music AI, lyrics generators, AI mastering tools, AI catalog management tools, and AI-powered distribution or metadata tools
- All releases on the [Organization Name] catalog, regardless of release date

---

### 3. AI Tool Classification

We classify AI tools used in music operations into two categories:

**Category A — Creative AI** (tools that generate musical content)
These tools generate audio, melody, lyrics, or other musical material that may appear in a final release. Examples: Suno, Udio, Melodyne (AI features), ChatGPT/Claude for lyrics, AI stem generators.

All use of Category A tools must be:
1. Documented in the track's Creation Log (see Section 5)
2. Assessed for AI Involvement Tier (see Section 4)
3. Disclosed to distribution platforms where required

**Category B — Operational AI** (tools that process or analyze without generating content)
These tools assist with production, analysis, metadata, or operations but do not generate content that appears in the final release. Examples: AI mastering tools (Landr, iZotope AI), AI metadata enrichment, AI analytics, AI noise reduction.

Category B tools do not require creation log entries but should be documented in the organization's tool register.

---

### 4. AI Involvement Tiers

All releases with Category A AI tool involvement must be assessed using the Provenance Triangle and assigned an AI Involvement Tier (0–4) before distribution:

| Tier | Label | Distribution action |
|---|---|---|
| 0 | No AI | Standard distribution |
| 1 | AI-Assisted | Standard distribution; note in tool register |
| 2 | AI-Collaborative | Disclose to platforms; document human authorship |
| 3 | AI-Directed | Legal review required; disclose to platforms |
| 4 | AI-Generated | Legal review required; full disclosure; copyright limitation noted |

No release at Tier 3 or 4 may be distributed without written sign-off from [designated approver role].

---

### 5. Creation Log Requirements

A Creation Log must be completed for every release that uses Category A AI tools. Creation Logs must be:
- Completed before or on the release date (not retrospectively unless required)
- Retained for a minimum of 10 years from release date
- Stored at [designated storage location: e.g., shared drive path, documentation system]
- Made available to legal counsel on request

The Creation Log template is maintained in the `publish-provenance` skill reference files.

---

### 6. Platform Disclosure Requirements

[Organization Name] requires compliance with all platform AI content disclosure policies. Specifically:

- Distribution uploads for Tier 2+ releases must have the AI content flag checked in the distributor upload portal
- YouTube releases at Tier 2+ must carry the "Made with AI" label where required by YouTube's creator policy
- TikTok releases at Tier 2+ must carry the required AI-generated content label via SoundOn or equivalent
- Any release using AI-generated vocals must disclose this via all available disclosure mechanisms

Non-compliance with platform disclosure requirements may result in content removal, account suspension, or loss of monetization rights.

---

### 7. Prohibited Uses of AI

The following uses of AI are prohibited at [Organization Name] regardless of tier:

1. AI-generated content that mimics the voice, sound, or style of a specific named real-world artist without written authorization from that artist
2. AI tools that require input of another artist's copyrighted recordings to generate output (i.e., voice cloning from copyrighted material)
3. Using AI-generated content to claim Content ID rights over material the organization does not genuinely own
4. Mass-generating AI tracks for the purpose of streaming manipulation or royalty fraud
5. Using AI to generate metadata, reviews, or playlist descriptions in ways that misrepresent the nature of the content

---

### 8. Songwriter and Co-Creator Agreements

When AI tools are used in a co-write or collaborative setting:
- All co-creators must be informed of any Category A AI tool use before the creation begins
- Co-writer agreements must explicitly address AI involvement and how it affects ownership splits if applicable
- Any dispute over AI involvement in a co-written work must be escalated to [designated role] before the release proceeds

---

### 9. Policy Maintenance

This policy will be reviewed every 6 months, or within 30 days of a major change in:
- Platform AI content policies (Spotify, YouTube, Apple Music, TikTok)
- US, EU, or applicable jurisdiction AI regulation
- Copyright Office guidance on AI-generated content

The review owner is responsible for updating this policy and communicating changes to all affected staff.

---

### 10. Acknowledgment

All employees and contractors working with AI tools under this policy must sign an acknowledgment confirming they have read and understood this policy. Acknowledgments are stored at [location].

---

*This policy was prepared with the assistance of the Quirgs `publish-shield` skill. It does not constitute legal advice. Review with qualified legal counsel before formal adoption.*
