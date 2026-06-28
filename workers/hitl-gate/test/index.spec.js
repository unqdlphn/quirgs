import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import worker from '../index.js';

const AUTH = { Authorization: 'Bearer test-token' };

// This pool version has no per-test isolated storage, so D1 persists across
// tests within the file. The Worker no longer bootstraps the schema at runtime
// (it lives in migrations/0001_init.sql), so recreate the table — mirroring that
// migration — before each test.
beforeEach(async () => {
  await env.HITL_DB.prepare('DROP TABLE IF EXISTS events').run();
  await env.HITL_DB.prepare(`
    CREATE TABLE events (
      id         TEXT    PRIMARY KEY,
      type       TEXT    NOT NULL,
      payload    TEXT    NOT NULL,
      status     TEXT    NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `).run();
});

async function request(path, init = {}) {
  const req = new Request(`https://hitl.test${path}`, init);
  const ctx = createExecutionContext();
  const res = await worker.fetch(req, env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

// Authenticated GET — reads now require the Bearer token.
function authGet(path) {
  return request(path, { headers: AUTH });
}

function sendJSON(method, path, body, headers = {}) {
  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

// Drive the Cron Trigger handler (the TTL archive sweep).
async function runScheduled() {
  const ctx = createExecutionContext();
  await worker.scheduled({ cron: '0 3 * * *', scheduledTime: Date.now() }, env, ctx);
  await waitOnExecutionContext(ctx);
}

async function createEvent(payload = { note: 'review me' }, type = 'hitl.checkpoint') {
  const res = await sendJSON('POST', '/events', { type, payload }, AUTH);
  expect(res.status).toBe(201);
  const body = await res.json();
  expect(body.ok).toBe(true);
  return body.id;
}

describe('CORS', () => {
  it('answers OPTIONS preflight with 204 and an allow-listed origin', async () => {
    const res = await request('/events', { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    // No Origin header on the request → falls back to the first allowed origin.
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://quirgs.com');
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('PATCH');
    expect(res.headers.get('Vary')).toBe('Origin');
  });

  it('reflects an allow-listed Origin', async () => {
    const res = await request('/events', {
      method: 'OPTIONS',
      headers: { Origin: 'https://www.quirgs.com' },
    });
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://www.quirgs.com');
  });

  it('does not reflect a non-allow-listed Origin (no wildcard)', async () => {
    const res = await request('/events', {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil.example.com' },
    });
    const acao = res.headers.get('Access-Control-Allow-Origin');
    expect(acao).not.toBe('*');
    expect(acao).not.toBe('https://evil.example.com');
    expect(acao).toBe('https://quirgs.com');
  });
});

describe('GET /events', () => {
  it('rejects an unauthenticated request with 401', async () => {
    const res = await request('/events');
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'unauthorized' });
  });

  it('returns an empty list when authenticated', async () => {
    const res = await authGet('/events');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('lists created events newest-first with parsed payloads', async () => {
    const idA = await createEvent({ n: 1 });
    const idB = await createEvent({ n: 2 });
    // created_at has second granularity; force a stable order for the assertion.
    await env.HITL_DB.prepare('UPDATE events SET created_at = created_at - 10 WHERE id = ?')
      .bind(idA)
      .run();

    const res = await authGet('/events');
    const events = await res.json();
    expect(events).toHaveLength(2);
    expect(events[0].id).toBe(idB);
    expect(events[0].payload).toEqual({ n: 2 });
    expect(events[0].status).toBe('pending');
    expect(events[1].id).toBe(idA);
  });

  it('caps results at the requested limit, newest-first', async () => {
    const ids = [];
    for (let i = 0; i < 5; i++) ids.push(await createEvent({ n: i }));
    // Spread created_at so ordering is deterministic (newest = last created).
    for (let i = 0; i < ids.length; i++) {
      await env.HITL_DB.prepare('UPDATE events SET created_at = ? WHERE id = ?')
        .bind(1000 + i, ids[i])
        .run();
    }

    const res = await authGet('/events?limit=2');
    const events = await res.json();
    expect(events).toHaveLength(2);
    expect(events.map((e) => e.id)).toEqual([ids[4], ids[3]]);
  });

  it('paginates with a before cursor on created_at', async () => {
    const ids = [];
    for (let i = 0; i < 3; i++) ids.push(await createEvent({ n: i }));
    for (let i = 0; i < ids.length; i++) {
      await env.HITL_DB.prepare('UPDATE events SET created_at = ? WHERE id = ?')
        .bind(2000 + i, ids[i])
        .run();
    }

    // Page 1: newest two.
    const page1 = await (await authGet('/events?limit=2')).json();
    expect(page1.map((e) => e.id)).toEqual([ids[2], ids[1]]);

    // Page 2: anything older than the last seen created_at.
    const cursor = page1[page1.length - 1].created_at;
    const page2 = await (await authGet(`/events?limit=2&before=${cursor}`)).json();
    expect(page2.map((e) => e.id)).toEqual([ids[0]]);
  });
});

describe('POST /events', () => {
  it('rejects a request with no Authorization header', async () => {
    const res = await sendJSON('POST', '/events', { type: 't', payload: {} });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong bearer token', async () => {
    const res = await sendJSON('POST', '/events', { type: 't', payload: {} }, { Authorization: 'Bearer wrong' });
    expect(res.status).toBe(401);
  });

  it('rejects a malformed JSON body with 400', async () => {
    const res = await request('/events', { method: 'POST', headers: AUTH, body: '{nope' });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'invalid json body' });
  });

  it.each([
    ['missing type', { payload: {} }],
    ['empty type', { type: '   ', payload: {} }],
    ['missing payload', { type: 't' }],
    ['null payload', { type: 't', payload: null }],
    ['non-object payload', { type: 't', payload: 'str' }],
  ])('rejects %s with 400', async (_label, body) => {
    const res = await sendJSON('POST', '/events', body, AUTH);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'missing required fields: type, payload' });
  });

  it('creates a pending event and returns its id', async () => {
    const id = await createEvent({ decision: 'ship?' }, 'hitl.gate');
    const res = await authGet(`/events/${id}`);
    const event = await res.json();
    expect(event).toMatchObject({
      id,
      type: 'hitl.gate',
      payload: { decision: 'ship?' },
      status: 'pending',
    });
    expect(event.created_at).toBeTypeOf('number');
    expect(event.updated_at).toBe(event.created_at);
  });

  it('strips a client-supplied status from the payload (column is the source of truth)', async () => {
    const id = await createEvent({ item: 'x', status: 'pending' }, 'hitl.gate');
    const event = await (await authGet(`/events/${id}`)).json();
    expect(event.status).toBe('pending');
    expect(event.payload).toEqual({ item: 'x' });
    expect(event.payload).not.toHaveProperty('status');
  });

  it('preserves an array payload untouched (no status stripping)', async () => {
    const id = await createEvent(['a', 'b'], 'hitl.list');
    const event = await (await authGet(`/events/${id}`)).json();
    expect(event.payload).toEqual(['a', 'b']);
  });
});

describe('GET /events/:id', () => {
  it('rejects an unauthenticated request with 401', async () => {
    const id = await createEvent();
    const res = await request(`/events/${id}`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await authGet('/events/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /events/:id', () => {
  it('rejects a request with no Authorization header', async () => {
    const id = await createEvent();
    const res = await sendJSON('PATCH', `/events/${id}`, { status: 'approved' });
    expect(res.status).toBe(401);
  });

  it('rejects a malformed JSON body with 400', async () => {
    const id = await createEvent();
    const res = await request(`/events/${id}`, { method: 'PATCH', headers: AUTH, body: '{nope' });
    expect(res.status).toBe(400);
  });

  it("rejects status 'archived' (TTL-only transition)", async () => {
    const id = await createEvent();
    const res = await sendJSON('PATCH', `/events/${id}`, { status: 'archived' }, AUTH);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'use TTL for archiving' });
  });

  it('rejects statuses outside approved/rejected', async () => {
    const id = await createEvent();
    const res = await sendJSON('PATCH', `/events/${id}`, { status: 'pending' }, AUTH);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'invalid status' });
  });

  it('returns 404 for an unknown id', async () => {
    const res = await sendJSON('PATCH', '/events/does-not-exist', { status: 'approved' }, AUTH);
    expect(res.status).toBe(404);
  });

  it.each(['approved', 'rejected'])('transitions a pending event to %s', async (status) => {
    const id = await createEvent();
    const res = await sendJSON('PATCH', `/events/${id}`, { status }, AUTH);
    expect(res.status).toBe(200);

    const readBack = await (await authGet(`/events/${id}`)).json();
    expect(readBack.status).toBe(status);
    expect(readBack.updated_at).toBeGreaterThanOrEqual(readBack.created_at);
  });

  it('approval does not leave a stale status inside the payload', async () => {
    // Regression: a PATCH updated the top-level status column but a status
    // embedded in payload stayed 'pending', so a consumer reading payload.status
    // saw a cleared gate as still pending. With status stripped on POST, the
    // payload carries no status to go stale.
    const id = await createEvent({ item: 'ship it', status: 'pending' });
    await sendJSON('PATCH', `/events/${id}`, { status: 'approved' }, AUTH);
    const event = await (await authGet(`/events/${id}`)).json();
    expect(event.status).toBe('approved');
    expect(event.payload).not.toHaveProperty('status');
  });

  it('rejects a second transition once no longer pending', async () => {
    const id = await createEvent();
    await sendJSON('PATCH', `/events/${id}`, { status: 'approved' }, AUTH);
    const res = await sendJSON('PATCH', `/events/${id}`, { status: 'rejected' }, AUTH);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'event is not pending' });
  });
});

