import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import manifest from './assets/manifest.json';

export default defineConfig({
  envPrefix: ['OCULAR'],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewrite: (path) => path.slice(4) // cut off `/api`
      }
    }
  },
  define: {
    'import.meta.env.OCULAR_BUILD_TIMESTAMP': Date.now()
  },
  plugins: [
    tsconfigPaths({ loose: true }),
    optimizeCssModules(),
    vue({
      script: {
        defineModel: true
      }
    }),
    VitePWA({
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2}']
      }
    })
  ]
});
