// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://quirgs.com',
  integrations: [react(), mdx(), keystatic(), sitemap()],
  build: {
    // Emit all component styles as external stylesheets (never inline <style>)
    // so the CSP can use `style-src 'self'` with no 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  markdown: {
    // Default Shiki highlighting emits an inline `style=` on <pre>, which would
    // require `style-src 'unsafe-inline'`. All skill code fences are plaintext
    // (no token coloring to lose), and BaseLayout already styles
    // `.terminal-body pre`/`code`, so disable it for a clean `style-src 'self'`.
    syntaxHighlight: false,
  },
  vite: {
    optimizeDeps: {
      exclude: ['virtual:keystatic-config'],
    },
    build: {
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