describe('scheduled 30-day TTL', () => {
  it('archives events older than 30 days and hides them from the list', async () => {
    const oldId = await createEvent({ n: 'old' });
    const freshId = await createEvent({ n: 'fresh' });
    const thirtyOneDaysAgo = Math.floor(Date.now() / 1000) - 31 * 24 * 60 * 60;
    await env.HITL_DB.prepare('UPDATE events SET created_at = ? WHERE id = ?')
      .bind(thirtyOneDaysAgo, oldId)
      .run();

    await runScheduled();

    const events = await (await authGet('/events')).json();
    expect(events.map((e) => e.id)).toEqual([freshId]);

    // Archived events remain fetchable by id, with archived status.
    const archived = await (await authGet(`/events/${oldId}`)).json();
    expect(archived.status).toBe('archived');
  });

  it('does not archive events newer than 30 days', async () => {
    const id = await createEvent();
    const twentyNineDaysAgo = Math.floor(Date.now() / 1000) - 29 * 24 * 60 * 60;
    await env.HITL_DB.prepare('UPDATE events SET created_at = ? WHERE id = ?')
      .bind(twentyNineDaysAgo, id)
      .run();

    await runScheduled();

    const events = await (await authGet('/events')).json();
    expect(events.map((e) => e.id)).toEqual([id]);
    expect(events[0].status).toBe('pending');
  });

  it('does not mutate the table on read (GET performs no archiving)', async () => {
    const oldId = await createEvent({ n: 'old' });
    const thirtyOneDaysAgo = Math.floor(Date.now() / 1000) - 31 * 24 * 60 * 60;
    await env.HITL_DB.prepare('UPDATE events SET created_at = ? WHERE id = ?')
      .bind(thirtyOneDaysAgo, oldId)
      .run();

    // Read it directly by id without running the cron — still pending.
    const event = await (await authGet(`/events/${oldId}`)).json();
    expect(event.status).toBe('pending');
  });
});

