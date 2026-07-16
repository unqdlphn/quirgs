# NIST SP 800-61 — Computer Security Incident Handling Guide (AI Context)

## Overview

NIST SP 800-61 Rev. 2 defines four phases of incident response. This reference adapts
those phases for AI system incidents, where failures often involve model behaviour,
data quality, or algorithmic outputs rather than traditional cybersecurity events.

---

## Phase 1 — Preparation

Preparation happens before incidents occur. For AI systems, preparation includes:

**Incident response plan elements:**
- Defined incident classification criteria (what constitutes an AI incident vs. normal variability)
- Designated incident response team with clear roles (incident commander, technical lead, legal, DPO, communications)
- Pre-agreed escalation paths (who decides if an incident is "serious" under Article 73)
- Contact list for national market surveillance authorities (for EU high-risk AI systems)
- Logging and monitoring in place to detect incidents (Article 12 EU AI Act: logs must enable post-hoc review)
- Template incident reports (this skill) ready for immediate use

**AI-specific preparation items:**
- Baseline performance metrics established (enables detection of performance degradation)
- Known failure modes documented (from pre-deployment testing)
- Kill switch / suspension procedure defined and tested
- Training data and model version records maintained (needed for root cause investigation)
- Contact details for upstream model providers (if using third-party GPAI models)

---

## Phase 2 — Detection and Analysis

**Detection sources for AI incidents:**
- User complaints or reports (most common for bias and harmful output incidents)
- Automated output monitoring (PII filters, toxicity classifiers, anomaly detection)
- Internal quality review
- Regulatory notification (regulator or supervisory authority flags an issue)
- Media or public reporting
- Whistleblower

**Analysis tasks:**
1. **Confirm the incident** — distinguish genuine failure from expected model variability
2. **Characterise the failure** — what type of incident is this?
   - Harmful or discriminatory output
   - Privacy breach (PII in output, training data exposure)
   - Safety failure (incorrect output in high-stakes context)
   - Performance degradation (accuracy, fairness metrics outside acceptable range)
   - Unauthorised access or model extraction
   - Data poisoning or adversarial attack
3. **Scope the impact** — how many individuals, what decisions, what downstream effects
4. **Preserve evidence** — log the triggering inputs and outputs; snapshot model version and configuration
5. **Initial severity assessment** — apply Article 73 threshold check (see `references/article-73-thresholds.md`)

**Evidence to collect and preserve:**
- Input that triggered the failure (text, image, structured data)
- System output that constituted the failure
- Timestamp and session/request ID
- Model version, configuration, and deployment parameters at time of incident
- Logs covering the incident window (Article 12 EU AI Act logs)
- Any human override or review activity at the time
- Downstream actions taken based on the AI output

---

## Phase 3 — Containment, Eradication, and Recovery

### Containment
Prevent the incident from causing further harm while the investigation continues.

**Short-term containment options (choose based on severity):**
- **Full suspension** — take the AI system offline entirely (appropriate for serious harm incidents)
- **Feature limitation** — disable the specific capability that failed (e.g., disable a specific output type)
- **Enhanced human review** — require human sign-off on all AI outputs until root cause is resolved
- **Input filtering** — block the class of inputs that triggered the failure
- **Output filtering** — add a temporary filter to catch the class of outputs that caused harm

**Containment decision factors:**
- Severity and ongoing risk of harm
- Operational impact of suspension
- Whether the failure is reproducible or appears to be a one-time event
- Regulatory obligations (Article 73 serious incidents may require suspension)

### Eradication
Address the root cause so the incident cannot recur.

**Common AI incident root causes and eradication approaches:**

| Root cause | Eradication approach |
|---|---|
| Training data bias | Dataset audit, resampling, or reweighting; retrain model |
| Model memorization of PII | Differential privacy, data scrubbing, model retrain |
| Prompt injection / adversarial input | Input validation, adversarial training, output guardrails |
| Distributional shift (deployment context changed) | Retrain on current data; update monitoring thresholds |
| Integration error (AI output misinterpreted downstream) | Fix downstream system; add output validation |
| Human oversight failure (AI output acted on without review) | Process redesign; mandatory review gate |
| Third-party model update changed behaviour | Evaluate update; roll back or re-evaluate supplier |

### Recovery
Restore normal operation with confidence the root cause is addressed.

**Recovery checklist:**
- [ ] Root cause confirmed and eradicated
- [ ] Fix tested in staging environment with the class of inputs that caused the failure
- [ ] Affected individuals notified (if required)
- [ ] Monitoring enhanced to detect recurrence
- [ ] Regulatory notification completed (if required)
- [ ] Decision to resume operation documented and signed off by incident commander
- [ ] Post-incident review scheduled

---

## Phase 4 — Post-Incident Activity

**Post-incident review (lessons learned meeting):**
Schedule within 2 weeks of incident resolution. Document:

1. **Timeline reconstruction** — precise chronology from first occurrence to resolution
2. **Root cause analysis** — confirmed technical or operational cause
3. **Contributing factors** — conditions that allowed the incident to occur or escalate
4. **Detection gap** — why wasn't this caught earlier? (testing, monitoring, or process gap)
5. **Response assessment** — what worked well, what didn't in the response
6. **Improvements** — specific, assigned actions to prevent recurrence
7. **Policy updates** — whether incident response plan, monitoring thresholds, or governance policies need revision

**Documentation outputs from post-incident review:**
- Completed Section 9 of the incident report (lessons learned)
- Updated known failure modes register
- Updated monitoring thresholds (if detection gap identified)
- Action register with owners and due dates

**Retention:**
Incident reports should be retained for at least the period required by applicable regulation.
For EU AI Act high-risk systems: logs must be kept for the period set by the relevant
sectoral regulation, or a minimum of 6 months where no sectoral requirement applies (Article 12(1)).

---

## AI Incident Severity Classification

Use this table to determine initial severity and response urgency:

| Severity | Criteria | Response timeline |
|---|---|---|
| 🔴 **CRITICAL** | Death or serious physical harm; serious fundamental rights breach; Article 73 serious incident threshold met | Immediate response; legal notified within hours; regulatory notification within 15 days (10 days for death; 2 days for widespread infringement or critical-infrastructure disruption) |
| 🔴 **URGENT** | Significant harm to individuals; ongoing failure affecting many users; GDPR breach likely | Response within 24 hours; legal notified same day |
| 🟡 **ELEVATED** | Limited harm; isolated failure; no ongoing risk; potential compliance issue | Response within 72 hours; legal informed |
| 🟢 **STANDARD** | No harm; performance degradation; process failure without external impact | Response within 5 working days; tracked in incident log |
