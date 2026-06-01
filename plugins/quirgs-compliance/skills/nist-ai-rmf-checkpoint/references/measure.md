# NIST AI RMF — MEASURE Function Reference

## Purpose
MEASURE analyzes and quantifies AI risks identified during MAP. It answers:
*How bad is it, really? How do we know?* MEASURE turns qualitative risk awareness into
evidence-based assessments using testing, evaluation, and monitoring.

---

## Categories and Subcategories

### MEASURE 1 — Approaches to Measure AI Risks
Methods and metrics for evaluating AI risks are selected and documented.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MS-1.1 | Evaluation approaches are selected and justified for this system | Development/testing |
| MS-1.2 | Metrics for measuring trustworthiness characteristics are defined | Development |
| MS-1.3 | Methods for measuring uncertainty and confidence are in place | Development/testing |
| MS-1.4 | Evaluation methods are appropriate for the deployment context | Testing |
| MS-1.5 | Evaluation plans are documented before testing begins | Testing |

**Key reviewer questions:**
- What specific metrics will be used to declare the system safe/acceptable?
- Are success criteria defined before testing, not after?
- Is uncertainty quantification built into the output?

---

### MEASURE 2 — Trustworthiness Characteristics Are Evaluated
The system is assessed across all relevant AI trustworthiness properties.

| ID | Subcategory | Property | Lifecycle relevance |
|---|---|---|---|
| MS-2.1 | Accuracy and performance are evaluated | Accuracy | Testing |
| MS-2.2 | Bias and fairness are evaluated across demographic groups | Fairness | Testing |
| MS-2.3 | Explainability and interpretability are assessed | Explainability | Testing |
| MS-2.4 | Privacy risks to training/inference data are assessed | Privacy | Dev/testing |
| MS-2.5 | Robustness to adversarial inputs is tested | Robustness | Testing |
| MS-2.6 | Security vulnerabilities are assessed | Security | Dev/testing |
| MS-2.7 | Reliability and availability under real-world conditions are tested | Reliability | Testing |
| MS-2.8 | Transparency documentation (model card, system card) is complete | Transparency | Testing |
| MS-2.9 | Human oversight mechanisms are verified to work as designed | Oversight | Testing |
| MS-2.10 | Safety properties specific to the deployment domain are tested | Safety | Testing |

**Key reviewer questions:**
- Has bias been tested across all relevant demographic groups (race, gender, age, disability)?
- Can the system's outputs be explained to affected individuals?
- What happens when the system encounters inputs it wasn't trained on?

---

### MEASURE 3 — External Expertise
Independent or external review is used where internal capacity is limited.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MS-3.1 | External auditors or red teams have reviewed the system | Testing/deployment |
| MS-3.2 | Third-party evaluations are conducted for high-risk systems | Testing |
| MS-3.3 | Community or domain expert input has been incorporated | Testing |
| MS-3.4 | Evaluation results are shared with relevant stakeholders | Testing/deployment |

**Key reviewer questions:**
- Has anyone outside the development team evaluated this system?
- For high-stakes applications: has an independent audit been commissioned?

---

### MEASURE 4 — Feedback Loops
Risk metrics are monitored continuously and inform ongoing improvement.

| ID | Subcategory | Lifecycle relevance |
|---|---|---|
| MS-4.1 | Performance metrics are monitored post-deployment | Deployment/monitoring |
| MS-4.2 | Drift detection is in place (model drift, data drift, concept drift) | Monitoring |
| MS-4.3 | User feedback and complaints are collected and analyzed | Monitoring |
| MS-4.4 | Evaluation results feed back into system improvements | Monitoring |
| MS-4.5 | Re-evaluation is triggered when performance degrades or context changes | Monitoring |

**Key reviewer questions:**
- Is there an alerting system for when model performance drops?
- Is user feedback being systematically collected and reviewed?
- What triggers a re-evaluation of the system?

---

## Trustworthiness Properties Quick Reference

These are the eight core trustworthiness characteristics from the AI RMF:

| Property | Definition | Primary test types |
|---|---|---|
| **Accuracy** | Outputs are correct relative to ground truth | Benchmark evaluation, holdout testing |
| **Fairness** | Performance is equitable across groups | Disaggregated metrics, disparity analysis |
| **Explainability** | Outputs can be interpreted and understood | Feature attribution, saliency maps, LIME/SHAP |
| **Privacy** | Data is protected throughout the lifecycle | Data audits, differential privacy checks |
| **Robustness** | System handles edge cases and adversarial inputs | Adversarial testing, stress testing, fuzzing |
| **Security** | System resists attacks and unauthorized access | Penetration testing, threat modeling |
| **Reliability** | System performs consistently under real-world conditions | Load testing, uptime monitoring |
| **Transparency** | System's design and behavior are documented and understandable | Documentation review, model cards |

---

## MEASURE Risk Signal Guide

| Signal | Posture |
|---|---|
| No formal evaluation; no bias testing; no metrics defined | 🔴 High |
| Basic accuracy metrics; no fairness or robustness testing | 🟡 Moderate |
| Comprehensive evaluation across all relevant properties; external review | 🟢 Low |
| Strong pre-deployment testing but no post-deployment monitoring | 🟡 Moderate |

---

## Playbook Actions — MEASURE Gaps

| Gap | Recommended action |
|---|---|
| No evaluation plan | Define success metrics and evaluation criteria before testing |
| No bias/fairness testing | Run disaggregated performance analysis by key demographic groups |
| No robustness testing | Conduct adversarial testing and edge-case stress tests |
| No explainability | Implement post-hoc explanation methods (SHAP, LIME); document for affected users |
| No drift detection | Deploy monitoring with alerts for data drift, model drift, and performance degradation |
| No external review | Commission an independent audit or red team exercise |
| No user feedback loop | Implement a feedback mechanism and assign someone to triage reports |
