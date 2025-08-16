/**
 * ESLint 配置檔案 (v9 格式)
 * 基於 Context7 最新最佳實踐優化
 *
 * @author: @s123104
 * @version: 1.0.0
 * @created: 2025-01-27T15:45:00+08:00
 */

import js from '@eslint/js';
import globals from 'globals';

export default [
  // 全域忽略模式
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.min.js',
      'sw.js',
      'sw-enhanced.js'
    ]
  },

  // 全域配置
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,

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
        console: 'readonly'
      }
    }
  },

  // JavaScript 檔案配置
  {
    files: ['**/*.js', '**/*.jsx'],
    ...js.configs.recommended,
    rules: {
      // 程式碼品質規則
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
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
      'no-new-wrappers': 'error'
    }
  },

  // 測試檔案配置
  {
    files: ['**/*.test.js', '**/*.spec.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.mocha
      }
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off'
    }
  },

  // 設定檔案配置
  {
    files: ['*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off'
    }
  }
];