// The webhook fires via the global `fetch` inside ctx.waitUntil. This pool
// version (@cloudflare/vitest-pool-workers 0.16.x) does not expose the newer
// `fetchMock` MockAgent, but the worker and the test share one workerd isolate,
// so stubbing globalThis.fetch intercepts the outbound webhook call directly.
describe('POST /events — webhook fire', () => {
  const WEBHOOK_URL = 'https://webhook.example.com/hook';
  let fetchSpy;

  // POST an event through a fresh execution context, draining ctx.waitUntil
  // (where the webhook fires) before returning. Pass extra env to toggle WEBHOOK_URL.
  async function postEvent(body, extraEnv = {}) {
    const req = new Request('https://hitl.test/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH },
      body: JSON.stringify(body),
    });
    const ctx = createExecutionContext();
    const res = await worker.fetch(req, { ...env, ...extraEnv }, ctx);
    await waitOnExecutionContext(ctx); // drains the webhook waitUntil promise
    return res;
  }

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('fires the webhook when WEBHOOK_URL is set and receiver returns 200', async () => {
    fetchSpy.mockResolvedValue(new Response('ok', { status: 200 }));

    const res = await postEvent(
      { type: 'test.event', payload: { item: 'foo', stage: 'draft' } },
      { WEBHOOK_URL }
    );
    expect(res.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [calledUrl, calledInit] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe(WEBHOOK_URL);
    expect(calledInit.method).toBe('POST');
    expect(calledInit.headers['Content-Type']).toBe('application/json');
    const sent = JSON.parse(calledInit.body);
    expect(sent).toMatchObject({
      type: 'test.event',
      item: 'foo',
      stage: 'draft',
      status: 'pending',
    });
    expect(sent.review_url).toMatch(/\/events\/.+$/);
  });

  it('returns 201 when receiver returns 500 — error does not surface', async () => {
    fetchSpy.mockResolvedValue(new Response('error', { status: 500 }));

    const res = await postEvent(
      { type: 'test.event', payload: { item: 'bar' } },
      { WEBHOOK_URL }
    );
    expect(res.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Event was still persisted despite the webhook receiver erroring.
    const { id } = await res.json();
    const event = await (await authGet(`/events/${id}`)).json();
    expect(event.status).toBe('pending');
  });

  it('returns 201 when the receiver is unreachable — fetch rejection is swallowed', async () => {
    fetchSpy.mockRejectedValue(new Error('connection refused'));

    const res = await postEvent(
      { type: 'test.event', payload: { item: 'qux' } },
      { WEBHOOK_URL }
    );
    expect(res.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const { id } = await res.json();
    const event = await (await authGet(`/events/${id}`)).json();
    expect(event.status).toBe('pending');
  });

  it('returns 201 with no webhook fire when WEBHOOK_URL is not set', async () => {
    const res = await postEvent({ type: 'test.event', payload: { item: 'baz' } });
    expect(res.status).toBe(201);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('serializes missing optional fields as null, not undefined', async () => {
    fetchSpy.mockResolvedValue(new Response('ok', { status: 200 }));

    // payload has no item, stage, or frameworks
    const res = await postEvent(
      { type: 'test.event', payload: { custom: 'data' } },
      { WEBHOOK_URL }
    );
    expect(res.status).toBe(201);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const sentBody = fetchSpy.mock.calls[0][1].body;
    const parsed = JSON.parse(sentBody);
    expect(parsed.item).toBeNull();
    expect(parsed.stage).toBeNull();
    expect(parsed.frameworks).toBeNull();
    expect(parsed.status).toBe('pending');
    expect(parsed.review_url).toMatch(/^https?:\/\/.+\/events\/.+/);
    // No undefined values leak into the serialized payload.
    expect(sentBody).not.toContain('undefined');
  });
});

describe('routing', () => {
  it('returns 404 for unknown paths', async () => {
    const res = await request('/nope');
    expect(res.status).toBe(404);
  });
});
