/**
 * 統一儲存適配器 - Storage Adapter
 * 提供 LocalStorage 與 IndexedDB 的統一介面
 * 基於適配器模式設計，支援自動回退與容量管理
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

import { LocalStorageAdapter } from './localStorage.js';
import { IndexedDBAdapter } from './indexedDB.js';

/**
 * 儲存適配器主類別
 * 自動選擇最佳的儲存方案並提供統一API
 */
export class StorageAdapter {
  constructor(options = {}) {
    this.config = {
      // 預設使用 IndexedDB，回退到 LocalStorage
      preferredStorage: 'indexeddb',
      // 資料庫名稱
      dbName: options.dbName || 'ClickFunDB',
      // 版本號
      version: options.version || 1,
      // 容量警告閾值 (5MB)
      quotaWarningThreshold: options.quotaWarningThreshold || 5 * 1024 * 1024,
      // 是否啟用調試模式
      debug: options.debug || false,
      ...options
    };

    this.primaryAdapter = null;
    this.fallbackAdapter = null;
    this.isInitialized = false;

    this.init();
  }

  /**
   * 初始化適配器
   */
  async init() {
    try {
      // 檢測 IndexedDB 支援性
      if (this.config.preferredStorage === 'indexeddb' && this.isIndexedDBSupported()) {
        this.primaryAdapter = new IndexedDBAdapter(this.config);
        this.fallbackAdapter = new LocalStorageAdapter(this.config);
        
        await this.primaryAdapter.init();
        this.log('✅ IndexedDB 初始化成功，LocalStorage 作為後備');
      } else {
        // 直接使用 LocalStorage
        this.primaryAdapter = new LocalStorageAdapter(this.config);
        this.log('📝 使用 LocalStorage 作為主要儲存');
      }

      await this.primaryAdapter.init();
      this.isInitialized = true;
      
      // 檢查儲存配額
      await this.checkStorageQuota();
      
    } catch (error) {
      console.error('❌ 儲存適配器初始化失敗:', error);
      
      // 回退到 LocalStorage
      if (this.fallbackAdapter) {
        this.log('🔄 回退到 LocalStorage');
        this.primaryAdapter = this.fallbackAdapter;
        await this.primaryAdapter.init();
        this.isInitialized = true;
      } else {
        throw new Error('所有儲存選項均不可用');
      }
    }
  }

  /**
   * 檢測 IndexedDB 支援性
   */
  isIndexedDBSupported() {
    try {
      return 'indexedDB' in window && 
             window.indexedDB !== null && 
             window.indexedDB !== undefined;
    } catch (e) {
      return false;
    }
  }

  /**
   * 檢查儲存配額
   */
  async checkStorageQuota() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const total = estimate.quota || 0;
        
        this.log(`📊 儲存使用狀況: ${this.formatBytes(used)} / ${this.formatBytes(total)}`);
        
        if (used > this.config.quotaWarningThreshold) {
          console.warn(`⚠️ 儲存空間使用量較高: ${this.formatBytes(used)}`);
        }
        
