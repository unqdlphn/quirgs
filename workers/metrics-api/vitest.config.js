import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.toml' },
      miniflare: {
        // Test-only overrides — deploys still use wrangler.toml + secrets.
        // CF_API_TOKEN is deliberately left unset so tests can exercise the
        // "worker misconfigured" 500 path without hitting the real Cloudflare
        // GraphQL API. Routes that require live analytics data are not
        // covered here — verify those manually with `wrangler dev` after
        // setting real secrets (see index.js header comment).
        compatibilityFlags: ['nodejs_compat'],
        bindings: { METRICS_READ_TOKEN: 'test-token' },
      },
    }),
  ],
  test: {
    root: import.meta.dirname,
  },
});
