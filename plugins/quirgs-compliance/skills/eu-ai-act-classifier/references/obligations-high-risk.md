# EU AI Act — High-Risk Obligations by Role

High-risk obligations differ significantly depending on whether you are a **provider**
(builds/places on market), **deployer** (uses in own context), **importer**, or **distributor**.

---

## Provider Obligations (Articles 8–25)

Providers bear the heaviest obligations. These apply before placing the system on the market.

### Risk Management System (Article 9)
- Establish, implement, document, and maintain a risk management system throughout the lifecycle
- Identify and analyse known and foreseeable risks to health, safety, and fundamental rights
- Estimate and evaluate risks that may emerge when used as intended and under foreseeable misuse
- Adopt suitable risk management measures (residual risks must be acceptable)
- Conduct testing to ensure measures are effective; document results

### Data and Data Governance (Article 10)
- Training, validation, and testing datasets must be subject to data governance practices
- Datasets must be relevant, representative, free of errors, and complete (to the extent possible)
- Examine datasets for biases that could lead to discrimination
- Identify data gaps; take mitigating measures if gaps cannot be eliminated
- For sensitive personal data: only process if strictly necessary for bias detection/correction

### Technical Documentation (Article 11 + Annex IV)
- Prepare technical documentation before market placement; keep it up to date
- Documentation must demonstrate the system meets high-risk requirements
- Must include: system description, design specs, development process, validation results,
  monitoring plan, instructions for use

### Record-Keeping / Logging (Article 12)
- System must automatically log events throughout operation ("logs")
- Logging capability must be traceable at least to the period over which a system is used
- Logs must be retained; accessible to national authorities

### Transparency and Information to Deployers (Article 13)
- Provide instructions for use that include:
  - Intended purpose and conditions of use
  - Level of accuracy, robustness, and cybersecurity
  - Known biases and limitations
  - Human oversight measures and required competencies
  - Expected lifetime and maintenance requirements

### Human Oversight (Article 14)
- Design system so it can be overseen by natural persons during the period of use
- Enable deployers to: monitor operation, detect/address anomalies, interrupt or override
- System must not impede human oversight measures
- Identify individuals responsible for oversight and ensure they have appropriate competence

### Accuracy, Robustness, Cybersecurity (Article 15)
- Achieve appropriate levels of accuracy throughout the lifecycle; document metrics
- Ensure resilience against errors, faults, and inconsistencies
- Ensure resilience against adversarial attacks targeting data, models, or outputs
- Address potential security risks specific to the AI system's context

### Conformity Assessment (Article 43)
- Conduct conformity assessment before market placement
- Most high-risk systems: internal assessment by provider (Annex VI)
- Exceptions requiring third-party notified body: biometric ID systems, certain safety-critical uses
- Document assessment; draw up EU Declaration of Conformity (Article 47)

### EU Declaration of Conformity (Article 47)
- Draw up written declaration that system conforms to the Act
- Contains: provider details, system description, applicable requirements confirmed,
  standards applied, notified body (if applicable), date and signature

### CE Marking (Article 48)
- Affix CE marking before placing high-risk system on EU market
- Marking indicates conformity has been assessed

### Registration (Article 49 + EU Database)
- Register the system in the EU database before market placement
- Registration includes system description, intended purpose, risk tier, conformity status

### Post-Market Monitoring (Article 72)
- Establish and maintain a post-market monitoring system
- Collect and review data on system performance during operation
- Document findings; report serious incidents and corrective actions

### Serious Incident Reporting (Article 73)
- Report serious incidents to the market surveillance authority immediately after establishing a causal link, and no later than 15 days after becoming aware — 10 days if the incident involved a person's death, 2 days for a widespread infringement or serious disruption to critical infrastructure
- Serious incident = death, serious health damage, serious breach of fundamental rights,
  or other serious harm including property damage

---

## Deployer Obligations (Article 26)

Deployers use high-risk systems in their own operations. Obligations are lighter than providers.

### Core Deployer Obligations:
- Use the system in accordance with the provider's instructions for use
- Assign human oversight to competent natural persons with necessary authority
- Monitor operation for anomalies, dysfunctions, or unexpected risks
- Inform the provider if the system presents a risk not covered by instructions
- Keep logs generated by the system (where within deployer's control) for defined period
- Conduct a **Data Protection Impact Assessment** if processing personal data (GDPR link)
- If deployer makes **substantial modifications**, they become the provider

### Additional Deployer Obligations for Employment/Credit/Benefits contexts:
- Inform individuals that they are subject to high-risk AI decision-making
- Provide meaningful explanation of the decision logic (where required by applicable law)
- Enable individuals to request human review of decisions

### Deployer-as-Provider Trigger:
A deployer becomes a provider (with full provider obligations) if they:
- Place the system on the market under their own name/brand
- Make a substantial modification to the system
- Change the intended purpose beyond the original provider's scope

---

## Importer Obligations (Article 23)
- Verify the non-EU provider has completed conformity assessment
- Verify technical documentation exists and CE marking is affixed
- Ensure provider has EU representative appointed
- Do not place on market if non-conformant; notify provider and market surveillance authority

## Distributor Obligations (Article 24)
- Verify CE marking is affixed and required documentation accompanies the system
- Do not make available if clearly non-conformant
- Cooperate with market surveillance authorities on request

---

## EU AI Act Timeline for High-Risk

> **Updated post-EU AI Act Digital Omnibus (adopted June 2026 — Parliament 16 June, Council 29 June).** The original single August 2026 HRAIS deadline has been split into two tracks. Deployer disclosure obligations remain at August 2026; provider/deployer technical compliance for high-risk systems is now tiered. Dates are provisional until the amending act is published in the Official Journal (pending as of mid-July 2026).

| Date | What applies | Status |
|---|---|---|
| 2 February 2025 | Prohibited practices (Article 5) | ✅ In force |
| 2 August 2025 | GPAI obligations; governance provisions | ✅ In force |
| 2 August 2026 | Deployer chatbot and biometric disclosure obligations (Article 50) | 🔴 **ACTIVE — imminent** |
| 2 December 2027 | Standalone HRAIS — Annex III (employment, credit scoring, education, biometrics, law enforcement, migration, justice) | ⏳ Delayed 16 months by Omnibus |
| 2 August 2028 | AI embedded as safety components in Annex I products (medical devices, aviation, machinery, rail, etc.) | ⏳ Delayed 12 months by Omnibus |
