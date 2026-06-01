---
name: ai-transparency-writer
description: >
  Generates ready-to-publish transparency notices, model cards, and AI system disclosures.
  Use whenever someone says "write a transparency notice", "draft a model card", "create
  a system disclosure", "Article 13 notice", "what do I need to disclose about my AI",
  "transparency documentation", "AI system card", "document my AI for compliance", or
  "how do I tell users about my AI". Also trigger when preparing EU AI Act compliance
  disclosures or NIST AI RMF Govern function documentation. Two modes: (1) EU AI Act
  Article 13 notice for high-risk AI deployers, (2) NIST AI RMF-aligned model card.
  Produces actual draft document text the user can edit and publish — not checklists.
  Suggest eu-ai-act-classifier first if risk tier is unconfirmed. Offer hitl-compliance-gate
  after drafting before the notice is published.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install ai-transparency-writer@quirgs`

# AI Transparency Writer

Drafts compliant, publication-ready transparency notices, model cards, and system
disclosures. The output is actual document text — not a checklist — scoped to the
framework and role that applies to the user's situation.

---

## Step 1 — Gather Context

Collect the following before drafting. Infer what you can from the conversation; ask
only for what's genuinely missing:

1. **What does the AI system do?** (plain-language description of function and outputs)
2. **Who interacts with or is affected by it?** (end users, operators, impacted individuals)
3. **What is the user's role?** — provider (develops/places on market) or deployer (uses in own context)?
4. **Which framework to target?**
   - EU AI Act Article 13 (transparency for high-risk AI)
   - NIST AI RMF model card / system disclosure
   - Both
5. **Has the system been classified under the EU AI Act?** If not and the user is targeting
   Article 13, recommend running `eu-ai-act-classifier` first — Article 13 only applies
   to high-risk systems, and the obligations differ by role.

If the framework is ambiguous, ask: _"Should I draft an EU AI Act Article 13 notice,
a NIST-aligned model card, or both?"_

---

## Step 2 — Select Mode and Load References

| Target framework       | Load                                    |
| ---------------------- | --------------------------------------- |
| EU AI Act Article 13   | `references/article-13-requirements.md` |
| NIST AI RMF model card | `references/model-card-template.md`     |
| Both                   | Both files                              |
| Ambiguous              | Ask (see Step 1)                        |

Also load `references/disclosure-examples.md` for language patterns and worked examples
regardless of mode — it helps produce natural, accurate prose rather than boilerplate.

---

## Step 3 — Draft the Document

Generate a complete, publication-ready draft using the structure and requirements from
the loaded reference files. The output should be real text the user can drop into a
document, website, or system interface — not a template with blanks.

### EU AI Act Article 13 — Transparency Notice

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 AI SYSTEM TRANSPARENCY NOTICE
Prepared under: EU AI Act Article 13
System: [system name]
Deployer / Provider: [org name]
Date: [today]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
───────────────────
This document is drafted by an AI skill and is provided for informational and
governance support purposes only. It does not constitute legal advice or a formal
compliance determination. Do not publish or rely on this notice as a substitute for
review by qualified legal counsel or a licensed compliance professional with
jurisdiction-specific expertise.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Draft notice text — see references/article-13-requirements.md for required fields
and references/disclosure-examples.md for example language. Write full prose
paragraphs for each mandatory section. Do not leave placeholder brackets in the
final output — use [ field — to be confirmed ] only where the user genuinely
hasn't provided the information.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### NIST AI RMF — Model Card / System Disclosure

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️  AI SYSTEM MODEL CARD
Framework: NIST AI RMF 1.0 (GOVERN function)
System: [system name]
Organization: [org name]
Version: [version / date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
───────────────────
This document is drafted by an AI skill and is provided for informational and
governance support purposes only. It does not constitute legal advice or a formal
compliance determination. Do not publish or rely on this notice as a substitute for
review by qualified legal counsel or a licensed compliance professional with
jurisdiction-specific expertise.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Draft model card text — see references/model-card-template.md for section
structure and references/disclosure-examples.md for example language. Write
full prose for each section; do not leave sections blank.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Drafting principles:**

- Write in plain language accessible to affected individuals — not legal jargon
- Be specific: generic boilerplate fails compliance reviews and erodes user trust
- Where information is unknown, flag explicitly (e.g., "[ human oversight contact — to be confirmed ]") rather than omitting or writing vague filler
- For deployers under EU AI Act: focus on use-context disclosures, not technical model details (that's the provider's job)
- For providers drafting model cards: focus on intended uses, limitations, and risk mitigations

---

## Step 4 — Compliance Self-Check

After drafting, run a quick internal check:

**For Article 13 notices:**

- Verify all mandatory fields from `references/article-13-requirements.md` are present
- Flag any field where user input was insufficient and a placeholder was used
- Note whether the system's risk tier has been confirmed

**For NIST model cards:**

- Verify all sections from `references/model-card-template.md` are addressed
- Flag any section left thin due to missing information

Present the draft followed by a brief compliance note:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLIANCE NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mandatory fields covered: [list]
Fields needing confirmation: [list any placeholders or gaps]
Risk tier confirmed: [Yes / No — recommend eu-ai-act-classifier if No]
Recommended next step: [e.g., legal review, hitl-compliance-gate sign-off]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Offer Outputs and Next Steps

After presenting the draft and compliance note, offer:

1. **Save as Markdown** — write the notice to a `.md` file for version control or sharing
2. **Export as Word document** — hand off to the `docx` skill to produce a formatted `.docx`
3. **Compliance gate** — trigger `hitl-compliance-gate` with EU AI Act pre-selected before
   publishing or distributing to affected users
4. **Refine a section** — iterate on specific sections inline if the user wants improvements
5. **Draft both frameworks** — if only one was produced, offer to generate the other

---

## Key Principles

- **Advisory only** — All outputs produced by this skill are for informational and governance support purposes only. They do not constitute legal advice, regulatory advice, or a formal compliance determination. No output from this skill should be relied upon as a substitute for advice from qualified legal counsel, a licensed compliance professional, or a certified auditor with jurisdiction-specific expertise.
- **Documents, not checklists** — the output must be readable and publishable prose, not a
  list of boxes to fill in later
- **Plain language is a compliance requirement** — Article 13 notices must be understandable
  by affected individuals; dense legalese is itself a compliance failure
- **Specificity over safety blankets** — "the AI may make errors" tells users nothing;
  "the AI's credit scoring output may underweight recent income changes and should be
  reviewed by an officer before a final lending decision" is actionable
- **Role determines scope** — deployers disclose use-context, purpose, and human oversight
  contacts; providers disclose model characteristics, training data categories, and limitations
