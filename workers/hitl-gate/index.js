/**
 * HITL Gate Worker
 *
 * Serves as the event log for all human-in-the-loop review checkpoints.
 * Backed by Cloudflare D1 database binding: HITL_DB.
 *
 * Auth model: a single Bearer token (env.HITL_WRITE_TOKEN) gates EVERY data
 * operation — list, read-by-id, create, and decision. There is no anonymous
 * read path: the event payloads can carry review material and must not be
 * world-readable. The /review dashboard collects the token client-side and
 * sends it on every request.
 *
 * Schema & TTL: the `events` table is provisioned by D1 migrations
 * (migrations/0001_init.sql), NOT by runtime DDL. The 30-day archive sweep runs
 * on a Cron Trigger (see scheduled() and [triggers] in wrangler.toml), so reads
 * never perform writes.
 */

// Default origins allowed to call the gate from a browser. Overridable via the
// ALLOWED_ORIGINS env var (comma-separated). curl / server-to-server callers
// send no Origin and are unaffected.
const DEFAULT_ALLOWED_ORIGINS = [
  'https://quirgs.com',
  'https://www.quirgs.com',
];

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

function allowedOrigins(env) {
  if (env && typeof env.ALLOWED_ORIGINS === 'string' && env.ALLOWED_ORIGINS.trim()) {
    return env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

// Reflect the request Origin only when it is allow-listed. Falls back to the
// first allowed origin so a missing/blocked Origin never gets a wildcard.
function corsHeaders(request, env) {
  const list = allowedOrigins(env);
  const origin = request.headers.get('Origin');
  const allow = origin && list.includes(origin) ? origin : list[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

const jsonResponse = (body, status, cors) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
    },
  });
};

function parsePayload(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;
  }
}

function serializeEvent(row) {
  return {
    id: row.id,
    type: row.type,
    payload: parsePayload(row.payload),
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(request, env);

    // 1. Handle CORS OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Single Bearer token gates every data operation (read and write).
    const checkAuth = () => {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.HITL_WRITE_TOKEN;
      return Boolean(
        expectedToken &&
        authHeader &&
        authHeader.startsWith('Bearer ') &&
        authHeader.slice(7) === expectedToken
      );
    };

    // 2. GET /events — authenticated, paginated list of non-archived events.
    if (path === '/events' && method === 'GET') {
      if (!checkAuth()) {
        return jsonResponse({ error: 'unauthorized' }, 401, cors);
      }
      try {
        // limit: clamp to [1, MAX_LIMIT]; before: keyset cursor on created_at.
        let limit = parseInt(url.searchParams.get('limit'), 10);
        if (!Number.isFinite(limit) || limit <= 0) limit = DEFAULT_LIMIT;
        limit = Math.min(limit, MAX_LIMIT);

        const beforeRaw = url.searchParams.get('before');
        const before = beforeRaw !== null ? parseInt(beforeRaw, 10) : null;
        const hasCursor = Number.isFinite(before);

        const query = hasCursor
          ? env.HITL_DB.prepare(
              "SELECT * FROM events WHERE status != 'archived' AND created_at < ? ORDER BY created_at DESC LIMIT ?"
            ).bind(before, limit)
          : env.HITL_DB.prepare(
              "SELECT * FROM events WHERE status != 'archived' ORDER BY created_at DESC LIMIT ?"
            ).bind(limit);

        const { results } = await query.all();
        return jsonResponse(results.map(serializeEvent), 200, cors);
      } catch (err) {
        return jsonResponse({ error: `Internal server error: ${err.message}` }, 500, cors);
      }
    }

    // 3. POST /events
    if (path === '/events' && method === 'POST') {
      if (!checkAuth()) {
        return jsonResponse({ error: 'unauthorized' }, 401, cors);
      }

      try {
        let body;
        try {
          body = await request.json();
        } catch (err) {
          return jsonResponse({ error: 'invalid json body' }, 400, cors);
        }

        if (!body || typeof body.type !== 'string' || !body.type.trim() || typeof body.payload !== 'object' || body.payload === null) {
          return jsonResponse({ error: 'missing required fields: type, payload' }, 400, cors);
        }

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const payloadStr = JSON.stringify(body.payload);

        await env.HITL_DB.prepare(
          "INSERT INTO events (id, type, payload, status, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?)"
        ).bind(id, body.type, payloadStr, now, now).run();

        // Fire webhook notification if configured (non-blocking)
        const webhookUrl = env.WEBHOOK_URL;
        if (webhookUrl) {
          ctx.waitUntil(
            fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event_id: id,
                type: body.type,
                item: body.payload?.item ?? null,
                stage: body.payload?.stage ?? null,
                frameworks: body.payload?.frameworks ?? null,
                status: 'pending',
                review_url: `${url.origin}/events/${id}`,
                timestamp: now,
              }),
            }).catch(() => {}) // fire-and-forget — webhook errors must not fail the event POST
          );
        }

        return jsonResponse({ ok: true, id }, 201, cors);
      } catch (err) {
        return jsonResponse({ error: `Internal server error: ${err.message}` }, 500, cors);
      }
    }

    // 4. Match /events/:id routes
    const eventMatch = path.match(/^\/events\/([^/]+)$/);
    if (eventMatch) {
      const id = eventMatch[1];

      // GET /events/:id — authenticated single-event read.
      if (method === 'GET') {
        if (!checkAuth()) {
          return jsonResponse({ error: 'unauthorized' }, 401, cors);
        }
        try {
          const event = await env.HITL_DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
          if (!event) {
            return jsonResponse({ error: 'not found' }, 404, cors);
          }
          return jsonResponse(serializeEvent(event), 200, cors);
        } catch (err) {
          return jsonResponse({ error: `Internal server error: ${err.message}` }, 500, cors);
        }
      }

      // PATCH /events/:id
      if (method === 'PATCH') {
        if (!checkAuth()) {
          return jsonResponse({ error: 'unauthorized' }, 401, cors);
        }

        try {
          let body;
          try {
            body = await request.json();
          } catch (err) {
            return jsonResponse({ error: 'invalid json body' }, 400, cors);
          }

          const newStatus = body ? body.status : null;
          if (newStatus === 'archived') {
            return jsonResponse({ error: 'use TTL for archiving' }, 400, cors);
          }
          if (newStatus !== 'approved' && newStatus !== 'rejected') {
            return jsonResponse({ error: 'invalid status' }, 400, cors);
          }

          const event = await env.HITL_DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
          if (!event) {
            return jsonResponse({ error: 'not found' }, 404, cors);
          }

          if (event.status !== 'pending') {
            return jsonResponse({ error: 'event is not pending' }, 400, cors);
          }

          const now = Math.floor(Date.now() / 1000);
          await env.HITL_DB.prepare(
            "UPDATE events SET status = ?, updated_at = ? WHERE id = ?"
          ).bind(newStatus, now, id).run();

          return jsonResponse({ ok: true }, 200, cors);
        } catch (err) {
          return jsonResponse({ error: `Internal server error: ${err.message}` }, 500, cors);
        }
      }
    }

    // 5. Unknown routes
    return jsonResponse({ error: 'not found' }, 404, cors);
  },

  // Cron Trigger: archive events older than 30 days. Replaces the lazy
  // write-on-read TTL so GET requests never mutate the table.
  async scheduled(controller, env, ctx) {
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - TTL_SECONDS;
    await env.HITL_DB.prepare(
      "UPDATE events SET status = 'archived', updated_at = ? WHERE status != 'archived' AND created_at < ?"
    ).bind(now, cutoff).run();
  },
};
