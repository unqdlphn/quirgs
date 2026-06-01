# NIST AI RMF — GOVERN Function Reference

## Purpose
GOVERN establishes the policies, culture, processes, and accountability structures that
shape how an organization approaches AI risk across all other functions. It is foundational —
if GOVERN is weak, MAP/MEASURE/MANAGE will be inconsistent or ignored.

---

## Categories and Subcategories

### GOVERN 1 — Policies, Processes, Procedures, and Practices
AI risk policies are established, communicated, and enforced.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-1.1 | Organizational policies exist for AI risk management | All stages |
| GV-1.2 | Policies address the full AI lifecycle | Design onward |
| GV-1.3 | Policies include human oversight requirements | Development onward |
| GV-1.4 | AI risk tolerance / appetite is documented | All stages |
| GV-1.5 | Policies are reviewed and updated periodically | All stages |
| GV-1.6 | Policies address third-party / supply chain AI risks | Development onward |
| GV-1.7 | AI-specific incident response policy exists | Deployment onward |

**Key reviewer questions:**
- Can anyone point to a current, approved AI risk policy document?
- Does it cover this specific type of AI system?
- When was it last reviewed?

---

### GOVERN 2 — Accountability
Roles and responsibilities for AI risk are clearly defined and owned.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-2.1 | Roles and responsibilities for AI risk management are defined | All stages |
| GV-2.2 | A named individual or body is accountable for AI risk outcomes | All stages |
| GV-2.3 | AI developers, deployers, and operators have documented responsibilities | Development onward |
| GV-2.4 | Accountability extends to third-party AI vendors/partners | Procurement / development |

**Key reviewer questions:**
- Who is the named owner of this AI system's risk posture?
- Is there a cross-functional AI governance body (e.g., AI review board)?
- Are vendor contracts specifying AI risk responsibilities?

---

### GOVERN 3 — Workforce and Culture
AI risk culture is cultivated through training, awareness, and psychological safety.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-3.1 | AI risk training is provided to relevant staff | All stages |
| GV-3.2 | Training is role-specific (not one-size-fits-all) | All stages |
| GV-3.3 | Staff feel safe raising AI risk concerns (psychological safety) | All stages |
| GV-3.4 | Leadership models responsible AI behavior | All stages |

**Key reviewer questions:**
- Have the people building/deploying this system received AI risk training?
- Is there a formal channel for raising AI risk concerns?
- Has leadership communicated the importance of responsible AI?

---

### GOVERN 4 — Organizational Teams
Diverse teams with relevant expertise are involved in AI risk decisions.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-4.1 | AI risk decisions involve multidisciplinary teams | Design onward |
| GV-4.2 | Teams include domain experts, ethicists, affected-community representatives where relevant | Design/testing |
| GV-4.3 | Diversity and inclusion considerations are built into team composition | Design onward |

**Key reviewer questions:**
- Who is in the room making decisions about this system?
- Are affected communities or their proxies represented?

---

### GOVERN 5 — Policies and Processes for Advancement of AI Risk Management
Risk management processes are prioritized and resourced.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-5.1 | Resources (budget, tools, time) are allocated to AI risk management | All stages |
| GV-5.2 | AI risk management is integrated into project planning and milestones | All stages |
| GV-5.3 | AI risk management outcomes are monitored at the organizational level | All stages |

---

### GOVERN 6 — Policies for Engagement with AI Risks from Third Parties
Third-party AI risks are systematically managed.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| GV-6.1 | Third-party AI providers are assessed before procurement | Procurement |
| GV-6.2 | Contracts include AI risk and accountability clauses | Procurement |
| GV-6.3 | Third-party AI systems are monitored post-deployment | Deployment onward |

---

## Documentation Cards Task Group — GOVERN Alignment Note

The NIST Artificial Intelligence Consortium (formerly the AI Safety Institute Consortium) has formally established a **Documentation Cards** task group under its reorganised structure. This group directly validates the documentation practices assessed under the GOVERN function — particularly model cards, system cards, and transparency disclosures required by GV-1.1, GV-1.2, and the transparency dimension of MS-2.8.

When a U.S. federal stakeholder or auditor questions the rationale for documentation card practices, reference the Documentation Cards task group as NIST's own formalised recognition that structured AI documentation is a governance requirement, not a best-practice option. This alignment also strengthens the case for using the `ai-transparency-writer` skill output as GOVERN-compliant documentation evidence.

---

## GOVERN Risk Signal Guide

| Signal | Posture |
|---|---|
| No AI policy exists, no named owner, no training | 🔴 High |
| Policy exists but is outdated or not enforced; roles unclear | 🟡 Moderate |
| Policy is current, roles assigned, training conducted | 🟢 Low |
| Policy exists but gaps in 3rd-party or incident coverage | 🟡 Moderate |

---

## Playbook Actions — GOVERN Gaps

| Gap | Recommended action |
|---|---|
| No AI policy | Draft an AI risk policy aligned to NIST AI RMF; assign an owner and review cycle |
| No named risk owner | Assign an AI risk lead; define escalation path to executive leadership |
| No training | Conduct role-specific AI risk training; document completion |
| No third-party controls | Add AI risk clauses to vendor contracts; build a vendor AI risk register |
| No incident policy | Draft an AI-specific incident response procedure referencing NIST SP 800-61 |
