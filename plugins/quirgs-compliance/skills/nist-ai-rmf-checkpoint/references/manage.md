# NIST AI RMF — MANAGE Function Reference

## Purpose
MANAGE prioritizes and responds to AI risks identified in MAP and measured in MEASURE.
It answers: *What are we going to do about it?* MANAGE covers risk treatment decisions,
incident response, ongoing monitoring, and the processes for retiring or modifying systems.

---

## Categories and Subcategories

### MANAGE 1 — Risk Treatment
Identified risks are responded to with documented, prioritized treatments.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MG-1.1 | A risk response plan exists for identified AI risks | Development/deployment |
| MG-1.2 | Risk treatments are selected (mitigate / transfer / accept / avoid) | Development |
| MG-1.3 | Risk treatment decisions are documented with rationale | Development |
| MG-1.4 | Residual risks are documented after treatment | Deployment |
| MG-1.5 | Residual risks are accepted by an appropriate authority | Deployment |
| MG-1.6 | Decommissioning criteria are defined (when to shut the system down) | Design/deployment |

**Key reviewer questions:**
- For every identified high-priority risk: what has been decided — mitigate, accept, avoid, or transfer?
- Who authorized the acceptance of residual risk?
- What would cause this system to be taken offline?

**Risk treatment options:**
- **Mitigate** — implement controls to reduce likelihood or impact
- **Transfer** — shift risk to another party (insurance, vendor SLA)
- **Accept** — acknowledge risk and proceed with awareness
- **Avoid** — change the system design or discontinue the feature

---

### MANAGE 2 — Monitoring and Review
Risk posture is monitored continuously and reviewed on a defined schedule.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MG-2.1 | A monitoring plan is active and includes defined KPIs | Deployment/monitoring |
| MG-2.2 | Monitoring covers model performance, data drift, and user outcomes | Monitoring |
| MG-2.3 | Monitoring results are reviewed on a defined schedule | Monitoring |
| MG-2.4 | Monitoring findings are reported to accountable stakeholders | Monitoring |
| MG-2.5 | The risk register is updated based on monitoring findings | Monitoring |
| MG-2.6 | Changes in deployment context trigger a risk re-assessment | Monitoring |

**Key reviewer questions:**
- Who receives the monitoring reports, and how often?
- What happens when a KPI threshold is breached?
- Is there a process for updating the risk register when new risks emerge post-deployment?

---

### MANAGE 3 — Incident Response
AI-specific incidents are detected, reported, and resolved.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MG-3.1 | An AI-specific incident response plan exists | Deployment |
| MG-3.2 | Incident response roles and responsibilities are defined | Deployment |
| MG-3.3 | Incidents are logged, classified, and tracked | Deployment/monitoring |
| MG-3.4 | Root cause analysis is conducted for significant incidents | Monitoring |
| MG-3.5 | Incident learnings are fed back into the risk management process | Monitoring |
| MG-3.6 | External reporting obligations (regulatory, contractual) are met | Deployment/monitoring |

**Key reviewer questions:**
- If this system produces a harmful output tomorrow, who do you call?
- Is there a playbook for the most likely failure modes?
- Are there regulatory reporting requirements if a serious AI incident occurs?

**AI Incident Classifications:**
- **Level 1 — Near miss**: potential harm, no actual impact; log and investigate
- **Level 2 — Limited impact**: small number of users affected; contained response
- **Level 3 — Significant impact**: material harm to individuals or groups; escalate
- **Level 4 — Critical**: widespread or severe harm; leadership + regulatory notification

---

### MANAGE 4 — Risk Response Improvement
Risk management processes are continually improved.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MG-4.1 | Lessons learned from incidents and monitoring feed back into governance | Monitoring |
| MG-4.2 | Risk management processes are reviewed periodically | All stages |
| MG-4.3 | Improvements to risk management are tracked and validated | All stages |
| MG-4.4 | Knowledge gained is shared across teams (and externally where appropriate) | All stages |

---

## MANAGE Risk Signal Guide

| Signal | Posture |
|---|---|
| No risk response plan; no monitoring; no incident process | 🔴 High |
| Risk plan exists but incomplete; monitoring inconsistent; no incident playbook | 🟡 Moderate |
| Documented risk treatments; live monitoring; tested incident response | 🟢 Low |
| Good treatment and monitoring but no feedback loop to improve governance | 🟡 Moderate |

---

## Playbook Actions — MANAGE Gaps

| Gap | Recommended action |
|---|---|
| No risk response plan | Create a risk register with treatment decisions, owners, and timelines for each identified risk |
| Residual risk not accepted | Convene a risk acceptance meeting; document decisions and signatories |
| No monitoring plan | Define KPIs, thresholds, and review cadence; assign a monitoring owner |
| No incident response plan | Adapt NIST SP 800-61 for AI; define roles, severity levels, escalation paths |
| No root cause analysis process | After any Level 2+ incident, require a structured RCA and track remediation |
| No decommissioning plan | Define explicit criteria for system retirement; include in system documentation |
| No feedback loop | Schedule quarterly risk register reviews with the AI governance body |

---

## Risk Register Template (Minimal)

For each identified risk, capture:

| Field | Description |
|---|---|
| Risk ID | Unique identifier (e.g., R-001) |
| Description | Plain-language description of the risk |
| Function origin | MAP subcategory that identified it |
| Likelihood | Low / Medium / High |
| Impact | Low / Medium / High |
| Priority | Likelihood × Impact |
| Treatment | Mitigate / Transfer / Accept / Avoid |
| Controls | What is being done |
| Residual risk | Risk remaining after controls |
| Owner | Named individual responsible |
| Review date | When this entry is next reviewed |
