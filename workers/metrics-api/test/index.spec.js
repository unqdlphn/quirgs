import { describe, it, expect } from 'vitest';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import worker from '../index.js';

const AUTH = { Authorization: 'Bearer test-token' };

async function request(path, init = {}) {
  const req = new Request(`https://metrics.test${path}`, init);
  const ctx = createExecutionContext();
  const res = await worker.fetch(req, env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe('CORS', () => {
  it('answers OPTIONS preflight with 204 and CORS headers', async () => {
    const res = await request('/traffic', { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
  });
});

describe('GET /health', () => {
  it('is unauthenticated and returns ok', async () => {
    const res = await request('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, worker: 'quirgs-metrics-api' });
  });
});

describe('auth gate', () => {
  for (const path of ['/traffic', '/security', '/ai-bots', '/workers']) {
    it(`rejects ${path} with no Authorization header`, async () => {
      const res = await request(path);
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'unauthorized' });
    });

    it(`rejects ${path} with a wrong bearer token`, async () => {
      const res = await request(path, { headers: { Authorization: 'Bearer wrong' } });
      expect(res.status).toBe(401);
    });

    it(`rejects a non-GET method on ${path}`, async () => {
      const res = await request(path, { method: 'POST', headers: AUTH });
      expect(res.status).toBe(405);
    });
  }
});

describe('misconfiguration guard', () => {
  it('returns 500 when CF_API_TOKEN/CF_ACCOUNT_ID/CF_ZONE_ID are unset', async () => {
    // vitest.config.js deliberately omits these bindings so this path is
    // exercised without calling the real Cloudflare GraphQL API.
    const res = await request('/traffic', { headers: AUTH });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/misconfigured/);
  });
});

describe('routing', () => {
  it('returns 404 for unknown paths', async () => {
    const res = await request('/nope', { headers: AUTH });
    expect(res.status).toBe(404);
  });
});
