/**
 * Jest 測試設置文件
 * 配置測試環境和全局設置
 */

// 設置測試環境變數
process.env.NODE_ENV = 'test';

// 模擬瀏覽器環境（如果需要）
global.window = global.window || {};
global.document = global.document || {};
global.navigator = global.navigator || {};

// 設置測試超時時間
jest.setTimeout(10000);

// 清理函數
afterEach(() => {
  // 清理測試後的狀態
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// 全局測試工具函數
global.testUtils = {
  // 創建模擬遊戲狀態
  createMockGameState: () => ({
    score: 0,
    tps: 0,
    isActive: false,
    mode: 'single',
    timeLeft: 30,
  }),

  // 等待異步操作
  wait: ms => new Promise(resolve => setTimeout(resolve, ms)),

  // 模擬點擊事件
  simulateClick: element => {
    if (element && typeof element.click === 'function') {
      element.click();
    }
  },
};
