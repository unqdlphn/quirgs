---
name: nist-ai-rmf-checkpoint
description: >
  Walk an agent or human-in-the-loop reviewer through the NIST AI Risk Management Framework
  (AI RMF 1.0) at any stage of an AI project lifecycle. Use this skill whenever someone
  mentions NIST, AI RMF, risk profiling, "Govern / Map / Measure / Manage", AI risk
  assessment, or asks to evaluate an AI system against a federal or enterprise risk standard.
  Also trigger when someone says "build a risk profile", "what risks does this AI system have",
  "run a risk assessment on this", "what controls are missing", "check our AI governance",
  or "are we following NIST". Outputs a structured, stage-scoped risk profile with addressed
  and unaddressed controls, and recommended next actions from the NIST AI RMF Playbook.
  This is a deeper, function-by-function assessment tool — not just a checklist. Use it
  over the hitl-compliance-gate when the user wants a thorough NIST-specific deep dive
  rather than a quick multi-framework sign-off gate.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install nist-ai-rmf-checkpoint@quirgs`

# NIST AI RMF Checkpoint

A guided, function-by-function walkthrough of the NIST AI Risk Management Framework
(AI RMF 1.0). Produces a structured AI Risk Profile with control status and recommended
actions scoped to the current lifecycle stage.

> **Current NIST AI Landscape (updated May 2026):**
>
> - The **AI Safety Institute** has been renamed the **Center for AI Standards and Innovation (CAISI)**.
> - The **AI Safety Institute Consortium** has been renamed the **NIST Artificial Intelligence Consortium**.
> - NIST has formally established six task groups under the consortium: Testing and Evaluation; Risks and Impacts; Evaluation Science and Measurement; Bias and Limitations of Generative Tools; **Documentation Cards**; and Chemical and Biological Security.
> - The policy direction has shifted toward "measurement science" and U.S. competitiveness alongside risk management — not instead of it. The AI RMF 1.0 functions (GOVERN, MAP, MEASURE, MANAGE) remain unchanged and authoritative.
> - The **Documentation Cards** task group directly aligns with the GOVERN function and model card outputs from this skill. Reference this group when justifying documentation card practices to U.S. federal stakeholders.

---

## Step 1 — Establish Context

Before running any function, collect the following. Infer from conversation where possible;
ask only for what's missing:

1. **System name / description** — what does the AI system do?
2. **Lifecycle stage** — design, development, testing, deployment, or monitoring?
3. **Deployment context** — who uses it, in what setting, with what stakes?
4. **Organization type** — federal agency, enterprise, startup, researcher?
5. **Prior RMF work** — has an Organizational Profile or risk register already been started?

Use answers to scope which functions to run and how deep to go.

---

## Step 2 — Select Scope

| User says…                      | Run these functions                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| "Full assessment" or "all four" | GOVERN → MAP → MEASURE → MANAGE (in order)                                          |
| "We're just starting out"       | GOVERN + MAP                                                                        |
| "We're about to deploy"         | MEASURE + MANAGE                                                                    |
| "Post-deployment review"        | MANAGE (monitoring subcategories)                                                   |
| Specific function named         | That function only                                                                  |
| Ambiguous                       | Ask: _"Should I run a full four-function assessment, or focus on a specific area?"_ |

---

## Step 3 — Run Each Function

For each selected function, load the corresponding reference file and generate a
**Function Assessment Block** using the format below.

Reference files:

- `references/govern.md`
- `references/map.md`
- `references/measure.md`
- `references/manage.md`

### Function Assessment Block Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️  NIST AI RMF — [FUNCTION NAME]
System: [system name]
Stage: [lifecycle stage]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBCATEGORY STATUS
──────────────────
For each subcategory relevant to the current stage:

  [ID]  [Subcategory name]
        Status: ✅ Addressed | ⚠️ Partial | ❌ Gap | — Not applicable
        Evidence / notes: [brief note or question for reviewer]

GAPS IDENTIFIED
───────────────
[Numbered list of unaddressed or partial subcategories]

RECOMMENDED ACTIONS
───────────────────
[Playbook-aligned next steps from the "Playbook Actions — [FUNCTION] Gaps" table at the
end of this function's own reference file, e.g. references/govern.md]

RISK SIGNAL
───────────
Overall posture for this function: 🟢 Low | 🟡 Moderate | 🔴 High | ⬜ Insufficient info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 4 — Produce the Risk Profile Summary

After all functions are assessed, output a consolidated **AI Risk Profile**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  AI RISK PROFILE SUMMARY
System: [name]
Date: [today's date]
Stage: [lifecycle stage]
Assessed against: NIST AI RMF 1.0
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

FUNCTION POSTURES
──────────────────
  GOVERN   [🟢 / 🟡 / 🔴 / ⬜]
  MAP      [🟢 / 🟡 / 🔴 / ⬜]
  MEASURE  [🟢 / 🟡 / 🔴 / ⬜]
  MANAGE   [🟢 / 🟡 / 🔴 / ⬜]

TOP GAPS (Priority Order)
──────────────────────────
1. [Most critical unaddressed control]
2. [Second]
3. [Third]
...

IMMEDIATE NEXT ACTIONS
───────────────────────
1. [Action]
2. [Action]
3. [Action]

OVERALL RISK POSTURE
─────────────────────
[One paragraph narrative summary — plain language, no jargon]

RECOMMENDED FOLLOW-UP
──────────────────────
☐ Schedule a full GOVERN review with leadership
☐ Initiate MAP stakeholder identification session
☐ Commission a bias/fairness evaluation (MEASURE)
☐ Finalize incident response plan (MANAGE)
[Check only what applies based on gaps found]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Offer Outputs

After presenting the risk profile, offer:

1. **Save as Markdown** — offer to write the full profile to a `.md` file for the team's records
2. **Gap Action Plan** — offer to produce a prioritized action list with suggested owners and timelines
3. **Cross-framework mapping** — offer to map identified gaps to EU AI Act or ISO 42001 equivalents
4. **Compliance Gate** — if a deployment decision is pending, offer to trigger `hitl-compliance-gate` with the NIST frame pre-selected

---

## Key Principles

- **Advisory only** — All outputs produced by this skill are for informational and governance support purposes only. They do not constitute legal advice, regulatory advice, or a formal compliance determination. No output from this skill should be relied upon as a substitute for advice from qualified legal counsel, a licensed compliance professional, or a certified auditor with jurisdiction-specific expertise.
- **Stage matters** — never ask deployment questions during the design phase
- **Be specific** — reference actual subcategory IDs (e.g., GOVERN 1.1, MAP 2.3) so teams can trace back to the framework
- **Surface the right questions** — when evidence is unclear, generate the question the reviewer needs to answer, not a generic placeholder
- **Avoid false confidence** — if evidence is insufficient to assess a subcategory, mark it ⬜ and explain what's needed
- **Plain language summary always** — the narrative in the profile should be readable by a non-technical executive
