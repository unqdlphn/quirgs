# NIST AI RMF — MAP Function Reference

## Purpose
MAP establishes context and identifies risks. It answers: *What is this system, who does it
affect, and what can go wrong?* Good MAP work directly determines the quality of MEASURE
and MANAGE — you can only measure and manage risks you've identified.

---

## Categories and Subcategories

### MAP 1 — Context Is Established
The AI system's intended purpose, deployment context, and limitations are documented.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MP-1.1 | Intended purpose and use cases are documented | Design |
| MP-1.2 | Foreseeable misuse scenarios are identified | Design/development |
| MP-1.3 | System capabilities and limitations are documented | Development/testing |
| MP-1.4 | Assumptions underlying the system are made explicit | Design/development |
| MP-1.5 | Deployment environment is described (users, infrastructure, context) | Design/deployment |
| MP-1.6 | The system's scope of autonomous vs. human decision-making is defined | Design |

**Key reviewer questions:**
- Is there a system card, model card, or equivalent documentation?
- Are the assumptions baked into the model written down somewhere?
- Is it clear what the system is *not* supposed to do?

---

### MAP 2 — Scientific and Empirical Knowledge
Decisions are grounded in evidence, prior research, and relevant domain knowledge.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MP-2.1 | Relevant prior research and scientific literature has been reviewed | Design/development |
| MP-2.2 | Known failure modes for this type of AI are documented | Design/development |
| MP-2.3 | Empirical evidence supports design and architecture decisions | Development |
| MP-2.4 | Uncertainty about the system's behavior is acknowledged and documented | Development/testing |

**Key reviewer questions:**
- Has the team reviewed existing research on failure modes for this type of model?
- Are there known biases or limitations in the model family being used?
- Are confidence intervals or uncertainty estimates available?

---

### MAP 3 — AI Risks Are Identified
Potential harms are systematically identified across stakeholder groups.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MP-3.1 | Potential harms to individuals are identified (physical, psychological, financial) | Design/development |
| MP-3.2 | Potential harms to groups and communities are identified | Design/development |
| MP-3.3 | Potential societal and systemic harms are identified | Design |
| MP-3.4 | Environmental impacts are considered | Design |
| MP-3.5 | Dual-use potential (system could be weaponized or misused at scale) is assessed | Design/development |
| MP-3.6 | Harms are prioritized by likelihood and severity | Development |

**Key reviewer questions:**
- Is there a harm taxonomy or risk register for this system?
- Have low-probability, high-severity scenarios been considered (tail risks)?
- Has dual-use potential been explicitly assessed?

---

### MAP 4 — Risks Are Prioritized
Identified risks are ranked and resources allocated accordingly.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MP-4.1 | Risks are ranked by likelihood × impact | Development/testing |
| MP-4.2 | High-priority risks have assigned owners and treatment plans | Development |
| MP-4.3 | Risk prioritization has been reviewed by relevant stakeholders | Development/testing |
| MP-4.4 | Residual risks after treatment are documented | Deployment |

---

### MAP 5 — Impacts to Individuals and Groups
Stakeholder impacts are assessed with appropriate depth.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MP-5.1 | All affected stakeholders are identified (direct users, indirect, third parties) | Design |
| MP-5.2 | Vulnerable or marginalized groups are explicitly identified | Design |
| MP-5.3 | Stakeholder feedback has been collected (or a process exists to collect it) | Design/testing |
| MP-5.4 | Impacts on children, protected classes, or other sensitive groups are assessed | Design/testing |
| MP-5.5 | Differential impacts by demographic group are analyzed | Testing |

**Key reviewer questions:**
- Who are all the people who will be affected by this system — not just the intended users?
- Have any vulnerable populations been identified?
- Has anyone from the affected community been consulted?

---

## MAP Risk Signal Guide

| Signal | Posture |
|---|---|
| No system documentation, no harm inventory, no stakeholder map | 🔴 High |
| System purpose documented; stakeholders partially identified; limited harm analysis | 🟡 Moderate |
| Full documentation, harm taxonomy, stakeholder map, risks prioritized | 🟢 Low |
| Good design-stage MAP, but not updated post-testing | 🟡 Moderate |

---

## Playbook Actions — MAP Gaps

| Gap | Recommended action |
|---|---|
| No intended use documentation | Create a system card with purpose, scope, limitations, and assumptions |
| No harm taxonomy | Conduct a structured harm identification workshop; document outputs in a risk register |
| Stakeholders not identified | Map all affected parties; flag vulnerable groups for deeper assessment |
| Misuse not considered | Run a structured misuse scenario exercise (red team or tabletop) |
| Risks not prioritized | Apply a likelihood × impact matrix; assign owners to top-tier risks |
| No stakeholder feedback | Plan a community consultation or user research session |
