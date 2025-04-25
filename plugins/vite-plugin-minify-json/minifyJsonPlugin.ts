import { Plugin } from 'vite';

export const minifyJsonPlugin = (): Plugin => ({
  name: 'vite-plugin-minify-json',
  apply: 'build',
  enforce: 'pre',
  generateBundle: async (_, bundle) => {
    for (const fileName of Object.keys(bundle)) {
      if (fileName.endsWith('.json')) {
        const asset = bundle[fileName];

        if (asset.type !== 'asset') {
          continue;
        }

        if (typeof asset.source === 'string') {
          asset.source = JSON.stringify(JSON.parse(asset.source));
        } else {
          asset.source = JSON.stringify(JSON.parse(Buffer.from(asset.source).toString('utf8')));
        }
      }
    }
  }
});
