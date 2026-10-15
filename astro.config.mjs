import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hquan1428.github.io',
  base: '/portfolio',
  output: 'static',
  build: { inlineStylesheets: 'always' },
});
