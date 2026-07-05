---
name: eu-ai-act-classifier
description: >
  Classify an AI system's risk tier under the EU AI Act and surface the specific legal
  obligations that apply. Use this skill whenever someone asks about EU AI Act compliance,
  risk classification, "is this high-risk AI", "what category does my AI fall into", "do
  I need a conformity assessment", "what are my EU AI Act obligations", "does the AI Act
  apply to me", or "how do I comply with the EU AI Act". Also trigger when someone
  describes an AI system and needs to understand their regulatory exposure in the EU — even
  if they don't use the phrase "EU AI Act". Outputs a definitive risk tier, the legal basis
  for that classification, and a tailored obligations checklist scoped to that tier and
  deployment role (provider, deployer, importer, distributor). Do not use hitl-compliance-gate
  for this — use this skill when the EU AI Act classification and obligations are the
  primary need.
---

# EU AI Act Classifier

Determines an AI system's risk tier under EU Regulation 2024/1689 (the EU AI Act),
explains the legal basis for that classification, and outputs a tailored compliance
obligations checklist based on the system type and the user's role in the AI value chain.

---

## Standing Disclaimer

Every response this skill produces — including clarifying questions, partial or
prose-only answers, and any output that is not the full formatted classification output —
must end with this line:

> ⚠️ *Advisory only — this output is not legal, regulatory, or compliance advice; consult qualified counsel before acting.*

The full boxed ADVISORY NOTICE in Step 3 replaces this short line only when
the complete classification output is emitted.

---

## Step 1 — Gather System Information

Collect the following before classifying. Infer from conversation where possible:

1. **What does the system do?** (plain-language description of function and outputs)
2. **Who uses it?** (end users, operators, affected individuals)
3. **What decisions does it inform or make?** (and what are the stakes?)
4. **Where is it deployed?** (EU market, EU users, or outside EU?)
5. **What is the user's role?** — provider (develops/places on market), deployer (uses in own context), importer, or distributor?
6. **Is it a general-purpose AI model?** (e.g., a foundation model or LLM)

**EU scope (item 4) gates the tier determination in Step 2 — never silently assume it.**
The Act does not apply at all outside its territorial scope (2a), so if scope is missing or
ambiguous from the conversation, **ask before classifying — do not guess:**

- Scope: *"Is the system placed on the EU market, or are any of its users or outputs in the EU?"*

**Role (item 5) does not gate the tier determination.** None of the Step 2 classification
logic depends on role — this includes Article 5 prohibited-practice matches (2b), which bind
every actor in the value chain regardless of provider/deployer/importer/distributor status.
Role only determines *which obligations apply* once a tier is set (Step 4). Ask for role
after classifying, not before, and never let a missing role delay or hedge a PROHIBITED (or
any other otherwise-clear) tier call.

Only if EU scope genuinely cannot be established: classify against the **higher-obligation**
assumption (in-scope), and state at the very top of the output that scope was *assumed* and
that the result changes if that is wrong. Never present an assumed scope as if it were
established. A wrong tier is worse than a delayed answer. If role remains unknown once a
tier is set, generate the obligations checklist generically (or covering both provider and
deployer where they materially differ) and note that role confirmation will narrow it.

---

## Step 2 — Classify the Risk Tier

Work through the classification logic in order. The first match wins.

### 2a. Check EU Territorial Scope (Article 2)
This check comes before all others — the Act does not apply at all outside its territorial
scope, regardless of what the system does. If the system is **not** placed on the EU market,
and **none** of its users, deployers, or outputs are in the EU → classify as **OUT OF SCOPE**
and stop. Do not proceed to further classification.

Do not confuse this with MINIMAL RISK (2f) — MINIMAL RISK means the Act applies but imposes
no mandatory obligations; OUT OF SCOPE means the Act does not apply at all.

### 2b. Check for Prohibited Practices (Article 5)
Load `references/prohibited.md`. If the system matches any prohibited practice → output
**PROHIBITED** and stop. Do not proceed to further classification. Role is irrelevant to
this check — Article 5 bans the practice outright for any actor in the value chain; do not
withhold or hedge a PROHIBITED call pending role confirmation.

### 2c. Check for High-Risk Classification (Annex III + Article 6)
Load `references/high-risk.md`. Check both pathways:
- **Article 6(1)** — safety component of a product regulated under EU harmonisation legislation (Annex I)
- **Article 6(2) / Annex III** — standalone high-risk AI in one of eight listed domains

