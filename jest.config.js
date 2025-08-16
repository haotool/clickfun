/**
 * Jest 配置文件 - ClickFun 主專案
 * 配置測試環境和測試文件路徑
 */

export default {
  // 測試環境
  testEnvironment: 'node',
  
  // 測試文件匹配模式
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/scripts/**/*.test.js'
  ],
  
  // 跳過 E2E 測試（在 CI 環境中）
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dev-tools/'
  ],
  
  // 測試文件匹配模式
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/scripts/**/*.test.js'
  ],
  
  // 收集覆蓋率的文件
  collectCoverageFrom: [
    '<rootDir>/*.js',
    '<rootDir>/scripts/**/*.js',
    '!<rootDir>/sw.js',
    '!<rootDir>/fx.worker.js',
    '!<rootDir>/dev-tools/**/*'
  ],
  
  // 覆蓋率報告目錄
  coverageDirectory: 'coverage',
  
  // 覆蓋率報告格式
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // 測試設置文件
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // 模組名稱映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // 轉換器配置
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // 忽略的文件
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dev-tools/'
  ],
  
  // 測試超時時間
  testTimeout: 10000,
  
  // 詳細輸出
  verbose: true
};
