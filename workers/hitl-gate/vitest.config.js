import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.toml' },
      miniflare: {
        // Test-only overrides — deploys still use wrangler.toml + secrets.
        compatibilityFlags: ['nodejs_compat'],
        bindings: { HITL_WRITE_TOKEN: 'test-token' },
      },
    }),
  ],
  test: {
    root: import.meta.dirname,
  },
});
