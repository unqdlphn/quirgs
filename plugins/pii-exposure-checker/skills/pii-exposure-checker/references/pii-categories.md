# PII Categories Reference — GDPR and EU AI Act

## GDPR Personal Data (Article 4)

Personal data is any information relating to an identified or identifiable natural person.
"Identifiable" means directly or indirectly — a person doesn't need to be named for data
to be personal data.

### Direct Identifiers (🔴 High Risk by default)
Data that identifies a person on its own:
- Full name
- National identity / social security number
- Passport or driving licence number
- Email address (personal)
- Phone number (personal)
- Precise home address
- Biometric data used for unique identification (fingerprint, face scan, iris scan, voiceprint)
- IP address (where linkable to an individual — CJEU Breyer case)
- Device ID / cookie ID (where linkable)
- Employee ID (in combination with name or contact data)

### Indirect Identifiers (🟡 Medium Risk — assess in combination)
Data that can identify a person when combined with other elements:
- Date of birth
- Postcode / zip code (especially rural areas)
- Gender
- Job title and employer name
- General location (city / region)
- Account numbers (without credentials)
- Vehicle registration number
- Educational or professional qualifications (in combination)

### Quasi-identifiers (🟢 Low Risk individually — 🟡 Medium Risk in combination)
Data that individually seems innocuous but can enable re-identification:
- Age band / age range
- Salary band / income range
- Department or team name
- Broad geographic region
- Languages spoken
- General professional field

**Note on combination risk:** Three or more quasi-identifiers together can uniquely identify
an individual in many datasets (Latanya Sweeney's research shows zip code + date of birth +
gender uniquely identifies ~87% of Americans). Always assess fields in combination, not isolation.

---

## GDPR Special Category Data (Article 9) — 🔴 Always High Risk

Special category data requires explicit legal basis (Article 9(2)) and is subject to
stricter controls. Flag immediately whenever found in AI training data or inputs:

- **Racial or ethnic origin** — including proxy variables (name origin analysis, geographic
  proxies for ethnicity, dialect data)
- **Political opinions** — voting records, political affiliation, expressed political views
- **Religious or philosophical beliefs** — including inferred religion from name, cultural practices
- **Trade union membership** — employment records, union subscription data
- **Genetic data** — DNA profiles, genetic test results
- **Biometric data processed for unique identification** — facial recognition templates,
  fingerprint templates (note: raw biometric images are not automatically special category
  unless processed for identification)
- **Health data** — medical records, diagnoses, prescriptions, disability status, fitness data,
  mental health data, pregnancy data
- **Sex life or sexual orientation** — explicit data or inferred via proxy variables

### Proxy Variables — Particular Concern for AI Training Data
AI models can learn to infer special category data from non-special category inputs.
Flag these as requiring review even if not technically special category data:
- First name + surname combinations (can be used to infer ethnicity or religion)
- Postcode in combination with demographic data (ethnicity proxy)
- Shopping/consumption data (dietary patterns may reveal religion)
- Social network connections (political opinion, sexual orientation inference)
- Search history or browsing data
- Facial images (can be processed to infer race, health, emotion)

---

## EU AI Act-Specific Data Flags (Article 10)

For high-risk AI systems, Article 10 adds requirements beyond GDPR:

### Relevance requirement
Training data must be relevant to the intended purpose. Flag data elements that:
- Were collected for a different purpose (purpose limitation violation)
- Cannot be explained as contributing to the model's stated function
- Are historical data from contexts that no longer reflect the deployment environment

### Accuracy requirement
Training data must be sufficiently accurate and up to date. Flag:
- Data older than the system's intended deployment context warrants
- Data known to contain systematic errors or measurement bias
- Data collected under conditions not representative of deployment conditions

### Completeness requirement
Training data must be complete for the stated purpose. Flag:
- Missing data on protected groups that may cause disparate performance
- Underrepresentation of edge cases the system will encounter in deployment
- Gaps that would cause the system to fail silently on certain inputs

### Bias and representativeness
Article 10(2)(f) explicitly requires examination of possible biases. Flag:
- Training data that over- or underrepresents demographic groups
- Historical data that encodes past discrimination (e.g., historical hiring decisions)
- Data collected from non-representative samples (e.g., only English language data for a multilingual deployment)

---

## Sensitivity Tiers for Risk Rating

### 🔴 High Risk
Applies when any of the following are true:
- Special category data (Article 9) is present
- Direct identifiers in training data or model outputs accessible to third parties
- Data enables re-identification of individuals when combined with other available data
- Children's data (under 18) is present
- Data from vulnerable populations (patients, prisoners, benefit claimants) is present
- Article 10 violation: data is not relevant, accurate, or representative

### 🟡 Medium Risk
- Indirect identifiers present without adequate separation or access controls
- Quasi-identifiers that could enable re-identification in combination
- Personal data present for which legal basis is unclear or undocumented
- Data that may act as proxy for special category data

### 🟢 Low Risk
- Aggregate or anonymised data with low re-identification risk
- Personal data with clear legal basis, purpose limitation, and access controls in place
- Public data used within its original context and purpose
