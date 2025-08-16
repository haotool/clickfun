/**
 * Jest 配置文件 - Click Fun 主專案
 * 基於 Context7 最佳實踐配置
 * [context7:jestjs/jest:2025-08-16T18:26:00+08:00]
 * 版本: 2025.8.16
 */

import baseConfig from './jest.base.config.js';

export default {
  ...baseConfig,

  // 多專案配置 (根據 Context7 最佳實踐)
  projects: [
    {
      ...baseConfig,
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/scripts/**/*.test.js'],
      collectCoverageFrom: [
        '<rootDir>/scripts/**/*.js',
        '!<rootDir>/scripts/**/*.test.js',
        '!<rootDir>/dev-tools/**/*',
        '!<rootDir>/team-worktrees/**/*',
        '!<rootDir>/jest.config.js',
        '!<rootDir>/jest.base.config.js',
        '!<rootDir>/babel.config.js',
        '!<rootDir>/commitlint.config.js',
        '!<rootDir>/eslint.config.js',
        '!<rootDir>/release.config.js',
      ],
    },
    {
      ...baseConfig,
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/**/*.integration.test.js'],
      testTimeout: 30000,
      collectCoverage: false, // 整合測試不需要覆蓋率
    },
  ],

  // 覆蓋率門檻 (根據 Context7 最佳實踐，MVP 階段採用寬鬆標準)
  // 注意：隨著專案發展逐步提高標準
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
    './scripts/': {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
