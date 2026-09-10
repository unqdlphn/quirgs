// scripts/check-inventory-coverage.mjs
//
// AI asset inventory coverage check (Shadow AI Rule enforcement, GOVERN 1.2 /
// MAP 2.1 / ISO 42001 Clause 8.3).
//
// The Pillar 1 AI System Inventory declares its own Shadow AI Rule: anything not
// registered there is ungoverned. That rule has been enforced by memory, and it
// failed three times in a row — claude-fable-5 (caught 2026-07-05),
// quirgs-publish (2026-07-06), and claude-opus-5 / claude-fable-5-1
// (2026-09-10). In all three cases the asset was already in use and a late
// manual sync check found out afterwards.
//
// The structural reason is that the inventory is a local HTML artifact outside
// this repo, so nothing in CI can read it. governance/ai-asset-index.json is a
// committed projection of just the registered asset IDs, and this asserts that
// every AI asset derivable from this repo appears in it.
//
//   npm run check:inventory            # verify
//   npm run check:inventory -- --strict# also fail on orphaned index entries
//
// What it can and cannot catch
// ----------------------------
// CAN:    assets you create here — skills, bundles, Workers, Worker bindings.
//         A new plugin or Worker can no longer merge unregistered, the same way
//         a new inline script can no longer merge unpinned (check:csp).
// CANNOT: foundation-model versions. Those change outside the repo with no
//         commit to hang a check on, which is why two of the three gaps above
//         were model versions. That class needs a recurring probe, not a repo
//         check — tracked separately in _v2/docs (Class B).
//
// Three failure modes, deliberately weighted:
//
//   UNREGISTERED — present in the repo, absent from the index. This is the
//                  Shadow AI gap itself. Always fails.
//   UNLISTED     — a plugin in plugins/ missing from .claude-plugin/
//                  marketplace.json (or vice versa). A distinct recurring bug:
//                  the plugin ships but is undiscoverable. Always fails.
//   ORPHANED     — in the index but no longer in the repo. Harmless to users
//                  (it claims an asset that is gone) but a reliable signal a
//                  reconcile was missed. Warns; fails under --strict.
//
// Sources of truth, all read from the repo — never hardcoded here:
//   skills   -> src/content/skills/*.mdx           (slug = filename)
//   plugins  -> plugins/*/.claude-plugin/plugin.json ("name")
//   bundles  -> plugin names that are not also skill slugs
//   workers  -> workers/*/wrangler.toml            ("name")
//   bindings -> binding tables in those same wrangler.toml files

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const REPO = process.cwd();
const INDEX_FILE = join(REPO, 'governance/ai-asset-index.json');
const SKILLS_DIR = join(REPO, 'src/content/skills');
const PLUGINS_DIR = join(REPO, 'plugins');
const WORKERS_DIR = join(REPO, 'workers');
const MARKETPLACE_FILE = join(REPO, '.claude-plugin/marketplace.json');

const STRICT = process.argv.includes('--strict');

// Binding tables that represent a governed resource — a data store, an egress
// path, or a model surface. Each needs a §3 pipeline and/or §4 integration row.
// `send_email` names its binding `name`; the rest use `binding`.
const BINDING_TABLES = {
  kv_namespaces: 'binding',
  d1_databases: 'binding',
  r2_buckets: 'binding',
  queues: 'binding',
  vectorize: 'binding',
  hyperdrive: 'binding',
  ai: 'binding',
  send_email: 'name',
  analytics_engine_datasets: 'binding',
};

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

/**
 * Minimal TOML reader for the subset wrangler configs use: top-level `key =`
 * scalars and `[[table]]` arrays. Deliberately dependency-free — this check
 * must run on a bare `npm ci` with no build step.
 *
 * Tables are positional in TOML, which is exactly the trap that hid dead
 * `routes`/`workers_dev` keys in two configs until PR #173: a bare key after a
 * [table] header belongs to that table. This tracks the current table so a
 * top-level read cannot accidentally pick up a nested key.
 */
