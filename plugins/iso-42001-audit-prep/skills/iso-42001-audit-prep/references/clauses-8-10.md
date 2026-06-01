# ISO 42001 — Clauses 8–10 Reference (Operation, Performance Evaluation, Improvement)

These clauses are the **implementation and improvement engine**. Stage 2 auditors probe
here hardest — they want to see that the documented system is actually being followed in practice.

---

## Clause 8 — Operation

### 8.1 Operational Planning and Control
**Requirement:** Processes for meeting AIMS requirements are planned, implemented, and controlled.

| Requirement | Evidence needed |
|---|---|
| Operational processes for AI systems are documented | Process documentation, SOPs |
| Criteria for process performance are defined | Process KPIs, acceptance criteria |
| Processes are controlled to meet criteria | Monitoring records, process audit logs |
| Documented information is retained as evidence of process control | Records register |
| Planned changes are controlled; unintended changes reviewed | Change management records |
| Outsourced processes are controlled | Vendor management policy, contracts |

**Auditor focus:** "Walk me through how you develop and deploy an AI system. Show me the process documentation and a recent example."

---

### 8.2 AI System Impact Assessment
**Requirement:** Conduct and document an impact assessment for AI systems within scope.

| Requirement | Evidence needed |
|---|---|
| Impact assessments have been conducted for all in-scope systems | Completed impact assessment documents |
| Assessment covers intended use, potential harms, affected parties | Assessment methodology / template |
| Assessment results inform design and operational decisions | Evidence of decisions made based on assessment |
| Assessments are updated when systems change significantly | Version history on assessment documents |

**Auditor focus:** This is a high-scrutiny item. Auditors will review actual completed assessments. Generic or template-only assessments will raise findings.

**Minimum contents of an AI System Impact Assessment:**
- System description and intended use
- Identification of affected stakeholders
- Potential harms (physical, psychological, financial, societal)
- Risk level determination
- Mitigation measures planned or implemented
- Residual risk acceptance
- Review trigger criteria

---

### 8.3 AI System Life Cycle
**Requirement:** AI systems are managed across their full lifecycle.

| Requirement | Evidence needed |
|---|---|
| Lifecycle stages are defined (design, development, testing, deployment, decommissioning) | Lifecycle policy or procedure |
| Controls are applied at each stage | Stage-gate checklists, review records |
| Criteria for moving between lifecycle stages are defined | Approval gates, review criteria |
| Decommissioning criteria and procedures are defined | Decommissioning procedure |

---

### 8.4 AI System Supply Chain
**Requirement:** Third-party AI components, tools, and services are managed.

| Requirement | Evidence needed |
|---|---|
| Third-party AI suppliers are identified | Supplier register |
| Supplier AI risk is assessed before procurement | Supplier assessment records |
| Contracts include AI-relevant requirements | Contract templates with AI clauses |
| Supplier performance is monitored | Supplier review records |

**Auditor focus:** "Do you use any third-party AI models or APIs? How do you assess their risk?"

---

## Clause 9 — Performance Evaluation

### 9.1 Monitoring, Measurement, Analysis, and Evaluation
**Requirement:** AIMS performance is measured against defined objectives.

| Requirement | Evidence needed |
|---|---|
| What to monitor and measure is defined | KPI register or monitoring plan |
| Methods for monitoring are valid and reliable | Measurement methodology document |
| When monitoring is performed is defined | Monitoring schedule |
| When results are analyzed is defined | Review schedule |
| Results are documented | Performance reports, dashboards |
| AI system performance metrics are tracked | System monitoring logs, dashboards |

**Auditor focus:** "Show me your AIMS performance data for the last quarter. What trends are you seeing?"

---

### 9.2 Internal Audit
**Requirement:** Internal audits are conducted at planned intervals.

| Requirement | Evidence needed |
|---|---|
| An audit programme exists with defined scope, frequency, and methods | Audit programme document |
| Auditors are selected to ensure objectivity | Audit assignment records |
| Audit results are reported to management | Audit reports |
| Nonconformities from audits are addressed | Corrective action records |
| Audit records are retained | Audit file |

**Auditor focus:** "Show me your internal audit programme and the last audit report. What nonconformities were found and how were they resolved?"

**Critical:** If no internal audits have been conducted, this is a major nonconformity for Stage 2.

---

### 9.3 Management Review
**Requirement:** Top management reviews the AIMS at planned intervals.

| Requirement | Evidence needed |
|---|---|
| Management reviews are conducted at defined intervals | Meeting schedule |
| Reviews cover: audit results, performance vs objectives, nonconformities, risks/opportunities, stakeholder feedback | Meeting minutes or management review report |
| Review outputs include decisions on improvement opportunities | Action items from review |
| Records of management reviews are retained | Signed minutes |

**Required inputs to management review:**
- Status of actions from previous reviews
- Changes in external/internal context
- AI objectives performance data
- Nonconformities and corrective actions status
- Audit results
- Interested party feedback
- Risks and opportunities

**Auditor focus:** "When was your last management review? Can I see the minutes? Did top management actually attend?"

---

## Clause 10 — Improvement

### 10.1 Continual Improvement
**Requirement:** The organization continually improves the suitability, adequacy, and effectiveness of the AIMS.

| Requirement | Evidence needed |
|---|---|
| Improvement activities are planned and tracked | Improvement register or log |
| Improvements are linked to AIMS objectives | Traceability from objective to improvement action |
| Improvements are evaluated for effectiveness | Post-implementation review records |

---

### 10.2 Nonconformity and Corrective Action
**Requirement:** Nonconformities are identified, controlled, and corrected.

| Requirement | Evidence needed |
|---|---|
| A process for handling nonconformities exists | Nonconformity procedure |
| Nonconformities are documented | Nonconformity register |
| Immediate containment actions are taken | Containment records |
| Root cause analysis is conducted | RCA records |
| Corrective actions are implemented | Action records |
| Effectiveness of corrective actions is verified | Verification records |
| Nonconformity register is maintained and reviewed | Register with closure dates |

**Auditor focus:** "Show me a recent nonconformity. Walk me through how it was handled. Was root cause identified? Has it recurred?"

**Nonconformity severity levels:**
- **Major nonconformity** — systematic failure; absence of required process; likely to result in failed audit
- **Minor nonconformity** — isolated failure; process exists but not followed consistently
- **Observation / opportunity for improvement** — not a failure, but a recommendation
