// scripts/check-csp-hashes.mjs
//
// CSP script-src hash integrity check.
//
// `public/_headers` ships a strict Content-Security-Policy with no
// 'unsafe-inline' for script-src. Every Astro-bundled inline <script> is
// instead pinned by SHA-256 of its exact body. Those hashes are tied to the
// bytes in dist/client *after a build* — so they go stale silently whenever a
// bundled script changes, or whenever Astro/Vite bumps in a way that alters the
// inlined module wrapper. There is no build-time error: the build succeeds and
// the affected scripts are simply blocked in the browser (broken boot
// animation, copy buttons, site menu, filters).
//
// This asserts the pinned set and the emitted set are the same set.
//
//   npm run check:csp            # verify (requires a prior `npm run build`)
//   npm run check:csp -- --write # rewrite stale pins in public/_headers
//   npm run check:csp -- --strict# also fail on stale (unused) pins
//
// Two failure modes, deliberately weighted differently:
//
//   UNPINNED — emitted into dist/client but absent from _headers. The script
//              WILL be CSP-blocked in production. Always fails.
//   STALE    — pinned in _headers but no longer emitted. Harmless to users
//              (it permits a script that no longer exists) but a reliable
//              signal that a regeneration was missed. Warns; fails under
//              --strict.
//
// Pages whose CSP is deliberately detached in _headers (`! Content-Security-
// Policy` — currently the legacy ollama guide, which carries its own inline
// scripts and must not be modified) are discovered from _headers itself rather
// than hardcoded here, so this stays correct if that list ever changes.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const REPO = process.cwd();
const HEADERS_FILE = join(REPO, 'public/_headers');
const DIST = join(REPO, 'dist/client');

const WRITE = process.argv.includes('--write');
const STRICT = process.argv.includes('--strict');

// Inline <script> = no src= attribute. Includes type=application/ld+json, which
// is not executed but which script-src still applies to as an element.
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
const PIN = /'sha256-([A-Za-z0-9+/=]+)'/g;

const sha256 = (body) => createHash('sha256').update(body, 'utf8').digest('base64');

/**
 * Parse a Cloudflare _headers file into [{ pattern, headers, detached }].
 * Unindented lines open a rule; indented lines are its headers. A `!` prefix
 * removes an inherited header.
 */
function parseHeaders(text) {
  const rules = [];
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (/^\s/.test(raw)) {
      const line = raw.trim();
      if (!rules.length) continue;
      if (line.startsWith('!')) rules.at(-1).detached.push(line.slice(1).trim().toLowerCase());
      else rules.at(-1).headers.push(line);
    } else {
      rules.push({ pattern: raw.trim(), headers: [], detached: [] });
    }
  }
  return rules;
}

/** Cloudflare _headers path pattern -> RegExp. Only `*` is significant here. */
function patternToRegExp(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

/** dist/client/skills/index.html -> /skills/ ; dist/client/index.html -> / */
function urlPathFor(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

if (!existsSync(HEADERS_FILE)) fail(`missing ${relative(REPO, HEADERS_FILE)}`);
if (!existsSync(DIST)) fail(`missing dist/client — run \`npm run build\` first.`);

const headersText = readFileSync(HEADERS_FILE, 'utf8');
const rules = parseHeaders(headersText);

// Paths where the strict CSP is intentionally removed — their inline scripts
// are expected to be unpinned.
const detachedMatchers = rules
  .filter((r) => r.detached.includes('content-security-policy'))
  .map((r) => ({ pattern: r.pattern, re: patternToRegExp(r.pattern) }));

const pinned = [...headersText.matchAll(PIN)].map((m) => m[1]);
const pinnedSet = new Set(pinned);

// hash -> Set of url paths that emit it
const emitted = new Map();
let pagesScanned = 0;
let pagesSkipped = 0;

for await (const file of walk(DIST)) {
  const urlPath = urlPathFor(file);
  const detached = detachedMatchers.find((m) => m.re.test(urlPath));
  if (detached) {
    pagesSkipped++;
    continue;
  }
  pagesScanned++;
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(INLINE_SCRIPT)) {
    const hash = sha256(m[1]);
    if (!emitted.has(hash)) emitted.set(hash, new Set());
    emitted.get(hash).add(urlPath);
  }
}

const unpinned = [...emitted.keys()].filter((h) => !pinnedSet.has(h));
const stale = pinned.filter((h) => !emitted.has(h));

console.log(
  `scanned ${pagesScanned} page(s), skipped ${pagesSkipped} CSP-detached` +
    `${detachedMatchers.length ? ` (${detachedMatchers.map((m) => m.pattern).join(', ')})` : ''}`,
);
console.log(`pinned in _headers: ${pinned.length}   unique inline scripts emitted: ${emitted.size}`);

if (unpinned.length) {
  console.error(`\n✗ UNPINNED — these WILL be CSP-blocked in production:`);
  for (const h of unpinned) {
    console.error(`    'sha256-${h}'`);
    console.error(`        on: ${[...emitted.get(h)].sort().slice(0, 6).join(', ')}`);
  }
}
if (stale.length) {
  console.error(`\n${STRICT ? '✗' : '!'} STALE — pinned but no longer emitted:`);
  for (const h of stale) console.error(`    'sha256-${h}'`);
}

if (WRITE) {
  if (!unpinned.length && !stale.length) {
    console.log('\nNothing to write — _headers is already in sync.');
    process.exit(0);
  }
  if (unpinned.length !== stale.length) {
    fail(
      `--write needs a 1:1 substitution (${stale.length} stale vs ${unpinned.length} unpinned).\n` +
        `  Update public/_headers by hand — a mismatch means scripts were added or removed,\n` +
        `  not just changed, so which pin maps to which is ambiguous.`,
    );
  }
  let out = headersText;
  console.log('');
  for (const [i, old] of stale.entries()) {
    out = out.replaceAll(`'sha256-${old}'`, `'sha256-${unpinned[i]}'`);
    console.log(`  ${old.slice(0, 16)}…  ->  ${unpinned[i].slice(0, 16)}…`);
  }
  writeFileSync(HEADERS_FILE, out);
  console.log(`\n✓ Rewrote ${stale.length} pin(s) in public/_headers. Re-run without --write to confirm.`);
  process.exit(0);
}

if (unpinned.length || (STRICT && stale.length)) {
  fail(
    `CSP script-src pins are out of sync with dist/client.\n` +
      `  Fix: npm run build && npm run check:csp -- --write`,
  );
}

console.log('\n✓ Every inline script is pinned.');
if (!stale.length) console.log('✓ No stale pins.');
