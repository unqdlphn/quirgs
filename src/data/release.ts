// src/data/release.ts
// Single source of truth for the site's CalVer release identity.
//
// Site/repo versioning is CalVer (`YYYY.MM`, with a `.N` patch suffix if more
// than one release lands in a month). The authoritative record is the git tag
// + GitHub Release; this constant mirrors it for display. Plugins and bundles
// keep their own SemVer — see `plugins/*/.claude-plugin/plugin.json`.
//
// Consumed by:
//   - index.astro       (rendered into a `data-release` attribute on the
//                        terminal element, NOT into the boot script itself —
//                        the boot script's inline bytes are pinned by SHA-256
//                        in public/_headers, so keeping the version out of it
//                        means a release bump never invalidates the CSP hash)
//   - transparency.astro (release provenance link)
//
// To cut a release: bump RELEASE here in the same PR that retitles the
// CHANGELOG `[Unreleased]` block, then tag the merge commit to match.

/** Current CalVer release. Must match the most recent git tag. */
export const RELEASE = "2026.07";

/** Public release history — tags, notes, and diffs. */
export const RELEASES_URL = "https://github.com/unqdlphn/quirgs/releases";
