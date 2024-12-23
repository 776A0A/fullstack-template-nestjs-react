const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = tseslint.config({
  files: ['{src,apps,libs,test}/**/*.ts'],
  ignores: ['dist/**', '**/node_modules/**'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier: prettier,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    'prettier/prettier': 'error',
  },
});
