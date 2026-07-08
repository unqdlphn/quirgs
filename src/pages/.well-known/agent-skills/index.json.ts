// Agent Skills Discovery index (RFC v0.2.0), built at astro build time
// directly from skills/*/SKILL.md — the same files the Gist-sync workflow
// publishes (.github/workflows/sync-gists.yml). No copy is checked into git;
// this endpoint (and ./[slug]/SKILL.md.ts) are the only places this data is
// produced, so it can never drift from source.
//
// Uses import.meta.glob (not node:fs) because the Cloudflare adapter
// prerenders API routes inside a workerd sandbox without node:fs — see
// scripts/lib/registry-entries.mjs / CLAUDE.md for the same constraint on
// plugin-version resolution.
//
// Schema: https://schemas.agentskills.io/discovery/0.2.0/schema.json
/// <reference types="astro/client" />
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { parse as parseYaml } from 'yaml';

export const prerender = true;

const skillFiles = import.meta.glob('/skills/*/SKILL.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function frontmatter(text: string) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error('No frontmatter found');
  return parseYaml(m[1]);
}

export const GET: APIRoute = () => {
  const skills = Object.entries(skillFiles)
    .map(([path, content]) => {
      const slug = path.match(/\/skills\/([^/]+)\/SKILL\.md$/)![1];
      const fm = frontmatter(content);
      const digest = createHash('sha256').update(content, 'utf-8').digest('hex');
      return {
        slug,
        entry: {
          name: fm.name,
          type: 'skill-md',
          description: String(fm.description).trim().slice(0, 1024),
          url: `/.well-known/agent-skills/${slug}/SKILL.md`,
          digest: `sha256:${digest}`,
        },
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((s) => s.entry);

  const body = JSON.stringify(
    { $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json', skills },
    null,
    2
  );

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
