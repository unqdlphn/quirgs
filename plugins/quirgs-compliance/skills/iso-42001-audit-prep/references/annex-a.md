# ISO 42001 — Annex A: Organizational Controls Reference

Annex A contains AI-specific controls that organizations select based on their context.
Unlike ISO 27001, **all Annex A controls are potentially applicable** — organizations must
review each and either implement it or provide a documented justification for exclusion
(a Statement of Applicability is strongly recommended).

---

## Statement of Applicability (SoA)

Before auditors review Annex A controls, they will ask for the SoA:
- Lists every Annex A control
- States whether it is included or excluded
- Gives justification for any exclusion
- References the evidence/document that implements each included control

**If no SoA exists: create one immediately. This is a Stage 1 blocker.**

---

## Annex A Controls

### A.2 — Policies for AI

| Control | Requirement | Evidence needed |
|---|---|---|
| A.2.2 | AI policy is defined, approved, and communicated | Signed AI policy document |
| A.2.3 | AI policy addresses responsible use, fairness, transparency, accountability | Policy content review |
| A.2.4 | AI policy is reviewed periodically and updated as needed | Version history, review records |

---

### A.3 — Internal Organization

| Control | Requirement | Evidence needed |
|---|---|---|
| A.3.2 | AI roles and responsibilities are defined | Role descriptions, RACI |
| A.3.3 | AI governance body or oversight function exists | Charter, terms of reference |
| A.3.4 | Responsibilities for AI risk management are assigned to named individuals | Named role in governance docs |

---

### A.4 — Resources for AI Systems

| Control | Requirement | Evidence needed |
|---|---|---|
| A.4.2 | Human resources with appropriate AI competence are available | Competency records |
| A.4.3 | Infrastructure and tooling for AI lifecycle are provided | Asset inventory |
| A.4.4 | Resources are periodically reviewed against AIMS needs | Resource review records |

---

### A.5 — Assessing Impacts of AI Systems

| Control | Requirement | Evidence needed |
|---|---|---|
| A.5.2 | A process exists to assess impacts of AI systems on individuals, groups, and society | Impact assessment procedure |
| A.5.3 | Impact assessments are conducted before deployment and when systems change | Completed assessments per system |
| A.5.4 | Impact assessment results are used in decision-making | Evidence of decisions informed by assessment |
| A.5.5 | Impact assessments address: intended use, potential misuse, affected parties, harms | Assessment template review |

**Auditor focus:** Most scrutinized Annex A area. "Show me an actual completed impact assessment."

---

### A.6 — AI System Life Cycle

| Control | Requirement | Evidence needed |
|---|---|---|
| A.6.1 | Lifecycle management processes are established for AI systems | Lifecycle policy/procedure |
| A.6.2 | Design considerations include fairness, safety, reliability, and explainability | Design documentation |
| A.6.3 | Data used in AI systems is managed throughout the lifecycle | Data management policy |
| A.6.4 | Testing and validation are conducted before deployment | Test plans, test results |
| A.6.5 | AI systems are monitored post-deployment | Monitoring plan and records |
| A.6.6 | Criteria for decommissioning AI systems are defined | Decommissioning procedure |

---

### A.7 — Data for AI Systems

| Control | Requirement | Evidence needed |
|---|---|---|
| A.7.2 | Data quality requirements are defined for AI systems | Data quality policy |
| A.7.3 | Data provenance and lineage are documented | Data catalogues, lineage records |
| A.7.4 | Data used for training is assessed for bias and representativeness | Bias assessment records |
| A.7.5 | Data governance policies are in place | Data governance framework |
| A.7.6 | Personal data used in AI is managed in compliance with privacy obligations | Privacy impact assessments, DPIAs |

---

### A.8 — Information for Users of AI Systems

| Control | Requirement | Evidence needed |
|---|---|---|
| A.8.2 | Users are provided with information about AI system capabilities and limitations | User documentation, system cards |
| A.8.3 | Users are informed when they are interacting with an AI system | Disclosure mechanisms |
| A.8.4 | Instructions for appropriate use of AI systems are provided | User guides |
| A.8.5 | Mechanisms for users to report concerns are provided | Feedback/reporting channels |

---

### A.9 — Use of AI Systems

| Control | Requirement | Evidence needed |
|---|---|---|
| A.9.2 | Use of AI systems is governed by policies and procedures | Use policy |
| A.9.3 | Human oversight mechanisms are implemented where required | Oversight design documentation |
| A.9.4 | AI system outputs are reviewed before high-stakes decisions | Review process records |
| A.9.5 | Misuse of AI systems is actively prevented | Access controls, use monitoring |

---

### A.10 — Third-Party and Supply Chain Management

| Control | Requirement | Evidence needed |
|---|---|---|
| A.10.2 | Third-party AI providers are assessed for risk | Supplier assessment records |
| A.10.3 | Contracts with AI providers include appropriate requirements | Contract review records |
| A.10.4 | Third-party AI system performance is monitored | Supplier performance records |
| A.10.5 | AI supply chain risks are included in the AIMS risk register | Risk register |

---

## Annex B — AI System Impact Categories

Annex B provides a framework of impact categories to structure AI system impact assessments.
It is informative (guidance), not normative (required), but auditors expect teams to reference it.

### Key Impact Categories:

| Category | Examples |
|---|---|
| **Physical** | Bodily harm, safety risks, health impacts |
| **Psychological** | Emotional harm, manipulation, addiction |
| **Financial** | Credit denial, job loss, economic discrimination |
| **Privacy** | Unlawful data processing, surveillance, profiling |
| **Autonomy** | Undermining human decision-making, over-reliance |
| **Societal** | Discrimination at scale, erosion of trust, polarization |
| **Rule of law** | Due process violations, surveillance, biometric misuse |

Use these categories as the structure for AI System Impact Assessments under A.5 and Clause 8.2.
