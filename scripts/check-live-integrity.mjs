// scripts/check-live-integrity.mjs
//
// Published-metadata integrity check (governance action A-9, MS-2.8 / MS-4.2).
//
// Asserts that the LIVE public surfaces advertise exactly the metadata derived
// from this repo's single sources of truth (skill MDX frontmatter + plugin
// manifests). Build-time derivation (feat/derive-skill-version #105,
// feat/derive-bundle-version #106) guarantees the *build* can't drift; this
// closes the post-deploy loop so production can never advertise a version that
// differs from the installable artifact.
//
// Checks:
//   A. Registry API  — GET  <REGISTRY>/skills: every entry field-for-field
//                      equal to the seeder's canonical entries; no missing or
//                      extra slugs.
//   B. Skill pages   — GET  <SITE>/skills/<slug>/: the version badge equals
//                      the skill's plugin manifest version.
//   C. Bundles page  — GET  <SITE>/bundles/: the quirgs-compliance and
//                      quirgs-publish header versions equal their bundle
//                      plugin manifests.
//
//   node scripts/check-live-integrity.mjs
//
// Env:
//   SITE_BASE_URL       default https://quirgs.elbrigante9.workers.dev
//                       (quirgs.com serves CI clients a bot challenge — the
//                       verified-bots-only edge posture — so the check targets
//                       the same Worker on its workers.dev host, which serves
//                       the identical deployment)
//   REGISTRY_BASE_URL   default https://api.quirgs.com
//   INTEGRITY_ATTEMPTS  default 1. >1 re-runs the whole check on failure —
//                       used by CI on push to absorb Cloudflare deploy lag.
//   INTEGRITY_INTERVAL  seconds between attempts, default 60.

import { buildRegistryEntries, readPluginVersions } from './lib/registry-entries.mjs';

const REPO = process.cwd();
const SITE = (process.env.SITE_BASE_URL ?? 'https://quirgs.elbrigante9.workers.dev').replace(/\/$/, '');
const REGISTRY = (process.env.REGISTRY_BASE_URL ?? 'https://api.quirgs.com').replace(/\/$/, '');
const ATTEMPTS = Math.max(1, Number(process.env.INTEGRITY_ATTEMPTS) || 1);
const INTERVAL = Math.max(0, Number(process.env.INTEGRITY_INTERVAL) || 60);

const BUNDLE_PLUGINS = ['quirgs-compliance', 'quirgs-publish'];

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'quirgs-integrity-check' } });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  return res.text();
}

/** Deep-equal for the entry value types: scalars, null, string arrays. */
function sameValue(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return a === b;
}

async function checkRegistry(expected, failures) {
  let live;
  try {
    live = JSON.parse(await fetchText(`${REGISTRY}/skills`));
  } catch (err) {
    failures.push(`registry: ${err.message}`);
    return;
  }
  const liveBySlug = new Map(live.map((e) => [e.slug, e]));
  for (const want of expected) {
    const got = liveBySlug.get(want.slug);
    if (!got) {
      failures.push(`registry: ${want.slug} missing from live registry`);
      continue;
    }
    liveBySlug.delete(want.slug);
    for (const field of Object.keys(want)) {
      if (!sameValue(got[field], want[field])) {
        failures.push(
          `registry: ${want.slug}.${field} live=${JSON.stringify(got[field])} ` +
            `expected=${JSON.stringify(want[field])}`
        );
      }
    }
    for (const field of Object.keys(got)) {
      if (!(field in want)) {
        failures.push(`registry: ${want.slug} has unexpected field "${field}"`);
      }
    }
  }
  for (const slug of liveBySlug.keys()) {
    failures.push(`registry: live registry has extra entry "${slug}"`);
  }
}

async function checkSkillPages(expected, failures) {
  for (const want of expected) {
    let html;
    try {
      html = await fetchText(`${SITE}/skills/${want.slug}/`);
    } catch (err) {
      failures.push(`site: ${want.slug}: ${err.message}`);
      continue;
    }
    const m = html.match(/version-badge[^>]*>v(\d+\.\d+\.\d+)/);
    if (!m) {
      failures.push(`site: ${want.slug}: no version badge found on page`);
    } else if (m[1] !== want.version) {
      failures.push(`site: ${want.slug}: page shows v${m[1]}, manifest says v${want.version}`);
    }
  }
}

async function checkBundlesPage(pluginVersions, failures) {
  let html;
  try {
    html = await fetchText(`${SITE}/bundles/`);
  } catch (err) {
    failures.push(`site: /bundles/: ${err.message}`);
    return;
  }
  for (const plugin of BUNDLE_PLUGINS) {
    const want = pluginVersions.get(plugin);
    if (!want) {
      failures.push(`source: no plugin.json version for bundle plugin "${plugin}"`);
      continue;
    }
    const m = html.match(new RegExp(`${plugin}\\s+v(\\d+\\.\\d+\\.\\d+)`));
    if (!m) {
      failures.push(`site: /bundles/: no version found for ${plugin}`);
    } else if (m[1] !== want) {
      failures.push(`site: /bundles/: ${plugin} shows v${m[1]}, manifest says v${want}`);
    }
  }
}

async function runOnce() {
  const expected = buildRegistryEntries(REPO);
  const pluginVersions = readPluginVersions(REPO);
  const failures = [];
  await checkRegistry(expected, failures);
  await checkSkillPages(expected, failures);
  await checkBundlesPage(pluginVersions, failures);
  return { failures, count: expected.length };
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const { failures, count } = await runOnce();
  if (failures.length === 0) {
    console.log(
      `ok: ${count} skills + 2 bundles verified against ${REGISTRY} and ${SITE} ` +
        `(attempt ${attempt}/${ATTEMPTS})`
    );
    process.exit(0);
  }
  console.error(`attempt ${attempt}/${ATTEMPTS}: ${failures.length} mismatch(es)`);
  for (const f of failures) console.error(`  FAIL ${f}`);
  if (attempt < ATTEMPTS) {
    console.error(`retrying in ${INTERVAL}s (deploy may still be propagating)...`);
    await new Promise((r) => setTimeout(r, INTERVAL * 1000));
  }
}
console.error(
  '\nLive published metadata does not match the plugin manifests. ' +
    'If a version bump just merged: redeploy may have failed, or the registry ' +
    'needs reseeding (`npm run seed:registry`).'
);
process.exit(1);
