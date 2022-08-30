import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import manifest from './assets/manifest.json';
import { createCounter } from './utils/createCounter';

export default defineConfig(({ mode }) => ({
  envPrefix: ['OAUTH'],

  css: {
    modules: {
      generateScopedName:
        mode === 'development'
          ? '[local]_[hash:base64:5]'
          : (() => {
              const map: Map<string, string> = new Map();
              const counter = createCounter();

              return (name: string, fileName: string) => {
                const key = `${fileName} ${name}`;
                let hash = map.get(key);
                if (!hash) map.set(key, (hash = counter()));
                return hash;
              };
            })()
    }
  },

  server: {
    port: 3000
  },

  define: {
    'import.meta.env.APP_BUILD_TIMESTAMP': Date.now()
  },

  plugins: [tsconfigPaths({ loose: true }), vue(), VitePWA({ manifest })]
}));
