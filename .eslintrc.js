/**
 * ESLint 配置檔案
 * 基於 Context7 最新最佳實踐優化
 *
 * @author: @s123104
 * @version: 1.0.0
 * @created: 2025-01-27T15:45:00+08:00
 */

module.exports = {
  // 使用推薦的 JavaScript 規則
  extends: ['eslint:recommended'],

  // 環境設定
  env: {
    browser: true,
    es2024: true,
    node: true,
  },

  // 解析器選項
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // 全域變數
  globals: {
    // 遊戲相關全域變數
    GameState: 'readonly',
    audioManager: 'readonly',
    inputManager: 'readonly',
    gameEngine: 'readonly',
    storageManager: 'readonly',
    uiManager: 'readonly',

    // PWA 相關全域變數
    APP_VERSION: 'readonly',
    SW_ENHANCED_VERSION: 'readonly',
    CURRENT_CACHE_PATTERNS: 'readonly',

    // 開發工具全域變數
    console: 'readonly',
  },

  // 規則配置
  rules: {
    // 程式碼品質規則
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-undef': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // 程式碼風格規則
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',

    // 最佳實踐規則
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // 效能相關規則
    'no-loop-func': 'error',
    'no-new-object': 'error',
    'no-new-array': 'error',
    'no-new-wrappers': 'error',

    // 安全性規則
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
  },

  // 覆蓋特定檔案的規則
  overrides: [
    {
      // 測試檔案使用較寬鬆的規則
      files: ['**/*.test.js', '**/*.spec.js', 'tests/**/*.js'],
      env: {
        jest: true,
        mocha: true,
      },
      rules: {
        'no-console': 'off',
        'no-undef': 'off',
      },
    },
    {
      // 設定檔案使用較寬鬆的規則
      files: ['*.config.js', '*.config.mjs'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      },
    },
  ],

  // 忽略特定檔案
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'sw.js',
    'sw-enhanced.js',
  ],
};
