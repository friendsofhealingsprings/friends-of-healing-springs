import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://healingsprings.org',
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory',
  },
});
