// Jest 測試環境設定
const path = require('path');

// 設定測試超時時間
jest.setTimeout(30000);

// 全域測試工具函數
global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

global.waitForElement = async (page, selector, timeout = 5000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.warn(`Element ${selector} not found within ${timeout}ms`);
    return false;
  }
};

global.getGameState = async (page) => {
  return await page.evaluate(() => {
    return {
      isGameActive: window.gameState?.isActive || false,
      currentScore: window.gameState?.score || 0,
      currentTPS: window.gameState?.tps || 0,
      gameMode: window.gameState?.mode || 'single'
    };
  });
};

// 測試前後清理
beforeEach(async () => {
  if (typeof page !== 'undefined') {
    // 清除 localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // 重新載入頁面確保乾淨狀態
    await page.reload({ waitUntil: 'networkidle0' });
  }
});

afterEach(async () => {
  if (typeof page !== 'undefined') {
    // 截圖用於除錯（測試失敗時）
    if (
      jasmine.currentSpec &&
      jasmine.currentSpec.result.failedExpectations.length > 0
    ) {
      const screenshotPath = path.join(
        __dirname,
        'screenshots',
        `${jasmine.currentSpec.description}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
  }
});
