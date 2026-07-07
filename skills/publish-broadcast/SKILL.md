---
name: publish-broadcast
description: >
  Extract and format the data required to register a release with DDEX delivery
  partners and performing rights organizations (PROs). Use this skill whenever
  someone says "prepare DDEX registration", "submit to PRO", "register my release
  with ASCAP", "register with BMI", "DDEX ERN data", "PRO registration packet",
  "submit my compositions for performance rights", "register my sound recordings",
  "prepare registration data", "what do I need to register at a PRO", or any
  request to prepare the structured data needed for rights registration with a
  licensing body or digital delivery network. Outputs a validated DDEX ERN data
  packet and separate PRO registration records ready for submission.
---

> **Install:** `/plugin marketplace add unqdlphn/quirgs` then `/plugin install publish-broadcast@quirgs-publish`

# Publish Broadcast — DDEX + PRO Registration

Extracts the data required to register new releases through DDEX ERN (for digital distribution) and with performing rights organizations (for performance and mechanical royalties). Validates all required fields and outputs submission-ready data packets.

---

## Standing Disclaimer

Every response this skill produces — including clarifying questions, partial or
prose-only answers, and any output that is not a full formatted registration
packet — must end with this line:

> ⚠️ *Advisory only — this output is administrative support, not legal or licensing advice; verify PRO/DDEX requirements before submission.*

The full boxed ADVISORY NOTICE on the PRO Registration Packet (Step 4) replaces
this short line only when that complete packet is emitted. The DDEX ERN Packet
(Step 3) is data-format output, not a legal/licensing determination, but still
carries the short line on any turn that doesn't emit the full PRO packet.

---

## Step 1 — Identify Registration Scope

Ask the user (or infer from context):

1. **What is being registered?** — a new single, EP, or album?
2. **Which registrations are needed?**
   - DDEX ERN (digital distribution to DSPs)
   - PRO composition registration (ASCAP, BMI, SESAC, PRS, SOCAN, etc.)
   - Both
3. **PRO(s) to register with?** — which societies does the publisher/songwriter belong to?
4. **Is catalog data available?** — can the user provide a metadata file, or will they provide details manually?

Load `references/ddex-ern-fields.md` and `references/pro-registration-requirements.md` for field requirements.

---

## Step 2 — Collect Release Data

Gather the following for each track in the release:

### Track-Level Data
- Track title (canonical)
- ISRC
- Artist name(s)
- Composer name(s) and IPI numbers (for PRO registration)
- Publisher name(s) and IPI numbers
- Duration (HH:MM:SS)
- Genre
- BPM
- Language (ISO 639-1)
- Explicit flag
- P-line (℗ Year Owner)
- C-line (© Year Owner)

### Release-Level Data
- Release title
- UPC
- Release date
- Label name
- Territory availability (specific countries or WORLDWIDE)
- Distribution territories (which DSPs / regions)
- Release type (Single, EP, Album, Compilation)

---

## Step 3 — Build the DDEX ERN Packet

Load `references/ddex-ern-fields.md` for the required field schema.

Validate that all required fields are present. **The release-level required fields
are: UPC, release title, release date (exact ISO 8601 calendar date — a relative
description like "next month" does not satisfy this), release type, P-line, C-line,
label name, and territory. The track-level required fields are: ISRC (a literal
value — "present" or "confirmed" without the actual code does not satisfy this),
track title, duration, artist name, and language.** Every one of these — including
P-line and C-line, which are easy to overlook because they appear inside the output
template rather than the validation prose — blocks submission if missing or
malformed; list each missing required field explicitly under "❌ Required fields
missing" rather than folding it silently into the displayed template with a "None"
or "Not provided" note and no corresponding blocking flag.

Output the DDEX ERN data as a structured table (not XML, unless the user requests it) that the user's distributor or direct DDEX implementation can ingest:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 DDEX ERN REGISTRATION PACKET
Release: [Release Title]
UPC: [UPC]
Generated: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RELEASE HEADER
──────────────
Release Title:     [Value]
UPC:               [Value]
Label:             [Value]
Release Date:      [Value]
Release Type:      [Value]
Territory:         [Value]
P-line:            [Value]
C-line:            [Value]

TRACK RECORDS
─────────────
Track 1:
  Title:           [Value]
  ISRC:            [Value]
  Artist:          [Value]
  Duration:        [Value]
  Genre:           [Value]
  Explicit:        [Value]
  Language:        [Value]
...

VALIDATION STATUS
─────────────────
✅ All required fields present
⚠️ Optional fields missing: [list]
❌ Required fields missing: [list — blocks submission]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ *Advisory only — this output is administrative support, not legal or licensing advice; verify PRO/DDEX requirements before submission.*
```

**The disclaimer line above is part of this template — it is not optional and
is not satisfied by the Standing Disclaimer section alone. Include it
verbatim every time this DDEX ERN packet block is emitted, even when this is
the only packet produced (no PRO registration requested).**

---

## Step 4 — Build the PRO Registration Packet

Load `references/pro-registration-requirements.md` for PRO-specific field requirements.

For each composition in the release, produce a PRO registration record:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎼 PRO REGISTRATION PACKET
Society: [ASCAP / BMI / SESAC / PRS / SOCAN / Other]
Generated: [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ADVISORY NOTICE
This output is generated by an AI skill for administrative support purposes only.
PRO registration rules change. Verify field requirements at your PRO's current
member portal before submission. This output does not constitute legal or
licensing advice.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPOSITION: [Title]
────────────────────
ISWC:                [If known]
Composers:
  [Name] | IPI: [Number] | Share: [%] | Role: [C/CA/A/TR]
  [Name] | IPI: [Number] | Share: [%] | Role: [C/CA/A/TR]
Publishers:
  [Name] | IPI: [Number] | Share: [%] | Territory: [Value]
Linked Recording:
  ISRC: [Value]
  Artist: [Value]
  Release: [Value]

SUBMISSION STATUS
─────────────────
☐ Ready for submission
☐ Missing IPI numbers — obtain from PRO member portal
☐ Missing ISWC — will be assigned on registration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5 — Offer Submission Guidance

After producing the packets:

- Remind the user of PRO submission deadlines relative to release date (register compositions before or on release date for best royalty coverage).
- Flag any tracks where the ISWC is unknown — submission will trigger ISWC assignment by the PRO.
- Offer to save both packets as `.md` files for record-keeping.
- If multiple PROs are involved (e.g., a co-write split between ASCAP and BMI members), offer to produce a separate packet per society.

---

## Key Principles

- **IPI numbers are mandatory for PRO registration.** Without them, royalty payments cannot be routed. Flag any missing IPI numbers as blocking before producing a final packet.
- **DDEX ERN is a data format, not a submission tool.** This skill produces the data; the user's distributor or direct DDEX integration handles XML generation and ingestion.
- **Always flag split totals.** Composer splits must sum to 100% (writer side). Publisher splits must sum to 100% (publisher side). Flag if they don't.
- **Advisory notice is mandatory.** PRO rules and DDEX schema versions change — always include the notice.

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
