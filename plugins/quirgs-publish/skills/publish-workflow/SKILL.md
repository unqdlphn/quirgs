---
name: publish-workflow
description: >
  Orchestrate the full PUBLISH Loop — the weekly music publishing operating cadence
  — routing tasks to the appropriate domain skill based on what's due and what data
  is available. Use this skill whenever someone says "run the publish workflow",
  "run the weekly publishing OS", "start my publishing cadence", "what should I be
  working on this week", "run the PUBLISH Loop", "orchestrate my publishing tasks",
  "publishing workflow", "what's due in my publishing operation this week", or any
  request to run or initiate the full end-to-end music publishing workflow. Also trigger
  when a publisher wants to start their weekly publishing session and isn't sure which
  skill to run first. This is the entry point for the full PUBLISH Bundle — it routes
  to the right skill, in the right order, based on what's actually due. HITL checkpoint
  after every stage.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-workflow@quirgs-publish`

# Publish Workflow — Weekly Publishing OS Orchestrator

The master entry point for the PUBLISH Bundle. Manages the weekly publishing cadence by assessing what's due, routing to the correct domain skill, and enforcing HITL checkpoints at every stage.

---

## The PUBLISH Loop

The PUBLISH Loop is a seven-pillar operating cadence for music publishers. Each pillar maps to a domain skill:

| Pillar | Skill | Cadence |
|---|---|---|
| **P** — Performance Income | `publish-income` | Monthly (after statements arrive) |
| **U** — Update Catalog | `publish-update` | Weekly (new releases) / Quarterly (full audit) |
| **B** — Broadcast Registration | `publish-broadcast` | Per-release (before distribution) |
| **L** — License Sync | `publish-license` | Weekly (active briefs) |
| **I** — AI Involvement | `publish-provenance` | Per-release (when AI tools used) |
| **S** — Shield (Compliance) | `publish-shield` | Per-release (pre-distribution gate) |
| **H** — Harvest Review | `publish-harvest` | Quarterly (end of each quarter) |

---

## Step 1 — Session Triage

At the start of each session, ask the user:

1. "Are any new statements available this week?" (→ triggers **P**)
2. "Are there any new releases in the pipeline?" (→ triggers **U**, **B**, **I**, **S**)
3. "Are there any active sync briefs to work on?" (→ triggers **L**)
4. "Is it end of quarter?" (→ triggers **H**)
5. "Any specific pillar to focus on today?"

If the user says "run the full workflow," proceed through all due pillars in order.

If the user specifies a single pillar (e.g., "just run sync licensing today"), route directly to that skill and skip the orchestration.

---

## Step 2 — Route to Domain Skills

### Route P — Performance Income (`publish-income`)
**Trigger:** New statements available (DSP, distributor, or PRO)

```
[PUBLISH LOOP — STEP P]
Running publish-income: Statement-to-Ledger reconciliation

Inputs needed:
  - Statement file(s) for the period
  - Existing master ledger (if available)

→ Invoke publish-income skill
→ HITL checkpoint: Review reconciliation report before proceeding
→ Update master ledger with confirmed figures
```

### Route U — Update Catalog (`publish-update`)
**Trigger:** New releases in pipeline OR scheduled quarterly audit

```
[PUBLISH LOOP — STEP U]
Running publish-update: Catalog metadata audit

Inputs needed:
  - Catalog export or list of tracks to audit
  - Scope: new releases only OR full catalog

→ Invoke publish-update skill
→ HITL checkpoint: Review hygiene report and confirm enrichments
→ Update catalog with approved corrections
```

### Route B — Broadcast Registration (`publish-broadcast`)
**Trigger:** New release pre-distribution

```
[PUBLISH LOOP — STEP B]
Running publish-broadcast: DDEX + PRO registration packet

Inputs needed:
  - Track/release data (after Step U confirms metadata is clean)
  - PRO affiliation(s) and IPI numbers

→ Invoke publish-broadcast skill
→ HITL checkpoint: Review registration packets before submission
→ Submit to distributor (DDEX) and PRO portals
```

*Note: Step B should always run after Step U for new releases — clean metadata first, then generate registration packets.*

### Route L — License Sync (`publish-license`)
**Trigger:** Active sync brief received OR weekly sync pipeline review

```
[PUBLISH LOOP — STEP L]
Running publish-license: Sync brief matching and pitch generation

Inputs needed:
  - Sync brief (or description of the opportunity)
  - Catalog with BPM, mood, and instrumentation tags

→ Invoke publish-license skill (Brief Analyst → Catalog Matcher → Pitch Writer)
→ HITL checkpoint: Review brief decode and confirm shortlist before writing pitches
→ HITL checkpoint: Review and approve pitch language before sending
```

### Route I — AI Involvement (`publish-provenance`)
**Trigger:** Any new release that used AI tools

```
[PUBLISH LOOP — STEP I]
Running publish-provenance: Creation log and AI involvement assessment

