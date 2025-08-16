/**
 * Jest 配置文件 - ClickFun 主專案
 * 基於 Context7 最佳實踐配置
 * 版本: 2025.1.16
 */

export default {
  // 專案顯示名稱
  displayName: 'ClickFun Tests',

  // 測試環境
  testEnvironment: 'node',

  // 多專案配置 (根據 Context7 最佳實踐)
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/scripts/**/*.test.js'],
      collectCoverageFrom: [
        '<rootDir>/*.js',
        '<rootDir>/scripts/**/*.js',
        '!<rootDir>/sw.js',
        '!<rootDir>/fx.worker.js',
        '!<rootDir>/dev-tools/**/*',
      ],
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/**/*.integration.test.js'],
      testTimeout: 30000,
    },
  ],

  // 覆蓋率配置
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  // 測試設置文件
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // 模組名稱映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // 轉換器配置
  transform: {
    '^.+\\\\.js$': 'babel-jest',
  },

  // 忽略的文件
  testPathIgnorePatterns: ['/node_modules/', '/dev-tools/', '.*\\\\.e2e\\\\.test\\\\.js$'],

  // 模組文件擴展名
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],

  // 測試超時時間
  testTimeout: 10000,

  // 詳細輸出
  verbose: true,

  // 收集覆蓋率
  collectCoverage: true,

  // 覆蓋率門檻 (根據 Context7 最佳實踐)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 快取配置
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // 測試並行執行
  maxWorkers: '50%',

  // 錯誤報告
  errorOnDeprecated: true,

  // 測試結果輸出
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
      },
    ],
  ],
};
