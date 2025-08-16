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

  extends: ['eslint:recommended'],

  plugins: ['jest'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    // 程式碼品質
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prefer-const': 'error',
    'no-var': 'error',
    'comma-dangle': ['error', 'always-multiline'],

    // 最佳實踐
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // 可讀性
    'max-len': ['warn', { code: 120, ignoreUrls: true }],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },

  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js', '**/jest.setup.js'],
      env: {
        jest: true,
        node: true,
      },
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        it: 'readonly',
        jasmine: 'readonly',
        page: 'writable',
      },
      rules: {
        'no-console': 'off',
        'no-undef': 'error',
      },
    },
    {
      files: ['scripts/**/*.js', 'dev-tools/**/*.js'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
        'no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_|^path$',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['sw*.js', 'fx.worker.js'],
      env: {
        worker: true,
        serviceworker: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],

  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/', '*.min.js', 'team-worktrees/'],
};
