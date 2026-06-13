# Broadcast Registration Data Template

Standardized output format for a complete registration packet covering DDEX delivery and PRO submission.

---

## Complete Registration Packet Structure

A registration packet for a single release consists of:

1. **Release Header** — top-level release data (one record per release)
2. **Track Records** — one record per track (for DDEX/distributor delivery)
3. **Composition Records** — one record per composition (for PRO registration)
4. **Validation Summary** — checklist of ready vs. missing fields

---

## Release Header Template

```
RELEASE REGISTRATION HEADER
════════════════════════════
Release Title:         ________________________________
UPC:                   ________________________________
Label Name:            ________________________________
Release Date:          ________________________________  [YYYY-MM-DD]
Release Type:          ________________________________  [Single/EP/Album]
P-line:                ℗ ______ ______________________
C-line:                © ______ ______________________
Territory:             ________________________________  [Worldwide / specific]
Primary Genre:         ________________________________
Language:              ________________________________  [ISO 639-1]
```

---

## Track Record Template (repeat for each track)

```
TRACK RECORD
════════════
Track #:               ________________________________
Track Title:           ________________________________
ISRC:                  ________________________________  [CC-XXX-YY-NNNNN]
Primary Artist:        ________________________________
Featured Artist(s):    ________________________________  [if any]
Duration:              ________________________________  [HH:MM:SS]
BPM:                   ________________________________
Explicit:              ________________________________  [Yes / No / Unknown]
Genre:                 ________________________________
P-line:                ________________________________  [if differs from release]
```

---

## Composition Record Template (repeat for each composition)

```
COMPOSITION RECORD
══════════════════
Song Title:            ________________________________
ISWC:                  ________________________________  [if known; blank = TBD]
Linked ISRC:           ________________________________
Language:              ________________________________

WRITERS
───────
Writer 1:
  Full Legal Name:     ________________________________
  IPI Number:          ________________________________
  Role:                ________________________________  [C/CA/A/AR/TR]
  Share (%):           ________________________________
  PRO Affiliation:     ________________________________  [ASCAP/BMI/SESAC/PRS/etc.]

Writer 2:
  Full Legal Name:     ________________________________
  IPI Number:          ________________________________
  Role:                ________________________________
  Share (%):           ________________________________
  PRO Affiliation:     ________________________________

Total Writer Share:    ________________________________  [Must = 100%]

PUBLISHERS
──────────
Publisher 1:
  Name:                ________________________________
  IPI Number:          ________________________________
  Share (%):           ________________________________
  Administering:       ________________________________  [Territory or Worldwide]
  PRO Affiliation:     ________________________________

Total Publisher Share: ________________________________  [Must = 100%]
```

---

## Validation Summary Template

```
REGISTRATION PACKET VALIDATION
═══════════════════════════════
Generated: _______________________________________________

DDEX DELIVERY READINESS
────────────────────────
✅ UPC valid format
✅ All ISRCs valid format
✅ Duration in ISO 8601 format
✅ P-line / C-line present
✅ Release date confirmed
⚠️ Missing BPM for [N] tracks
❌ Missing ISRC for track: [Title] — BLOCKS delivery

PRO REGISTRATION READINESS
───────────────────────────
✅ All IPI numbers present
✅ Writer shares sum to 100%
✅ Publisher shares sum to 100%
⚠️ ISWC unknown — will be assigned on submission
⚠️ MLC registration not yet confirmed

OVERALL STATUS
──────────────
☐ Ready for delivery — no blocking errors
☐ Conditional — proceed with noted warnings
☐ Blocked — resolve errors before submission
```

---

## Pre-Submission Checklist

Before submitting to any distribution partner or PRO, confirm:

- [ ] UPC and all ISRCs are valid and assigned to this rights holder (not borrowed or reused)
- [ ] Release date is confirmed with all distribution partners
- [ ] Composer splits are documented and agreed upon by all co-writers
- [ ] IPI numbers verified for all writers and publishers
- [ ] P-line and C-line owner names match legal entity names on file
- [ ] Territory availability list reviewed and approved
- [ ] Explicit flags set correctly for each track
- [ ] MLC registration on to-do list if releasing in the United States

---

## Submission Timing Reference

| Action | Recommended lead time before release |
|---|---|
| DDEX / distributor delivery | 2–4 weeks for major platforms; 1 week minimum |
| ASCAP composition registration | Before release date |
| BMI composition registration | Before release date |
| MLC composition registration | Before release date |
| PRE-release metadata embargo | Some distributors allow 12-week pre-release; Spotify requires 7 days minimum |

Late PRO registration does not forfeit past royalties — PROs can retroactively collect for unregistered works — but timely registration ensures cleaner matching from day one.
