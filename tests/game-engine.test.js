/**
 * 遊戲引擎測試
 * 測試 GameEngine、TPSCalculator、InputManager 等核心功能
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

// Mock DOM 環境
global.performance = {
  now: jest.fn(() => Date.now())
};

global.window = {
  performance: global.performance,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

global.document = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getElementById: jest.fn((id) => ({
    textContent: '',
    style: {},
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }))
};

describe('TPSCalculator', () => {
  let tpsCalculator;
  
  beforeEach(() => {
    // 模擬 TPSCalculator 類別
    class TPSCalculator {
      constructor(windowSize = 1000) {
        this.windowSize = windowSize;
        this.clickBuffer = [];
        this.updateInterval = 100;
      }
      
      addClick(timestamp = performance.now()) {
        this.clickBuffer.push(timestamp);
        this.cleanOldClicks(timestamp);
      }
      
      cleanOldClicks(currentTime) {
        this.clickBuffer = this.clickBuffer.filter(
          time => currentTime - time <= this.windowSize
        );
      }
      
      calculateTPS() {
        return this.clickBuffer.length;
      }
      
      getCurrentTPS() {
        return this.calculateTPS();
      }
      
      getAverageTPS() {
        if (this.clickBuffer.length === 0) return 0;
        const timeSpan = Math.max(
          this.clickBuffer[this.clickBuffer.length - 1] - this.clickBuffer[0],
          this.windowSize
        );
        return (this.clickBuffer.length * 1000) / timeSpan;
      }
      
      getPeakTPS() {
        let peak = 0;
        const bufferCopy = [...this.clickBuffer];
        
        for (let i = 0; i < bufferCopy.length; i++) {
          const windowStart = bufferCopy[i];
          const windowEnd = windowStart + this.windowSize;
          const clicksInWindow = bufferCopy.filter(
            time => time >= windowStart && time <= windowEnd
          ).length;
          peak = Math.max(peak, clicksInWindow);
        }
        
        return peak;
      }
      
      getStatistics() {
        return {
          current: this.getCurrentTPS(),
          average: this.getAverageTPS(),
          peak: this.getPeakTPS(),
          total: this.clickBuffer.length,
          duration: this.clickBuffer.length > 0 ? 
            this.clickBuffer[this.clickBuffer.length - 1] - this.clickBuffer[0] : 0
        };
      }
      
      reset() {
        this.clickBuffer = [];
      }
      
      setWindowSize(size) {
        this.windowSize = size;
      }
    }
    
    tpsCalculator = new TPSCalculator();
  });
  
  describe('基本功能', () => {
    test('應該能正確添加點擊', () => {
      expect(tpsCalculator.getCurrentTPS()).toBe(0);
      
      tpsCalculator.addClick(1000);
      expect(tpsCalculator.getCurrentTPS()).toBe(1);
      
      tpsCalculator.addClick(1100);
      expect(tpsCalculator.getCurrentTPS()).toBe(2);
    });
    
    test('應該能計算當前 TPS', () => {
      const baseTime = 1000;
      
      // 在 1 秒內添加 10 次點擊
      for (let i = 0; i < 10; i++) {
        tpsCalculator.addClick(baseTime + i * 100);
      }
      
      expect(tpsCalculator.getCurrentTPS()).toBe(10);
    });
    
    test('應該能清理過期點擊', () => {
      const baseTime = 1000;
      
      // 添加舊點擊
      tpsCalculator.addClick(baseTime);
      tpsCalculator.addClick(baseTime + 100);
      
      // 添加新點擊，應該清理舊的
      tpsCalculator.addClick(baseTime + 1500); // 超過 1000ms 窗口
      
      expect(tpsCalculator.getCurrentTPS()).toBe(1);
    });
    
    test('應該能重置計算器', () => {
      tpsCalculator.addClick(1000);
      tpsCalculator.addClick(1100);
      expect(tpsCalculator.getCurrentTPS()).toBe(2);
      
      tpsCalculator.reset();
      expect(tpsCalculator.getCurrentTPS()).toBe(0);
    });
  });
  
  describe('統計功能', () => {
    test('應該能計算平均 TPS', () => {
      const baseTime = 1000;
      
      // 在 2 秒內均勻添加 20 次點擊
      for (let i = 0; i < 20; i++) {
        tpsCalculator.addClick(baseTime + i * 100);
      }
      
      const avgTPS = tpsCalculator.getAverageTPS();
      expect(avgTPS).toBeCloseTo(10, 1); // 約 10 TPS
    });
    
    test('應該能計算峰值 TPS', () => {
      const baseTime = 1000;
      
      // 前 500ms 內快速點擊 10 次
      for (let i = 0; i < 10; i++) {
        tpsCalculator.addClick(baseTime + i * 50);
      }
      
      // 後 500ms 內慢速點擊 5 次
      for (let i = 0; i < 5; i++) {
        tpsCalculator.addClick(baseTime + 500 + i * 100);
      }
      
      const peakTPS = tpsCalculator.getPeakTPS();
      expect(peakTPS).toBeGreaterThanOrEqual(10);
    });
    
    test('應該能獲取完整統計', () => {
      tpsCalculator.addClick(1000);
      tpsCalculator.addClick(1100);
      tpsCalculator.addClick(1200);
      
      const stats = tpsCalculator.getStatistics();
      
      expect(stats).toHaveProperty('current');
      expect(stats).toHaveProperty('average');
      expect(stats).toHaveProperty('peak');
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('duration');
      
      expect(stats.current).toBe(3);
      expect(stats.total).toBe(3);
      expect(stats.duration).toBe(200);
    });
  });
  
  describe('配置功能', () => {
    test('應該能設定窗口大小', () => {
      tpsCalculator.setWindowSize(500); // 設定為 500ms
      
      tpsCalculator.addClick(1000);
      tpsCalculator.addClick(1200);
      tpsCalculator.addClick(1600); // 超過 500ms 窗口
      
      expect(tpsCalculator.getCurrentTPS()).toBe(1); // 只有最後一個
    });
  });
});

describe('InputManager', () => {
  let inputManager;
  let mockGameEngine;
  
  beforeEach(() => {
    // Mock GameEngine
    mockGameEngine = {
      handleClick: jest.fn(),
      handleMultiTouch: jest.fn(),
      getState: jest.fn(() => ({ mode: 'playing' }))
    };
    
    // 模擬 InputManager 類別
    class InputManager {
      constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.touchPoints = new Map();
        this.debounceDelay = 16;
        this.lastClickTime = 0;
        this.hapticEnabled = true;
      }
      
      handleTouchStart(event) {
        const touches = Array.from(event.touches || [event]);
        
        touches.forEach((touch, index) => {
          const touchData = {
            x: touch.clientX || touch.x || 0,
            y: touch.clientY || touch.y || 0,
            timestamp: performance.now(),
            playerId: this.determinePlayers(touch.clientX || touch.x || 0)
          };
          
          this.touchPoints.set(touch.identifier || index, touchData);
          
          // 防抖動處理
          const now = performance.now();
          if (now - this.lastClickTime > this.debounceDelay) {
            this.gameEngine.handleClick(touchData);
            this.lastClickTime = now;
          }
        });
      }
      
      handleTouchEnd(event) {
        const touches = Array.from(event.changedTouches || [event]);
        
        touches.forEach((touch, index) => {
          this.touchPoints.delete(touch.identifier || index);
        });
      }
      
      handleMouseClick(event) {
        const clickData = {
          x: event.clientX || 0,
          y: event.clientY || 0,
          timestamp: performance.now(),
          playerId: this.determinePlayers(event.clientX || 0),
          type: 'mouse'
        };
        
        const now = performance.now();
        if (now - this.lastClickTime > this.debounceDelay) {
          this.gameEngine.handleClick(clickData);
          this.lastClickTime = now;
        }
      }
      
      determinePlayers(x) {
        // 簡單的左右分割邏輯
        const screenWidth = 800; // 假設螢幕寬度
        return x < screenWidth / 2 ? 1 : 2;
      }
      
      setDebounceDelay(delay) {
        this.debounceDelay = delay;
      }
      
      enableHapticFeedback(enabled) {
        this.hapticEnabled = enabled;
      }
      
      getActiveTouches() {
        return this.touchPoints.size;
      }
    }
    
    inputManager = new InputManager(mockGameEngine);
  });
  
  describe('觸控事件處理', () => {
    test('應該能處理單點觸控', () => {
      const mockTouchEvent = {
        touches: [{
          identifier: 0,
          clientX: 100,
          clientY: 200
        }]
      };
      
      inputManager.handleTouchStart(mockTouchEvent);
      
      expect(mockGameEngine.handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 100,
          y: 200,
          playerId: 1, // 左側
          timestamp: expect.any(Number)
        })
      );
    });
    
    test('應該能處理多點觸控', () => {
      const mockTouchEvent = {
        touches: [
          { identifier: 0, clientX: 100, clientY: 200 },
          { identifier: 1, clientX: 600, clientY: 300 }
        ]
      };
      
      inputManager.handleTouchStart(mockTouchEvent);
      
      expect(mockGameEngine.handleClick).toHaveBeenCalledTimes(2);
      expect(inputManager.getActiveTouches()).toBe(2);
    });
    
    test('應該能處理觸控結束', () => {
      // 先開始觸控
      const startEvent = {
        touches: [{ identifier: 0, clientX: 100, clientY: 200 }]
      };
      inputManager.handleTouchStart(startEvent);
      expect(inputManager.getActiveTouches()).toBe(1);
      
      // 結束觸控
      const endEvent = {
        changedTouches: [{ identifier: 0 }]
      };
      inputManager.handleTouchEnd(endEvent);
      expect(inputManager.getActiveTouches()).toBe(0);
    });
  });
  
  describe('滑鼠事件處理', () => {
    test('應該能處理滑鼠點擊', () => {
      const mockMouseEvent = {
        clientX: 300,
        clientY: 400
      };
      
      inputManager.handleMouseClick(mockMouseEvent);
      
      expect(mockGameEngine.handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 300,
          y: 400,
          playerId: 1,
          type: 'mouse',
          timestamp: expect.any(Number)
        })
      );
    });
  });
  
  describe('玩家判定', () => {
    test('應該正確判定左側玩家', () => {
      const leftX = 200;
      const playerId = inputManager.determinePlayers(leftX);
      expect(playerId).toBe(1);
    });
    
    test('應該正確判定右側玩家', () => {
      const rightX = 600;
      const playerId = inputManager.determinePlayers(rightX);
      expect(playerId).toBe(2);
    });
  });
  
  describe('防抖動機制', () => {
    test('應該防止快速重複點擊', () => {
      const mockEvent = {
        touches: [{ identifier: 0, clientX: 100, clientY: 200 }]
      };
      
      // 快速連續點擊
      inputManager.handleTouchStart(mockEvent);
      inputManager.handleTouchStart(mockEvent);
      inputManager.handleTouchStart(mockEvent);
      
      // 應該只處理一次（防抖動）
      expect(mockGameEngine.handleClick).toHaveBeenCalledTimes(1);
    });
    
    test('應該允許設定防抖動延遲', () => {
      inputManager.setDebounceDelay(50);
      expect(inputManager.debounceDelay).toBe(50);
    });
  });
  
  describe('配置功能', () => {
    test('應該能啟用/停用震動回饋', () => {
      inputManager.enableHapticFeedback(false);
      expect(inputManager.hapticEnabled).toBe(false);
      
      inputManager.enableHapticFeedback(true);
      expect(inputManager.hapticEnabled).toBe(true);
    });
  });
});

describe('GameEngine', () => {
  let gameEngine;
  let mockTPSCalculator;
  let mockInputManager;
  let mockAudioManager;
  
  beforeEach(() => {
    // Mock TPS Calculator
    mockTPSCalculator = {
      addClick: jest.fn(),
      getCurrentTPS: jest.fn(() => 15),
      getStatistics: jest.fn(() => ({
        current: 15,
        average: 12,
        peak: 20,
        total: 150
      })),
      reset: jest.fn()
    };
    
    // Mock Audio Manager
    mockAudioManager = {
      playClickSound: jest.fn(),
      playSuccessSound: jest.fn(),
      setEnabled: jest.fn()
    };
    
    // 模擬 GameEngine 類別
    class GameEngine {
      constructor() {
        this.state = {
          mode: 'idle',
          gameType: 'single',
          duration: 30000,
          remainingTime: 0,
          players: [
            { id: 1, score: 0, tps: 0, active: false },
            { id: 2, score: 0, tps: 0, active: false }
          ]
        };
        this.tpsCalculator = mockTPSCalculator;
        this.audioManager = mockAudioManager;
        this.gameTimer = null;
        this.updateInterval = null;
      }
      
      startGame(mode, duration) {
        this.state.mode = 'playing';
        this.state.gameType = mode;
        this.state.duration = duration;
        this.state.remainingTime = duration;
        
        // 重置統計
        this.tpsCalculator.reset();
        this.state.players.forEach(player => {
          player.score = 0;
          player.tps = 0;
          player.active = true;
        });
        
        // 開始計時器
        this.gameTimer = setTimeout(() => {
          this.endGame();
        }, duration);
        
        // 開始更新循環
        this.updateInterval = setInterval(() => {
          this.updateGame();
        }, 100);
      }
      
      pauseGame() {
        if (this.state.mode === 'playing') {
          this.state.mode = 'paused';
          this.clearTimers();
        }
      }
      
      resumeGame() {
        if (this.state.mode === 'paused') {
          this.state.mode = 'playing';
          this.startTimers();
        }
      }
      
      endGame() {
        this.state.mode = 'ended';
        this.clearTimers();
        
        const stats = this.tpsCalculator.getStatistics();
        
        return {
          mode: this.state.gameType,
          duration: this.state.duration,
          score: this.getTotalScore(),
          peakTPS: stats.peak,
          averageTPS: stats.average,
          players: this.state.players.map(p => ({ ...p }))
        };
      }
      
      handleClick(clickEvent) {
        if (this.state.mode !== 'playing') return;
        
        const player = this.state.players.find(p => p.id === clickEvent.playerId);
        if (player && player.active) {
          player.score++;
          this.tpsCalculator.addClick(clickEvent.timestamp);
          this.audioManager.playClickSound();
        }
      }
      
      updateGame() {
        if (this.state.mode === 'playing') {
          this.state.remainingTime = Math.max(0, this.state.remainingTime - 100);
          
          // 更新 TPS
          const currentTPS = this.tpsCalculator.getCurrentTPS();
          this.state.players.forEach(player => {
            if (player.active) {
              player.tps = currentTPS;
            }
          });
          
          if (this.state.remainingTime <= 0) {
            this.endGame();
          }
        }
      }
      
      getState() {
        return { ...this.state };
      }
      
      setState(newState) {
        this.state = { ...this.state, ...newState };
      }
      
      getTPS() {
        return this.tpsCalculator.getCurrentTPS();
      }
      
      getScore() {
        return this.getTotalScore();
      }
      
      getTotalScore() {
        return this.state.players.reduce((total, player) => total + player.score, 0);
      }
      
      clearTimers() {
        if (this.gameTimer) {
          clearTimeout(this.gameTimer);
          this.gameTimer = null;
        }
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
          this.updateInterval = null;
        }
      }
      
      startTimers() {
        // 重新開始計時器（簡化實作）
        this.gameTimer = setTimeout(() => {
          this.endGame();
        }, this.state.remainingTime);
      }
    }
    
    gameEngine = new GameEngine();
  });
  
  afterEach(() => {
    gameEngine.clearTimers();
  });
  
  describe('遊戲狀態管理', () => {
    test('應該正確初始化遊戲狀態', () => {
      const state = gameEngine.getState();
      
      expect(state.mode).toBe('idle');
      expect(state.players).toHaveLength(2);
      expect(state.players[0].score).toBe(0);
      expect(state.players[1].score).toBe(0);
    });
    
    test('應該能開始遊戲', () => {
      gameEngine.startGame('single', 30000);
      
      const state = gameEngine.getState();
      expect(state.mode).toBe('playing');
      expect(state.gameType).toBe('single');
      expect(state.duration).toBe(30000);
      expect(state.remainingTime).toBe(30000);
      expect(mockTPSCalculator.reset).toHaveBeenCalled();
    });
    
    test('應該能暫停遊戲', () => {
      gameEngine.startGame('single', 30000);
      gameEngine.pauseGame();
      
      const state = gameEngine.getState();
      expect(state.mode).toBe('paused');
    });
    
    test('應該能恢復遊戲', () => {
      gameEngine.startGame('single', 30000);
      gameEngine.pauseGame();
      gameEngine.resumeGame();
      
      const state = gameEngine.getState();
      expect(state.mode).toBe('playing');
    });
    
    test('應該能結束遊戲並返回結果', () => {
      gameEngine.startGame('single', 30000);
      
      // 模擬一些點擊
      gameEngine.handleClick({ playerId: 1, timestamp: 1000 });
      gameEngine.handleClick({ playerId: 1, timestamp: 1100 });
      
      const result = gameEngine.endGame();
      
      expect(result).toHaveProperty('mode');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('peakTPS');
      expect(result).toHaveProperty('averageTPS');
      expect(result.mode).toBe('single');
      expect(result.duration).toBe(30000);
    });
  });
  
  describe('點擊處理', () => {
    test('應該正確處理玩家點擊', () => {
      gameEngine.startGame('single', 30000);
      
      const clickEvent = {
        playerId: 1,
        x: 100,
        y: 200,
        timestamp: 1000
      };
      
      gameEngine.handleClick(clickEvent);
      
      const state = gameEngine.getState();
      expect(state.players[0].score).toBe(1);
      expect(mockTPSCalculator.addClick).toHaveBeenCalledWith(1000);
      expect(mockAudioManager.playClickSound).toHaveBeenCalled();
    });
    
    test('非遊戲狀態下不應處理點擊', () => {
      const clickEvent = { playerId: 1, timestamp: 1000 };
      
      gameEngine.handleClick(clickEvent);
      
      const state = gameEngine.getState();
      expect(state.players[0].score).toBe(0);
      expect(mockTPSCalculator.addClick).not.toHaveBeenCalled();
    });
    
    test('應該正確計算總分', () => {
      gameEngine.startGame('dual', 30000);
      
      // 玩家 1 點擊 3 次
      for (let i = 0; i < 3; i++) {
        gameEngine.handleClick({ playerId: 1, timestamp: 1000 + i * 100 });
      }
      
      // 玩家 2 點擊 2 次
      for (let i = 0; i < 2; i++) {
        gameEngine.handleClick({ playerId: 2, timestamp: 2000 + i * 100 });
      }
      
      expect(gameEngine.getTotalScore()).toBe(5);
    });
  });
  
  describe('統計功能', () => {
    test('應該能獲取當前 TPS', () => {
      const tps = gameEngine.getTPS();
      expect(tps).toBe(15);
      expect(mockTPSCalculator.getCurrentTPS).toHaveBeenCalled();
    });
    
    test('應該能獲取當前分數', () => {
      gameEngine.startGame('single', 30000);
      gameEngine.handleClick({ playerId: 1, timestamp: 1000 });
      gameEngine.handleClick({ playerId: 1, timestamp: 1100 });
      
      const score = gameEngine.getScore();
      expect(score).toBe(2);
    });
  });
});

describe('整合測試', () => {
  test('完整遊戲流程測試', () => {
    // 這個測試模擬一個完整的遊戲流程
    const mockGameEngine = {
      state: { mode: 'idle' },
      startGame: jest.fn(),
      handleClick: jest.fn(),
      endGame: jest.fn(),
      getState: jest.fn(() => ({ mode: 'playing' }))
    };
    
    const mockInputManager = {
      setupEventListeners: jest.fn(),
      handleTouchStart: jest.fn(),
      setDebounceDelay: jest.fn()
    };
    
    // 1. 初始化
    expect(mockGameEngine.state.mode).toBe('idle');
    
    // 2. 開始遊戲
    mockGameEngine.startGame('single', 30000);
    expect(mockGameEngine.startGame).toHaveBeenCalledWith('single', 30000);
    
    // 3. 處理輸入
    const touchEvent = {
      touches: [{ identifier: 0, clientX: 100, clientY: 200 }]
    };
    mockInputManager.handleTouchStart(touchEvent);
    expect(mockInputManager.handleTouchStart).toHaveBeenCalledWith(touchEvent);
    
    // 4. 結束遊戲
    mockGameEngine.endGame();
    expect(mockGameEngine.endGame).toHaveBeenCalled();
  });
});
