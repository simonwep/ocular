import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import { defineConfig } from 'vite';
import manifest from './assets/manifest.json';

export default defineConfig({
  envPrefix: ['OAUTH', 'ACKEE'],
  server: {
    port: 3000
  },

  define: {
    'import.meta.env.APP_BUILD_TIMESTAMP': Date.now()
  },

  plugins: [
    tsconfigPaths({ loose: true }),
    optimizeCssModules(),
    vue(),
    VitePWA({ manifest })
  ]
});
