/**
 * HITL Gate Worker
 * 
 * Serves as the event log for all human-in-the-loop review checkpoints.
 * Backed by Cloudflare D1 database binding: HITL_DB.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const jsonResponse = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json'
    }
  });
};

async function ensureTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS events (
      id        TEXT    PRIMARY KEY,
      type      TEXT    NOT NULL,
      payload   TEXT    NOT NULL,
      status    TEXT    NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `).run();
}

async function applyLazyTTL(db) {
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60); // 2592000 seconds
  await db.prepare(
    "UPDATE events SET status = 'archived', updated_at = ? WHERE status != 'archived' AND created_at < ?"
  ).bind(now, thirtyDaysAgo).run();
}

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Helper for Bearer token authentication
    const checkAuth = () => {
      const authHeader = request.headers.get('Authorization');
      const expectedToken = env.HITL_WRITE_TOKEN;
      return authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7) === expectedToken;
    };

    // 2. GET /events
    if (path === '/events' && method === 'GET') {
      try {
        await ensureTable(env.HITL_DB);
        await applyLazyTTL(env.HITL_DB);

        const { results } = await env.HITL_DB.prepare(
          "SELECT * FROM events WHERE status != 'archived' ORDER BY created_at DESC"
        ).all();

        const events = results.map(row => {
          let payloadObj;
          try {
            payloadObj = JSON.parse(row.payload);
          } catch (e) {
            payloadObj = row.payload;
          }
          return {
            id: row.id,
            type: row.type,
            payload: payloadObj,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at
          };
        });

        return jsonResponse(events, 200);
      } catch (err) {
        return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
      }
    }

    // 3. POST /events
    if (path === '/events' && method === 'POST') {
      if (!checkAuth()) {
        return jsonResponse({ error: 'unauthorized' }, 401);
      }

      try {
        await ensureTable(env.HITL_DB);

        let body;
        try {
          body = await request.json();
        } catch (err) {
          return jsonResponse({ error: 'invalid json body' }, 400);
        }

        if (!body || typeof body.type !== 'string' || !body.type.trim() || typeof body.payload !== 'object' || body.payload === null) {
          return jsonResponse({ error: 'missing required fields: type, payload' }, 400);
        }

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const payloadStr = JSON.stringify(body.payload);

        await env.HITL_DB.prepare(
          "INSERT INTO events (id, type, payload, status, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?)"
        ).bind(id, body.type, payloadStr, now, now).run();

        return jsonResponse({ ok: true, id }, 201);
      } catch (err) {
        return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
      }
    }

    // 4. Match /events/:id routes
    const eventMatch = path.match(/^\/events\/([^/]+)$/);
    if (eventMatch) {
      const id = eventMatch[1];

      // GET /events/:id
      if (method === 'GET') {
        try {
          await ensureTable(env.HITL_DB);
          await applyLazyTTL(env.HITL_DB);

          const event = await env.HITL_DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
          if (!event) {
            return jsonResponse({ error: 'not found' }, 404);
          }

          let payloadObj;
          try {
            payloadObj = JSON.parse(event.payload);
          } catch (e) {
            payloadObj = event.payload;
          }

          return jsonResponse({
            id: event.id,
            type: event.type,
            payload: payloadObj,
            status: event.status,
            created_at: event.created_at,
            updated_at: event.updated_at
          }, 200);
        } catch (err) {
          return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
        }
      }

      // PATCH /events/:id
      if (method === 'PATCH') {
        if (!checkAuth()) {
          return jsonResponse({ error: 'unauthorized' }, 401);
        }

        try {
          await ensureTable(env.HITL_DB);
          await applyLazyTTL(env.HITL_DB);

          let body;
          try {
            body = await request.json();
          } catch (err) {
            return jsonResponse({ error: 'invalid json body' }, 400);
          }

          const newStatus = body ? body.status : null;
          if (newStatus === 'archived') {
            return jsonResponse({ error: 'use TTL for archiving' }, 400);
          }
          if (newStatus !== 'approved' && newStatus !== 'rejected') {
            return jsonResponse({ error: 'invalid status' }, 400);
          }

          const event = await env.HITL_DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
          if (!event) {
            return jsonResponse({ error: 'not found' }, 404);
          }

          if (event.status !== 'pending') {
            return jsonResponse({ error: 'event is not pending' }, 400);
          }

          const now = Math.floor(Date.now() / 1000);
          await env.HITL_DB.prepare(
            "UPDATE events SET status = ?, updated_at = ? WHERE id = ?"
          ).bind(newStatus, now, id).run();

          return jsonResponse({ ok: true }, 200);
        } catch (err) {
          return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
        }
      }
    }

    // 5. Unknown routes
    return jsonResponse({ error: 'not found' }, 404);
  }
};
