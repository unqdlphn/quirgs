# Platform AI Content Policies

Summary of major platform policies on AI-generated and AI-assisted music content. As of July 2026. Verify at each platform's current documentation before distributing.

---

## Policy Evolution Context

Platform policies on AI-generated music are among the fastest-changing areas in music industry compliance. The period 2023–2025 saw most major platforms move from no policy to active disclosure requirements and, in some cases, content restrictions. In 2026 the shift has been toward **structured, standardized disclosure**: Spotify's DDEX-based AI Credits metadata (April 2026), Apple Music's Transparency Tags (March 2026), and YouTube's move to automatic AI-detection and labeling (May–June 2026). Expect continued change as regulatory frameworks (EU AI Act, US state laws) pressure platforms to formalize their positions.

---

## Spotify

**Policy name:** AI Credits (DDEX metadata extension), plus distribution partner agreements and content moderation.

**AI disclosure:** Spotify's **AI Credits** program (voluntary beta since 16 April 2026) lets labels and distributors submit per-track AI-involvement metadata using the DDEX standard's AI disclosure fields. DistroKid was the first distribution partner; additional distributors (Believe, CD Baby, FUGA, IDOL, Amuse, Empire) are onboarding. Participation is **not mandatory** — it is a structured disclosure channel, not a delivery requirement. Distributor-level AI flags for AI-generated vocal content continue to apply.

**What's required:**
- AI-generated **vocals**: must be disclosed via distributor flag; Spotify may restrict or remove undisclosed AI vocals
- AI-involvement metadata generally: voluntary via AI Credits (DDEX); recommended for Tier 2+ releases
- **Deepfakes**: Strictly prohibited. AI-generated content that mimics a specific real artist's voice without authorization is subject to immediate removal.

**Distribution restriction:** Spotify does not accept "functional" music (white noise, sleep sounds, etc.) generated purely algorithmically regardless of AI involvement. This is a separate policy from AI content rules.

**Reference:** developers.spotify.com → Platform Policy; newsroom.spotify.com (search "AI content policy")

---

## Apple Music

**Policy name:** Transparency Tags (announced 4 March 2026 via partner communications).

**What's required:**
- Labels and distributors can declare AI involvement per release across four categories: **Artwork, Track, Composition, Music Video**
- The tags are **optional and self-declared** as of July 2026 — Apple applies no detection or cross-verification, and if no tag is supplied, no AI involvement is assumed. Despite some industry reporting framing them as "required," they are not a delivery mandate.
- Content that mimics a real artist's voice without authorization is prohibited

**Watch:** the tags create the metadata rails for a future mandate — if Apple flips them to required-at-delivery, undisclosed back-catalog AI content becomes a compliance gap. Declare accurately now.

**Reference:** Apple Music for Artists documentation; distributor-specific communications

---

## YouTube / YouTube Music

**Policy name:** YouTube's "Synthetic and Manipulated Media" policy + AI content labeling (now detection-backed)

**What's required:**
- Content created with "realistic-looking" AI must be labeled — this includes AI-generated music videos
- **Shift to automatic detection (May–June 2026):** YouTube moved from pure creator self-disclosure to **automatic AI-detection plus platform-applied labeling**, with a simplified single label shown beneath long-form videos and as an overlay on Shorts. Self-disclosure at upload still exists, but YouTube may label content it detects as AI-generated regardless. The label does **not** affect monetization.
- **Content ID:** Fully AI-generated content (no human-authored underlying work) has unclear Content ID eligibility. YouTube has not published a definitive statement; in practice, Content ID claims for AI-generated music have been inconsistent.

**Voice cloning / deepfake music:**
- Prohibited without authorization from the real artist
- The real artist can request removal via a dedicated request form (introduced 2024)
- Music labels have begun using automated tools to detect unauthorized voice cloning

**Reference:** support.google.com/youtube → "AI-generated content on YouTube"; support.google.com/youtube/answer/10561096 (labeling)

---

## TikTok

**Policy name:** TikTok's "AI-Generated Content" label requirement

**What's required:**
- Any content that is "entirely or substantially AI-generated" must be labeled with the platform's AI-generated content label
- This includes AI music used in videos and AI-generated music uploaded directly to TikTok's music library
- TikTok's SoundOn distribution service requires an AI content declaration at upload

**Enforcement:** TikTok has been among the most aggressive in enforcement, particularly around voice cloning. Several major labels have successfully removed AI-generated music that mimicked their artists. The required label is now backed by **automated detection** — TikTok reads C2PA Content Credentials (adopted January 2025) and auto-labels AI content carrying them, so relying on non-disclosure is not viable.

**Universal Music Group agreement (2025):** TikTok and UMG reached an agreement that included AI protections; this agreement shapes platform-level AI content standards that affect all publishers, not just UMG artists.

**Reference:** tiktok.com/creators/creator-portal → AI-generated content

---

## Amazon Music

**Policy:** Amazon has not published a standalone AI music policy as of mid-2026. Music distributed through DistroKid, TuneCore, or other partners is subject to those distributors' AI disclosure requirements, which Amazon receives as part of the metadata.

**Reference:** Amazon Music for Artists developer documentation (search AI content)

---

## Distributors (Requiring AI Flags at Upload)

### DistroKid
Checkbox at upload: "This track contains AI-generated content." Checking this passes a flag to platforms that support it. Not checking when applicable may result in removal.

### TuneCore
Similar AI declaration checkbox during upload workflow. Policy updated 2024.

### CD Baby
AI content declaration required for releases with Tier 2+ involvement as of 2024 policy update.

### AWAL / Kobalt
Requires AI disclosure via metadata and submission portal for direct-signed clients.

---

## Prohibited Content Across All Platforms

Regardless of AI involvement tier, the following are prohibited by all major platforms:

1. **Unauthorized voice cloning** — AI-generated content that sounds like a specific real artist without their written consent
2. **Content ID fraud** — claiming Content ID rights over AI-generated material to siphon royalties from genuine rights holders
3. **Mass-generated spam** — bulk-uploading AI-generated tracks to game streaming algorithms
4. **Defamatory content** — AI-generated music or vocals that defame or falsely represent real people
5. **Copyright infringement** — AI systems trained on copyrighted material that output content substantially similar to copyrighted works (this is legally unsettled but most platforms will remove on complaint)

---

## Policy Monitoring Recommendation

Subscribe to update channels from:
- Music publisher industry associations (NMPF, IFPI, A2IM)
- Distributor help center release notes
- Music Tech Policy blog (musictechpolicy.com)
- Billboard Pro news on AI and music policy

Review platform policies at minimum every 6 months, or within 30 days of any major platform announcement.
