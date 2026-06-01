# EU AI Act Article 62 — Serious Incident Reporting

## Overview

Article 62 of EU Regulation 2024/1689 requires providers of high-risk AI systems placed
on the EU market to report serious incidents to the relevant national market surveillance
authority. This obligation is distinct from GDPR breach notification and may run in parallel.

**Who it applies to:**
- **Providers** of high-risk AI systems (Annex III + Article 6)
- Providers of GPAI models with systemic risk (Article 55)
- Importers and distributors have notification obligations to the provider (Article 62(2))
- Deployers must notify the provider when they identify a serious incident (Article 73(4))

**Who it does NOT apply to:**
- Deployers (they notify the provider; the provider notifies the authority)
- Providers of limited-risk or minimal-risk AI systems
- Providers of AI systems used exclusively for national security purposes

---

## Article 62 Serious Incident Definition

A **serious incident** means any incident or malfunction of an AI system that directly or
indirectly leads to any of the following:

### (a) Death of a person
Any fatality directly or indirectly caused by or attributable to the AI system's output
or failure to produce an appropriate output.

**Examples:**
- An AI medical diagnostic system fails to flag a condition that leads to delayed treatment and death
- An AI system controlling physical infrastructure fails, causing a fatal accident
- An AI hiring system systematically excludes a protected group, leading to loss of livelihood in circumstances contributing to death (indirect — assess carefully)

### (b) Serious harm to health
Physical or mental harm that is severe, lasting, or both. "Serious" requires medical
judgement but includes hospitalisation, permanent or long-term impairment, and severe
psychological harm.

**Examples:**
- AI medication dosing recommendation produces a dangerous overdose recommendation acted upon by a clinician
- AI mental health support chatbot produces output that contributes to self-harm
- AI safety monitoring system fails to detect a workplace hazard, resulting in injury

### (c) Serious and irreversible disruption to critical infrastructure
Disruption to systems designated as critical infrastructure (energy, water, transport,
financial, health, digital infrastructure) that cannot be quickly reversed.

**Examples:**
- AI traffic management system failure causes significant gridlock or accident conditions
- AI fraud detection failure allows large-scale financial crime affecting multiple institutions
- AI system managing power distribution fails, causing regional outage

### (d) Infringement of obligations under EU law protecting fundamental rights
A serious breach of rights protected under the EU Charter of Fundamental Rights,
including rights to non-discrimination, privacy, fair trial, and dignity.

**Examples:**
- AI hiring system produces systematically discriminatory outcomes affecting a protected class (Article 21 Charter)
- AI system used in law enforcement produces biased identification leading to wrongful detention
- AI credit scoring system denies financial services to a protected group without justification

### (e) Serious damage to property or the environment
Material damage to physical property or environmental harm resulting from AI system failure.

**Examples:**
- AI industrial control system failure causes equipment damage or environmental release
- AI autonomous vehicle failure causes significant property damage

---

## Article 62 Notification Requirements

### Timeline
- **15 working days** from when the provider becomes aware of a serious incident
- For incidents involving death or serious harm to health: notify immediately (as soon as
  technically possible, and no later than 2 working days after awareness)
- The 15-day clock starts at **awareness**, not at occurrence — document when awareness occurred

### Content of Notification (Article 62(1))
The notification must include:

1. **Description of the incident** — what happened, when, in what context
2. **Information about the AI system** — system name, version, intended purpose, risk tier
3. **Corrective actions taken** — what has been done to contain and address the incident
4. **Impact assessment** — number of persons affected, nature and severity of harm
5. **Provider contact** — point of contact for follow-up from the authority

### Which Authority to Notify
Notify the **national market surveillance authority** of the EU member state where the
serious incident occurred, or where the affected persons are located. If the incident
spans multiple member states, notify all relevant authorities or the lead authority
under applicable coordination mechanisms.

**Key authorities (non-exhaustive):**
- Germany: Bundesnetzagentur (for AI systems in scope)
- France: ANSSI / sectoral regulators
- Netherlands: Rijksinspectie Digitale Infrastructuur (RDI)
- Ireland: (to be designated — likely digital economy regulator)
- UK: Not subject to EU AI Act post-Brexit; ICO has separate AI guidance

### Ongoing Reporting
After the initial notification, provide updates as the investigation progresses.
A final report summarising root cause, corrective actions, and lessons learned
is required once the investigation is complete.

---

## Relationship to Other Notification Obligations

| Obligation | Trigger | Authority | Timeline |
|---|---|---|---|
| EU AI Act Article 62 | Serious incident (death, serious harm, fundamental rights breach) | National market surveillance authority | 15 working days (2 days for death/serious harm) |
| GDPR Article 33 | Personal data breach | National DPA (e.g., ICO, CNIL, BfDI) | 72 hours of awareness |
| GDPR Article 34 | High-risk data breach requiring individual notification | Affected individuals | Without undue delay |
| NIS2 Directive | Significant cybersecurity incident | National CSIRT + competent authority | 24 hours (early warning), 72 hours (notification), 1 month (full report) |
| Sector-specific | Medical device failure, financial system failure, etc. | Sectoral regulator | Varies by sector |

**Key point:** A single AI incident may trigger multiple parallel notification obligations.
Identify all applicable obligations at the point of triage (Step 1 of this skill).

---

## Article 62 Threshold Assessment Checklist

Use this checklist during incident triage. If ANY item is checked Yes, treat as potential
serious incident and escalate to legal immediately:

```
[ ] Did or could the AI system output contribute to a person's death?
[ ] Did or could the AI system output cause serious physical harm requiring hospitalisation?
[ ] Did or could the AI system output cause serious psychological harm?
[ ] Did the AI system failure disrupt critical infrastructure (energy, water, transport,
    health, finance, digital)?
[ ] Did the AI system produce discriminatory outputs affecting a protected characteristic
    at scale (multiple individuals)?
[ ] Did the AI system contribute to wrongful enforcement action (arrest, detention,
    denial of legal rights)?
[ ] Did the AI system failure cause serious damage to property or the environment?
[ ] Is this a high-risk AI system under Annex III or a GPAI model with systemic risk?

If all boxes are unchecked: likely NOT a serious incident under Article 62.
Assess under standard incident classification (NIST SP 800-61 severity table).

Legal confirmation required before concluding no Article 62 obligation exists.
```
