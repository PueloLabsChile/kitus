// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambiar por el dominio real cuando se registre.
export default defineConfig({
  site: 'https://kitus.org',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'file' },
});
