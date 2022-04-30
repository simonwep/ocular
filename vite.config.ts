import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths({loose: true}),
    vue(),
    VitePWA()
  ],
  envPrefix: [
    'OAUTH'
  ]
});
