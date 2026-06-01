# NIST AI RMF — Model Card / System Disclosure Template

## Overview

Model cards are structured documents that describe an AI system's purpose, design,
performance, and limitations. They support the NIST AI RMF GOVERN function by
making AI system characteristics transparent to deployers, affected individuals,
oversight bodies, and other stakeholders.

Reference: NIST AI RMF 1.0, GOVERN 1.1 (policies for AI risk), GOVERN 6.1 (transparency
policies), and the broader AI RMF Playbook actions GV-1.1-001 through GV-1.1-005.

---

## Section 1 — System Overview

**Purpose of this section:** Establish what the system is, why it was built, and who it's for.
A reader should finish this section knowing whether this system is relevant to them.

Fields to cover:
- **System name and version**
- **Developed by** (organisation, team)
- **Date** (release or last update)
- **System type** (e.g., classification model, generative AI, recommendation engine, decision-support tool)
- **Plain-language summary** — one paragraph describing what the system does, in terms
  understandable to a non-technical stakeholder or affected individual

---

## Section 2 — Intended Use

**Purpose of this section:** Define the boundaries of appropriate use. This protects
both the deployer and affected individuals by making clear what the system was and
wasn't designed to do.

Fields to cover:
- **Primary intended use cases** — specific tasks the system is designed for
- **Intended users / deployers** — who should operate this system (e.g., trained HR professionals, licensed clinicians)
- **Intended deployment contexts** — settings where the system is appropriate
- **Out-of-scope uses** — explicit list of uses the system was NOT designed for and should not be used for
- **Foreseeable misuse** — ways the system might be misused and why those uses are inappropriate

---

## Section 3 — System Description

**Purpose of this section:** Give enough technical context for deployers and oversight
bodies to understand how the system works without requiring access to proprietary details.

Fields to cover:
- **Model type / approach** (e.g., large language model, random forest, rules-based with ML component)
- **Input data types** (what the system takes as input: text, images, structured records, etc.)
- **Output format** (what the system produces: scores, classifications, generated text, recommendations)
- **Key components or pipeline stages** (high level — e.g., "document parsing → NLP extraction → scoring")
- **Human-AI interaction design** (where and how humans are in the loop)

---

## Section 4 — Training Data (for ML systems)

**Purpose of this section:** Transparency about training data enables stakeholders to
assess potential biases, gaps, and limitations. Omit trade-secret details; focus on
what's relevant to understanding performance and fairness.

Fields to cover:
- **Data sources** — categories of data used (e.g., "publicly available court records from 2010–2022")
- **Data collection period** — date range of training data
- **Geographic / demographic coverage** — what populations or contexts are represented
- **Known gaps or limitations** — groups, contexts, or time periods underrepresented in training data
- **Data preprocessing** — key cleaning or transformation steps that affect what the model learned
- **Sensitive attributes** — whether protected characteristics (race, gender, age, disability, etc.)
  were present in training data and how they were handled

---

## Section 5 — Performance and Evaluation

**Purpose of this section:** Honest performance disclosure lets deployers make informed
decisions about where and how to use the system.

Fields to cover:
- **Evaluation datasets** — what data was used to evaluate performance (separate from training)
- **Key metrics** — the metrics used and what they measure (e.g., accuracy, F1, AUC, false positive rate)
- **Overall performance results** — headline numbers with appropriate context
- **Disaggregated performance** — performance broken down by relevant subgroups (demographic, geographic, use-context)
- **Performance limitations** — where the system performs below acceptable thresholds
- **Fairness evaluation** — whether a bias/fairness analysis was conducted and key findings
- **Known failure modes** — circumstances in which the system is likely to produce incorrect or harmful outputs

---

## Section 6 — Risks and Limitations

**Purpose of this section:** Proactive risk disclosure is a core NIST AI RMF requirement
(MAP function) and builds deployer and public trust. Be specific — generic disclaimers
do not satisfy this section.

Fields to cover:
- **Identified risks** — concrete risks the system poses if used as intended (e.g., "may perpetuate
  historical disparities in credit access for applicants from certain zip codes")
- **Risk severity and likelihood** — qualitative or quantitative assessment
- **Mitigations in place** — technical or procedural controls implemented to reduce identified risks
- **Residual risks** — risks that remain after mitigations are applied
- **Sensitivity to input quality** — how the system behaves when inputs are incomplete, noisy, or atypical
- **Degradation over time** — whether model performance is expected to degrade as the world changes
  relative to training data (concept drift), and how this will be monitored

---

## Section 7 — Human Oversight and Accountability

**Purpose of this section:** Required for NIST AI RMF GOVERN and MANAGE functions.
Deployers and affected individuals need to know who is responsible and how errors
can be caught and corrected.

Fields to cover:
- **Human oversight design** — which decisions require mandatory human review before action
- **Override capability** — whether and how operators can override AI outputs
- **Accountability structure** — who is responsible for the system's outputs (role/title, not personal name)
- **Incident escalation path** — how errors or harms are reported and escalated
- **Feedback mechanism** — how users or affected individuals can report problems

---

## Section 8 — Privacy and Data Handling

Fields to cover:
- **Data collected at inference** — what data the system collects or logs when in use
- **Data retention** — how long inference data is retained and for what purpose
- **Applicable privacy frameworks** — GDPR, CCPA, HIPAA, or other relevant regimes
- **Contact for data rights** — who to contact to exercise data subject rights

---

## Section 9 — Maintenance and Updates

Fields to cover:
- **Monitoring approach** — how the system is monitored post-deployment (drift detection, accuracy tracking)
- **Update cadence** — how frequently the system is retrained or updated
- **Change notification** — how deployers and users are informed of material changes
- **End-of-life plan** — when and how the system will be retired

---

## Section 10 — Contact and Further Information

Fields to cover:
- **Technical contact** — for questions about system behaviour or performance
- **Compliance / legal contact** — for regulatory or rights-related questions
- **Full documentation** — link to technical documentation if available and appropriate
- **Version history** — summary of changes from previous versions (for updated cards)
