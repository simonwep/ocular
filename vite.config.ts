import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import {VitePWA} from 'vite-plugin-pwa';
import {defineConfig} from 'vite';
import manifest from './assets/manifest.json';

export default defineConfig(({mode}) => ({
  envPrefix: ['OAUTH'],

  css: {
    modules: {
      generateScopedName: mode === 'development' ? '[name]_[local]_[hash:base64:5]' : (() => {
        let index = 0;
        return () => {
          const hash = (index++).toString(36);
          return hash[0].match(/^\d/) ? `_${hash}` : hash;
        };
      })()
    }
  },

  plugins: [
    tsconfigPaths({loose: true}),
    vue(),
    VitePWA({manifest})
  ]
}));