        return { used, total, percentage: total > 0 ? (used / total) * 100 : 0 };
      }
    } catch (error) {
      this.log('⚠️ 無法檢查儲存配額:', error);
    }
    return null;
  }

  /**
   * 格式化位元組大小
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 儲存資料
   */
  async setItem(key, value) {
    await this.ensureInitialized();
    
    try {
      await this.primaryAdapter.setItem(key, value);
      this.log(`💾 儲存成功: ${key}`);
    } catch (error) {
      console.error(`❌ 儲存失敗 ${key}:`, error);
      
      // 嘗試使用後備適配器
      if (this.fallbackAdapter && this.primaryAdapter !== this.fallbackAdapter) {
        try {
          await this.fallbackAdapter.setItem(key, value);
          this.log(`💾 後備儲存成功: ${key}`);
        } catch (fallbackError) {
          console.error(`❌ 後備儲存也失敗 ${key}:`, fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * 讀取資料
   */
  async getItem(key) {
    await this.ensureInitialized();
    
    try {
      const value = await this.primaryAdapter.getItem(key);
      if (value !== null) {
        this.log(`📖 讀取成功: ${key}`);
        return value;
      }
    } catch (error) {
      console.error(`❌ 讀取失敗 ${key}:`, error);
    }

    // 嘗試從後備適配器讀取
    if (this.fallbackAdapter && this.primaryAdapter !== this.fallbackAdapter) {
      try {
        const value = await this.fallbackAdapter.getItem(key);
        if (value !== null) {
          this.log(`📖 後備讀取成功: ${key}`);
          // 同步到主適配器
          try {
            await this.primaryAdapter.setItem(key, value);
          } catch (syncError) {
            this.log(`⚠️ 同步到主適配器失敗: ${syncError.message}`);
          }
          return value;
        }
      } catch (fallbackError) {
        console.error(`❌ 後備讀取也失敗 ${key}:`, fallbackError);
      }
    }

    return null;
  }

  /**
   * 移除資料
   */
  async removeItem(key) {
    await this.ensureInitialized();
    
    const promises = [];
    
    // 從主適配器移除
    promises.push(
      this.primaryAdapter.removeItem(key).catch(error => {
        console.error(`❌ 主適配器移除失敗 ${key}:`, error);
      })
    );

    // 從後備適配器移除
    if (this.fallbackAdapter && this.primaryAdapter !== this.fallbackAdapter) {
      promises.push(
        this.fallbackAdapter.removeItem(key).catch(error => {
          console.error(`❌ 後備適配器移除失敗 ${key}:`, error);
        })
      );
    }

    await Promise.all(promises);
    this.log(`🗑️ 移除完成: ${key}`);
  }

  /**
   * 清空所有資料
   */
  async clear() {
    await this.ensureInitialized();
    
    const promises = [];
    
    promises.push(
      this.primaryAdapter.clear().catch(error => {
        console.error('❌ 主適配器清空失敗:', error);
      })
    );

    if (this.fallbackAdapter && this.primaryAdapter !== this.fallbackAdapter) {
      promises.push(
        this.fallbackAdapter.clear().catch(error => {
          console.error('❌ 後備適配器清空失敗:', error);
        })
      );
    }

    await Promise.all(promises);
    this.log('🧹 儲存清空完成');
  }

  /**
   * 獲取所有鍵名
   */
  async keys() {
    await this.ensureInitialized();
    return await this.primaryAdapter.keys();
  }

  /**
   * 獲取儲存大小
   */
  async size() {
    await this.ensureInitialized();
    return await this.primaryAdapter.size();
  }

  /**
   * 確保適配器已初始化
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  /**
   * 調試日誌
   */
  log(...args) {
    if (this.config.debug) {
      console.log('🗃️ StorageAdapter:', ...args);
    }
  }

  /**
   * 獲取適配器資訊
   */
  getAdapterInfo() {
    return {
      primary: this.primaryAdapter?.constructor.name || 'None',
      fallback: this.fallbackAdapter?.constructor.name || 'None',
      isInitialized: this.isInitialized,
      config: this.config
    };
  }
}

// 建立預設實例
export const storage = new StorageAdapter({
  debug: false, // 生產環境關閉調試
  dbName: 'ClickFunDB',
  version: 1
});

// 遊戲專用的高階 API
export class GameStorage {
  constructor(storageAdapter = storage) {
    this.storage = storageAdapter;
  }

  // 儲存遊戲設定
  async saveSettings(settings) {
    await this.storage.setItem('game:settings', settings);
  }

  // 讀取遊戲設定
  async getSettings() {
    const defaultSettings = {
      soundEnabled: true,
      vibrationEnabled: true,
      effectsEnabled: true,
      theme: 'auto'
    };
    
    const settings = await this.storage.getItem('game:settings');
    return settings ? { ...defaultSettings, ...settings } : defaultSettings;
  }

  // 儲存最高分
  async saveHighScore(mode, score, tps) {
    const key = `game:highscore:${mode}`;
    const record = {
      score,
      tps,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };
    
    await this.storage.setItem(key, record);
  }

  // 獲取最高分
  async getHighScore(mode) {
    const key = `game:highscore:${mode}`;
    return await this.storage.getItem(key);
  }

  // 儲存遊戲歷史
  async saveGameHistory(gameData) {
    const history = await this.getGameHistory();
    history.unshift({
      ...gameData,
      id: Date.now(),
      timestamp: Date.now()
    });
    
    // 保留最近 100 筆記錄
    if (history.length > 100) {
      history.splice(100);
    }
    
    await this.storage.setItem('game:history', history);
  }

  // 獲取遊戲歷史
  async getGameHistory() {
    return await this.storage.getItem('game:history') || [];
  }

  // 清空遊戲資料
  async clearGameData() {
    const keys = await this.storage.keys();
    const gameKeys = keys.filter(key => key.startsWith('game:'));
    
    for (const key of gameKeys) {
      await this.storage.removeItem(key);
    }
  }
}

// 建立遊戲儲存實例
export const gameStorage = new GameStorage();
