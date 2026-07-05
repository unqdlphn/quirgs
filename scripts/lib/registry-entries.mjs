// scripts/lib/registry-entries.mjs
//
// Build the canonical registry entries from source. Shared by:
//   - scripts/seed-registry.mjs        (writes these entries to remote KV)
//   - scripts/check-live-integrity.mjs (asserts the live registry/site match them)
//
// Keeping one builder is the point: the integrity check must compare the live
// surfaces against *exactly* what the seeder would write, or the check itself
// can drift.
//
// Single sources of truth:
//   - skill metadata  -> src/content/skills/<slug>.mdx frontmatter
//   - version         -> plugins/<name>/.claude-plugin/plugin.json, resolved via
//                        the skill's installCmd ("/plugin install <name>@quirgs")
//
// The registry entry schema (11 fields, must stay uniform across all skills):
//   slug, title, tagline, pillar, bundle, framework[], status, version,
//   tags[], gistUrl, installCmd

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'yaml';
const { parse: parseYaml } = yaml;

/** plugin name -> version, read from plugins/<dir>/.claude-plugin/plugin.json */
export function readPluginVersions(repoRoot) {
  const pluginsDir = join(repoRoot, 'plugins');
  const versions = new Map();
  for (const dirent of readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    try {
      const m = JSON.parse(
        readFileSync(join(pluginsDir, dirent.name, '.claude-plugin/plugin.json'), 'utf-8')
      );
      if (m.version) versions.set(m.name ?? dirent.name, m.version);
    } catch {
      /* no manifest — skip */
    }
  }
  return versions;
}

function frontmatter(file) {
  const text = readFileSync(file, 'utf-8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`No frontmatter in ${file}`);
  return parseYaml(m[1]);
}

function versionFor(pluginVersions, installCmd, slug) {
  const name = installCmd?.match(/install\s+([^@\s]+)@/)?.[1];
  if (!name) throw new Error(`${slug}: no plugin name in installCmd "${installCmd}"`);
  const v = pluginVersions.get(name);
  if (!v) throw new Error(`${slug}: no plugin.json version for plugin "${name}"`);
  return v;
}

/** Canonical registry entries, sorted by slug. */
export function buildRegistryEntries(repoRoot) {
  const skillsDir = join(repoRoot, 'src/content/skills');
  const pluginVersions = readPluginVersions(repoRoot);
  return readdirSync(skillsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '');
      const fm = frontmatter(join(skillsDir, f));
      return {
        slug,
        title: fm.title,
        tagline: fm.tagline,
        pillar: fm.pillar,
        bundle: fm.bundle,
        framework: fm.framework ?? [],
        status: fm.status,
        version: versionFor(pluginVersions, fm.installCmd, slug),
        tags: fm.tags ?? [],
        gistUrl: fm.gistUrl ?? null,
        installCmd: fm.installCmd ?? null,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
