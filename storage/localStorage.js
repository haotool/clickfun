/**
 * LocalStorage 適配器
 * 提供標準化的 LocalStorage 介面
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

export class LocalStorageAdapter {
  constructor(config = {}) {
    this.config = config;
    this.prefix = config.dbName ? `${config.dbName}:` : 'clickfun:';
    this.isAvailable = this.checkAvailability();
  }

  /**
   * 檢查 LocalStorage 可用性
   */
  checkAvailability() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('⚠️ LocalStorage 不可用:', e);
      return false;
    }
  }

  /**
   * 初始化
   */
  async init() {
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }
    
    // 清理過期資料
    await this.cleanupExpiredData();
    
    this.log('✅ LocalStorage 適配器初始化完成');
  }

  /**
   * 清理過期資料
   */
  async cleanupExpiredData() {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      
      for (const key of prefixedKeys) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          
          // 檢查是否有過期時間且已過期
          if (data && data.__expires && Date.now() > data.__expires) {
            localStorage.removeItem(key);
            this.log(`🧹 清理過期資料: ${key}`);
          }
        } catch (parseError) {
          // 如果解析失敗，可能是舊格式資料，保留不動
          this.log(`⚠️ 跳過無法解析的資料: ${key}`);
        }
      }
    } catch (error) {
      this.log('⚠️ 清理過期資料時發生錯誤:', error);
    }
  }

  /**
   * 生成完整鍵名
   */
  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * 儲存資料
   */
  async setItem(key, value, options = {}) {
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }

    try {
      const fullKey = this.getFullKey(key);
      
      // 包裝資料，添加元資訊
      const wrappedData = {
        value,
        __timestamp: Date.now(),
        __version: this.config.version || 1
      };

      // 添加過期時間 (如果指定)
      if (options.ttl) {
        wrappedData.__expires = Date.now() + options.ttl;
      }

      const serializedData = JSON.stringify(wrappedData);
      
      // 檢查大小限制 (LocalStorage 通常限制為 5-10MB)
      if (serializedData.length > 5 * 1024 * 1024) {
        throw new Error('資料過大，超出 LocalStorage 限制');
      }

      localStorage.setItem(fullKey, serializedData);
      this.log(`💾 LocalStorage 儲存: ${key} (${this.formatBytes(serializedData.length)})`);
      
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        // 配額超出，嘗試清理舊資料
        await this.cleanupOldData();
        
        // 再次嘗試儲存
        try {
          const fullKey = this.getFullKey(key);
          const wrappedData = { value, __timestamp: Date.now() };
          localStorage.setItem(fullKey, JSON.stringify(wrappedData));
          this.log(`💾 LocalStorage 儲存 (清理後): ${key}`);
        } catch (retryError) {
          throw new Error(`LocalStorage 配額已滿且清理後仍無法儲存: ${retryError.message}`);
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
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }

    try {
      const fullKey = this.getFullKey(key);
      const serializedData = localStorage.getItem(fullKey);
      
      if (serializedData === null) {
        return null;
      }

      const wrappedData = JSON.parse(serializedData);
      
      // 檢查是否過期
      if (wrappedData.__expires && Date.now() > wrappedData.__expires) {
        localStorage.removeItem(fullKey);
        this.log(`⏰ 資料已過期並移除: ${key}`);
        return null;
      }

      // 相容性處理：如果沒有包裝結構，直接返回原始資料
      if (wrappedData.hasOwnProperty('value')) {
        this.log(`📖 LocalStorage 讀取: ${key}`);
        return wrappedData.value;
      } else {
        // 舊格式資料
        this.log(`📖 LocalStorage 讀取 (舊格式): ${key}`);
        return wrappedData;
      }
      
    } catch (error) {
      console.error(`❌ LocalStorage 讀取失敗 ${key}:`, error);
      return null;
    }
  }

  /**
   * 移除資料
   */
  async removeItem(key) {
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }

    const fullKey = this.getFullKey(key);
    localStorage.removeItem(fullKey);
    this.log(`🗑️ LocalStorage 移除: ${key}`);
  }

  /**
   * 清空所有資料
   */
  async clear() {
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }

    const keys = Object.keys(localStorage);
    const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
    
    for (const key of prefixedKeys) {
      localStorage.removeItem(key);
    }
    
    this.log(`🧹 LocalStorage 清空: ${prefixedKeys.length} 項目`);
  }

  /**
   * 獲取所有鍵名
   */
  async keys() {
    if (!this.isAvailable) {
      throw new Error('LocalStorage 不可用');
    }

    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  /**
   * 獲取儲存項目數量
   */
  async size() {
    const keys = await this.keys();
    return keys.length;
  }

  /**
   * 清理舊資料 (當配額不足時)
   */
  async cleanupOldData() {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      
      // 獲取所有資料的時間戳記
      const dataWithTimestamp = [];
      
      for (const key of prefixedKeys) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const timestamp = data.__timestamp || 0;
          dataWithTimestamp.push({ key, timestamp });
        } catch (e) {
          // 無法解析的資料視為最舊
          dataWithTimestamp.push({ key, timestamp: 0 });
        }
      }

      // 按時間戳記排序，移除最舊的 25% 資料
      dataWithTimestamp.sort((a, b) => a.timestamp - b.timestamp);
      const itemsToRemove = Math.ceil(dataWithTimestamp.length * 0.25);
      
      for (let i = 0; i < itemsToRemove; i++) {
        localStorage.removeItem(dataWithTimestamp[i].key);
        this.log(`🧹 清理舊資料: ${dataWithTimestamp[i].key}`);
      }
      
      this.log(`🧹 清理完成，移除 ${itemsToRemove} 項舊資料`);
      
    } catch (error) {
      this.log('⚠️ 清理舊資料時發生錯誤:', error);
    }
  }

  /**
   * 格式化位元組大小
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 調試日誌
   */
  log(...args) {
    if (this.config.debug) {
      console.log('📝 LocalStorageAdapter:', ...args);
    }
  }

  /**
   * 獲取使用統計
   */
  async getStats() {
    try {
      const keys = await this.keys();
      let totalSize = 0;
      
      for (const key of keys) {
        const fullKey = this.getFullKey(key);
        const data = localStorage.getItem(fullKey);
        if (data) {
          totalSize += data.length * 2; // UTF-16 字符佔 2 位元組
        }
      }

      return {
        itemCount: keys.length,
        totalSize,
        formattedSize: this.formatBytes(totalSize),
        maxSize: 5 * 1024 * 1024, // 5MB 估計值
        usagePercentage: (totalSize / (5 * 1024 * 1024)) * 100
      };
    } catch (error) {
      this.log('⚠️ 獲取統計資訊時發生錯誤:', error);
      return null;
    }
  }
}
