// scripts/seed-registry.mjs
//
// Reseed the registry-api KV namespace (api.quirgs.com) from source — so the
// public skill catalog never drifts from the repo. Run after adding a skill or
// bumping a plugin version.
//
//   node scripts/seed-registry.mjs            # write all entries to remote KV
//   node scripts/seed-registry.mjs --dry-run  # print entries, write nothing
//
// Entry construction (sources of truth, 11-field schema) lives in
// scripts/lib/registry-entries.mjs, shared with check-live-integrity.mjs so the
// integrity check always compares against exactly what this script writes.
//
// Writes go through `wrangler kv key put --remote`. The OAuth login can do this
// as long as you pass --namespace-id explicitly (see CLAUDE.md / memory). No
// REGISTRY_WRITE_TOKEN needed for this path.

import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { buildRegistryEntries } from './lib/registry-entries.mjs';

const NAMESPACE_ID = 'ab23c8017bc846ae96253e1c2207d716'; // QUIRGS_REGISTRY
const DRY_RUN = process.argv.includes('--dry-run');

const entries = buildRegistryEntries(process.cwd());

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
