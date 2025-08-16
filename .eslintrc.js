/**
 * ESLint 配置文件 - ClickFun 專案
 * 基於現代 JavaScript 最佳實踐
 */

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    // 程式碼品質
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',

    // 最佳實踐
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // 可讀性
    'max-len': ['warn', { code: 100, ignoreUrls: true }],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    // Jest 相關
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },

  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['scripts/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'sw.js',
    'fx.worker.js',
  ],
};
