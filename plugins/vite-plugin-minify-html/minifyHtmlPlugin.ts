import { Plugin } from 'vite';
import { minify } from 'html-minifier-terser';

export const minifyHtmlPlugin = (): Plugin => ({
  name: 'vite-plugin-minify',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      return minify(html, {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: false,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true
      });
    }
  }
});
