/**
 * Quirgs Registry API Worker
 * 
 * Serves as the skill catalog for quirgs.com.
 * Backed by Cloudflare KV namespace binding: QUIRGS_REGISTRY.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

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

    // Helper to build JSON response
    const jsonResponse = (body, status = 200, extraHeaders = {}) => {
      return new Response(JSON.stringify(body), {
        status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
          ...extraHeaders
        }
      });
    };

    // 2. GET /skills
    if (path === '/skills' && request.method === 'GET') {
      try {
        const list = await env.QUIRGS_REGISTRY.list();
        const keys = list.keys || [];
        
        // Fetch all values concurrently
        const fetchPromises = keys.map(key => env.QUIRGS_REGISTRY.get(key.name));
        const rawValues = await Promise.all(fetchPromises);
        
        const skills = [];
        for (const rawVal of rawValues) {
          if (rawVal !== null) {
            try {
              skills.push(JSON.parse(rawVal));
            } catch (err) {
              // If not valid JSON, push as raw value (should not happen in production)
              skills.push(rawVal);
            }
          }
        }

        return jsonResponse(skills, 200, {
          'Cache-Control': 'max-age=60'
        });
      } catch (err) {
        return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
      }
    }

    // 3. Match /skills/:slug routes
    const skillMatch = path.match(/^\/skills\/([^/]+)$/);
    if (skillMatch) {
      const slug = skillMatch[1];

      // GET /skills/:slug
      if (request.method === 'GET') {
        try {
          const value = await env.QUIRGS_REGISTRY.get(slug);
          if (value === null) {
            return jsonResponse({ error: 'not found' }, 404);
          }
          
          let parsedValue;
          try {
            parsedValue = JSON.parse(value);
          } catch (err) {
            parsedValue = value;
          }

          return jsonResponse(parsedValue, 200, {
            'Cache-Control': 'max-age=60'
          });
        } catch (err) {
          return jsonResponse({ error: `Internal server error: ${err.message}` }, 500);
        }
      }

      // POST /skills/:slug
      if (request.method === 'POST') {
        // Token authorization check
        const authHeader = request.headers.get('Authorization');
        const expectedToken = env.REGISTRY_WRITE_TOKEN;

        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken) {
          return jsonResponse({ error: 'unauthorized' }, 401);
        }

        try {
          let body;
          try {
            body = await request.json();
          } catch (err) {
            return jsonResponse({ error: 'invalid json body' }, 400);
          }

          // Write request body to KV at key = slug
          await env.QUIRGS_REGISTRY.put(slug, JSON.stringify(body));
          return jsonResponse({ ok: true }, 200);
        } catch (err) {
          return jsonResponse({ error: `KV write error: ${err.message}` }, 500);
        }
      }
    }

    // 4. Unknown routes
    return jsonResponse({ error: 'not found' }, 404);
  }
};
