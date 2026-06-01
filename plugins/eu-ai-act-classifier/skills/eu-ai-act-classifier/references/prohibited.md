# EU AI Act — Prohibited AI Practices (Article 5)

These practices are **banned outright** in the EU. No conformity assessment, no exemption,
no derogation. If a system falls into any of these categories, it cannot be placed on the
EU market or put into service.

**Applicability date:** 2 February 2025

---

## Prohibited Practices

### 1. Subliminal or Manipulative Techniques
**Article 5(1)(a)**
AI systems that deploy subliminal techniques beyond a person's consciousness, or that
exploit psychological weaknesses or biases, in a way that materially distorts behavior and
causes or is likely to cause harm.

**Examples:**
- Systems using hidden auditory/visual stimuli to influence purchasing or political behavior
- Systems exploiting cognitive biases to manipulate vulnerable users
- Dark pattern AI that covertly steers users against their interests

**Distinguishing factor:** Must be *subliminal* (below conscious awareness) OR exploit
*vulnerabilities*. Ordinary persuasive advertising AI does not automatically qualify.

---

### 2. Exploitation of Vulnerabilities
**Article 5(1)(b)**
AI systems that exploit vulnerabilities of specific groups — due to age, disability, or
social/economic situation — in a way that distorts their behavior and causes or is likely
to cause harm.

**Examples:**
- AI targeting elderly people with manipulative financial product recommendations
- Systems exploiting addiction vulnerabilities in gambling or social media contexts
- AI targeting children with manipulative content designed to bypass parental oversight

---

### 3. Social Scoring by Public Authorities
**Article 5(1)(c)**
AI systems used by or on behalf of public authorities for evaluating or classifying natural
persons based on their social behavior or personal characteristics over time, where this
leads to detrimental or disproportionate treatment.

**Examples:**
- Government-run social credit scoring systems
- AI that aggregates citizen behavior data to restrict access to public services
- Systems that create tiered citizen treatment based on behavioral profiles

**Note:** This prohibition applies to **public authorities**. Private-sector loyalty scoring
and credit scoring are separately regulated under the high-risk provisions.

---

### 4. Real-Time Remote Biometric Identification in Public Spaces (Law Enforcement)
**Article 5(1)(d)**
Real-time remote biometric identification (RBI) systems used by law enforcement in publicly
accessible spaces, except in narrowly defined circumstances.

**Permitted exceptions (Article 5(2)):**
- Targeted search for specific missing persons, trafficking/sexual exploitation victims
- Prevention of specific, substantial, and imminent terrorist threat
- Detection, localisation, identification of perpetrators of serious criminal offences
  (punishable by ≥4 years imprisonment) — with prior judicial/independent authority authorisation

**Post-remote biometric identification** (after the fact, not real-time) is regulated as
high-risk, not prohibited.

---

### 5. Biometric Categorisation Inferring Sensitive Attributes
**Article 5(1)(e)**
AI systems that use biometric data to infer or deduce race, political opinions, trade union
membership, religious beliefs, sex life or sexual orientation.

**Examples:**
- Facial analysis systems claiming to detect sexual orientation
- Systems inferring political affiliation from facial features
- Tools claiming to identify religious identity from appearance

**Note:** Biometric categorisation for other purposes (e.g., age estimation) falls under
limited-risk or high-risk depending on context — not necessarily prohibited.

---

### 6. Emotion Recognition in Workplace and Education
**Article 5(1)(f)**
AI systems that infer emotions of natural persons in workplace and educational settings,
except where used for medical or safety reasons.

**Prohibited examples:**
- Workplace productivity tools that monitor employee emotional states via webcam
- Student engagement systems that track emotional responses during online learning
- Hiring tools that assess candidate emotions during video interviews

**Permitted:** Emotion recognition for driver fatigue safety systems; medical diagnosis tools.

---

### 7. Untargeted Facial Image Scraping
**Article 5(1)(g)**
AI systems that create or expand facial recognition databases through untargeted scraping
of facial images from the internet or CCTV footage.

**Examples:**
- Systems that bulk-collect social media profile photos to train recognition models
- Services that aggregate face images from public cameras without legal basis
- Tools that compile facial databases from web scraping for commercial sale

---

### 8. Individual Criminal Risk Profiling from Biometrics
**Article 5(1)(h)**
AI systems used to assess or predict the risk of a person committing a criminal offence
solely on the basis of profiling or personality traits/characteristics, without prior
criminal behavior.

**Examples:**
- "Predictive policing" tools that flag individuals as crime risks based on appearance/demographics
- Pre-crime assessment systems relying on behavioral profiling without individual history
- Systems claiming to detect "criminal intent" from facial features

---

## Classification Decision

If the system matches **any** of the above:
→ Output **PROHIBITED**
→ State the specific Article 5 provision(s)
→ Recommend the user seek qualified legal advice
→ Do **not** proceed to high-risk or other classification
→ Do **not** suggest workarounds or reframing to avoid the prohibition
