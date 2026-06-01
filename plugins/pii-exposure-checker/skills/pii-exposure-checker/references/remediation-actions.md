# PII Remediation Actions Reference

Remediation must be specific and proportionate to the risk. "Remove the data" is not
a remediation action — the specific technique, scope, and validation step must be named.

---

## Remediation Techniques by Category

### 1. Pseudonymization
Replace direct identifiers with a reversible token or code, retaining the ability to
re-link if necessary (e.g., for audit or legal hold).

**When to use:** When the data needs to be retained and linkable but direct identifiers
are not required for the AI system's function.

**How to implement:**
- Replace names, IDs, and contact details with a UUID or hash
- Maintain the mapping table in a separate, access-controlled system
- Use a rotating salt for hashing to prevent pre-computation attacks
- Document the pseudonymization scheme and who holds the mapping

**Example:** Replace `employee_name: "Jane Smith"` with `employee_ref: "f47ac10b-58cc"`.
The mapping table is held by the DPO with access logged.

**Limitations:** Pseudonymized data is still personal data under GDPR. It reduces
exposure risk but does not eliminate compliance obligations.

---

### 2. Anonymization
Remove or transform data such that re-identification is not reasonably possible, even
in combination with other available data. Truly anonymized data falls outside GDPR scope.

**When to use:** When the data element serves no necessary function in the AI system
and can be discarded permanently.

**How to implement:**
- Apply k-anonymity (ensure each combination of quasi-identifiers appears ≥ k times)
- Apply l-diversity or t-closeness for sensitive attributes
- Generalize specific values (e.g., exact age → age band, postcode → region)
- Suppress records that cannot be generalised without excessive information loss

**Validation required:** Anonymization must be tested for re-identification risk, not
just declared. Use a linkage attack test before treating data as anonymous.

**Caution:** Many datasets marketed as "anonymized" remain re-identifiable. Do not
assume anonymization is complete without testing.

---

### 3. Data Minimization
Remove data elements from the dataset that are not necessary for the AI system's
stated purpose. The first remediation question is always: "Do we need this at all?"

**When to use:** When a data element or field fails the necessity test — it is present
but cannot be justified as required for the model's function.

**How to implement:**
- Remove the field/column from the training dataset entirely
- If removing creates missing data problems, assess whether the model's purpose
  can be achieved without this feature
- Document the removal decision for Article 10(2) compliance
- Validate that model performance is not materially degraded (if performance drops
  significantly, reassess whether the data was necessary after all, and if so,
  establish proper legal basis)

---

### 4. Access Control and Separation
Restrict who can access personal data within the AI development pipeline.

**When to use:** When personal data must be retained for legitimate reasons but
exposure risk comes from overly broad access.

**How to implement:**
- Limit raw data access to data engineers with documented need-to-know
- Ensure model training environments cannot exfiltrate training data
- Implement role-based access controls with logging
- Separate training data storage from model artifact storage
- Ensure model outputs cannot reconstruct training data (model inversion risk)

**For training data specifically:**
- Use a secure, isolated training environment
- Log all access to raw training data
- Ensure model checkpoints and final weights are stored separately from training data

---

### 5. Output Filtering and Guardrails
Prevent personal data from appearing in model outputs.

**When to use:** When a generative or retrieval-based model may reproduce or infer
personal data from training data in its outputs.

**How to implement:**
- Apply a PII detection filter to model outputs before returning to users
  (tools: Presidio, AWS Comprehend, Google DLP, spaCy + custom rules)
- Block outputs that contain patterns matching known PII (emails, phone numbers,
  national ID formats, names in context)
- Test for training data memorization (Carlini et al. extraction attack test)
  and retrain or apply differential privacy if memorization is detected
- Log and review outputs that trigger PII filters for model improvement

---

### 6. Differential Privacy
Add calibrated statistical noise to training data or model gradients to provide
mathematical guarantees that the model cannot reveal information about specific individuals.

**When to use:** When the dataset contains sensitive personal data and there is risk
of training data memorization or membership inference attacks.

**How to implement:**
- Apply DP-SGD (differentially private stochastic gradient descent) during training
- Set privacy budget (ε) based on sensitivity of the data and acceptable utility loss
  — ε < 1 provides strong guarantees; ε = 10 provides weaker guarantees
- Use libraries: Google's DP library, OpenDP, PyTorch Opacus
- Document the privacy budget and its justification

**Trade-offs:** Differential privacy typically reduces model accuracy, particularly
for minority groups. This trade-off must be assessed and documented.

---

### 7. Purpose Limitation Enforcement
Ensure data collected for one purpose is not repurposed for AI training without
a documented justification and, where required, fresh consent or legal basis.

**When to use:** When training data was collected for a different primary purpose
(e.g., customer service records used to train a recommendation model).

**How to implement:**
- Document the original collection purpose and the proposed AI training purpose
- Assess compatibility under GDPR Article 6(4) (purpose compatibility test)
- If incompatible: obtain fresh consent, identify an alternative legal basis,
  or source different training data
- For Article 10 compliance: document the purpose limitation assessment

---

### 8. Data Retention and Deletion
Remove personal data that is no longer needed for its purpose.

**When to use:** When personal data in training sets has exceeded its retention period,
or when Article 10(3) special category data was used for bias correction and is no
longer needed.

**How to implement:**
- Define retention schedules for training data (not just operational data)
- Implement automated deletion pipelines for expired training data
- For special category data used under Article 10(3): delete immediately after
  bias correction is complete; document deletion
- Ensure deletion extends to backups, snapshots, and derived datasets
- Issue a certificate of destruction for high-sensitivity deletions

---

## Remediation Priority Decision Guide

| Finding | Recommended remediation |
|---|---|
| Direct identifier in training data, not needed as feature | Data minimization (remove) |
| Direct identifier needed for training linkage | Pseudonymization |
| Special category data present without Article 9(2) basis | Remove immediately; assess legal basis before re-introducing |
| Special category data for bias correction only | Access control + deletion plan |
| Quasi-identifiers enabling re-identification | Anonymization (k-anonymity or generalization) |
| PII in model outputs | Output filtering + memorization test |
| High memorization risk for sensitive training data | Differential privacy |
| Data collected for different original purpose | Purpose limitation enforcement |
| Data beyond retention period | Deletion pipeline |
| Overly broad access to raw personal data | Access control and separation |
