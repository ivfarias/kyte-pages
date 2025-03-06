import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: vercel(),
  vite: {
    envPrefix: [
      'PUBLIC_',
      'SERPER_API_KEY',
      'MAUTIC_BEARER_TOKEN'
    ]
  }
});
