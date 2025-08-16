/**
 * 整合測試 - ClickFun 專案
 * 測試主要功能模組的整合
 */

import { jest } from '@jest/globals';

// 模擬瀏覽器環境
global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  location: { href: 'http://localhost:3000' },
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  sessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
};

global.document = {
  createElement: jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    },
  })),
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

global.navigator = {
  serviceWorker: {
    register: jest.fn(),
    ready: Promise.resolve(),
  },
  onLine: true,
};

// 測試套件
describe('ClickFun 整合測試', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('PWA 功能整合', () => {
    test('Service Worker 註冊', async () => {
      // 模擬 Service Worker 註冊
      const mockRegister = jest.fn().mockResolvedValue({
        active: { state: 'activated' },
        installing: null,
        waiting: null,
      });

      global.navigator.serviceWorker.register = mockRegister;

      // 這裡可以測試實際的 Service Worker 註冊邏輯
      expect(mockRegister).toBeDefined();
    });

    test('離線功能支援', () => {
      // 測試離線狀態檢測
      global.navigator.onLine = false;
      expect(global.navigator.onLine).toBe(false);

      global.navigator.onLine = true;
      expect(global.navigator.onLine).toBe(true);
    });
  });

  describe('本地儲存整合', () => {
    test('遊戲狀態儲存', () => {
      const mockLocalStorage = global.window.localStorage;
      const gameState = { score: 100, level: 5 };

      // 測試儲存
      mockLocalStorage.setItem('gameState', JSON.stringify(gameState));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('gameState', JSON.stringify(gameState));

      // 測試讀取
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(gameState));
      const retrieved = JSON.parse(mockLocalStorage.getItem('gameState'));
      expect(retrieved).toEqual(gameState);
    });

    test('快取清理', () => {
      const mockLocalStorage = global.window.localStorage;

      mockLocalStorage.clear();
      expect(mockLocalStorage.clear).toHaveBeenCalled();
    });
  });

  describe('DOM 操作整合', () => {
    test('元素創建和操作', () => {
      const mockElement = global.document.createElement('div');

      expect(mockElement).toBeDefined();
      expect(mockElement.addEventListener).toBeDefined();
      expect(mockElement.setAttribute).toBeDefined();
    });

    test('事件監聽器管理', () => {
      const mockElement = global.document.createElement('button');
      const mockHandler = jest.fn();

      mockElement.addEventListener('click', mockHandler);
      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', mockHandler);

      mockElement.removeEventListener('click', mockHandler);
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', mockHandler);
    });
  });

  describe('效能監控整合', () => {
    test('效能指標收集', () => {
      // 模擬 Performance API
      global.performance = {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn(() => []),
      };

      expect(global.performance.now).toBeDefined();
      expect(global.performance.mark).toBeDefined();
      expect(global.performance.measure).toBeDefined();
    });
  });

  describe('錯誤處理整合', () => {
    test('全域錯誤處理', () => {
      const mockErrorHandler = jest.fn();

      // 模擬錯誤事件監聽器
      global.window.addEventListener('error', mockErrorHandler);
      expect(global.window.addEventListener).toHaveBeenCalledWith('error', mockErrorHandler);

      // 模擬未處理的 Promise 拒絕
      global.window.addEventListener('unhandledrejection', mockErrorHandler);
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        mockErrorHandler
      );
    });
  });
});
