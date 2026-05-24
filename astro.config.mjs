// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://quirgs.com',
  integrations: [mdx(), keystatic()],
});
