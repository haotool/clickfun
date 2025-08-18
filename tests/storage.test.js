/**
 * 儲存系統測試
 * 測試 StorageAdapter、LocalStorageAdapter、IndexedDBAdapter 和 GameStorage
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

import { StorageAdapter, GameStorage } from '../storage/adapter.js';
import { LocalStorageAdapter } from '../storage/localStorage.js';
import { IndexedDBAdapter } from '../storage/indexedDB.js';

// Mock IndexedDB for testing
global.indexedDB = require('fake-indexeddb');
global.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

describe('StorageAdapter', () => {
  let storageAdapter;
  
  beforeEach(async () => {
    // 清理 localStorage
    localStorage.clear();
    
    // 建立測試用適配器
    storageAdapter = new StorageAdapter({
      debug: true,
      dbName: 'TestDB',
      version: 1
    });
    
    await storageAdapter.init();
  });
  
  afterEach(async () => {
    if (storageAdapter) {
      await storageAdapter.clear();
    }
  });

  describe('基本操作', () => {
    test('應該能儲存和讀取字串資料', async () => {
      const key = 'test-string';
      const value = 'Hello World';
      
      await storageAdapter.setItem(key, value);
      const result = await storageAdapter.getItem(key);
      
      expect(result).toBe(value);
    });

    test('應該能儲存和讀取物件資料', async () => {
      const key = 'test-object';
      const value = {
        name: 'ClickFun',
        version: '7.2.3',
        features: ['PWA', 'Offline', 'Multi-touch']
      };
      
      await storageAdapter.setItem(key, value);
      const result = await storageAdapter.getItem(key);
      
      expect(result).toEqual(value);
    });

    test('應該能儲存和讀取數組資料', async () => {
      const key = 'test-array';
      const value = [1, 2, 3, 'test', { nested: true }];
      
      await storageAdapter.setItem(key, value);
      const result = await storageAdapter.getItem(key);
      
      expect(result).toEqual(value);
    });

    test('讀取不存在的鍵應該返回 null', async () => {
      const result = await storageAdapter.getItem('non-existent-key');
      expect(result).toBeNull();
    });

    test('應該能移除資料', async () => {
      const key = 'test-remove';
      const value = 'to be removed';
      
      await storageAdapter.setItem(key, value);
      expect(await storageAdapter.getItem(key)).toBe(value);
      
      await storageAdapter.removeItem(key);
      expect(await storageAdapter.getItem(key)).toBeNull();
    });

    test('應該能清空所有資料', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const values = ['value1', 'value2', 'value3'];
      
      // 儲存多筆資料
      for (let i = 0; i < keys.length; i++) {
        await storageAdapter.setItem(keys[i], values[i]);
      }
      
      // 驗證資料存在
      for (let i = 0; i < keys.length; i++) {
        expect(await storageAdapter.getItem(keys[i])).toBe(values[i]);
      }
      
      // 清空所有資料
      await storageAdapter.clear();
      
      // 驗證資料已被清空
      for (const key of keys) {
        expect(await storageAdapter.getItem(key)).toBeNull();
      }
    });
  });

  describe('進階功能', () => {
    test('應該能獲取所有鍵名', async () => {
      const testData = {
        'game:score': 100,
        'game:settings': { sound: true },
        'user:name': 'Player1'
      };
      
      for (const [key, value] of Object.entries(testData)) {
        await storageAdapter.setItem(key, value);
      }
      
      const keys = await storageAdapter.keys();
      
      for (const key of Object.keys(testData)) {
        expect(keys).toContain(key);
      }
    });

    test('應該能獲取儲存項目數量', async () => {
      const testKeys = ['test1', 'test2', 'test3'];
      
      // 初始大小應為 0
      expect(await storageAdapter.size()).toBe(0);
      
      // 逐一加入資料
      for (let i = 0; i < testKeys.length; i++) {
        await storageAdapter.setItem(testKeys[i], `value${i}`);
        expect(await storageAdapter.size()).toBe(i + 1);
      }
    });

    test('應該能獲取適配器資訊', () => {
      const info = storageAdapter.getAdapterInfo();
      
      expect(info).toHaveProperty('primary');
      expect(info).toHaveProperty('fallback');
      expect(info).toHaveProperty('isInitialized');
      expect(info).toHaveProperty('config');
      expect(info.isInitialized).toBe(true);
    });
  });

  describe('TTL 過期機制', () => {
    test('資料應該在 TTL 過期後自動移除', async () => {
      const key = 'test-ttl';
      const value = 'will expire';
      const ttl = 100; // 100ms
      
      await storageAdapter.setItem(key, value, { ttl });
      
      // 立即讀取應該成功
      expect(await storageAdapter.getItem(key)).toBe(value);
      
      // 等待過期
      await new Promise(resolve => setTimeout(resolve, ttl + 50));
      
      // 過期後讀取應該返回 null
      expect(await storageAdapter.getItem(key)).toBeNull();
    });
  });

  describe('錯誤處理', () => {
    test('應該處理無效的 JSON 資料', async () => {
      // 直接在 localStorage 中設定無效 JSON
      const key = storageAdapter.primaryAdapter.getFullKey('invalid-json');
      localStorage.setItem(key, 'invalid json data');
      
      const result = await storageAdapter.getItem('invalid-json');
      expect(result).toBeNull();
    });
  });
});

describe('GameStorage', () => {
  let gameStorage;
  let storageAdapter;
  
  beforeEach(async () => {
    localStorage.clear();
    
    storageAdapter = new StorageAdapter({
      debug: true,
      dbName: 'GameTestDB',
      version: 1
    });
    
    await storageAdapter.init();
    gameStorage = new GameStorage(storageAdapter);
  });
  
  afterEach(async () => {
    if (storageAdapter) {
      await storageAdapter.clear();
    }
  });

  describe('遊戲設定', () => {
    test('應該能儲存和讀取遊戲設定', async () => {
      const settings = {
        soundEnabled: false,
        vibrationEnabled: true,
        effectsEnabled: false,
        theme: 'dark'
      };
      
      await gameStorage.saveSettings(settings);
      const result = await gameStorage.getSettings();
      
      expect(result).toMatchObject(settings);
    });

    test('應該提供預設設定', async () => {
      const settings = await gameStorage.getSettings();
      
      expect(settings).toHaveProperty('soundEnabled');
      expect(settings).toHaveProperty('vibrationEnabled');
      expect(settings).toHaveProperty('effectsEnabled');
      expect(settings).toHaveProperty('theme');
      
      // 預設值
      expect(settings.soundEnabled).toBe(true);
      expect(settings.vibrationEnabled).toBe(true);
      expect(settings.effectsEnabled).toBe(true);
      expect(settings.theme).toBe('auto');
    });
  });

  describe('最高分記錄', () => {
    test('應該能儲存和讀取最高分', async () => {
      const mode = 'single-30s';
      const score = 150;
      const tps = 25.5;
      
      await gameStorage.saveHighScore(mode, score, tps);
      const result = await gameStorage.getHighScore(mode);
      
      expect(result).toMatchObject({
        score,
        tps,
        timestamp: expect.any(Number),
        date: expect.any(String)
      });
    });

    test('不存在的模式應該返回 null', async () => {
      const result = await gameStorage.getHighScore('non-existent-mode');
      expect(result).toBeNull();
    });
  });

  describe('遊戲歷史', () => {
    test('應該能儲存遊戲歷史', async () => {
      const gameData = {
        mode: 'single',
        duration: 30000,
        score: 120,
        peakTPS: 30,
        averageTPS: 20
      };
      
      await gameStorage.saveGameHistory(gameData);
      const history = await gameStorage.getGameHistory();
      
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        ...gameData,
        id: expect.any(Number),
        timestamp: expect.any(Number)
      });
    });

    test('應該限制歷史記錄數量', async () => {
      // 新增超過限制的記錄
      for (let i = 0; i < 105; i++) {
        await gameStorage.saveGameHistory({
          mode: 'test',
          duration: 1000,
          score: i,
          peakTPS: i,
          averageTPS: i
        });
      }
      
      const history = await gameStorage.getGameHistory();
      expect(history.length).toBeLessThanOrEqual(100);
      
      // 應該保留最新的記錄
      expect(history[0].score).toBe(104);
    });

    test('空歷史應該返回空陣列', async () => {
      const history = await gameStorage.getGameHistory();
      expect(history).toEqual([]);
    });
  });

  describe('資料管理', () => {
    test('應該能清空遊戲資料', async () => {
      // 新增各種遊戲資料
      await gameStorage.saveSettings({ soundEnabled: false });
      await gameStorage.saveHighScore('single', 100, 20);
      await gameStorage.saveGameHistory({
        mode: 'single',
        duration: 30000,
        score: 100,
        peakTPS: 20,
        averageTPS: 15
      });
      
      // 確認資料存在
      expect(await gameStorage.getSettings()).toMatchObject({ soundEnabled: false });
      expect(await gameStorage.getHighScore('single')).not.toBeNull();
      expect(await gameStorage.getGameHistory()).toHaveLength(1);
      
      // 清空遊戲資料
      await gameStorage.clearGameData();
      
      // 確認資料已清空
      expect(await gameStorage.getSettings()).toMatchObject({ soundEnabled: true }); // 預設值
      expect(await gameStorage.getHighScore('single')).toBeNull();
      expect(await gameStorage.getGameHistory()).toEqual([]);
    });
  });
});

describe('LocalStorageAdapter', () => {
  let adapter;
  
  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter({
      debug: true,
      dbName: 'TestLS'
    });
  });
  
  afterEach(async () => {
    if (adapter) {
      await adapter.clear();
    }
  });

  test('應該檢測到 LocalStorage 可用性', () => {
    expect(adapter.isAvailable).toBe(true);
  });

  test('應該正確生成完整鍵名', () => {
    const key = 'testKey';
    const fullKey = adapter.getFullKey(key);
    
    expect(fullKey).toBe('TestLS:testKey');
  });

  test('應該能獲取使用統計', async () => {
    await adapter.init();
    
    // 新增一些測試資料
    await adapter.setItem('test1', 'value1');
    await adapter.setItem('test2', { complex: 'object' });
    
    const stats = await adapter.getStats();
    
    expect(stats).toHaveProperty('itemCount');
    expect(stats).toHaveProperty('totalSize');
    expect(stats).toHaveProperty('formattedSize');
    expect(stats).toHaveProperty('usagePercentage');
    
    expect(stats.itemCount).toBe(2);
    expect(stats.totalSize).toBeGreaterThan(0);
  });
});

describe('整合測試', () => {
  test('StorageAdapter 應該在 IndexedDB 失敗時回退到 LocalStorage', async () => {
    // Mock IndexedDB 失敗
    const originalIndexedDB = global.indexedDB;
    global.indexedDB = undefined;
    
    const adapter = new StorageAdapter({
      preferredStorage: 'indexeddb',
      debug: true
    });
    
    await adapter.init();
    
    // 確認使用 LocalStorage
    const info = adapter.getAdapterInfo();
    expect(info.primary).toBe('LocalStorageAdapter');
    
    // 測試基本功能
    await adapter.setItem('fallback-test', 'works');
    const result = await adapter.getItem('fallback-test');
    expect(result).toBe('works');
    
    // 還原
    global.indexedDB = originalIndexedDB;
  });
});
