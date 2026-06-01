# EU AI Act — High-Risk AI Classification (Article 6 + Annex III)

High-risk AI systems are permitted but subject to the most extensive obligations in the Act.
There are **two pathways** to a high-risk classification.

**Applicability dates (post-EU AI Act Omnibus — finalised May 2026):**
- **2 August 2026** — Deployer chatbot and biometric disclosure obligations (Article 50, Limited Risk) — **ACTIVE**
- **2 December 2027** — Standalone high-risk AI (Annex III: employment, credit, education, biometrics, etc.) — delayed 16 months
- **2 August 2028** — AI embedded as safety components in Annex I products (medical devices, aviation, machinery) — delayed 12 months

> **Omnibus note:** The EU AI Act "Digital Omnibus" provisional agreement (May 2026) split the original single August 2026 HRAIS deadline into two tracks. Deployer disclosure obligations under Article 50 remain unchanged at August 2026. Provider/deployer technical compliance for high-risk systems is now tiered by Annex track.

---

## Pathway 1 — Safety Components (Article 6(1) + Annex I)

A system is high-risk if it is a **safety component** of a product already regulated under
EU harmonisation legislation listed in Annex I, AND the product is subject to third-party
conformity assessment.

**Annex I product categories include:**
- Machinery (Regulation 2023/1230) — **Exemption (Omnibus, May 2026):** AI in machinery covered solely by EU Machinery Regulation 2023/1230 is no longer automatically classified as a High-Risk AI System. The "double regulation" overlap has been removed. Assess on Article 6(1) merits — the exemption does not apply if the system independently qualifies under Annex III.
- Medical devices (Regulation 2017/745)
- In vitro diagnostic medical devices (Regulation 2017/746)
- Radio equipment (Directive 2014/53/EU)
- Civil aviation safety (Regulation 2018/1139)
- Automotive safety (various regulations)
- Marine equipment (Directive 2014/90/EU)
- Rail systems (Directive 2016/797)
- Agricultural machinery
- Pressure equipment

**Test:** Is this AI a component whose failure could cause the regulated product to fail its
safety requirements? If yes → high-risk.

---

## Pathway 2 — Standalone High-Risk Domains (Article 6(2) + Annex III)

A system is high-risk if it falls into one of the eight Annex III domains.

### Domain 1 — Biometrics
- Remote biometric identification systems (not real-time in public — that's prohibited)
- Biometric categorisation systems inferring sensitive characteristics (except prohibited ones)
- Emotion recognition systems (outside workplace/education — those are prohibited)

### Domain 2 — Critical Infrastructure
- AI used as safety components in management of critical infrastructure:
  - Road, rail, water, gas, electricity, heating networks
  - Digital infrastructure

### Domain 3 — Education and Vocational Training
- AI that determines access, admission, or assignment to educational institutions
- AI that evaluates learning outcomes (grades, assessments)
- AI that monitors and detects prohibited behaviour in exams
- AI that recommends educational pathways

### Domain 4 — Employment and Workers Management
- AI used in recruitment and selection (CV screening, interview scoring, candidate ranking)
- AI used in employment decisions (promotion, termination, task assignment)
- AI that monitors and evaluates workplace performance
- AI that allocates tasks in gig economy platforms

### Domain 5 — Access to Essential Services
- AI used by public authorities or in their behalf to assess eligibility for public benefits/services
- AI used for creditworthiness assessment and credit scoring (not excluded from scope)
- AI used in life/health insurance risk assessment and pricing
- AI for emergency service dispatch and prioritisation (112/999/emergency services)

### Domain 6 — Law Enforcement
- AI used by law enforcement to assess individual risk of offending or reoffending
- AI used as polygraphs or lie detection tools
- AI used to assess reliability/credibility of evidence
- AI used for profiling of individuals in criminal investigations
- AI used to predict crime occurrence (geographic/temporal profiling excluded — person-level included)
- AI used to detect emotional states of suspects

### Domain 7 — Migration, Asylum, and Border Management
- AI used to assess migration/asylum/visa application risk
- AI used to examine applications and associated documents
- AI used for document authenticity verification
- AI used to assist in border control decisions

### Domain 8 — Administration of Justice and Democratic Processes
- AI used to assist courts and justice authorities in researching, interpreting facts/law, applying law
- AI used to influence elections (targeted political advertising, campaign optimisation)

---

## Exceptions to High-Risk Classification (Article 6(3))

Even if an Annex III domain applies, a system is **not** high-risk if it meets both criteria:
1. It does not pose significant risk of harm to health, safety, or fundamental rights
2. It performs a narrow procedural task, improves human activity without replacing human assessment,
   detects patterns/anomalies without acting on them, or prepares assessments reviewed by a human

**Providers must document and notify the EU database** when using this exception.

---

## Classification Signal

| Signals pointing to high-risk | Notes |
|---|---|
| System makes or strongly influences consequential decisions about individuals | Core signal |
| Domain is one of the eight Annex III areas | Check specifics |
| System interacts with safety-critical physical infrastructure | Pathway 1 or Domain 2 |
| System used in hiring, HR decisions, or performance management | Domain 4 |
| System used for creditworthiness or insurance pricing | Domain 5 |
| System used by public authorities affecting individual rights | Domains 5, 6, 7, 8 |

| Signals pointing away from high-risk | Notes |
|---|---|
| System only assists a human who makes the final decision and output is clearly labelled | May qualify for Art. 6(3) exception |
| System does not process data about individuals | Likely not in scope |
| System is purely for internal business operations with no individual impact | Likely minimal risk |
