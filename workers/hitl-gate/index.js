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
 *
 * Retention: archived rows are hard-deleted 60 days after archiving (same cron).
 * Full lifecycle: ~30 days active → 60 days archived → deleted (~90 days total).
 * Payloads can carry review material, so retention is deliberately bounded —
 * do not remove the delete step without re-assessing risk R-007 in the
 * governance risk register.
 */

// Default origins allowed to call the gate from a browser. Overridable via the
// ALLOWED_ORIGINS env var (comma-separated). curl / server-to-server callers
// send no Origin and are unaffected.
const DEFAULT_ALLOWED_ORIGINS = [
  'https://quirgs.com',
  'https://www.quirgs.com',
];

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days active before archiving
const RETENTION_SECONDS = 60 * 24 * 60 * 60; // 60 days archived before hard delete
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

function parseNotificationFields(payload) {
  const rawItem = payload?.item ?? null;
  const rawStage = payload?.stage ?? null;
  const rawFrameworks = payload?.frameworks ?? null;

  // Clean strings for email/subject (CRLF stripping + capping length)
  const clean = (val, max) => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/[\r\n]+/g, ' ').trim();
    return str.length > max ? str.slice(0, max - 3) + '...' : str;
  };

  const emailItem = clean(rawItem, 150) || '(no item)';
  const emailStage = clean(rawStage, 50) || 'n/a';

  let emailFrameworks = 'n/a';
  if (Array.isArray(rawFrameworks)) {
    emailFrameworks = rawFrameworks
      .map((f) => clean(f, 30))
      .filter(Boolean)
      .join(', ');
    if (!emailFrameworks) emailFrameworks = 'n/a';
  } else if (rawFrameworks !== null) {
    emailFrameworks = clean(rawFrameworks, 100) || 'n/a';
  }

  return {
    raw: {
      item: rawItem,
      stage: rawStage,
      frameworks: rawFrameworks,
    },
    email: {
      item: emailItem,
      stage: emailStage,
      frameworks: emailFrameworks,
    },
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

    // Health check — no auth required. Lets monitoring confirm the worker is
    // alive without exposing HITL_WRITE_TOKEN.
    if (path === '/health' && method === 'GET') {
      return jsonResponse({ ok: true, ts: Math.floor(Date.now() / 1000) }, 200, cors);
    }

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
        // `status` is gate-managed on the top-level column. Strip any client-
        // supplied copy from the payload so the two can't diverge: a PATCH updates
        // the column, never the embedded JSON, so a retained payload.status would
        // go stale on the first approval. Single source of truth = the column.
        // (Arrays pass the object check above; leave those untouched.)
        let payloadToStore = body.payload;
        if (!Array.isArray(body.payload) && 'status' in body.payload) {
          const { status: _gateManaged, ...rest } = body.payload;
          payloadToStore = rest;
        }
        const payloadStr = JSON.stringify(payloadToStore);

        await env.HITL_DB.prepare(
          "INSERT INTO events (id, type, payload, status, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?)"
        ).bind(id, body.type, payloadStr, now, now).run();

        const notification = parseNotificationFields(body.payload);

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
                item: notification.raw.item,
                stage: notification.raw.stage,
                frameworks: notification.raw.frameworks,
                status: 'pending',
                review_url: `${url.origin}/events/${id}`,
                timestamp: now,
              }),
            }).catch(() => {}) // fire-and-forget — webhook errors must not fail the event POST
          );
        }

        // Fire email notification if configured (non-blocking). Separate from the
        // webhook above — this is a Quirgs-operated channel via Cloudflare Email
        // Service, not part of the generic self-host webhook path.
        if (env.EMAIL && typeof env.EMAIL.send === 'function' && env.GATE_NOTIFY_TO) {
          const reviewUrl = `${url.origin}/events/${id}`;
          ctx.waitUntil(
            (async () => {
              try {
                await env.EMAIL.send({
                  to: env.GATE_NOTIFY_TO,
                  from: env.GATE_NOTIFY_FROM || 'gate@notify.quirgs.com',
                  subject: `HITL Gate — pending: ${notification.email.item}`,
                  text:
                    `A new event is pending review.\n\n` +
                    `Type: ${body.type}\n` +
                    `Item: ${notification.email.item}\n` +
                    `Stage: ${notification.email.stage}\n` +
                    `Frameworks: ${notification.email.frameworks}\n` +
                    `Event ID: ${id}\n\n` +
                    `Review and approve/reject at https://quirgs.com/review/\n` +
                    `Raw event: ${reviewUrl}`,
                });
              } catch (err) {
                // Safely ignore email transmission failures
              }
            })()
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

  // Cron Trigger: archive events older than 30 days, then hard-delete rows
  // archived more than 60 days ago. Archiving stamps updated_at, so a row
  // archived by this sweep is not eligible for deletion until RETENTION_SECONDS
  // later — the two steps never touch the same row in one run.
  async scheduled(controller, env, ctx) {
    const now = Math.floor(Date.now() / 1000);
    const archiveCutoff = now - TTL_SECONDS;
    await env.HITL_DB.prepare(
      "UPDATE events SET status = 'archived', updated_at = ? WHERE status != 'archived' AND created_at < ?"
    ).bind(now, archiveCutoff).run();

    // Bounded retention (risk R-007): payloads can carry review material, so
    // archived rows must not accumulate indefinitely.
    const deleteCutoff = now - RETENTION_SECONDS;
    await env.HITL_DB.prepare(
      "DELETE FROM events WHERE status = 'archived' AND updated_at < ?"
    ).bind(deleteCutoff).run();
  },
};
