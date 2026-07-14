/**
 * Quirgs Metrics API Worker
 *
 * Read-only proxy in front of Cloudflare's GraphQL Analytics API. Holds the
 * Cloudflare API token as a server-side secret (CF_API_TOKEN) so it never
 * reaches the client — the live-metrics Cowork artifact calls this Worker
 * instead of calling Cloudflare directly.
 *
 * Every route except /health requires `Authorization: Bearer <METRICS_READ_TOKEN>`.
 * That token is a low-value, rotatable shared secret scoped to this Worker
 * only — unlike CF_API_TOKEN it grants no Cloudflare account access on its
 * own, even if it leaks out of a client-side artifact.
 *
 * NOTE ON FIELD NAMES: the GraphQL Analytics API schema evolves over time.
 * A schema mismatch surfaces as a GraphQL `errors` array in the JSON
 * response, not a crash — the Worker returns it as-is (502) rather than
 * masking it. Verified live against production data on 2026-07-14:
 * httpRequestsAdaptiveGroups and firewallEventsAdaptiveGroups are correct
 * as written. Two corrections made after the first live run: `uniq { uniques }`
 * is not a valid field on httpRequestsAdaptiveGroups (removed — unique
 * visitors just isn't reported by /traffic), and the Workers dataset is
 * `workersInvocationsAdaptive`, not `workersInvocationsAdaptiveGroups` (fixed).
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

// Known AI crawler / assistant user-agent substrings (case-insensitive match).
// Governance context: quirgs.com wants to know when these are hitting the
// skill registry (/skills) and legacy guides (/guides/) — see the AI-Indexed
// Content Thesis project memory. Extend this list as new bots show up in the
// "unmatched" bucket the /ai-bots route also returns.
const AI_BOT_PATTERNS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Google-Extended',
  'GoogleOther',
  'Googlebot',
  'Google-CloudVertexBot',
  'Bingbot',
  'BingPreview',
  'Amazonbot',
  'ByteSpider',
  'Applebot-Extended',
  'Applebot',
  'FacebookBot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'MistralAI-User',
  'DuckDuckBot',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
  'cohere-ai',
  'Timpibot',
  'ImagesiftBot',
];

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

function isAuthorized(request, env) {
  const auth = request.headers.get('Authorization');
  return !!env.METRICS_READ_TOKEN && auth === `Bearer ${env.METRICS_READ_TOKEN}`;
}

/** Resolve the ?hours= window (default 24h, clamped 1-168h/7d). */
function resolveWindow(url) {
  const raw = parseInt(url.searchParams.get('hours') || '24', 10);
  const hours = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 168) : 24;
  const end = new Date();
  const start = new Date(end.getTime() - hours * 3600 * 1000);
  return { start: start.toISOString(), end: end.toISOString(), hours };
}

async function graphqlQuery(env, query, variables) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await res.json();
  if (!res.ok || body.errors) {
    return { ok: false, status: res.status, errors: body.errors || [{ message: `HTTP ${res.status}` }] };
  }
  return { ok: true, data: body.data };
}

const TRAFFIC_QUERY = `
  query Traffic($zoneTag: string!, $start: Time!, $end: Time!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        totals: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 1
        ) {
          count
          sum { edgeResponseBytes }
        }
        byStatus: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 20
          orderBy: [count_DESC]
        ) {
          count
          dimensions { edgeResponseStatus }
        }
        byCache: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 10
          orderBy: [count_DESC]
        ) {
          count
          sum { edgeResponseBytes }
          dimensions { cacheStatus }
        }
        topPaths: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 15
          orderBy: [count_DESC]
        ) {
          count
          dimensions { clientRequestPath }
        }
      }
    }
  }
`;

const SECURITY_QUERY = `
  query Security($zoneTag: string!, $start: Time!, $end: Time!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        byAction: firewallEventsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 20
          orderBy: [count_DESC]
        ) {
          count
          dimensions { action }
        }
        bySource: firewallEventsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end }
          limit: 20
          orderBy: [count_DESC]
        ) {
          count
          dimensions { source }
        }
        topBlockedPaths: firewallEventsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_leq: $end
            action_in: ["block", "challenge", "jschallenge", "managedchallenge"]
          }
          limit: 15
          orderBy: [count_DESC]
        ) {
          count
          dimensions { clientRequestPath action }
        }
      }
    }
  }
`;

const AI_BOTS_QUERY = `
  query AiBotTraffic($zoneTag: string!, $start: Time!, $end: Time!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        skills: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end, clientRequestPath_like: "/skills%" }
          limit: 250
          orderBy: [count_DESC]
        ) {
          count
          dimensions { userAgent clientRequestPath }
        }
        guides: httpRequestsAdaptiveGroups(
          filter: { datetime_geq: $start, datetime_leq: $end, clientRequestPath_like: "/guides/%" }
          limit: 250
          orderBy: [count_DESC]
        ) {
          count
          dimensions { userAgent clientRequestPath }
        }
      }
    }
  }
`;

