# EU AI Act — Limited Risk & GPAI Obligations

---

## Limited Risk Obligations (Article 50)

Limited-risk systems have **transparency obligations only**. No conformity assessment,
no registration, no CE marking required.

**Applicability date:** 2 August 2026

### Chatbots and Conversational AI (Article 50(1))
**Obligation:** Inform users they are interacting with an AI system in a clear and timely manner.

- Disclosure must occur at the start of the interaction
- Does not apply if it is obvious from context that a human is speaking to an AI
- Exception: AI used for law enforcement, national security, or similar legitimate purposes

**What counts as compliant disclosure:**
- "You are now chatting with an AI assistant"
- Prominent labelling in the interface
- System persona that makes AI nature unmistakably clear

**What does not count:**
- Fine print in terms of service
- Disclosure only upon request
- Ambiguous persona names without context

---

### Deepfakes and Synthetic Media (Article 50(2)–(3))
**Obligation:** Disclose that content is AI-generated or manipulated.

- Applies to: images, audio, video that depict real persons, places, or events in
  ways that could falsely appear authentic
- Disclosure must be machine-readable (embedded metadata) and human-readable
- Exception: content that is obviously artistic, satirical, fictional, or analogous creative work
  (but must still be disclosed if there is potential for confusion about authenticity)

**Specific rules:**
- Deepfakes showing real people in sexual or violent content → disclosure mandatory regardless of context
- Political/electoral content → disclosure mandatory

---

### Emotion Recognition (Article 50(4))
**Obligation:** Inform natural persons that their emotions are being inferred.

- Applies when an AI system is used to infer emotions of individuals
- Disclosure must occur before the interaction or processing begins
- Note: Emotion recognition in workplaces and education contexts is **prohibited** (Article 5)
  — limited risk transparency applies to other contexts only (e.g., marketing research, wellness apps)

---

### Biometric Categorisation (Article 50(5))
**Obligation:** Inform individuals subject to biometric categorisation.

- Applies when categorising individuals by sensitive characteristics (race, political opinion,
  religious belief, etc.) — where not prohibited under Article 5
- Note: Very narrow window — most sensitive attribute inference from biometrics is prohibited
  under Article 5(1)(e). The transparency obligation here covers edge cases not caught by that prohibition.

---

## GPAI Obligations Summary (Articles 53–56)

*(Full detail in `references/gpai.md` — summary here for obligations checklist generation)*

### All GPAI Providers:

| Obligation | Article | Deadline |
|---|---|---|
| Technical documentation (Annex XI) | 53(1)(a) | Before making available in EU |
| Copyright policy (publicly available) | 53(1)(c) | Before making available in EU |
| Training data summary (publicly available) | 53(1)(d) | Before making available in EU |
| Downstream provider information package | 53(1)(b) | Before downstream integration |
| Register with EU AI Office (when registry live) | 53(1)(e) | When registry operational |

### GPAI Providers with Systemic Risk (≥10^25 FLOPs or Commission-designated):

| Obligation | Article | Deadline |
|---|---|---|
| Adversarial testing / red-teaming | 55(1)(a) | Before market release; ongoing |
| Notify AI Office of serious incidents | 55(1)(b) | Without undue delay |
| Cybersecurity measures | 55(1)(c) | Ongoing |
| Energy consumption reporting | 55(1)(d) | Ongoing / when required |
| Model evaluation by AI Office (if requested) | 56 | On request |

---

## Minimal Risk — No Mandatory Obligations

Systems classified as minimal risk have **no binding requirements** under the EU AI Act.

**Encouraged (not required):**
- Adopt voluntary codes of conduct (Article 95)
- Follow AI literacy best practices (Article 4)
- Align with technical standards when published by CEN/CENELEC

**Examples of minimal risk systems:**
- AI in spam filters
- AI-powered video games
- AI-assisted document drafting tools (non-regulated domains)
- AI for internal process optimisation with no individual impact
- Recommendation engines without significant individual consequence

**Caveat:** Minimal risk under the AI Act does not mean minimal risk under other regulations.
GDPR, product liability law, and sector-specific regulations may still apply.
