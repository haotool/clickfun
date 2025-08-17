/**
 * IndexedDB 適配器
 * 提供標準化的 IndexedDB 介面，支援大容量儲存
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

export class IndexedDBAdapter {
  constructor(config = {}) {
    this.config = {
      dbName: 'ClickFunDB',
      version: 1,
      storeName: 'gameData',
      ...config
    };
    
    this.db = null;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * 檢查 IndexedDB 可用性
   */
  checkAvailability() {
    try {
      return 'indexedDB' in window && 
             window.indexedDB !== null && 
             window.indexedDB !== undefined;
    } catch (e) {
      console.warn('⚠️ IndexedDB 不可用:', e);
      return false;
    }
  }

  /**
   * 初始化 IndexedDB
   */
  async init() {
    if (!this.isAvailable) {
      throw new Error('IndexedDB 不可用');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        reject(new Error(`IndexedDB 開啟失敗: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.log(`✅ IndexedDB 連接成功: ${this.config.dbName}`);
        
        // 設定錯誤處理
        this.db.onerror = (event) => {
          console.error('❌ IndexedDB 操作錯誤:', event);
        };
        
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.log(`🔄 IndexedDB 升級: v${event.oldVersion} → v${event.newVersion}`);
        
        // 建立 object store
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'key' });
          
          // 建立索引
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('expires', 'expires', { unique: false });
          
          this.log(`📦 建立 Object Store: ${this.config.storeName}`);
        }
      };
    });
  }

  /**
   * 獲取交易
   */
  getTransaction(mode = 'readonly') {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }
    
    return this.db.transaction([this.config.storeName], mode);
  }

  /**
   * 獲取 Object Store
   */
  getStore(mode = 'readonly') {
    const transaction = this.getTransaction(mode);
    return transaction.objectStore(this.config.storeName);
  }

  /**
   * 儲存資料
   */
  async setItem(key, value, options = {}) {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readwrite');
        
        // 建立資料物件
        const data = {
          key,
          value,
          timestamp: Date.now(),
          version: this.config.version
        };

        // 添加過期時間 (如果指定)
        if (options.ttl) {
          data.expires = Date.now() + options.ttl;
        }

        const request = store.put(data);

        request.onsuccess = () => {
          this.log(`💾 IndexedDB 儲存: ${key}`);
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 儲存失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 讀取資料
   */
  async getItem(key) {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readonly');
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result;
          
          if (!result) {
            resolve(null);
            return;
          }

          // 檢查是否過期
          if (result.expires && Date.now() > result.expires) {
            // 異步移除過期資料
            this.removeItem(key).catch(error => {
              this.log(`⚠️ 移除過期資料失敗: ${error.message}`);
            });
            this.log(`⏰ 資料已過期: ${key}`);
            resolve(null);
            return;
          }

          this.log(`📖 IndexedDB 讀取: ${key}`);
          resolve(result.value);
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 讀取失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 移除資料
   */
  async removeItem(key) {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readwrite');
        const request = store.delete(key);

        request.onsuccess = () => {
          this.log(`🗑️ IndexedDB 移除: ${key}`);
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 移除失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 清空所有資料
   */
  async clear() {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readwrite');
        const request = store.clear();

        request.onsuccess = () => {
          this.log('🧹 IndexedDB 清空完成');
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 清空失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 獲取所有鍵名
   */
  async keys() {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readonly');
        const request = store.getAllKeys();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 獲取鍵名失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 獲取儲存項目數量
   */
  async size() {
    if (!this.db) {
      throw new Error('IndexedDB 未初始化');
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readonly');
        const request = store.count();

        request.onsuccess = () => {
          resolve(request.result || 0);
        };

        request.onerror = () => {
          reject(new Error(`IndexedDB 計數失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 清理過期資料
   */
  async cleanupExpiredData() {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const store = this.getStore('readwrite');
        const index = store.index('expires');
        const now = Date.now();
        
        // 查詢所有過期的資料
        const range = IDBKeyRange.upperBound(now);
        const request = index.openCursor(range);
        
        let deletedCount = 0;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          
          if (cursor) {
            // 刪除過期資料
            const deleteRequest = cursor.delete();
            deleteRequest.onsuccess = () => {
              deletedCount++;
            };
            cursor.continue();
          } else {
            // 遍歷完成
            if (deletedCount > 0) {
              this.log(`🧹 清理過期資料: ${deletedCount} 項目`);
            }
            resolve(deletedCount);
          }
        };

        request.onerror = () => {
          reject(new Error(`清理過期資料失敗: ${request.error?.message}`));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 獲取使用統計
   */
  async getStats() {
    try {
      const keys = await this.keys();
      const itemCount = keys.length;
      
      // 估算存儲空間使用 (IndexedDB 沒有直接的大小查詢方法)
      // 這是一個粗略的估算
      let estimatedSize = 0;
      
      // 取樣部分資料來估算平均大小
      const sampleSize = Math.min(10, itemCount);
      if (sampleSize > 0) {
        const sampleKeys = keys.slice(0, sampleSize);
        let sampleTotalSize = 0;
        
        for (const key of sampleKeys) {
          const value = await this.getItem(key);
          if (value !== null) {
            const serialized = JSON.stringify(value);
            sampleTotalSize += serialized.length * 2; // UTF-16
          }
        }
        
        const averageSize = sampleTotalSize / sampleSize;
        estimatedSize = averageSize * itemCount;
      }

      return {
        itemCount,
        estimatedSize,
        formattedSize: this.formatBytes(estimatedSize),
        isEstimated: true
      };
      
    } catch (error) {
      this.log('⚠️ 獲取統計資訊時發生錯誤:', error);
      return null;
    }
  }

  /**
   * 執行資料庫維護
   */
  async maintenance() {
    try {
      this.log('🔧 開始 IndexedDB 維護...');
      
      // 清理過期資料
      const deletedCount = await this.cleanupExpiredData();
      
      // 獲取統計資訊
      const stats = await this.getStats();
      
      this.log('✅ IndexedDB 維護完成', {
        deletedExpired: deletedCount,
        totalItems: stats?.itemCount || 0,
        estimatedSize: stats?.formattedSize || '未知'
      });
      
      return {
        deletedExpired: deletedCount,
        stats
      };
      
    } catch (error) {
      this.log('⚠️ IndexedDB 維護時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 關閉資料庫連接
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.log('🔌 IndexedDB 連接已關閉');
    }
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
   * 調試日誌
   */
  log(...args) {
    if (this.config.debug) {
      console.log('🗄️ IndexedDBAdapter:', ...args);
    }
  }
}
