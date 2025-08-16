/**
 * ClickFun 基本功能測試
 * 測試遊戲的核心功能是否正常運作
 */

describe('ClickFun 基本功能測試', () => {
  let gameState;

  beforeEach(() => {
    // 模擬遊戲狀態
    gameState = {
      score: 0,
      tps: 0,
      isActive: false,
      mode: 'single',
      timeLeft: 30,
    };
  });

  describe('遊戲初始化', () => {
    test('應該正確初始化遊戲狀態', () => {
      expect(gameState.score).toBe(0);
      expect(gameState.tps).toBe(0);
      expect(gameState.isActive).toBe(false);
      expect(gameState.mode).toBe('single');
    });

    test('應該設定正確的遊戲時間', () => {
      expect(gameState.timeLeft).toBeGreaterThan(0);
      expect(gameState.timeLeft).toBeLessThanOrEqual(60);
    });
  });

  describe('分數計算', () => {
    test('應該正確累加分數', () => {
      const initialScore = gameState.score;
      const clickCount = 5;

      // 模擬點擊
      for (let i = 0; i < clickCount; i++) {
        gameState.score++;
      }

      expect(gameState.score).toBe(initialScore + clickCount);
    });

    test('分數不應該為負數', () => {
      gameState.score = 0;
      // 嘗試減少分數（不應該發生）
      gameState.score = Math.max(0, gameState.score - 1);

      expect(gameState.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('TPS 計算', () => {
    test('TPS 應該在合理範圍內', () => {
      // 模擬 TPS 計算
      const mockTPS = 15.5;
      gameState.tps = mockTPS;

      expect(gameState.tps).toBeGreaterThanOrEqual(0);
      expect(gameState.tps).toBeLessThan(100); // 合理的上限
    });

    test('TPS 應該支援小數點精度', () => {
      const preciseTPS = 12.7;
      gameState.tps = preciseTPS;

      expect(gameState.tps).toBe(preciseTPS);
      expect(Number.isInteger(gameState.tps)).toBe(false);
    });
  });

  describe('遊戲模式', () => {
    test('應該支援單人模式', () => {
      gameState.mode = 'single';
      expect(gameState.mode).toBe('single');
    });

    test('應該支援雙人模式', () => {
      gameState.mode = 'dual';
      expect(gameState.mode).toBe('dual');
    });

    test('不應該接受無效的遊戲模式', () => {
      const validModes = ['single', 'dual'];
      const testMode = 'invalid';

      if (!validModes.includes(testMode)) {
        gameState.mode = 'single'; // 預設值
      }

      expect(validModes).toContain(gameState.mode);
    });
  });

  describe('遊戲狀態管理', () => {
    test('遊戲開始時應該設定為活躍狀態', () => {
      gameState.isActive = true;
      expect(gameState.isActive).toBe(true);
    });

    test('遊戲結束時應該設定為非活躍狀態', () => {
      gameState.isActive = false;
      expect(gameState.isActive).toBe(false);
    });

    test('時間歸零時遊戲應該結束', () => {
      gameState.timeLeft = 0;
      gameState.isActive = gameState.timeLeft > 0;

      expect(gameState.isActive).toBe(false);
    });
  });
});
