// scripts/seed-registry.mjs
//
// Reseed the registry-api KV namespace (api.quirgs.com) from source — so the
// public skill catalog never drifts from the repo. Run after adding a skill or
// bumping a plugin version.
//
//   node scripts/seed-registry.mjs            # write all entries to remote KV
//   node scripts/seed-registry.mjs --dry-run  # print entries, write nothing
//
// Single sources of truth:
//   - skill metadata  -> src/content/skills/<slug>.mdx frontmatter
//   - version         -> plugins/<name>/.claude-plugin/plugin.json, resolved via
//                        the skill's installCmd ("/plugin install <name>@quirgs")
//
// The registry entry schema (11 fields, must stay uniform across all skills):
//   slug, title, tagline, pillar, bundle, framework[], status, version,
//   tags[], gistUrl, installCmd
//
// Writes go through `wrangler kv key put --remote`. The OAuth login can do this
// as long as you pass --namespace-id explicitly (see CLAUDE.md / memory). No
// REGISTRY_WRITE_TOKEN needed for this path.

import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import yaml from 'yaml';
const { parse: parseYaml } = yaml;

const REPO = process.cwd();
const SKILLS_DIR = join(REPO, 'src/content/skills');
const PLUGINS_DIR = join(REPO, 'plugins');
const NAMESPACE_ID = 'ab23c8017bc846ae96253e1c2207d716'; // QUIRGS_REGISTRY
const DRY_RUN = process.argv.includes('--dry-run');

// plugin name -> version
const pluginVersions = new Map();
for (const dirent of readdirSync(PLUGINS_DIR, { withFileTypes: true })) {
  if (!dirent.isDirectory()) continue;
  try {
    const m = JSON.parse(
      readFileSync(join(PLUGINS_DIR, dirent.name, '.claude-plugin/plugin.json'), 'utf-8')
    );
    if (m.version) pluginVersions.set(m.name ?? dirent.name, m.version);
  } catch {
    /* no manifest — skip */
  }
}

function frontmatter(file) {
  const text = readFileSync(file, 'utf-8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`No frontmatter in ${file}`);
  return parseYaml(m[1]);
}

function versionFor(installCmd, slug) {
  const name = installCmd?.match(/install\s+([^@\s]+)@/)?.[1];
  if (!name) throw new Error(`${slug}: no plugin name in installCmd "${installCmd}"`);
  const v = pluginVersions.get(name);
  if (!v) throw new Error(`${slug}: no plugin.json version for plugin "${name}"`);
  return v;
}

const entries = readdirSync(SKILLS_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const slug = f.replace(/\.mdx$/, '');
    const fm = frontmatter(join(SKILLS_DIR, f));
    return {
      slug,
      title: fm.title,
      tagline: fm.tagline,
      pillar: fm.pillar,
      bundle: fm.bundle,
      framework: fm.framework ?? [],
      status: fm.status,
      version: versionFor(fm.installCmd, slug),
      tags: fm.tags ?? [],
      gistUrl: fm.gistUrl ?? null,
      installCmd: fm.installCmd ?? null,
    };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

console.log(`Built ${entries.length} registry entries from source.\n`);
for (const e of entries) {
  console.log(`  ${e.slug.padEnd(26)} v${e.version}  ${e.bundle}`);
}

if (DRY_RUN) {
  console.log('\n--dry-run: nothing written. Full payload:\n');
  console.log(JSON.stringify(entries, null, 2));
  process.exit(0);
}

const tmp = mkdtempSync(join(tmpdir(), 'registry-seed-'));
console.log('\nWriting to remote KV...');
for (const e of entries) {
  const path = join(tmp, `${e.slug}.json`);
  writeFileSync(path, JSON.stringify(e));
  execFileSync(
    'npx',
    ['wrangler', 'kv', 'key', 'put', e.slug, '--path', path, '--namespace-id', NAMESPACE_ID, '--remote'],
    { stdio: ['ignore', 'ignore', 'inherit'] }
  );
  console.log(`  ok  ${e.slug}`);
}
console.log('\nDone. Verify: curl -s https://api.quirgs.com/skills');
