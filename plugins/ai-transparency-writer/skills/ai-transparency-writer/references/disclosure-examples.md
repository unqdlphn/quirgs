# Disclosure Language Examples

A library of worked example language for common AI transparency disclosure scenarios.
Use these as starting points — adapt the specifics to the actual system and context.
Generic boilerplate copied verbatim will not satisfy Article 13 or NIST requirements.

---

## EU AI Act Article 13 — Example Notices

### Example 1: HR Recruitment Screening Tool (Deployer Notice)

**Context:** An employer uses an AI system to screen CVs and rank candidates. Affected
individuals are job applicants. The employer is the deployer; a third-party vendor
built the system.

---

**AI SYSTEM TRANSPARENCY NOTICE**

Acme Corporation uses an AI-assisted tool in the initial stage of our recruitment process.
This notice explains how the system works and what rights you have.

**What the system does.** When you submit an application, our AI system analyses your CV
and cover letter and produces a relevance score based on the requirements of the role you
applied for. This score helps our HR team prioritise applications for human review.

**Who reviews the AI output.** No application is accepted or rejected based solely on
the AI's score. A member of our HR team reviews all applications that meet the minimum
criteria for the role, including cases where the AI score is borderline. Our HR team
can and does override the system's ranking.

**Limitations you should know about.** The system was trained primarily on successful
hires from 2015–2023. It may not fully reflect the value of non-traditional career paths,
career breaks, or qualifications from institutions outside the UK and US. If you believe
your application may not have been assessed fairly, you can request a manual review.

**Your rights.** You have the right to:
- Request that a human review your application without the AI score influencing the outcome
- Ask what information the AI system used to assess your application
- Lodge a complaint if you believe the system treated you unfairly

To exercise any of these rights, contact: recruitment-rights@acmecorp.com or
+44 20 7XXX XXXX (Monday–Friday, 09:00–17:00 GMT).

This system has been assessed as high-risk under the EU AI Act. Our data protection
officer can be reached at dpo@acmecorp.com.

---

### Example 2: Credit Scoring System (Deployer Notice — Financial Services)

**Context:** A bank deploys an AI credit scoring model to support loan decisions.

---

**AI SYSTEM TRANSPARENCY NOTICE**

FirstBank uses an automated AI system to help assess applications for personal loans
and credit products. This notice explains how we use this system and your rights.

**How AI is used in credit decisions.** When you apply for a loan or credit product,
our AI system analyses the information you provide, along with credit reference data
where you have consented, and produces a creditworthiness score. This score is one
factor our underwriters consider when making a lending decision.

**Human involvement.** All lending decisions are made by qualified underwriters, not by
the AI system alone. The AI score informs — it does not determine — the final decision.
In cases where the AI score is near our approval threshold, additional manual review
is automatically triggered.

**What the system considers.** The AI uses information including: income and employment
data, existing credit commitments, repayment history (where you have consented to a
credit check), and the amount and term of the product you are applying for. It does not
use protected characteristics such as race, religion, or disability status.

**Known limitations.** The model performs best for applicants with at least 24 months
of credit history in the UK. If you are newly arrived in the UK or have a limited
credit history, your application will be reviewed by a senior underwriter regardless
of the AI score.

**Your rights.** You have the right to request that a human underwriter review your
application without the AI score. If your application is declined, you can request
an explanation of the decision and challenge it. Contact: lending-decisions@firstbank.co.uk.

---

### Example 3: Medical Triage Support Tool (Provider Instructions for Use — Excerpt)

**Context:** A software provider supplies a symptom-checker and triage support tool to
NHS trusts. This is an excerpt from the provider's instructions for use, directed at
deployer clinicians and trust administrators.

---

**Intended use.** MedAssist Triage is designed to support — not replace — triage nurses
and emergency department staff in prioritising patient acuity during initial assessment.
It is intended for use only by trained clinical staff as a decision-support tool. It
must not be used as the sole basis for determining clinical priority.

**Performance.** MedAssist Triage achieved 87% agreement with consultant triage decisions
on a held-out evaluation dataset of 12,400 adult ED presentations (UK, 2020–2023).
Performance is lower for paediatric presentations (73% agreement) and for patients
presenting with primarily psychiatric symptoms (68% agreement). Do not use this system
as the primary triage tool for patients under 16 or for mental health crisis presentations.

**Required human oversight.** A registered nurse or clinician must review and confirm or
override every triage recommendation before it is acted upon. The system does not have
the ability to initiate clinical actions; all outputs are recommendations only.

**What to do when the system flags uncertainty.** When MedAssist displays a low-confidence
indicator (yellow or red banner), the presenting clinician must conduct a full manual
triage assessment. Do not rely on the AI recommendation in these cases.

---

## NIST AI RMF Model Card — Example Sections

### Example: Intended Use Section (Hiring Recommendation Tool)

**Primary intended use cases:**
- Supporting HR professionals in shortlisting candidates for professional roles (grades 5–9)
  at organisations with more than 500 employees
- Producing ranked candidate lists for human review in high-volume recruitment campaigns

**Intended users:**
HR professionals and talent acquisition specialists with at least six months of experience
in the organisation's recruitment processes. The system is not designed for use by
hiring managers without HR oversight, or by recruitment agencies operating outside the
deploying organisation.

**Out-of-scope uses:**
- Executive hiring (roles above grade 9) — the system was not evaluated for senior leadership selection
- Hiring for regulated professions (healthcare, legal, education) — sector-specific requirements
  apply that this system does not account for
- Any use that results in a hiring decision without human review of AI output

**Foreseeable misuse:**
The system's ranking output may create pressure to accept the AI's ranking without
adequate human review. Deployers must implement procedural controls (see Section 7)
to ensure ranked lists are treated as a starting point, not a final decision.

---

### Example: Risks and Limitations Section (Credit Scoring Model)

**Identified risks:**

1. *Geographic bias.* The model was trained predominantly on applicants from urban areas.
   Performance on rural applicants with atypical income patterns (e.g., seasonal or
   agricultural income) is lower. Estimated false-decline rate for this group is 12%
   higher than the overall population average.

2. *Thin-file applicants.* Individuals with fewer than 12 months of credit history
   receive scores with wider confidence intervals. A manual underwriting review is
   triggered automatically for all thin-file applicants.

3. *Concept drift.* The model was last retrained in Q3 2024. Significant changes in
   macroeconomic conditions (interest rates, unemployment) may reduce the model's
   predictive accuracy over time. Quarterly performance monitoring is in place with
   a threshold that triggers mandatory retraining.

**Mitigations in place:**
- All decisions within 5 percentage points of the approval threshold are referred
  for manual review
- Disaggregated performance monitoring by age band, geography, and credit-file length
  is reviewed quarterly by the model risk team
- An independent bias audit is conducted annually by [auditor name]

**Residual risks:**
Despite mitigations, the model may reflect historical lending disparities present in
training data. Applicants who believe they have been treated unfairly may request a
manual review (see Section 7).

---

## Language Patterns to Use and Avoid

### Use
- "The AI system produces a recommendation. A qualified [role] reviews this before any decision affecting you."
- "The system performs less accurately for [specific group] — in these cases, [specific safeguard applies]."
- "You have the right to [specific right] by contacting [specific contact]."
- "The AI analyses [specific data types] to produce [specific output type]."

### Avoid
- "Our AI may make mistakes." (too vague to be useful or compliant)
- "The system uses advanced machine learning algorithms." (jargon, not informative)
- "AI-assisted decisions are subject to human review." (passive — who reviews, when, how?)
- "We take privacy seriously." (assertion without substance)
- "Results may vary." (not a transparency disclosure)
