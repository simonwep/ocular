import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths({loose: true}),
        vue()
    ]
});
