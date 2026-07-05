---
name: pii-exposure-checker
description: >
  Audits AI system data inputs, outputs, training datasets, and pipelines for PII
  exposure risks under GDPR and EU AI Act Article 10 data governance requirements.
  Use whenever someone says "check for PII", "audit my data for personal information",
  "is there personal data in this", "data minimization check", "GDPR data audit",
  "scan my training data for PII", "flag personal data", "PII exposure risk",
  "does my dataset contain sensitive data", "check my AI inputs for privacy risks",
  or "am I processing personal data I shouldn't be". Also trigger when someone
  is preparing EU AI Act Article 10 compliance for a high-risk AI system, or when
  a data governance review is needed before model training or deployment. Produces
  a structured PII exposure report with risk ratings and specific remediation actions
  for each finding — not just a list of what was found.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install pii-exposure-checker@quirgs`

# PII Exposure Checker

Audits AI system data — inputs, outputs, training sets, or pipeline descriptions —
for personal data exposure risks. Produces a structured report with risk ratings
and remediation actions scoped to GDPR and EU AI Act Article 10 requirements.

---

## Standing Disclaimer

Every response this skill produces — including clarifying questions, partial or
prose-only answers, and any output that is not the full formatted Exposure Report —
must end with this line:

> ⚠️ *Advisory only — this output is not legal, regulatory, or compliance advice; consult qualified counsel before acting.*

The full boxed ADVISORY NOTICE in Step 4 replaces this short line only when
the complete Exposure Report is emitted.

---

## Step 1 — Establish Scope

Before auditing, understand what is being checked and why. Ask only for what's missing:

1. **What is being audited?**
   - Training / fine-tuning dataset (schema, sample, or description)
   - Inference inputs (what data the system takes in at runtime)
   - Inference outputs (what the system returns)
   - Full pipeline (end-to-end data flow description)
   - A document, file, or data sample provided directly

2. **What is the AI system's purpose and deployment context?**
   (Needed to assess whether PII is necessary or excessive for the use case)

3. **What is the legal basis for processing personal data, if known?**
   (Consent, legitimate interest, legal obligation, etc.)

4. **Is this system subject to EU AI Act Article 10?**
   Article 10 applies to HIGH-RISK AI systems. If risk tier is unconfirmed,
   recommend running `eu-ai-act-classifier` first.

5. **Has a Data Protection Impact Assessment (DPIA) been conducted?**
   (If yes, findings should be consistent with DPIA conclusions)

If the user provides a data sample or schema directly, proceed to Step 2 immediately
using what's available.

---

## Step 2 — Load References

Always load both reference files before auditing:

- `references/pii-categories.md` — GDPR personal data categories, special categories,
  sensitivity tiers, and EU AI Act-specific data types to flag
- `references/eu-ai-act-data-requirements.md` — Article 10 data governance obligations,
  data minimization requirements, and relevance/accuracy standards
- `references/remediation-actions.md` — remediation techniques mapped to PII category
  and risk level (masking, pseudonymization, deletion, access controls, etc.)

---

## Step 3 — Run the PII Audit

Work through the data systematically. For each data element or field identified:

1. **Classify it** — is it personal data? If yes, which category? (see `references/pii-categories.md`)
2. **Assess necessity** — is this data element necessary for the AI system's stated purpose,
   or does it exceed what's needed? (data minimization test)
3. **Assess risk** — what is the exposure risk if this data is retained, leaked, or used
   to train a model? (see sensitivity tiers in `references/pii-categories.md`)
4. **Check Article 10 compliance** — for high-risk AI: does processing this data meet
   the relevance, accuracy, and minimization requirements? (see `references/eu-ai-act-data-requirements.md`)

For each finding, produce a **Finding Block**:

```
┌─────────────────────────────────────────┐
│ FINDING: [field name / data element]    │
├─────────────────────────────────────────┤
│ PII Category:    [category]             │
│ Special Category: [Yes / No]            │
│ Risk Level:      🔴 High / 🟡 Medium / 🟢 Low │
│ Necessity:       [Necessary / Excessive / Unclear] │
│ Article 10 flag: [Yes / No / N/A]       │
│ Issue:           [plain-language description of the exposure risk] │
│ Remediation:     [specific action — see references/remediation-actions.md] │
└─────────────────────────────────────────┘
```

---

## Step 4 — Produce the Exposure Report

After auditing all data elements, output a consolidated report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 PII EXPOSURE REPORT
System / Dataset: [name or description]
Audit scope: [training data / inputs / outputs / pipeline]
Frameworks: GDPR, EU AI Act Article 10
Date: [today]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
───────────────────
This output is generated by an AI skill and is provided for informational and
governance support purposes only. It does not constitute legal advice, regulatory
advice, or a formal compliance determination. Do not rely on this output as a
substitute for advice from qualified legal counsel, a licensed compliance
professional, or a certified auditor. Review all outputs with appropriate human
expertise before taking compliance action.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
───────
Total data elements reviewed: [N]
PII elements identified:       [N]
  🔴 High risk:                [N]
  🟡 Medium risk:              [N]
  🟢 Low risk:                 [N]
Special categories present:    [Yes / No]
Data minimization violations:  [N]
Article 10 flags (high-risk):  [N]

FINDINGS
─────────
[Finding blocks from Step 3, ordered by risk level — high first]

REMEDIATION PRIORITY LIST
──────────────────────────
Priority 1 — Resolve before training / deployment:
  • [Action] — [Field] — [Technique]

Priority 2 — Resolve within 30 days:
  • [Action] — [Field] — [Technique]

Priority 3 — Address in next review cycle:
  • [Action] — [Field] — [Technique]

COMPLIANCE STATUS
──────────────────
GDPR data minimization:  [✅ Met / ⚠️ Partial / ❌ Not met]
GDPR special categories: [✅ Met / ⚠️ Requires review / ❌ Not met]
EU AI Act Article 10:    [✅ Met / ⚠️ Partial / ❌ Not met / — N/A]
DPIA required:           [Yes — trigger now / Likely — recommend / No]

RECOMMENDED NEXT STEPS
────────────────────────
1. [Most urgent action]
2. [Second]
3. [Third]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Offer Outputs and Next Steps

After presenting the report, offer:

1. **Save report as Markdown** — write the full audit to a `.md` file for records or DPIA appendix
2. **Export as Word document** — hand off to the `docx` skill for a formatted `.docx`
3. **Remediation plan** — expand Priority 1 items into a detailed action plan with owner/due-date fields
4. **DPIA trigger** — if a DPIA is flagged as required, offer to draft the DPIA scoping section
5. **Compliance gate** — trigger `hitl-compliance-gate` with EU AI Act pre-selected if Article 10 flags were raised
6. **Re-audit after remediation** — once fixes are applied, offer to re-run the audit on the cleaned dataset

---

## Key Principles

- **Advisory only** — All outputs produced by this skill are for informational and governance support purposes only. They do not constitute legal advice, regulatory advice, or a formal compliance determination. No output from this skill should be relied upon as a substitute for advice from qualified legal counsel, a licensed compliance professional, or a certified auditor with jurisdiction-specific expertise.
- **Necessity is the test, not just presence** — finding personal data is not automatically a problem;
  the question is whether it's necessary for the system's purpose and properly controlled
- **Special categories demand extra scrutiny** — health, biometric, racial/ethnic origin, political
  opinion, religion, and other Article 9 GDPR categories require explicit legal basis and should
  be flagged even if present for apparently legitimate reasons
- **Context determines risk** — a name in a training dataset is different from a name in a model
  output returned to a third party; assess the exposure risk in context
- **Remediation must be specific** — "remove the data" is not a remediation action;
  "pseudonymize the national ID field using SHA-256 hashing with a rotating salt before training"
  is actionable. Use `references/remediation-actions.md` for specifics
- **This audit supports, not replaces, a DPIA** — for high-risk processing, a formal Data
  Protection Impact Assessment conducted with the DPO is required under GDPR Article 35
