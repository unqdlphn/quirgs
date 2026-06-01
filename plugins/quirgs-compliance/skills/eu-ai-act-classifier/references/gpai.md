# EU AI Act — General-Purpose AI (GPAI) Models (Articles 51–56)

GPAI is a distinct regulatory category introduced by the EU AI Act. It covers foundation
models and large language models trained on broad data that can perform many different tasks.

**Applicability date:** 2 August 2025

---

## What Is a GPAI Model?

**Definition (Article 3(63)):** An AI model trained with large amounts of data using
self-supervision at scale, that displays significant generality and is capable of competently
performing a wide range of distinct tasks, and which can be integrated into a variety of
downstream systems or applications.

**Key signals:**
- Trained on broad, diverse data (not narrowly scoped)
- Capable of multiple task types (language, reasoning, code, image, etc.)
- Can be used by third parties via API or integration
- Does not have a single fixed intended use at training time

**Examples:** Large language models (LLMs), multimodal foundation models, large image/video
generation models, large code generation models.

**Not GPAI:** A model trained specifically for one task (e.g., a custom fraud detection
classifier, a medical image segmentation model for one hospital).

---

## Two Tiers of GPAI Obligations

### Tier 1 — All GPAI Models (Articles 53–54)

Applies to all providers of GPAI models made available in the EU.

**Obligations:**
1. **Technical documentation** — prepare and maintain documentation per Annex XI
2. **Copyright compliance** — establish and make publicly available a copyright policy
   compliant with EU law (including right-to-opt-out for text/data mining under DSM Directive)
3. **Training data summary** — publish a sufficiently detailed summary of training data
4. **Downstream provider support** — provide information and documentation to downstream
   providers who integrate the GPAI model, enabling them to comply with their obligations

**Documentation (Annex XI) must include:**
- Model architecture, training process, and parameters
- Training data description and provenance
- Model capabilities and performance benchmarks
- Intended and known unintended uses
- Known limitations, biases, and failure modes
- Safety evaluations conducted

---

### Tier 2 — GPAI Models with Systemic Risk (Articles 55–56)

A GPAI model has systemic risk if:
- **Training compute ≥ 10^25 FLOPs**, OR
- **Designated by the European Commission** based on impact/risk criteria

**Additional obligations for systemic risk models:**
1. **Model evaluation** — conduct adversarial testing (red-teaming) before release
2. **Incident reporting** — notify the AI Office of serious incidents and corrective actions within defined timeframes
3. **Cybersecurity** — implement appropriate measures against adversarial attacks
4. **Energy efficiency reporting** — report energy consumption

---

## GPAI and Downstream Systems

When a GPAI model is integrated into a higher-risk application:
- The **GPAI provider** retains GPAI obligations
- The **downstream system provider** takes on obligations for the integrated system's tier
- **Obligation stacking** occurs — both sets of obligations apply independently

**Example:** An LLM (GPAI obligations) integrated into an HR candidate screening tool
(high-risk obligations under Domain 4) → two separate obligation sets apply to potentially
two different providers.

---

## Open-Source GPAI Models (Article 53(2))

Providers of open-source GPAI models (weights publicly released) benefit from reduced
obligations:
- **Exempt from:** technical documentation (Annex XI) and downstream provider support requirements
- **NOT exempt from:** copyright policy and training data summary
- **NOT exempt from:** systemic risk obligations (if applicable — systemic risk obligations
  apply to open-source models too)

---

## GPAI Classification Signal

| Signal | Implication |
|---|---|
| Model trained on broad internet/diverse data | GPAI likely |
| Model performs multiple task types | GPAI likely |
| Model is made available via API to third parties | GPAI obligations apply to provider |
| Training compute ≥ 10^25 FLOPs | Systemic risk |
| Model is open-source (weights released) | Reduced but not zero obligations |
| Model integrated into high-risk application | Stacked obligations |
| Narrow single-task model | Probably not GPAI |
