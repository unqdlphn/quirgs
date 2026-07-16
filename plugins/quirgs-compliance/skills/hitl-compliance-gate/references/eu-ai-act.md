# EU AI Act — Compliance Reference

## Overview
The EU Artificial Intelligence Act (2024) is a risk-based regulatory framework.
It classifies AI systems into four tiers and assigns obligations accordingly.

---

## Risk Tier Classification

| Tier | Definition | Examples |
|---|---|---|
| **Unacceptable** | Prohibited outright | Social scoring, real-time biometric surveillance in public, subliminal manipulation |
| **High-Risk** | Permitted with strict obligations | Hiring tools, credit scoring, medical diagnosis, law enforcement, critical infrastructure |
| **Limited Risk** | Transparency obligations only | Chatbots, deepfakes, emotion recognition (disclosure required) |
| **Minimal Risk** | No obligations | Spam filters, AI in video games |

---

## Key Obligations by Stage

> **Scope note — intentionally framework-level, non-dated.** The obligations below are organized by lifecycle stage, not by applicability date, so this gate checklist stays valid as EU AI Act deadlines shift. For current applicability dates — which obligations are in force, and when — use the **eu-ai-act-classifier** skill, whose high-risk reference tracks the post-Omnibus timeline. Treat those dates as provisional until the Digital Omnibus amending the Act is published in the Official Journal: the European Parliament adopted it 16 June 2026 and the Council 29 June 2026, but as of mid-July 2026 OJ publication (expected before 2 August 2026) is still pending.

### Design / Development Stage
- Conduct a **Fundamental Rights Impact Assessment** for high-risk systems
- Establish data governance policies (Article 10): training data must be relevant, representative, and free of errors
- Define the **intended purpose** and foreseeable misuse scenarios
- Implement human oversight mechanisms from the start (Article 14)

### Testing / Validation Stage
- Validate against the requirements of Article 9 (Risk Management System)
- Test for bias, accuracy, robustness, and cybersecurity (Article 15)
- Ensure the system behaves as described in technical documentation (Annex IV)
- Conduct real-world testing under Article 60 (regulatory sandboxes) if applicable

### Deployment Stage
- Complete **EU Declaration of Conformity** (Article 47) for high-risk systems
- Register in the **EU AI Act database** (Article 49) for high-risk systems
- Affix CE marking where required
- Provide users with clear instructions for use (Article 13): capabilities, limitations, human oversight info

### Post-Deployment / Monitoring Stage
- Implement a **post-market monitoring system** (Article 72)
- Log incidents and near-misses; report serious incidents to the market surveillance authority immediately, and no later than 15 days after becoming aware — 10 days for a death, 2 days for widespread or critical-infrastructure incidents (Article 73)
- Maintain technical documentation for 10 years (high-risk)
- Conduct periodic reviews when the system is substantially modified

---

## Reviewer Checklist Questions by Stage

### Design
- Is this system's risk tier correctly classified?
- Has a Fundamental Rights Impact Assessment been initiated?
- Is the intended purpose clearly documented and scoped?
- Are training data governance policies in place?
- Is human oversight designed into the system architecture?
- Are foreseeable misuse scenarios documented and mitigated?

### Testing
- Has the system been tested for bias across relevant demographic groups?
- Are accuracy and robustness metrics documented?
- Does the technical documentation (Annex IV) accurately reflect what was built?
- Have cybersecurity vulnerabilities been assessed?

### Deployment
- Has the EU Declaration of Conformity been completed?
- Has the system been registered in the EU AI Act database (if high-risk)?
- Do user-facing disclosures explain capabilities, limitations, and oversight mechanisms?
- For limited-risk systems: is the AI-generated nature clearly disclosed to end users?

### Monitoring
- Is the post-market monitoring plan active and assigned?
- Is there a process for logging and escalating incidents?
- Is the technical documentation up to date?
- Is there a trigger for re-assessment if the system is modified?

---

## Mandatory Sign-Off Questions (High-Risk Systems)

These must be confirmed before deployment:

1. Risk tier has been correctly assigned and documented.
2. Conformity assessment has been completed.
3. Human oversight mechanisms are operational — not just designed.
4. Users have been given compliant transparency notices.
5. Post-market monitoring system is in place and owned by a named person/team.

---

## Key Articles Quick Reference

| Article | Topic |
|---|---|
| Art. 6–7 | High-risk AI classification |
| Art. 9 | Risk management system |
| Art. 10 | Data governance |
| Art. 13 | Transparency and information |
| Art. 14 | Human oversight |
| Art. 15 | Accuracy, robustness, cybersecurity |
| Art. 47 | Declaration of conformity |
| Art. 49 | Registration |
| Art. 72–73 | Post-market monitoring and incident reporting |
