// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambiar por el dominio propio cuando se registre (afecta canonical, sitemap y RSS).
export default defineConfig({
  site: 'https://kitus.netlify.app',

  // Hosting en cPanel/Apache: generamos una carpeta por página
  // (/politica/ -> politica/index.html) para que el servidor la sirva
  // sin necesidad de reglas de reescritura.
  build: { format: 'directory' },
  trailingSlash: 'always',

  integrations: [sitemap()],
});