function readWranglerToml(file) {
  const out = { name: null, bindings: [] };
  let table = null; // null = top level
  let arrayRow = null;

  for (const raw of readFileSync(file, 'utf-8').split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;

    const arrayHeader = line.match(/^\[\[([A-Za-z0-9_.]+)\]\]$/);
    if (arrayHeader) {
      table = arrayHeader[1];
      if (table in BINDING_TABLES) {
        arrayRow = { kind: table, binding: null };
        out.bindings.push(arrayRow);
      } else {
        arrayRow = null;
      }
      continue;
    }

    const header = line.match(/^\[([A-Za-z0-9_.]+)\]$/);
    if (header) {
      table = header[1];
      arrayRow = null;
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.+)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    const val = rawVal.trim().replace(/^["']|["'],?$/g, '');

    if (table === null && key === 'name') out.name = val;

    if (arrayRow && key === BINDING_TABLES[arrayRow.kind]) arrayRow.binding = val;
  }

  out.bindings = out.bindings.filter((b) => b.binding);
  return out;
}

// ---------------------------------------------------------------- enumerate

function repoSkills() {
  if (!existsSync(SKILLS_DIR)) fail(`missing ${relative(REPO, SKILLS_DIR)}`);
  return readdirSync(SKILLS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort();
}

function repoPlugins() {
  if (!existsSync(PLUGINS_DIR)) fail(`missing ${relative(REPO, PLUGINS_DIR)}`);
  const names = [];
  for (const dirent of readdirSync(PLUGINS_DIR, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const manifest = join(PLUGINS_DIR, dirent.name, '.claude-plugin/plugin.json');
    if (!existsSync(manifest)) {
      fail(`plugins/${dirent.name} has no .claude-plugin/plugin.json — cannot verify registration`);
    }
    const m = JSON.parse(readFileSync(manifest, 'utf-8'));
    names.push(m.name ?? dirent.name);
  }
  return names.sort();
}

function repoWorkers() {
  if (!existsSync(WORKERS_DIR)) return [];
  const workers = [];
  for (const dirent of readdirSync(WORKERS_DIR, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const toml = join(WORKERS_DIR, dirent.name, 'wrangler.toml');
    if (!existsSync(toml)) continue;
    const parsed = readWranglerToml(toml);
    if (!parsed.name) fail(`workers/${dirent.name}/wrangler.toml has no top-level \`name\``);
    workers.push({ dir: dirent.name, ...parsed });
  }
  return workers.sort((a, b) => a.name.localeCompare(b.name));
}

function marketplacePlugins() {
  if (!existsSync(MARKETPLACE_FILE)) fail(`missing ${relative(REPO, MARKETPLACE_FILE)}`);
  const m = JSON.parse(readFileSync(MARKETPLACE_FILE, 'utf-8'));
  return (m.plugins ?? []).map((p) => p.name ?? p.source).filter(Boolean).sort();
}

// -------------------------------------------------------------------- check

if (!existsSync(INDEX_FILE)) fail(`missing ${relative(REPO, INDEX_FILE)}`);
const index = JSON.parse(readFileSync(INDEX_FILE, 'utf-8'));

const idx = {
  skills: new Set(Object.keys(index.skills ?? {})),
  bundles: new Set(Object.keys(index.bundles ?? {})),
  workers: new Set(Object.keys(index.workers ?? {})),
  bindings: new Set(Object.keys(index.bindings ?? {})),
};

const skills = repoSkills();
const plugins = repoPlugins();
const workers = repoWorkers();
const market = marketplacePlugins();

// A plugin whose name is also a skill slug is that skill's plugin; the rest are
// bundles. Derived rather than listed so adding a bundle needs no change here.
const skillSet = new Set(skills);
const bundles = plugins.filter((p) => !skillSet.has(p));

const bindings = workers.flatMap((w) => w.bindings.map((b) => `${w.name}:${b.binding}`));

const unregistered = [];
const orphaned = [];
const unlisted = [];

function compare(kind, present, registered) {
  for (const id of present) if (!registered.has(id)) unregistered.push(`${kind}: ${id}`);
  for (const id of registered) if (!present.includes(id)) orphaned.push(`${kind}: ${id}`);
}

compare('skill', skills, idx.skills);
compare('bundle', bundles, idx.bundles);
compare('worker', workers.map((w) => w.name), idx.workers);
compare('binding', bindings, idx.bindings);

for (const p of plugins) if (!market.includes(p)) unlisted.push(`plugins/ has "${p}", marketplace.json does not`);
for (const p of market) if (!plugins.includes(p)) unlisted.push(`marketplace.json has "${p}", plugins/ does not`);

// ------------------------------------------------------------------- report

console.log(
  `inventory index: ${relative(REPO, INDEX_FILE)} ` +
    `(artifact ${index.artifactVersion ?? '?'}, reconciled ${index.lastReconciled ?? '?'})`,
);
console.log(
  `repo assets: ${skills.length} skill(s), ${bundles.length} bundle(s), ` +
    `${workers.length} worker(s), ${bindings.length} binding(s)`,
);

if (unregistered.length) {
  console.error(`\n✗ UNREGISTERED — present in this repo, absent from the inventory index:`);
  for (const u of unregistered) console.error(`    ${u}`);
  console.error(
    `\n  These are Shadow AI Rule gaps: per Pillar 1, an unregistered asset is ungoverned.\n` +
      `  Register each in the Pillar 1 artifact FIRST (the artifact is authoritative), then\n` +
      `  record it in ${relative(REPO, INDEX_FILE)} with the section it now appears in.\n` +
      `  Adding it to the index alone only hides the gap.`,
  );
}

if (unlisted.length) {
  console.error(`\n✗ UNLISTED — plugins/ and .claude-plugin/marketplace.json disagree:`);
  for (const u of unlisted) console.error(`    ${u}`);
  console.error(`\n  A plugin missing from marketplace.json ships but cannot be installed.`);
}

if (orphaned.length) {
  console.error(`\n${STRICT ? '✗' : '!'} ORPHANED — in the index but no longer in this repo:`);
  for (const o of orphaned) console.error(`    ${o}`);
  console.error(
    `  If the asset was retired, move it to the Pillar 1 §8 Deprecation Tracker and drop it here.`,
  );
}

if (unregistered.length || unlisted.length || (STRICT && orphaned.length)) process.exit(1);

if (!unregistered.length) console.log('✓ Every repo-derivable AI asset is registered.');
if (!unlisted.length) console.log('✓ plugins/ and marketplace.json agree.');
if (!orphaned.length) console.log('✓ No orphaned index entries.');
console.log(
  '\nNote: foundation-model versions are out of scope here — they change outside the repo\n' +
    'with no commit to check. That class needs a recurring probe (see _v2/docs, Class B).',
);
