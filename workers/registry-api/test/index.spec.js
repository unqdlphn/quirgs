import { describe, it, expect, beforeEach } from 'vitest';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import worker from '../index.js';

const AUTH = { Authorization: 'Bearer test-token' };

// This pool version has no per-test isolated storage, so KV persists across
// tests within the file — clear it before each one.
beforeEach(async () => {
  const { keys } = await env.QUIRGS_REGISTRY.list();
  await Promise.all(keys.map((key) => env.QUIRGS_REGISTRY.delete(key.name)));
});

async function request(path, init = {}) {
  const req = new Request(`https://registry.test${path}`, init);
  const ctx = createExecutionContext();
  const res = await worker.fetch(req, env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

function postJSON(path, body, headers = {}) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

describe('CORS', () => {
  it('answers OPTIONS preflight with 204 and CORS headers', async () => {
    const res = await request('/skills', { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });

  it('sets CORS headers on JSON responses', async () => {
    const res = await request('/skills');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});

describe('GET /skills', () => {
  it('returns an empty array when KV is empty', async () => {
    const res = await request('/skills');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('returns all stored skills with a cache header', async () => {
    await env.QUIRGS_REGISTRY.put('skill-a', JSON.stringify({ slug: 'skill-a', version: '1.0.0' }));
    await env.QUIRGS_REGISTRY.put('skill-b', JSON.stringify({ slug: 'skill-b', version: '2.0.0' }));

    const res = await request('/skills');
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('max-age=60');
    const skills = await res.json();
    expect(skills).toHaveLength(2);
    expect(skills.map((s) => s.slug).sort()).toEqual(['skill-a', 'skill-b']);
  });

  it('passes through a non-JSON KV value as a raw string', async () => {
    await env.QUIRGS_REGISTRY.put('raw-skill', 'not json');
    const res = await request('/skills');
    expect(await res.json()).toEqual(['not json']);
  });
});

describe('GET /skills/:slug', () => {
  it('returns 404 for an unknown slug', async () => {
    const res = await request('/skills/nope');
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'not found' });
  });

  it('returns the parsed skill for a known slug', async () => {
    await env.QUIRGS_REGISTRY.put('skill-a', JSON.stringify({ slug: 'skill-a', tags: ['x'] }));
    const res = await request('/skills/skill-a');
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('max-age=60');
    expect(await res.json()).toEqual({ slug: 'skill-a', tags: ['x'] });
  });
});

describe('POST /skills/:slug', () => {
  it('rejects a request with no Authorization header', async () => {
    const res = await postJSON('/skills/skill-a', { slug: 'skill-a' });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong bearer token', async () => {
    const res = await postJSON('/skills/skill-a', { slug: 'skill-a' }, { Authorization: 'Bearer wrong' });
    expect(res.status).toBe(401);
  });

  it('rejects a non-Bearer auth scheme', async () => {
    const res = await postJSON('/skills/skill-a', { slug: 'skill-a' }, { Authorization: 'Basic test-token' });
    expect(res.status).toBe(401);
  });

  it('rejects a malformed JSON body with 400', async () => {
    const res = await request('/skills/skill-a', { method: 'POST', headers: AUTH, body: '{nope' });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'invalid json body' });
  });

  it('writes the body to KV and round-trips through GET', async () => {
    const skill = { slug: 'skill-a', version: '1.0.0', status: 'live' };
    const res = await postJSON('/skills/skill-a', skill, AUTH);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const readBack = await request('/skills/skill-a');
    expect(await readBack.json()).toEqual(skill);
  });

  it('overwrites an existing key', async () => {
    await postJSON('/skills/skill-a', { version: '1.0.0' }, AUTH);
    await postJSON('/skills/skill-a', { version: '1.1.0' }, AUTH);
    const res = await request('/skills/skill-a');
    expect(await res.json()).toEqual({ version: '1.1.0' });
  });
});

describe('routing', () => {
  it('returns 404 for unknown paths', async () => {
    const res = await request('/nope');
    expect(res.status).toBe(404);
  });

  it('returns 404 for nested skill paths', async () => {
    const res = await request('/skills/a/b');
    expect(res.status).toBe(404);
  });
});
