import js from '@eslint/js';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
import vuePrettier from '@vue/eslint-config-prettier';
import prettier from 'eslint-plugin-prettier/recommended';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';

export default [
  prettier,
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...vueI18n.configs['flat/recommended'],
  vuePrettier,
  {
    files: ['**/*.{vue,ts,js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser
      }
    },
    settings: {
      'vue-i18n': {
        localeDir: 'src/i18n/locales/*.json'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',
      'no-console': 'error',
      'prettier/prettier': [
        'error',
        {
          jsonRecursiveSort: true,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none'
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
      ]
    }
  }
];