const WORKERS_QUERY = `
  query WorkersHealth($accountTag: string!, $start: Time!, $end: Time!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        registryApi: workersInvocationsAdaptive(
          filter: { scriptName: "quirgs-registry-api", datetime_geq: $start, datetime_leq: $end }
          limit: 1
        ) {
          sum { requests errors subrequests }
          quantiles { cpuTimeP50 cpuTimeP99 }
        }
        hitlGate: workersInvocationsAdaptive(
          filter: { scriptName: "quirgs-hitl-gate", datetime_geq: $start, datetime_leq: $end }
          limit: 1
        ) {
          sum { requests errors subrequests }
          quantiles { cpuTimeP50 cpuTimeP99 }
        }
        mainSite: workersInvocationsAdaptive(
          filter: { scriptName: "quirgs", datetime_geq: $start, datetime_leq: $end }
          limit: 1
        ) {
          sum { requests errors subrequests }
          quantiles { cpuTimeP50 cpuTimeP99 }
        }
      }
    }
  }
`;

function matchAiBot(userAgent) {
  if (!userAgent) return null;
  const lower = userAgent.toLowerCase();
  return AI_BOT_PATTERNS.find((pattern) => lower.includes(pattern.toLowerCase())) || null;
}

/** Merge the skills/guides row sets from AI_BOTS_QUERY into bot-classified summaries. */
function shapeAiBotResponse(zone, hours) {
  const rows = [...(zone?.skills || []), ...(zone?.guides || [])];

  const byBot = new Map(); // botName -> { bot, hits, paths: Map<path, hits> }
  const unmatched = new Map(); // userAgent -> hits (for transparency / list extension)

  for (const row of rows) {
    const ua = row.dimensions?.userAgent || '(unknown)';
    const path = row.dimensions?.clientRequestPath || '(unknown)';
    const count = row.count || 0;
    const bot = matchAiBot(ua);

    if (bot) {
      if (!byBot.has(bot)) byBot.set(bot, { bot, hits: 0, paths: new Map() });
      const entry = byBot.get(bot);
      entry.hits += count;
      entry.paths.set(path, (entry.paths.get(path) || 0) + count);
    } else {
      unmatched.set(ua, (unmatched.get(ua) || 0) + count);
    }
  }

  return {
    window_hours: hours,
    known_ai_bots: [...byBot.values()]
      .map((e) => ({
        bot: e.bot,
        hits: e.hits,
        top_paths: [...e.paths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([path, hits]) => ({ path, hits })),
      }))
      .sort((a, b) => b.hits - a.hits),
    unmatched_user_agents: [...unmatched.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([userAgent, hits]) => ({ userAgent, hits })),
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/health' && request.method === 'GET') {
      return jsonResponse({ ok: true, worker: 'quirgs-metrics-api' });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method not allowed' }, 405);
    }

    if (!isAuthorized(request, env)) {
      return jsonResponse({ error: 'unauthorized' }, 401);
    }

    const KNOWN_ROUTES = ['/traffic', '/security', '/ai-bots', '/workers'];
    if (!KNOWN_ROUTES.includes(path)) {
      return jsonResponse({ error: 'not found' }, 404);
    }

    if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID || !env.CF_ZONE_ID) {
      return jsonResponse(
        { error: 'worker misconfigured: CF_API_TOKEN / CF_ACCOUNT_ID / CF_ZONE_ID not set' },
        500
      );
    }

    const { start, end, hours } = resolveWindow(url);

    if (path === '/traffic') {
      const result = await graphqlQuery(env, TRAFFIC_QUERY, { zoneTag: env.CF_ZONE_ID, start, end });
      if (!result.ok) return jsonResponse({ error: 'graphql error', details: result.errors }, 502);
      const zone = result.data?.viewer?.zones?.[0] || {};
      return jsonResponse({ window_hours: hours, ...zone }, 200, { 'Cache-Control': 'max-age=60' });
    }

    if (path === '/security') {
      const result = await graphqlQuery(env, SECURITY_QUERY, { zoneTag: env.CF_ZONE_ID, start, end });
      if (!result.ok) return jsonResponse({ error: 'graphql error', details: result.errors }, 502);
      const zone = result.data?.viewer?.zones?.[0] || {};
      return jsonResponse({ window_hours: hours, ...zone }, 200, { 'Cache-Control': 'max-age=60' });
    }

    if (path === '/ai-bots') {
      const result = await graphqlQuery(env, AI_BOTS_QUERY, { zoneTag: env.CF_ZONE_ID, start, end });
      if (!result.ok) return jsonResponse({ error: 'graphql error', details: result.errors }, 502);
      const zone = result.data?.viewer?.zones?.[0] || {};
      return jsonResponse(shapeAiBotResponse(zone, hours), 200, { 'Cache-Control': 'max-age=60' });
    }

    if (path === '/workers') {
      const result = await graphqlQuery(env, WORKERS_QUERY, { accountTag: env.CF_ACCOUNT_ID, start, end });
      if (!result.ok) return jsonResponse({ error: 'graphql error', details: result.errors }, 502);
      const account = result.data?.viewer?.accounts?.[0] || {};
      return jsonResponse(
        {
          window_hours: hours,
          'registry-api': account.registryApi?.[0] || null,
          'hitl-gate': account.hitlGate?.[0] || null,
          quirgs: account.mainSite?.[0] || null,
        },
        200,
        { 'Cache-Control': 'max-age=60' }
      );
    }
  },
};