If either pathway matches → classify as **HIGH-RISK**.

### 2d. Check for General-Purpose AI (GPAI) (Articles 51–56)
Load `references/gpai.md`. If the system is a general-purpose AI model (trained on broad
data, usable across many tasks) → classify as **GPAI** and determine if it is a
**GPAI model with systemic risk** (≥10^25 FLOPs training compute or designated by Commission).

GPAI classification can overlap with other tiers — a GPAI model embedded in a high-risk
system carries both sets of obligations.

### 2e. Check for Limited Risk (Articles 50)
If the system involves: chatbots, deepfakes, emotion recognition, or biometric categorisation
→ classify as **LIMITED RISK** (transparency obligations apply).

### 2f. Default: Minimal Risk
If none of the above apply → classify as **MINIMAL RISK** (no mandatory obligations,
voluntary codes of conduct encouraged).

---

## Step 3 — Output the Classification

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🇪🇺 EU AI ACT CLASSIFICATION
System: [name / description]
Role: [Provider / Deployer / Importer / Distributor]
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

RISK TIER: [OUT OF SCOPE / PROHIBITED / HIGH-RISK / GPAI / LIMITED RISK / MINIMAL RISK]

LEGAL BASIS
────────────
[Specific article(s) and annex entries that determine this classification,
with a plain-language explanation of why they apply]

CLASSIFICATION CONFIDENCE
──────────────────────────
🟢 High — clear match to specific provision
🟡 Medium — likely match; legal review recommended
🔴 Low — ambiguous; qualified legal advice required

NOTES / EDGE CASES
───────────────────
[Any nuance, overlapping classifications, or borderline factors]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 4 — Output the Obligations Checklist

If the tier is **OUT OF SCOPE**, skip this step — there is no obligations checklist to
generate. State plainly that the EU AI Act does not apply given the stated deployment
scope, and note that other jurisdictions' AI regulations may still apply if the system
is used outside the EU.

If the tier is **PROHIBITED**, also skip the obligations checklist — there is no set of
compliance steps that makes a banned practice lawful. State plainly that the system cannot
be placed on the EU market or put into service in its current form (regardless of role),
and recommend qualified legal counsel to assess redesign options.

Otherwise, load `references/obligations-[tier].md` for the relevant tier and role
(GPAI and MINIMAL RISK obligations are both covered in `obligations-limited-risk.md` —
see the reference list below), then generate:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 COMPLIANCE OBLIGATIONS
Tier: [tier] | Role: [role]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY REQUIREMENTS
───────────────────────
For each obligation, mark: ✅ Done | ⚠️ In progress | ❌ Not started

[ ] [Obligation] — Article ref — Deadline: [date or "before market placement"]
[ ] [Obligation] — Article ref
...

KEY DEADLINES
──────────────
[Relevant phase-in dates from the EU AI Act timeline]

RECOMMENDED NEXT STEPS
────────────────────────
1. [Most urgent action]
2. [Second]
3. [Third]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Reference files for obligations:
- `references/obligations-high-risk.md` — HIGH-RISK tier
- `references/obligations-limited-risk.md` — LIMITED RISK, GPAI (incl. systemic risk), and MINIMAL RISK tiers

---

## Step 5 — Offer Follow-On Actions

After classification and obligations output, offer:

1. **Save as Markdown** — classification memo as a `.md` file for legal/compliance records
2. **Gap analysis** — assess which obligations are already met vs. outstanding
3. **Cross-framework map** — map obligations to ISO 42001 or NIST AI RMF equivalents
4. **Compliance gate** — trigger `hitl-compliance-gate` with EU AI Act pre-selected for a HITL sign-off

---

## Key Principles

- **Advisory only** — All outputs produced by this skill are for informational and governance support purposes only. They do not constitute legal advice, regulatory advice, or a formal compliance determination. No output from this skill should be relied upon as a substitute for advice from qualified legal counsel, a licensed compliance professional, or a certified auditor with jurisdiction-specific expertise.
- **Classify conservatively** — when in doubt between two tiers, flag the higher one
- **Role matters** — provider obligations are the heaviest; deployer obligations depend on use case
- **GPAI is additive** — GPAI obligations stack on top of any other applicable tier
- **Jurisdictional scope** — the Act applies if the AI output is used in the EU, regardless of where the provider is based; if it genuinely is not, classify OUT OF SCOPE rather than forcing a tier
- **Always flag legal review** for Medium/Low confidence classifications — this tool supports compliance work but is not a substitute for qualified legal advice
