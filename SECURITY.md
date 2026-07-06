# Security Policy

Quirgs ships governance Skills whose output people rely on. That creates two distinct
things you might need to report, and they are triaged differently. Pick your lane:

- **Lane A — Security vulnerability.** A flaw in the site, the Workers, or the skill
  distribution pipeline.
  → [Report privately via a GitHub security advisory](https://github.com/unqdlphn/quirgs/security/advisories/new)
- **Lane B — Skill-output issue.** A Quirgs Skill produced wrong, outdated, or misleading
  guidance.
  → [Open a skill-output issue](https://github.com/unqdlphn/quirgs/issues/new?template=skill-output-issue.yml)

---

## Lane A — Reporting a vulnerability

**Report privately:** [github.com/unqdlphn/quirgs/security/advisories/new](https://github.com/unqdlphn/quirgs/security/advisories/new)
(the same canonical contact published in [`/.well-known/security.txt`](https://quirgs.com/.well-known/security.txt), RFC 9116).

In scope:

- `quirgs.com` — the static site and its headers/CSP
- `api.quirgs.com` — the registry-api Worker
- `gate.quirgs.com` — the hitl-gate Worker
- The Gist sync pipeline and the Claude Code plugin/marketplace distribution chain

Please use the private advisory form rather than a public issue for anything
exploitable. Note: the shared hitl-gate at `gate.quirgs.com` is a public
demonstration queue — do not send real, production, or personal data to it (the
`hitl-compliance-gate` Skill warns about this at the point of use).

## Lane B — Reporting a skill-output issue

Wrong risk tier, wrong clause or article, an invented obligation, missing
disclaimers, or guidance that is out of date — these are **output defects, not
vulnerabilities**. File them as a regular issue so they enter incident triage
rather than the disclosure queue:

**[Open a skill-output issue](https://github.com/unqdlphn/quirgs/issues/new?template=skill-output-issue.yml)**
(the form collects the details below)

Include what you can:

1. **Skill name and version** (shown in the output header / install command), and
   whether it was installed standalone or via a bundle
2. **When you ran it**, and the model used if you know it
3. **A summary of your input** — do not paste personal, confidential, or client
   data into the issue; a described scenario is enough
4. **Why the output looks wrong** — for regulatory claims, a citation to the
   provision you believe is correct is the fastest path to a fix

### What happens to your report

Reports are triaged against Quirgs' internal AI incident playbook on a four-level
severity scale:

- **Confirmed user harm** traced to skill output → the skill is **pulled from
  distribution immediately**, with a dated note on its catalog page.
- **Confirmed wrong regulatory substance** (wrong tier/clause/article, invented
  obligation) → fixed and re-verified **promptly** — and if a fix cannot land
  quickly, the skill is pulled.
- Lower-severity defects (formatting, disclaimers, behavioral deviations) are
  fixed in the next release or explicitly accepted-and-monitored with a recorded
  rationale.

Every fix ships with a `CHANGELOG.md` entry. Fixes are re-verified against the
skill's validation fixtures in a clean-room run before re-publish. A catalog-page
note is posted whenever a skill is pulled or a fix is delayed. Defects
attributable to the underlying model rather than the skill text are reported
upstream to Anthropic.

## Supported versions

The **currently published version** of each Skill and bundle — what
`/plugin install` fetches today and what [quirgs.com/skills](https://quirgs.com/skills/)
lists — is supported. Older installed copies are not patched in place;
reinstall/update to the current version.

## Security posture

Platform security details (data handling, CSP, email authentication, supply
chain) are documented at [quirgs.com/security](https://quirgs.com/security/).

---

Governance first. Build accordingly.
