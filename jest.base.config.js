/**
 * Jest 基礎配置 - Click Fun 專案
 * 基於 Context7 最佳實踐的共享配置
 * [context7:jestjs/jest:2025-08-16T18:26:00+08:00]
 * 版本: 2025.8.16
 */

export default {
  // 專案顯示名稱
  displayName: 'Click Fun Tests',

  // 測試環境
  testEnvironment: 'node',

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
    '^.+\\.js$': 'babel-jest',
  },

  // 忽略的文件
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dev-tools/',
    '/team-worktrees/',
    '.*\\.e2e\\.test\\.js$',
  ],

  // 模組文件擴展名
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],

  // 測試超時時間
  testTimeout: 10000,

  // 詳細輸出
  verbose: true,

  // 收集覆蓋率
  collectCoverage: true,

  // 實驗性 V8 覆蓋率提供者 (根據 Context7 最佳實踐)
  coverageProvider: 'v8',

  // 每個測試重置模組 (根據 Context7 最佳實踐)
  resetModules: true,

  // 快取配置
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // 測試並行執行 (根據 Context7 最佳實踐)
  maxWorkers: '75%',

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

  // 模組解析優化
  moduleDirectories: ['node_modules', '<rootDir>'],

  // 測試環境選項
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};
