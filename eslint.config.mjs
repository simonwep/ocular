/* eslint-disable import-x/no-named-as-default-member */
import js from '@eslint/js';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
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
    ignores: ['.data/', 'test-results/', 'dist/', 'node_modules/', 'docs/.vitepress/{dist,cache}']
  },
  {
    files: ['**/*.{vue,ts,mts,js,mjs,json}'],
    settings: {
      'vue-i18n': {
        messageSyntaxVersion: '^9.0.0',
        localeDir: './src/i18n/locales/*.json'
      }
    },
    rules: {
      '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
      '@intlify/vue-i18n/no-dynamic-keys': 'error',
      '@intlify/vue-i18n/no-html-messages': 'error',
      '@intlify/vue-i18n/no-missing-keys': 'error',
      '@intlify/vue-i18n/no-unused-keys': [
        'error',
        {
          enableFix: true,
          extensions: ['.vue', '.ts'],
          ignores: ['page.income.incomeFor', 'page.expenses.expensesFor', 'page.dashboard.budgetFor']
        }
      ],
      '@intlify/vue-i18n/no-raw-text': [
        'error',
        {
          ignoreText: ['-', '(', ')']
        }
      ]
    }
  },
  {
    files: ['**/*.{vue,ts,mts,js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json'
      },
      globals: {
        process: true
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
      'vue/v-on-event-hyphenation': ['error', 'never'],
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_'
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
