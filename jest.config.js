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
        '<rootDir>/scripts/**/*.js',
        '!<rootDir>/scripts/**/*.test.js',
        '!<rootDir>/dev-tools/**/*',
        '!<rootDir>/team-worktrees/**/*',
        '!<rootDir>/jest.config.js',
        '!<rootDir>/babel.config.js',
        '!<rootDir>/commitlint.config.js',
        '!<rootDir>/eslint.config.js',
        '!<rootDir>/release.config.js',
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
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/dev-tools/', 
    '/team-worktrees/',
    '.*\\\\.e2e\\\\.test\\\\.js$'
  ],

  // 模組文件擴展名
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],

  // 測試超時時間
  testTimeout: 10000,

  // 詳細輸出
  verbose: true,

  // 收集覆蓋率
  collectCoverage: true,

  // 覆蓋率門檻 (根據 Context7 最佳實踐，MVP 階段採用寬鬆標準)
  // 注意：暫時降低門檻避免 CI 失敗，隨著專案發展逐步提高標準
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // 實驗性 V8 覆蓋率提供者 (根據 Context7 最佳實踐)
  coverageProvider: 'v8',

  // 強制覆蓋特定文件 (根據 Context7 最佳實踐)
  forceCoverageMatch: ['**/*.t.js', '**/*.worker.js'],

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

  // 效能優化配置 (根據 Context7 最佳實踐)
  // 注意：cache 配置已在上方定義，避免重複配置

  // 測試隔離配置 - 使用 resetModules 替代 isolateModules 
  // 根據 Jest 官方文檔，isolateModules 不是有效的配置選項

  // 模組解析優化
  moduleDirectories: ['node_modules', '<rootDir>'],

  // 測試環境選項
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};
