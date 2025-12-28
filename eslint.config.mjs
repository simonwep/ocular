/* eslint-disable import-x/default, import-x/no-named-as-default-member */
import js from '@eslint/js';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
import tsParser from '@typescript-eslint/parser';
import vuePrettier from '@vue/eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import { importX } from 'eslint-plugin-import-x';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import prettier from 'eslint-plugin-prettier/recommended';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default defineConfig([
  prettier,
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...vueI18n.configs['flat/recommended'],
  vuePrettier,
  {
    ignores: ['.data', 'test-results', 'dist', 'node_modules/', 'docs/.vitepress/{dist,cache}']
  },
  {
    files: ['**/*.{vue,ts,mts,js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser
      },
      globals: {
        process: true
      }
    },
    settings: {
      'vue-i18n': {
        localeDir: 'src/i18n/locales/*.json'
      }
    },
    plugins: {
      'prefer-arrow-functions': preferArrowFunctions
    },
    rules: {
      'no-console': 'error',
      'no-warning-comments': 'error',
      'vue/no-template-shadow': 'error',
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/no-useless-mustaches': [
        'error',
        {
          ignoreIncludesComment: false,
          ignoreStringEscape: false
        }
      ],
      'prettier/prettier': [
        'error',
        {
          jsonRecursiveSort: true,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none',
          endOfLine: 'lf'
        }
      ],
      'import-x/no-unresolved': 'off',
      'import-x/order': [
        'error',
        {
          groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
          alphabetize: {
            order: 'asc'
          }
        }
      ],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'implicit',
          singleReturnOnly: false
        }
      ]
    }
  }
]);