Inputs needed:
  - Track creation details (human authorship, AI tools used)

→ Invoke publish-provenance skill
→ HITL checkpoint: Review Provenance Triangle scores and tier assignment
→ Save creation log to records
→ If Tier 3–4: Flag for legal review before proceeding to Step S
```

### Route S — Shield Compliance (`publish-shield`)
**Trigger:** Any new release pre-distribution (runs after U, B, and I are complete)

```
[PUBLISH LOOP — STEP S]
Running publish-shield: Pre-release compliance gate

Inputs needed:
  - Release metadata (cleaned by Step U)
  - AI Involvement Tier (from Step I, or Tier 0 if no AI used)
  - Target platforms

→ Invoke publish-shield skill (Module A — compliance check)
→ HITL checkpoint: Review compliance report
→ DECISION GATE: If any platform shows "Blocked" status, release cannot proceed
→ If "Conditional": resolve items before distribution
→ If "Clear": proceed to distribution
```

### Route H — Harvest Review (`publish-harvest`)
**Trigger:** End of quarter (Q1: late May, Q2: late August, Q3: late November, Q4: late February)

```
[PUBLISH LOOP — STEP H]
Running publish-harvest: Quarterly catalog review

Inputs needed:
  - Royalty statements for the quarter (may reference Step P output)
  - Prior quarter data for comparison

→ Invoke publish-harvest skill
→ HITL checkpoint: Review harvest report and tier analysis
→ HITL checkpoint: Approve recommended actions
→ Schedule follow-on tasks from recommendations
```

---

## Step 3 — New Release Pipeline (Full Sequence)

For any new release, the correct sequence through the PUBLISH Loop is:

```
U (metadata clean) → I (AI assessment) → S (compliance gate) → B (registration)
                                                                      ↓
                                                            Distribute to DSPs
                                                                      ↓
                                                     P (reconcile next statement)
```

**Never skip the S gate.** A release that hasn't passed the publish-shield compliance check should not be submitted for distribution.

---

## Step 4 — HITL Protocol

This orchestrator enforces HITL at every stage transition. The rules are:

1. **Outputs from one skill must be reviewed before the next skill runs.** No auto-chaining without human review.
2. **A BLOCKED status at publish-shield stops the release.** Period. Do not override.

   **When you present the response to a Blocked status, your options list
   contains exactly ONE item: resolve the blocking issue, then re-run
   publish-shield.** Nothing else. Do not add a second, third, or fourth
   option. Do not suggest, float, hint at, or ask whether partial, staggered,
   platform-by-platform, or "release now / fix later" distribution might be
   possible — not even phrased as a question to "confirm with your
   distributor," not even hedged, not even as one option among several where
   the resolve-and-retry path is also listed. **This applies regardless of
   how the user describes the block** — even if the user's own phrasing
   mentions "one platform" or otherwise makes the block sound platform-
   specific, do not construct or infer a per-platform breakdown from that
   description. The ONLY circumstance where a per-platform status may be
   reflected at all is if publish-shield's own compliance report (the actual
   Step A3 template output, with its own per-platform ✅/⚠️/❌ status lines)
   is directly quoted or already present verbatim in this conversation — and
   even then, you may only restate exactly what that report says, never
   propose a distribution action based on it. If shield's actual report is
   not present in the conversation, treat the block as covering the entire
   release, full stop, with no exceptions.

   **Known failure pattern to avoid (do not do this):** "I can't route this
   to distribution while Blocked stands... however, if the block is
   platform-specific, you may be able to distribute to your cleared
   platforms and add the flagged one later — confirm with your distributor."
   This is a violation even though it also states the refusal, because it
   still offers the partial-distribution idea as a live option.
3. **Tier 3–4 AI involvement requires legal review before Step S.** Do not route to distribution until this is cleared.
4. **Sync pitches require human approval before sending.** The pitch is drafted by `publish-license`, approved by the user, then sent. The orchestrator never sends pitches autonomously.
5. **Quarterly harvest recommendations are suggestions.** The human publisher approves the action list before any task is executed.

---

## Key Principles

- **PUBLISH Loop is a cadence, not a checklist.** Not every pillar runs every week. The orchestrator's job is to surface what's due based on what data is available and what's in the pipeline.
- **Skills are self-contained.** Each domain skill produces its own output. The orchestrator sequences and gates — it does not merge or process skill outputs.
- **One session = one phase.** Following the Quirgs session protocol: complete one loop phase per session. Don't attempt to run the full weekly OS in a single session on a heavy week.
- **Start with the user's most urgent need.** The triage questions exist to serve the publisher's actual priority — not to enforce a rigid order when the user has a specific task in mind.

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
