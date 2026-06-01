# EU AI Act Article 13 — Transparency Requirements

## Overview

Article 13 of EU Regulation 2024/1689 requires providers of high-risk AI systems to
ensure those systems are sufficiently transparent to enable deployers to interpret the
system's output and use it appropriately. Deployers must in turn ensure that affected
natural persons are informed when they interact with or are subject to a high-risk AI system.

**Applicability:** Article 13 applies to HIGH-RISK AI systems only (Annex III + Article 6).
If the system's risk tier hasn't been confirmed, run eu-ai-act-classifier first.

**Role split:**
- **Provider** obligations: supply instructions for use (Article 13(1)–(3))
- **Deployer** obligations: inform affected individuals (Article 13 + Article 26)

---

## Mandatory Fields — Provider Instructions for Use (Article 13(3))

These fields must appear in the instructions for use that providers supply to deployers.
When drafting a provider notice, include all of these:

### a) Provider Identity
- Name and registered address of the provider
- Contact details for the provider (or authorised representative in the EU)

### b) System Characteristics
- Intended purpose of the AI system
- Level of accuracy, robustness, and cybersecurity the system has been tested for
- Any known or foreseeable circumstances that may lead to risks to health, safety, or fundamental rights
- Performance on specific groups of persons or in specific use contexts (where applicable)

### c) Input Data Requirements
- Specifications on input data (format, type, what data the system was designed to operate on)
- Any restrictions or limitations on use due to data characteristics

### d) Operational Information
- Description of changes to the AI system and its performance established through continuous learning post-deployment (where applicable)
- Human oversight measures required — specifically what decisions must not be taken without human review
- Computational and hardware requirements

### e) Expected Lifetime and Maintenance
- Expected lifetime of the system
- Maintenance and care requirements to maintain performance and compliance

### f) Log-keeping
- Description of the logging capabilities built into the system (Article 12 requirement)

---

## Mandatory Fields — Deployer Transparency Notice (Article 26 + Article 13)

When a deployer informs affected individuals, the notice must cover:

### 1. System Identity and Purpose
**Required:** What the AI system is and what it does in this specific deployment context.
**Plain language example:** "This application uses an AI system to assess your eligibility
for the housing benefit program. The AI analyses your submitted documents and financial
information to produce a recommendation for our caseworkers."

### 2. Deployer Identity and Contact
**Required:** Name of the deploying organisation and a contact point for questions.
**Note:** The deployer is the organisation operating the system, not necessarily the
company that built it.

### 3. How the System Is Used
**Required:** Description of how the AI output is used in the context of the specific
deployment — including what decisions it informs and what role human oversight plays.
**Plain language example:** "The AI system produces a score and a recommendation.
A qualified caseworker reviews this recommendation before any decision affecting
your benefit entitlement is made."

### 4. Human Oversight
**Required (for high-risk systems):** Who reviews the AI output, what they check for,
and how an individual can request human review of a decision.
**Plain language example:** "All AI recommendations in this process are reviewed by
a trained caseworker before they affect you. You have the right to request that a
decision be reviewed by a human without AI input — contact [name/email/phone]."

### 5. Rights of Affected Persons
**Required:** How affected individuals can exercise their rights, including:
- Right to explanation of individual decisions (where applicable under GDPR Art. 22)
- Right to contest or seek review
- Contact point for exercising these rights

### 6. Data Sources (where relevant)
**Recommended:** Categories of data the AI uses to make its assessment, in plain language.
Avoid revealing trade secrets; focus on what's relevant to the affected person's ability
to understand and challenge a decision.

---

## Recommended Additional Elements

These are not strictly mandated by Article 13 but are strongly recommended for a robust
transparency notice and may be required under GDPR or sector-specific regulation:

- Accuracy limitations: known performance gaps, error rates, or demographic disparities
- Scope limitations: what the system cannot assess or is not designed to consider
- Version and date: when the AI system was last updated and what changed
- Complaint mechanism: how to lodge a formal complaint with the deployer or a supervisory authority
- Links to full technical documentation (if available and appropriate for the audience)

---

## Key Dates (EU AI Act Applicability Timeline — updated post-Omnibus, May 2026)

- **February 2025**: Prohibited practices provisions in force (Article 5) ✅
- **August 2025**: GPAI provisions in force (Articles 51–56) ✅
- **2 August 2026**: Deployer chatbot and biometric disclosure obligations (Article 50) — 🔴 **THIS DEADLINE IS ACTIVE.** If you operate a chatbot, biometric system, or AI that interacts with users, your disclosure notice is legally required now.
- **2 December 2027**: Full high-risk AI obligations (Annex III — employment, credit, education, etc.) — delayed 16 months by EU AI Act Omnibus. Article 13 provider/deployer notices for these systems follow this timeline.
- **2 August 2028**: High-risk AI embedded in Annex I products (medical devices, aviation, machinery) — delayed 12 months by Omnibus.

> **Omnibus clarification:** The original single August 2026 HRAIS deadline was split by the EU Digital Omnibus (finalised May 2026). Deployers running chatbots or biometric tools must meet Article 50 disclosure requirements by August 2, 2026. High-risk system Article 13 technical notices for Annex III systems are due by December 2027. Draft deployer-facing notices now — the August deadline cannot slip.
