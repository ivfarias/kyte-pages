import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: vercel(),
  vite: {
    envPrefix: [
      'PUBLIC_',
      'SERPER_API_KEY',
      'MAUTIC_BEARER_TOKEN'
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'material-tailwind': ['@material-tailwind/react'],
            'apexcharts': ['apexcharts']
          }
        }
      },
      minify: 'esbuild',
      cssMinify: true
    },
    optimizeDeps: {
      include: [
        '@material-tailwind/react',
        'apexcharts'
      ]
    },
    ssr: {
      noExternal: ['@material-tailwind/react']
    }
  }
});