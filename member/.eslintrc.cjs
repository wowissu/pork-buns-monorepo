/* eslint-env node */

const path = require('path');

/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,

  extends: [
    '@pork-buns/eslint-config'
  ],

  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json')
  }
};
