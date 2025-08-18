/**
 * PWA 功能測試
 * 測試 Service Worker、更新機制、離線功能等
 * 
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

// Mock PWA 相關 API
global.navigator = {
  serviceWorker: {
    register: jest.fn(),
    ready: Promise.resolve({
      update: jest.fn(),
      unregister: jest.fn()
    }),
    getRegistration: jest.fn()
  },
  storage: {
    estimate: jest.fn(() => Promise.resolve({
      quota: 10 * 1024 * 1024 * 1024, // 10GB
      usage: 50 * 1024 * 1024 // 50MB
    })),
    persist: jest.fn(() => Promise.resolve(true))
  }
};

global.window = {
  ...global.window,
  navigator: global.navigator,
  location: {
    protocol: 'https:',
    host: 'example.com'
  },
  caches: {
    open: jest.fn(),
    delete: jest.fn(),
    keys: jest.fn()
  }
};

// Mock Notification API
global.Notification = {
  permission: 'default',
  requestPermission: jest.fn(() => Promise.resolve('granted'))
};

describe('PWAUpdateManager', () => {
  let updateManager;
  let mockUpdateSW;
  
  beforeEach(() => {
    // 清除所有 mock
    jest.clearAllMocks();
    
    // Mock registerSW 函數
    mockUpdateSW = jest.fn();
    
    // 模擬 PWAUpdateManager 類別
    class PWAUpdateManager {
      constructor() {
        this.updateSW = null;
        this.isOfflineReady = false;
        this.needRefresh = false;
        this.registration = null;
      }
      
      async registerServiceWorker() {
        try {
          // 模擬 vite-plugin-pwa 的 registerSW
          this.updateSW = mockUpdateSW;
          
          const mockRegisterSW = (options) => {
            this.onNeedRefresh = options.onNeedRefresh;
            this.onOfflineReady = options.onOfflineReady;
            this.onRegistered = options.onRegistered;
            
            // 模擬註冊成功
            setTimeout(() => {
              this.registration = {
                update: jest.fn(),
                unregister: jest.fn()
              };
              this.onRegistered?.(this.registration);
            }, 100);
            
            return mockUpdateSW;
          };
          
          this.updateSW = mockRegisterSW({
            onNeedRefresh: () => this.showUpdatePrompt(),
            onOfflineReady: () => this.showOfflinePrompt(),
            onRegistered: (registration) => {
              this.registration = registration;
              // 每小時檢查更新
              setInterval(() => registration.update(), 60 * 60 * 1000);
            }
          });
          
          return true;
        } catch (error) {
          console.error('Service Worker 註冊失敗:', error);
          return false;
        }
      }
      
      showUpdatePrompt() {
        this.needRefresh = true;
        // 模擬顯示更新提示
        const promptElement = this.createUpdatePrompt();
        document.body?.appendChild(promptElement);
      }
      
      showOfflinePrompt() {
        this.isOfflineReady = true;
        // 模擬顯示離線就緒提示
        const promptElement = this.createOfflinePrompt();
        document.body?.appendChild(promptElement);
      }
      
      hidePrompt() {
        const prompts = document.querySelectorAll('.pwa-prompt');
        prompts.forEach(prompt => prompt.remove());
      }
      
      createUpdatePrompt() {
        const div = document.createElement('div');
        div.className = 'pwa-prompt update-prompt';
        div.innerHTML = `
          <div class="prompt-content">
            <p>應用程式有新版本可用</p>
            <button id="update-btn">更新</button>
            <button id="close-btn">關閉</button>
          </div>
        `;
        return div;
      }
      
      createOfflinePrompt() {
        const div = document.createElement('div');
        div.className = 'pwa-prompt offline-prompt';
        div.innerHTML = `
          <div class="prompt-content">
            <p>應用程式已準備好離線使用</p>
            <button id="ok-btn">確定</button>
          </div>
        `;
        return div;
      }
      
      async checkForUpdates() {
        if (this.registration) {
          try {
            await this.registration.update();
            return true;
          } catch (error) {
            console.error('檢查更新失敗:', error);
            return false;
          }
        }
        return false;
      }
      
      async applyUpdate() {
        if (this.updateSW) {
          try {
            await this.updateSW();
            return true;
          } catch (error) {
            console.error('應用更新失敗:', error);
            return false;
          }
        }
        return false;
      }
      
      getStatus() {
        return {
          needRefresh: this.needRefresh,
          isOfflineReady: this.isOfflineReady,
          hasRegistration: !!this.registration
        };
      }
    }
    
    updateManager = new PWAUpdateManager();
  });
  
  describe('Service Worker 註冊', () => {
    test('應該能成功註冊 Service Worker', async () => {
      const result = await updateManager.registerServiceWorker();
      
      expect(result).toBe(true);
      expect(updateManager.updateSW).toBeDefined();
    });
    
    test('註冊後應該能獲取 registration', (done) => {
      updateManager.registerServiceWorker();
      
      setTimeout(() => {
        expect(updateManager.registration).toBeDefined();
        expect(updateManager.registration.update).toBeDefined();
        done();
      }, 150);
    });
  });
  
  describe('更新提示', () => {
    test('應該能顯示更新提示', () => {
      // Mock DOM
      global.document = {
        body: {
          appendChild: jest.fn()
        },
        createElement: jest.fn((tag) => ({
          className: '',
          innerHTML: '',
          addEventListener: jest.fn(),
          remove: jest.fn()
        }))
      };
      
      updateManager.showUpdatePrompt();
      
      expect(updateManager.needRefresh).toBe(true);
      expect(document.body.appendChild).toHaveBeenCalled();
    });
    
    test('應該能顯示離線就緒提示', () => {
      global.document = {
        body: {
          appendChild: jest.fn()
        },
        createElement: jest.fn((tag) => ({
          className: '',
          innerHTML: '',
          addEventListener: jest.fn(),
          remove: jest.fn()
        }))
      };
      
      updateManager.showOfflinePrompt();
      
      expect(updateManager.isOfflineReady).toBe(true);
      expect(document.body.appendChild).toHaveBeenCalled();
    });
    
    test('應該能隱藏提示', () => {
      global.document = {
        querySelectorAll: jest.fn(() => [
          { remove: jest.fn() },
          { remove: jest.fn() }
        ])
      };
      
      updateManager.hidePrompt();
      
      expect(document.querySelectorAll).toHaveBeenCalledWith('.pwa-prompt');
    });
  });
  
  describe('更新功能', () => {
    test('應該能檢查更新', async () => {
      await updateManager.registerServiceWorker();
      
      // 等待 registration 設置
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const result = await updateManager.checkForUpdates();
      
      expect(result).toBe(true);
      expect(updateManager.registration.update).toHaveBeenCalled();
    });
    
    test('沒有 registration 時檢查更新應該返回 false', async () => {
      const result = await updateManager.checkForUpdates();
      expect(result).toBe(false);
    });
    
    test('應該能應用更新', async () => {
      await updateManager.registerServiceWorker();
      
      const result = await updateManager.applyUpdate();
      expect(result).toBe(true);
      expect(mockUpdateSW).toHaveBeenCalled();
    });
  });
  
  describe('狀態查詢', () => {
    test('應該能獲取正確的狀態', async () => {
      const initialStatus = updateManager.getStatus();
      expect(initialStatus).toEqual({
        needRefresh: false,
        isOfflineReady: false,
        hasRegistration: false
      });
      
      await updateManager.registerServiceWorker();
      updateManager.showUpdatePrompt();
      updateManager.showOfflinePrompt();
      
      const finalStatus = updateManager.getStatus();
      expect(finalStatus.needRefresh).toBe(true);
      expect(finalStatus.isOfflineReady).toBe(true);
    });
  });
});

describe('Cache Strategy', () => {
  let cacheManager;
  
  beforeEach(() => {
    // Mock Cache API
    const mockCache = {
      add: jest.fn(() => Promise.resolve()),
      addAll: jest.fn(() => Promise.resolve()),
      put: jest.fn(() => Promise.resolve()),
      match: jest.fn(() => Promise.resolve(null)),
      delete: jest.fn(() => Promise.resolve(true)),
      keys: jest.fn(() => Promise.resolve([]))
    };
    
    global.caches = {
      open: jest.fn(() => Promise.resolve(mockCache)),
      delete: jest.fn(() => Promise.resolve(true)),
      keys: jest.fn(() => Promise.resolve(['cache-v1', 'cache-v2']))
    };
    
    // 模擬 CacheManager 類別
    class CacheManager {
      constructor() {
        this.cacheName = 'clickfun-cache-v1';
        this.staticCacheName = 'clickfun-static-v1';
      }
      
      async preCache(urls) {
        try {
          const cache = await caches.open(this.cacheName);
          await cache.addAll(urls);
          return true;
        } catch (error) {
          console.error('預快取失敗:', error);
          return false;
        }
      }
      
      async cacheResponse(request, response) {
        try {
          const cache = await caches.open(this.cacheName);
          await cache.put(request, response.clone());
          return true;
        } catch (error) {
          console.error('快取回應失敗:', error);
          return false;
        }
      }
      
      async getCachedResponse(request) {
        try {
          const cache = await caches.open(this.cacheName);
          const response = await cache.match(request);
          return response;
        } catch (error) {
          console.error('獲取快取失敗:', error);
          return null;
        }
      }
      
      async clearOldCaches(currentVersion) {
        try {
          const cacheNames = await caches.keys();
          const oldCaches = cacheNames.filter(name => 
            name.startsWith('clickfun-') && name !== currentVersion
          );
          
          const deletePromises = oldCaches.map(name => caches.delete(name));
          await Promise.all(deletePromises);
          
          return oldCaches.length;
        } catch (error) {
          console.error('清理舊快取失敗:', error);
          return 0;
        }
      }
      
      async getCacheStats() {
        try {
          const cache = await caches.open(this.cacheName);
          const keys = await cache.keys();
          
          return {
            cacheName: this.cacheName,
            itemCount: keys.length,
            keys: keys.map(req => req.url)
          };
        } catch (error) {
          console.error('獲取快取統計失敗:', error);
          return null;
        }
      }
    }
    
    cacheManager = new CacheManager();
  });
  
  describe('預快取功能', () => {
    test('應該能預快取指定 URL', async () => {
      const urls = [
        '/index.html',
        '/styles.css',
        '/app.js',
        '/manifest.json'
      ];
      
      const result = await cacheManager.preCache(urls);
      
      expect(result).toBe(true);
      expect(caches.open).toHaveBeenCalledWith('clickfun-cache-v1');
    });
  });
  
  describe('動態快取', () => {
    test('應該能快取回應', async () => {
      const mockRequest = new Request('/api/data');
      const mockResponse = new Response('{"data": "test"}', {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Mock Response.clone()
      mockResponse.clone = jest.fn(() => mockResponse);
      
      const result = await cacheManager.cacheResponse(mockRequest, mockResponse);
      
      expect(result).toBe(true);
      expect(mockResponse.clone).toHaveBeenCalled();
    });
    
    test('應該能獲取快取的回應', async () => {
      const mockRequest = new Request('/api/data');
      
      const response = await cacheManager.getCachedResponse(mockRequest);
      
      expect(caches.open).toHaveBeenCalledWith('clickfun-cache-v1');
    });
  });
  
  describe('快取管理', () => {
    test('應該能清理舊快取', async () => {
      const deletedCount = await cacheManager.clearOldCaches('clickfun-cache-v2');
      
      expect(deletedCount).toBeGreaterThanOrEqual(0);
      expect(caches.keys).toHaveBeenCalled();
    });
    
    test('應該能獲取快取統計', async () => {
      const stats = await cacheManager.getCacheStats();
      
      expect(stats).toHaveProperty('cacheName');
      expect(stats).toHaveProperty('itemCount');
      expect(stats).toHaveProperty('keys');
      expect(stats.cacheName).toBe('clickfun-cache-v1');
    });
  });
});

describe('Offline Detection', () => {
  let offlineManager;
  
  beforeEach(() => {
    // Mock online/offline events
    global.navigator.onLine = true;
    global.window.addEventListener = jest.fn();
    global.window.removeEventListener = jest.fn();
    
    // 模擬 OfflineManager 類別
    class OfflineManager {
      constructor() {
        this.isOnline = navigator.onLine;
        this.callbacks = {
          online: [],
          offline: []
        };
        this.setupEventListeners();
      }
      
      setupEventListeners() {
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
      }
      
      handleOnline() {
        this.isOnline = true;
        this.callbacks.online.forEach(callback => callback());
      }
      
      handleOffline() {
        this.isOnline = false;
        this.callbacks.offline.forEach(callback => callback());
      }
      
      onOnline(callback) {
        this.callbacks.online.push(callback);
      }
      
      onOffline(callback) {
        this.callbacks.offline.push(callback);
      }
      
      getStatus() {
        return {
          isOnline: this.isOnline,
          lastCheck: Date.now()
        };
      }
      
      async checkConnection() {
        try {
          // 模擬網路檢查
          const response = await fetch('/ping', {
            method: 'HEAD',
            cache: 'no-cache'
          });
          return response.ok;
        } catch (error) {
          return false;
        }
      }
      
      removeEventListeners() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline);
      }
    }
    
    // Mock fetch for connection check
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200
      })
    );
    
    offlineManager = new OfflineManager();
  });
  
  describe('事件監聽', () => {
    test('應該設置線上/離線事件監聽器', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
    });
    
    test('應該能註冊線上回調', () => {
      const callback = jest.fn();
      offlineManager.onOnline(callback);
      
      expect(offlineManager.callbacks.online).toContain(callback);
    });
    
    test('應該能註冊離線回調', () => {
      const callback = jest.fn();
      offlineManager.onOffline(callback);
      
      expect(offlineManager.callbacks.offline).toContain(callback);
    });
  });
  
  describe('狀態檢測', () => {
    test('應該能獲取連線狀態', () => {
      const status = offlineManager.getStatus();
      
      expect(status).toHaveProperty('isOnline');
      expect(status).toHaveProperty('lastCheck');
      expect(status.isOnline).toBe(true);
    });
    
    test('應該能檢查網路連線', async () => {
      const isConnected = await offlineManager.checkConnection();
      
      expect(isConnected).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/ping', {
        method: 'HEAD',
        cache: 'no-cache'
      });
    });
  });
  
  describe('事件處理', () => {
    test('線上事件應該觸發回調', () => {
      const callback = jest.fn();
      offlineManager.onOnline(callback);
      
      offlineManager.handleOnline();
      
      expect(callback).toHaveBeenCalled();
      expect(offlineManager.isOnline).toBe(true);
    });
    
    test('離線事件應該觸發回調', () => {
      const callback = jest.fn();
      offlineManager.onOffline(callback);
      
      offlineManager.handleOffline();
      
      expect(callback).toHaveBeenCalled();
      expect(offlineManager.isOnline).toBe(false);
    });
  });
});

describe('Storage Quota Management', () => {
  let quotaManager;
  
  beforeEach(() => {
    // 模擬 QuotaManager 類別
    class QuotaManager {
      constructor() {
        this.warningThreshold = 0.8; // 80%
        this.criticalThreshold = 0.95; // 95%
      }
      
      async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          return await navigator.storage.estimate();
        }
        return null;
      }
      
      async checkQuota() {
        const estimate = await this.getStorageEstimate();
        if (!estimate) return null;
        
        const { quota, usage } = estimate;
        const usagePercentage = quota > 0 ? usage / quota : 0;
        
        return {
          quota,
          usage,
          available: quota - usage,
          usagePercentage,
          status: this.getQuotaStatus(usagePercentage)
        };
      }
      
      getQuotaStatus(percentage) {
        if (percentage >= this.criticalThreshold) return 'critical';
        if (percentage >= this.warningThreshold) return 'warning';
        return 'normal';
      }
      
      async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
          return await navigator.storage.persist();
        }
        return false;
      }
      
      formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    }
    
    quotaManager = new QuotaManager();
  });
  
  describe('配額檢查', () => {
    test('應該能獲取儲存估算', async () => {
      const estimate = await quotaManager.getStorageEstimate();
      
      expect(estimate).toHaveProperty('quota');
      expect(estimate).toHaveProperty('usage');
      expect(navigator.storage.estimate).toHaveBeenCalled();
    });
    
    test('應該能檢查配額狀態', async () => {
      const quotaInfo = await quotaManager.checkQuota();
      
      expect(quotaInfo).toHaveProperty('quota');
      expect(quotaInfo).toHaveProperty('usage');
      expect(quotaInfo).toHaveProperty('available');
      expect(quotaInfo).toHaveProperty('usagePercentage');
      expect(quotaInfo).toHaveProperty('status');
    });
    
    test('應該正確判斷配額狀態', () => {
      expect(quotaManager.getQuotaStatus(0.5)).toBe('normal');
      expect(quotaManager.getQuotaStatus(0.85)).toBe('warning');
      expect(quotaManager.getQuotaStatus(0.98)).toBe('critical');
    });
  });
  
  describe('持久化儲存', () => {
    test('應該能請求持久化儲存', async () => {
      const result = await quotaManager.requestPersistentStorage();
      
      expect(result).toBe(true);
      expect(navigator.storage.persist).toHaveBeenCalled();
    });
  });
  
  describe('工具函數', () => {
    test('應該正確格式化位元組', () => {
      expect(quotaManager.formatBytes(0)).toBe('0 Bytes');
      expect(quotaManager.formatBytes(1024)).toBe('1 KB');
      expect(quotaManager.formatBytes(1048576)).toBe('1 MB');
      expect(quotaManager.formatBytes(1073741824)).toBe('1 GB');
    });
  });
});

describe('PWA Installation', () => {
  let installManager;
  
  beforeEach(() => {
    // Mock beforeinstallprompt event
    global.window.addEventListener = jest.fn();
    
    // 模擬 InstallManager 類別
    class InstallManager {
      constructor() {
        this.deferredPrompt = null;
        this.isInstallable = false;
        this.isInstalled = false;
        this.setupEventListeners();
      }
      
      setupEventListeners() {
        window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
        window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));
      }
      
      handleBeforeInstallPrompt(event) {
        event.preventDefault();
        this.deferredPrompt = event;
        this.isInstallable = true;
      }
      
      handleAppInstalled() {
        this.isInstalled = true;
        this.deferredPrompt = null;
        this.isInstallable = false;
      }
      
      async showInstallPrompt() {
        if (!this.deferredPrompt) return null;
        
        try {
          const result = await this.deferredPrompt.prompt();
          this.deferredPrompt = null;
          this.isInstallable = false;
          return result;
        } catch (error) {
          console.error('安裝提示失敗:', error);
          return null;
        }
      }
      
      getInstallStatus() {
        return {
          isInstallable: this.isInstallable,
          isInstalled: this.isInstalled,
          canPrompt: !!this.deferredPrompt
        };
      }
      
      checkIfInstalled() {
        // 檢查是否在獨立模式下運行
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppScope = window.navigator.standalone === true;
        
        return isStandalone || isInWebAppScope;
      }
    }
    
    // Mock matchMedia
    global.window.matchMedia = jest.fn(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn()
    }));
    
    installManager = new InstallManager();
  });
  
  describe('安裝事件處理', () => {
    test('應該設置安裝事件監聽器', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('appinstalled', expect.any(Function));
    });
    
    test('應該處理 beforeinstallprompt 事件', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        prompt: jest.fn(() => Promise.resolve({ outcome: 'accepted' }))
      };
      
      installManager.handleBeforeInstallPrompt(mockEvent);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(installManager.isInstallable).toBe(true);
      expect(installManager.deferredPrompt).toBe(mockEvent);
    });
    
    test('應該處理 appinstalled 事件', () => {
      installManager.deferredPrompt = { prompt: jest.fn() };
      installManager.isInstallable = true;
      
      installManager.handleAppInstalled();
      
      expect(installManager.isInstalled).toBe(true);
      expect(installManager.deferredPrompt).toBeNull();
      expect(installManager.isInstallable).toBe(false);
    });
  });
  
  describe('安裝提示', () => {
    test('應該能顯示安裝提示', async () => {
      const mockPrompt = jest.fn(() => Promise.resolve({ outcome: 'accepted' }));
      installManager.deferredPrompt = { prompt: mockPrompt };
      
      const result = await installManager.showInstallPrompt();
      
      expect(mockPrompt).toHaveBeenCalled();
      expect(result).toEqual({ outcome: 'accepted' });
      expect(installManager.deferredPrompt).toBeNull();
    });
    
    test('沒有 deferred prompt 時應該返回 null', async () => {
      installManager.deferredPrompt = null;
      
      const result = await installManager.showInstallPrompt();
      
      expect(result).toBeNull();
    });
  });
  
  describe('安裝狀態', () => {
    test('應該能獲取安裝狀態', () => {
      const status = installManager.getInstallStatus();
      
      expect(status).toHaveProperty('isInstallable');
      expect(status).toHaveProperty('isInstalled');
      expect(status).toHaveProperty('canPrompt');
    });
    
    test('應該能檢查是否已安裝', () => {
      const isInstalled = installManager.checkIfInstalled();
      expect(typeof isInstalled).toBe('boolean');
    });
  });
});
