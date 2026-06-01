# EU AI Act Article 10 — Data Governance Requirements

## Overview

Article 10 of EU Regulation 2024/1689 establishes data governance requirements for
high-risk AI systems. It applies to training, validation, and testing datasets used
to build high-risk AI systems. It does not override GDPR — both apply simultaneously.

**Applicability:** Article 10 applies to HIGH-RISK AI systems only (Annex III + Article 6).
Systems operating on GPAI models must comply with Article 10 requirements in the
context of those models' training data where the provider has control over it.

---

## Article 10(2) — Data Governance Practices

Providers of high-risk AI systems must implement data governance practices covering:

### (a) Relevant design choices
The choice of training data must be documented and justified relative to the AI system's
intended purpose. Data collected for one purpose should not be repurposed for training
without a documented justification for how it remains relevant.

**Audit check:** Can every data element or dataset be traced to a specific design choice
with a documented rationale for its inclusion?

### (b) Data collection processes
The processes used to collect training data must be documented, including:
- Collection methodology and sources
- Whether data was collected with appropriate consent or legal basis
- Any third-party data providers and their data governance practices

**Audit check:** Is there documented provenance for all training data sources?

### (c) Data preparation operations
Preprocessing, labelling, and cleaning operations must be documented. This includes:
- Filtering decisions (what data was excluded and why)
- Labelling methodology and inter-annotator agreement (where applicable)
- Normalisation or transformation steps

**Audit check:** Are preprocessing decisions documented and reversible?

### (d) Formulation of relevant assumptions
Explicit documentation of assumptions made about the data, including:
- What the data is assumed to represent
- The population the training data is assumed to generalise to
- Known gaps between training distribution and deployment distribution

**Audit check:** Are distributional assumptions documented and validated?

### (e) Assessment of availability, quantity, and suitability
The provider must assess whether sufficient data exists to train a system that will
perform adequately in the intended deployment context. This includes:
- Minimum dataset size justification
- Coverage of relevant use cases and edge cases
- Validation that the dataset reflects the deployment environment

**Audit check:** Is there a documented data sufficiency assessment?

### (f) Examination of possible biases
Article 10(2)(f) explicitly requires examination of biases that could lead to
discrimination prohibited under EU law. This includes:
- Demographic disparities in training data representation
- Historical biases encoded in labels or outcomes
- Proxy variables that may correlate with protected characteristics

**Audit check:** Has a bias examination been conducted and documented? Were findings acted on?

### (g) Relevant data gaps or shortcomings
Identified gaps must be documented, including:
- Demographic or geographic coverage gaps
- Temporal gaps (data age vs. deployment context)
- Domain gaps (training context vs. deployment context)

**Audit check:** Is there a data gap register? Are gaps mitigated or accepted with justification?

---

## Article 10(3) — Special Category Data in Training

Training data may include special category personal data under GDPR Article 9 (health,
biometric, racial/ethnic origin, etc.) only where **strictly necessary** for the purpose
of detecting or correcting bias.

**Requirements when special category data is used for bias detection:**
1. The use must be strictly necessary — not merely convenient
2. Appropriate safeguards must be in place (pseudonymization, access restriction)
3. The data must be processed under a valid Article 9(2) legal basis
4. The data must be deleted or anonymized after bias detection/correction is complete

**Audit check:** If special category data is present in training data:
- Is it used solely for bias detection/correction (not as a feature)?
- Is there a documented legal basis under Article 9(2)?
- Is there a documented plan for deletion after use?

---

## Article 10(4) — Relevance, Representativeness, and Accuracy

Training, validation, and testing datasets must be:

| Requirement | What it means | Common failures |
|---|---|---|
| **Relevant** | Data relates to the intended purpose | Repurposed datasets; irrelevant features included |
| **Sufficiently representative** | Covers the population the system will serve | Demographic underrepresentation; geographic gaps |
| **Free of errors** (to the extent possible) | Data is accurate and not systematically biased | Mislabelled data; outdated records; known error sources unaddressed |
| **Complete** | Has the properties needed for the intended purpose | Missing data for edge cases; silent failures on certain inputs |

---

## Article 10(5) — Data Minimization for Sensitive Attributes

When developing techniques to detect and correct bias, providers may process special
category data. Outside this narrow exception, data minimization applies:

- Do not include personal data in training sets that is not necessary for the model's function
- Remove or pseudonymize identifiers that are not needed as features
- Assess whether the model would perform equivalently without each personal data element

---

## Key Deadlines (updated post-Omnibus, May 2026)

- **2 August 2026**: Deployer chatbot and biometric disclosure obligations (Article 50) — 🔴 **ACTIVE**
- **2 December 2027**: Article 10 data governance obligations fully in force for standalone high-risk AI (Annex III — employment, credit, education, etc.) — delayed 16 months by EU AI Act Omnibus
- **2 August 2028**: Article 10 obligations for AI embedded in Annex I products (medical devices, aviation, machinery) — delayed 12 months by Omnibus
- **Now**: Providers should be documenting data governance practices regardless of deadline — early documentation reduces audit risk and supports ISO 42001 alignment

> **Omnibus note:** The original August 2026 deadline for full Annex III high-risk compliance (including Article 10) has been delayed. However, if your system deploys a chatbot or processes biometric data, Article 50 disclosure obligations still apply in August 2026.

---

## Relationship to GDPR

Article 10 does not replace GDPR — both apply:

| Obligation | Source |
|---|---|
| Legal basis for processing personal data | GDPR Article 6 |
| Special category data legal basis | GDPR Article 9 |
| Data subject rights (access, erasure, etc.) | GDPR Articles 15–22 |
| Data minimization | GDPR Article 5(1)(c) + EU AI Act Article 10 |
| Purpose limitation | GDPR Article 5(1)(b) |
| Data governance documentation | EU AI Act Article 10 (beyond GDPR) |
| Bias examination | EU AI Act Article 10(2)(f) (beyond GDPR) |
| Training data representativeness | EU AI Act Article 10(4) (beyond GDPR) |
