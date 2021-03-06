/* eslint-env node */

/** @type { import('eslint').Linter.Config } */
module.exports = {
  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue']
    // createDefaultProgram: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',
    '@wowissu/eslint-config/common',
    '@wowissu/eslint-config/file-progress',
    // '@wowissu/eslint-config/filenames',
    '@wowissu/eslint-config/unused-imports'
  ],

  overrides: [
    {
      files: ['*.js'],
      env: {
        node: true,
        es6: true
      },
      extends: [
        '@wowissu/eslint-config/@babel'
      ]
    },
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      env: {
        browser: true
      },
      extends: [
        '@wowissu/eslint-config/ts',
        '@wowissu/eslint-config/ts/type-checking',
        '@wowissu/eslint-config/vue/vue3'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
