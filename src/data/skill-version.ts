// src/data/skill-version.ts
// Single source of truth for skill version numbers.
//
// The authoritative version of a skill is the `version` in its plugin manifest
// (`plugins/<name>/.claude-plugin/plugin.json`) — that is the number a user gets
// when they `/plugin install <name>@quirgs`. The site derives the version from
// there at build time so the page can never drift from the published plugin.
//
// Do NOT reintroduce a `version` field to the skills content schema. It was
// removed (feat/derive-skill-version) precisely because a hand-copied frontmatter
// version silently fell out of sync with the plugin manifests.
//
// Mapping: a skill's `installCmd` ("/plugin install <name>@quirgs") names the
// plugin. Compliance skills map 1:1 to a same-named plugin; publish skills all
// map to the shared `quirgs-publish` plugin. Both resolve through this lookup.
//
// Implementation note: the manifests are pulled in with Vite's `import.meta.glob`
// (eager) so they are inlined into the bundle at build time. We deliberately do
// NOT read them with `node:fs` at render time — the @astrojs/cloudflare adapter
// prerenders inside a miniflare worker with no access to the real filesystem,
// so an fs read fails with "no such file or directory, readdir '/bundle/plugins'".

interface PluginManifest {
  name?: string;
  version?: string;
}

// Eagerly inlined at build time by Vite. Key = file path, value = parsed JSON.
const manifests = import.meta.glob<PluginManifest>(
  '../../plugins/*/.claude-plugin/plugin.json',
  { eager: true, import: 'default' }
);

// Build a plugin-name → version map. Prefer the manifest's own `name`; fall back
// to the directory name parsed from the glob path.
const versionByPlugin: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [path, manifest] of Object.entries(manifests)) {
    if (typeof manifest?.version !== 'string') continue;
    const dirName = path.match(/plugins\/([^/]+)\//)?.[1];
    const key = manifest.name ?? dirName;
    if (key) map.set(key, manifest.version);
  }
  return map;
})();

/** Extract the plugin name from an installCmd like "/plugin install foo@quirgs". */
function pluginNameFromInstallCmd(installCmd: string | undefined): string | null {
  if (!installCmd) return null;
  const match = installCmd.match(/install\s+([^@\s]+)@/);
  return match ? match[1] : null;
}

// A bundle is its own marketplace plugin, separately versioned from the per-skill
// plugins. Publish skills install *only* via the bundle, so a publish skill's
// version already equals the bundle version; compliance skills each have their
// own standalone plugin, so the `quirgs-compliance` bundle carries a distinct
// version (e.g. 1.1.3) that no single-skill installCmd points at. Hence this map.
const BUNDLE_PLUGIN: Record<string, string> = {
  compliance: 'quirgs-compliance',
  publish: 'quirgs-publish',
};

/** Look up a plugin's version by name, throwing if its manifest is missing. */
function versionForPlugin(pluginName: string, context: string): string {
  const version = versionByPlugin.get(pluginName);
  if (!version) {
    throw new Error(
      `${context}: no plugins/${pluginName}/.claude-plugin/plugin.json version was ` +
        `found. Add the plugin manifest or fix the reference.`
    );
  }
  return version;
}

/**
 * Resolve the authoritative version for a skill from its plugin manifest.
 *
 * @param installCmd the skill's `installCmd` frontmatter value
 * @returns the plugin's semver string, or `null` if the skill has no installCmd
 *          (e.g. a draft without a published plugin yet)
 * @throws if installCmd names a plugin that has no manifest on disk — a real
 *         misconfiguration we want to fail loudly at build time, not paper over.
 */
export function resolveSkillVersion(installCmd: string | undefined): string | null {
  const pluginName = pluginNameFromInstallCmd(installCmd);
  if (!pluginName) return null;
  return versionForPlugin(pluginName, `resolveSkillVersion("${installCmd}")`);
}

/**
 * Resolve the version for a bundle (compliance/publish) from its bundle plugin
 * manifest — NOT from any per-skill plugin. The bundle is installed as a single
 * plugin (`quirgs-compliance` / `quirgs-publish`) and versioned independently.
 *
 * @throws if the bundle is unknown or its plugin manifest is missing.
 */
export function resolveBundleVersion(bundle: 'compliance' | 'publish'): string {
  const pluginName = BUNDLE_PLUGIN[bundle];
  if (!pluginName) {
    throw new Error(`resolveBundleVersion: unknown bundle "${bundle}".`);
  }
  return versionForPlugin(pluginName, `resolveBundleVersion("${bundle}")`);
}
