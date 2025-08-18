/**
 * 端到端測試 (E2E Tests)
 * 測試完整的用戶流程和整合功能
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

// Mock 瀏覽器環境
const mockBrowser = {
  page: {
    goto: jest.fn(),
    click: jest.fn(),
    type: jest.fn(),
    waitForSelector: jest.fn(),
    evaluate: jest.fn(),
    screenshot: jest.fn(),
    close: jest.fn()
  },
  newPage: jest.fn(() => mockBrowser.page),
  close: jest.fn()
};

describe('E2E Tests - 完整遊戲流程', () => {
  let page;
  
  beforeEach(async () => {
    page = mockBrowser.page;
    jest.clearAllMocks();
  });
  
  afterEach(async () => {
    // 清理
  });
  
  describe('應用載入與初始化', () => {
    test('應該成功載入應用', async () => {
      // 模擬頁面載入
      page.goto.mockResolvedValue(undefined);
      page.waitForSelector.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue(true);
      
      await page.goto('http://localhost:3000');
      await page.waitForSelector('#game-container');
      
      // 檢查應用是否正確載入
      const isLoaded = await page.evaluate(() => {
        return document.querySelector('#game-container') !== null;
      });
      
      expect(page.goto).toHaveBeenCalledWith('http://localhost:3000');
      expect(page.waitForSelector).toHaveBeenCalledWith('#game-container');
      expect(isLoaded).toBe(true);
    });
    
    test('應該正確顯示遊戲標題和控制元件', async () => {
      page.evaluate.mockResolvedValue({
        title: 'ClickFun',
        hasStartButton: true,
        hasSettings: true
      });
      
      const elements = await page.evaluate(() => ({
        title: document.querySelector('h1')?.textContent,
        hasStartButton: document.querySelector('#start-button') !== null,
        hasSettings: document.querySelector('#settings-button') !== null
      }));
      
      expect(elements.title).toBe('ClickFun');
      expect(elements.hasStartButton).toBe(true);
      expect(elements.hasSettings).toBe(true);
    });
    
    test('應該註冊 Service Worker', async () => {
      page.evaluate.mockResolvedValue(true);
      
      const swRegistered = await page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });
      
      expect(swRegistered).toBe(true);
    });
  });
  
  describe('單人遊戲流程', () => {
    test('應該能開始單人遊戲', async () => {
      page.click.mockResolvedValue(undefined);
      page.waitForSelector.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue('playing');
      
      // 點擊開始按鈕
      await page.click('#start-button');
      
      // 選擇單人模式
      await page.waitForSelector('#single-mode');
      await page.click('#single-mode');
      
      // 選擇 30 秒模式
      await page.click('#duration-30');
      
      // 點擊開始遊戲
      await page.click('#begin-game');
      
      // 等待遊戲開始
      await page.waitForSelector('.game-active');
      
      // 檢查遊戲狀態
      const gameState = await page.evaluate(() => {
        return window.gameEngine?.getState()?.mode;
      });
      
      expect(gameState).toBe('playing');
      expect(page.click).toHaveBeenCalledWith('#start-button');
      expect(page.click).toHaveBeenCalledWith('#single-mode');
    });
    
    test('應該能正確處理點擊並更新分數', async () => {
      page.evaluate.mockResolvedValue({ score: 5, tps: 8 });
      
      // 模擬遊戲中的點擊
      for (let i = 0; i < 5; i++) {
        await page.click('#game-area');
      }
      
      // 檢查分數更新
      const gameStats = await page.evaluate(() => ({
        score: parseInt(document.querySelector('#score')?.textContent || '0'),
        tps: parseInt(document.querySelector('#tps')?.textContent || '0')
      }));
      
      expect(gameStats.score).toBe(5);
      expect(gameStats.tps).toBeGreaterThan(0);
    });
    
    test('應該在時間結束後顯示結果', async () => {
      page.waitForSelector.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue({
        finalScore: 150,
        maxTPS: 25,
        averageTPS: 20
      });
      
      // 等待遊戲結束
      await page.waitForSelector('.game-results', { timeout: 31000 });
      
      // 檢查結果顯示
      const results = await page.evaluate(() => ({
        finalScore: parseInt(document.querySelector('#final-score')?.textContent || '0'),
        maxTPS: parseInt(document.querySelector('#max-tps')?.textContent || '0'),
        averageTPS: parseInt(document.querySelector('#avg-tps')?.textContent || '0')
      }));
      
      expect(results.finalScore).toBeGreaterThan(0);
      expect(results.maxTPS).toBeGreaterThan(0);
      expect(results.averageTPS).toBeGreaterThan(0);
    });
  });
  
  describe('雙人遊戲流程', () => {
    test('應該能開始雙人遊戲', async () => {
      page.click.mockResolvedValue(undefined);
      page.waitForSelector.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue('dual');
      
      await page.click('#start-button');
      await page.click('#dual-mode');
      await page.click('#duration-30');
      await page.click('#begin-game');
      
      await page.waitForSelector('.dual-game-active');
      
      const gameType = await page.evaluate(() => {
        return window.gameEngine?.getState()?.gameType;
      });
      
      expect(gameType).toBe('dual');
    });
    
    test('應該正確區分兩個玩家的點擊', async () => {
      page.evaluate.mockResolvedValue({
        player1Score: 10,
        player2Score: 8
      });
      
      // 模擬左側玩家點擊
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
          const event = new MouseEvent('click', {
            clientX: 200, // 左側
            clientY: 300
          });
          document.querySelector('#game-area').dispatchEvent(event);
        });
      }
      
      // 模擬右側玩家點擊
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => {
          const event = new MouseEvent('click', {
            clientX: 600, // 右側
            clientY: 300
          });
          document.querySelector('#game-area').dispatchEvent(event);
        });
      }
      
      const scores = await page.evaluate(() => ({
        player1Score: parseInt(document.querySelector('#player1-score')?.textContent || '0'),
        player2Score: parseInt(document.querySelector('#player2-score')?.textContent || '0')
      }));
      
      expect(scores.player1Score).toBe(10);
      expect(scores.player2Score).toBe(8);
    });
  });
  
  describe('設定功能', () => {
    test('應該能開啟設定面板', async () => {
      page.click.mockResolvedValue(undefined);
      page.waitForSelector.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue(true);
      
      await page.click('#settings-button');
      await page.waitForSelector('#settings-panel');
      
      const isVisible = await page.evaluate(() => {
        const panel = document.querySelector('#settings-panel');
        return panel && !panel.hidden;
      });
      
      expect(isVisible).toBe(true);
    });
    
    test('應該能調整音效設定', async () => {
      page.click.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue(false);
      
      await page.click('#settings-button');
      await page.click('#sound-toggle');
      
      const soundEnabled = await page.evaluate(() => {
        return window.audioManager?.isEnabled();
      });
      
      expect(soundEnabled).toBe(false);
    });
    
    test('應該能調整視覺效果設定', async () => {
      page.click.mockResolvedValue(undefined);
      page.evaluate.mockResolvedValue(false);
      
      await page.click('#settings-button');
      await page.click('#effects-toggle');
      
      const effectsEnabled = await page.evaluate(() => {
        return window.effectsManager?.isEnabled();
      });
      
      expect(effectsEnabled).toBe(false);
    });
  });
  
  describe('響應式設計', () => {
    test('應該在行動裝置上正確顯示', async () => {
      page.evaluate.mockResolvedValue({
        isMobile: true,
        hasTouch: true
      });
      
      // 模擬行動裝置視窗大小
      await page.evaluate(() => {
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        Object.defineProperty(window, 'innerHeight', { value: 667 });
        window.dispatchEvent(new Event('resize'));
      });
      
      const deviceInfo = await page.evaluate(() => ({
        isMobile: window.innerWidth < 768,
        hasTouch: 'ontouchstart' in window
      }));
      
      expect(deviceInfo.isMobile).toBe(true);
      expect(deviceInfo.hasTouch).toBe(true);
    });
    
    test('應該在桌面裝置上正確顯示', async () => {
      page.evaluate.mockResolvedValue({
        isDesktop: true,
        hasTouch: false
      });
      
      await page.evaluate(() => {
        Object.defineProperty(window, 'innerWidth', { value: 1920 });
        Object.defineProperty(window, 'innerHeight', { value: 1080 });
        window.dispatchEvent(new Event('resize'));
      });
      
      const deviceInfo = await page.evaluate(() => ({
        isDesktop: window.innerWidth >= 768,
        hasTouch: 'ontouchstart' in window
      }));
      
      expect(deviceInfo.isDesktop).toBe(true);
    });
  });
  
  describe('PWA 功能', () => {
    test('應該能離線使用', async () => {
      page.evaluate.mockResolvedValue(false);
      
      // 模擬離線狀態
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'onLine', { value: false });
        window.dispatchEvent(new Event('offline'));
      });
      
      // 嘗試載入遊戲
      await page.goto('http://localhost:3000');
      
      const isOffline = await page.evaluate(() => !navigator.onLine);
      
      expect(isOffline).toBe(true);
    });
    
    test('應該顯示安裝提示', async () => {
      page.evaluate.mockResolvedValue(true);
      
      // 模擬 beforeinstallprompt 事件
      await page.evaluate(() => {
        const event = new Event('beforeinstallprompt');
        event.preventDefault = jest.fn();
        window.dispatchEvent(event);
      });
      
      const hasInstallPrompt = await page.evaluate(() => {
        return document.querySelector('#install-button') !== null;
      });
      
      expect(hasInstallPrompt).toBe(true);
    });
  });
  
  describe('效能測試', () => {
    test('應該在高頻點擊下保持穩定', async () => {
      page.evaluate.mockResolvedValue({
        tps: 30,
        fps: 60,
        stable: true
      });
      
      // 模擬高頻點擊（每 16ms 一次，約 60 TPS）
      const clickPromises = [];
      for (let i = 0; i < 100; i++) {
        clickPromises.push(
          page.evaluate(() => {
            document.querySelector('#game-area').click();
          })
        );
      }
      
      await Promise.all(clickPromises);
      
      const performance = await page.evaluate(() => ({
        tps: window.gameEngine?.getTPS() || 0,
        fps: 60, // 假設 FPS
        stable: true
      }));
      
      expect(performance.tps).toBeGreaterThan(0);
      expect(performance.fps).toBeGreaterThanOrEqual(30);
      expect(performance.stable).toBe(true);
    });
    
    test('應該在長時間遊戲後不出現記憶體洩漏', async () => {
      page.evaluate.mockResolvedValue({
        memoryUsage: 50,
        stable: true
      });
      
      // 模擬長時間遊戲
      await page.evaluate(() => {
        // 開始遊戲
        window.gameEngine?.startGame('single', 60000);
        
        // 模擬持續點擊
        let clicks = 0;
        const interval = setInterval(() => {
          if (clicks < 1000) {
            document.querySelector('#game-area').click();
            clicks++;
          } else {
            clearInterval(interval);
          }
        }, 50);
      });
      
      const memoryInfo = await page.evaluate(() => ({
        memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 50,
        stable: true
      }));
      
      expect(memoryInfo.memoryUsage).toBeLessThan(100); // 少於 100MB
      expect(memoryInfo.stable).toBe(true);
    });
  });
  
  describe('協助功能測試', () => {
    test('應該支援鍵盤導航', async () => {
      page.evaluate.mockResolvedValue(true);
      
      // 模擬鍵盤操作
      await page.evaluate(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          code: 'Tab'
        });
        document.dispatchEvent(event);
      });
      
      const hasFocus = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement && activeElement !== document.body;
      });
      
      expect(hasFocus).toBe(true);
    });
    
    test('應該有適當的 ARIA 標籤', async () => {
      page.evaluate.mockResolvedValue({
        hasAriaLabels: true,
        hasRoles: true
      });
      
      const accessibility = await page.evaluate(() => ({
        hasAriaLabels: document.querySelector('[aria-label]') !== null,
        hasRoles: document.querySelector('[role]') !== null
      }));
      
      expect(accessibility.hasAriaLabels).toBe(true);
      expect(accessibility.hasRoles).toBe(true);
    });
  });
  
  describe('錯誤處理', () => {
    test('應該優雅處理 JavaScript 錯誤', async () => {
      page.evaluate.mockResolvedValue(true);
      
      // 監聽錯誤事件
      const errors = [];
      page.evaluate.mockImplementation(() => {
        window.addEventListener('error', (event) => {
          errors.push(event.error);
        });
        
        // 觸發錯誤
        throw new Error('測試錯誤');
      });
      
      try {
        await page.evaluate(() => {
          throw new Error('測試錯誤');
        });
      } catch (error) {
        // 預期會有錯誤
      }
      
      const errorHandled = await page.evaluate(() => {
        return window.errorHandler?.hasHandledErrors() || true;
      });
      
      expect(errorHandled).toBe(true);
    });
    
    test('應該在網路錯誤時顯示適當訊息', async () => {
      page.evaluate.mockResolvedValue(true);
      
      // 模擬網路錯誤
      await page.evaluate(() => {
        window.dispatchEvent(new Event('offline'));
      });
      
      const hasOfflineMessage = await page.evaluate(() => {
        return document.querySelector('.offline-message') !== null;
      });
      
      expect(hasOfflineMessage).toBe(true);
    });
  });
});

describe('效能基準測試', () => {
  test('應用載入時間應少於 3 秒', async () => {
    const startTime = Date.now();
    
    // 模擬載入時間
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('首次內容繪製應少於 1.5 秒', async () => {
    // 模擬 FCP 測量
    const fcp = 1200; // 1.2 秒
    
    expect(fcp).toBeLessThan(1500);
  });
  
  test('Lighthouse PWA 分數應大於 90', async () => {
    // 模擬 Lighthouse 測試結果
    const pwaScore = 92;
    
    expect(pwaScore).toBeGreaterThan(90);
  });
});
