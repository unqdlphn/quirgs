// Serves the exact bytes of skills/<slug>/SKILL.md at build time, so the
// digest published in ../index.json.ts always matches what's actually served
// here — no separate copy to keep in lockstep.
//
// Uses import.meta.glob (not node:fs) — the Cloudflare adapter prerenders API
// routes inside a workerd sandbox without node:fs.
/// <reference types="astro/client" />
import type { APIRoute, GetStaticPaths } from 'astro';

const skillFiles = import.meta.glob('/skills/*/SKILL.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromPath(path: string): string {
  return path.match(/\/skills\/([^/]+)\/SKILL\.md$/)![1];
}

export const getStaticPaths: GetStaticPaths = () => {
  return Object.keys(skillFiles).map((path) => ({ params: { slug: slugFromPath(path) } }));
};

export const GET: APIRoute = ({ params }) => {
  const entry = Object.entries(skillFiles).find(([path]) => slugFromPath(path) === params.slug);
  const content = entry![1];
  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
