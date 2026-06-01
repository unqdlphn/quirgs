# NIST AI Risk Management Framework (AI RMF 1.0) — Compliance Reference

## Overview
The NIST AI RMF (January 2023) is a voluntary framework for managing AI risks throughout
the AI lifecycle. It is organized around four core functions and is widely adopted in US
federal contexts and enterprise risk programs.

---

## The Four Core Functions

| Function | Purpose | Key Activities |
|---|---|---|
| **GOVERN** | Establish policies, culture, accountability | Policies, roles, risk appetite, workforce training |
| **MAP** | Identify and classify AI risks | Context setting, risk identification, stakeholder impact |
| **MEASURE** | Analyze and assess risks | Testing, evaluation, bias analysis, uncertainty quantification |
| **MANAGE** | Prioritize and treat risks | Risk response plans, monitoring, incident handling |

---

## GOVERN — Key Questions

- Is there an AI risk governance policy in place and actively enforced?
- Are roles and responsibilities for AI risk clearly assigned?
- Is the organization's AI risk appetite documented?
- Has workforce training on AI risk been conducted?
- Is there a process for escalating AI risk concerns?
- Are third-party AI providers held to the same standards?

---

## MAP — Key Questions

- Is the AI system's purpose and context clearly defined?
- Have affected stakeholders (including vulnerable groups) been identified?
- Have potential harms — physical, psychological, financial, societal — been catalogued?
- Has the system been assessed for dual-use or misuse potential?
- Are the assumptions baked into the system documented and validated?
- Is the system's scope of deployment bounded and monitored?

---

## MEASURE — Key Questions

- Have quantitative and qualitative risk metrics been defined?
- Has the system been evaluated for fairness and bias across subgroups?
- Has the system's robustness to adversarial inputs been tested?
- Is there a documented uncertainty and confidence interval for model outputs?
- Have red-teaming or stress-testing exercises been conducted?
- Are evaluation results reproducible and auditable?

---

## MANAGE — Key Questions

- Is there a documented risk response plan (accept / mitigate / transfer / avoid)?
- Have residual risks been acknowledged and communicated to stakeholders?
- Is there a monitoring plan for drift, degradation, or changing risk conditions?
- Is there an incident response plan specific to AI failures?
- Have risk treatments been prioritized by impact and likelihood?
- Is there a decommissioning plan if the system needs to be retired?

---

## Reviewer Checklist Questions by Workflow Stage

### Design Stage
- GOVERN: Is there policy coverage for this type of AI system?
- MAP: Have all affected stakeholders been identified?
- MAP: Has the intended use and foreseeable misuse been documented?
- GOVERN: Are roles for this system's oversight assigned?

### Development Stage
- MAP: Are data provenance and lineage documented?
- MEASURE: Are evaluation criteria and success metrics defined upfront?
- GOVERN: Has the development team received AI risk training?

### Testing Stage
- MEASURE: Have bias and fairness evaluations been run?
- MEASURE: Has robustness testing (adversarial, edge cases) been conducted?
- MEASURE: Are uncertainty estimates available for model outputs?
- MEASURE: Have evaluation results been reviewed by an independent party?

### Deployment Stage
- MANAGE: Is a risk response plan finalized and communicated?
- MANAGE: Is a monitoring/alerting system live?
- MAP: Have downstream impacts on end users been re-evaluated pre-launch?
- GOVERN: Is there a named owner accountable for post-deployment risk?

### Post-Deployment Monitoring
- MANAGE: Is the system being monitored for drift or degradation?
- MANAGE: Have any incidents been logged and reviewed?
- MEASURE: Are periodic re-evaluations scheduled?
- GOVERN: Is the risk register being updated?

---

## Mandatory Sign-Off Questions

These represent the minimum bar across all four functions:

1. GOVERN: A named human is accountable for this system's risk posture.
2. MAP: All foreseeable harms — to users, third parties, and society — are documented.
3. MEASURE: Bias and fairness have been evaluated with results on record.
4. MANAGE: There is an active monitoring plan and an incident response owner.
5. MANAGE: Residual risks are documented and accepted by the appropriate authority.

---

## NIST AI RMF Profiles

The RMF supports **Organizational Profiles** (current state) and **Target Profiles** (desired state).
If your org has defined these, checklist questions should be scoped to the gap between them.

---

## Key Document References

| Document | Purpose |
|---|---|
| NIST AI RMF 1.0 | Core framework |
| NIST AI RMF Playbook | Suggested actions per subcategory |
| NIST SP 800-30 | Risk assessment guidance |
| NIST SP 800-37 | Risk management program integration |
| AI RMF Crosswalk | Mapping to ISO 42001, EU AI Act, and other frameworks |
