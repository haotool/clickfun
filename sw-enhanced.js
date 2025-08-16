/**
 * ClickFun Enhanced Service Worker
 * 基於最佳實踐的 PWA Service Worker 實作
 */

const SW_VERSION = `clickfun-v${APP_VERSION}`;
const APP_VERSION = '7.1.2';

// 快取策略配置
const CACHE_CONFIG = {
  // 應用程式核心檔案 - 預快取
  APP_SHELL: ['./', './index.html', './fx.worker.js', './icons/pwa.svg'],

  // 靜態資源 - 快取優先
  STATIC_RESOURCES: ['./app.webmanifest'],

  // 動態內容 - 網路優先
  DYNAMIC_CONTENT: ['/api/', '/data/'],
};

// 快取名稱
const CACHE_NAMES = {
  APP_SHELL: `${SW_VERSION}-app-shell`,
  STATIC: `${SW_VERSION}-static`,
  DYNAMIC: `${SW_VERSION}-dynamic`,
  IMAGES: `${SW_VERSION}-images`,
};

// 所有快取名稱列表
const ALL_CACHE_NAMES = Object.values(CACHE_NAMES);

/**
 * Service Worker 安裝事件
 */
self.addEventListener('install', event => {
  console.log(`🔧 Service Worker ${SW_VERSION} 安裝中...`);

  event.waitUntil(
    (async () => {
      try {
        // 預快取應用程式核心檔案
        const appShellCache = await caches.open(CACHE_NAMES.APP_SHELL);
        await appShellCache.addAll(CACHE_CONFIG.APP_SHELL);

        // 預快取靜態資源
        const staticCache = await caches.open(CACHE_NAMES.STATIC);
        await staticCache.addAll(CACHE_CONFIG.STATIC_RESOURCES);

        console.log('✅ 預快取完成');

        // 跳過等待，立即激活新的 Service Worker
        await self.skipWaiting();
      } catch (error) {
        console.error('❌ Service Worker 安裝失敗:', error);
        throw error;
      }
    })()
  );
});

/**
 * Service Worker 激活事件
 */
self.addEventListener('activate', event => {
  console.log(`🚀 Service Worker ${SW_VERSION} 激活中...`);

  event.waitUntil(
    (async () => {
      try {
        // 清理舊版本快取
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(cacheName => {
            // 保留當前版本快取，刪除其他版本
            if (cacheName.startsWith('clickfun-v') && cacheName !== SW_VERSION) {
              console.log(`🗑️ 刪除舊版本快取: ${cacheName}`);
              return true;
            }
            // 保留其他非版本相關快取
            return !ALL_CACHE_NAMES.includes(cacheName);
          })
          .map(cacheName => caches.delete(cacheName));

        await Promise.all(deletePromises);

        // 立即控制所有客戶端
        await self.clients.claim();

        console.log('✅ Service Worker 激活完成');

        // 通知所有客戶端 SW 已更新
        await notifyClients({
          type: 'SW_UPDATED',
          version: SW_VERSION,
          appVersion: APP_VERSION,
        });
      } catch (error) {
        console.error('❌ Service Worker 激活失敗:', error);
      }
    })()
  );
});

/**
 * 網路請求攔截
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理同源請求
  if (url.origin !== self.location.origin) {
    return;
  }

  // 根據請求類型選擇快取策略
  if (isAppShellRequest(request)) {
    event.respondWith(handleAppShellRequest(request));
  } else if (isStaticResourceRequest(request)) {
    event.respondWith(handleStaticResourceRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

/**
 * 訊息處理
 */
self.addEventListener('message', event => {
  const { data } = event;

  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: SW_VERSION,
        appVersion: APP_VERSION,
      });
      break;

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'CHECK_UPDATE':
      checkForUpdates().then(hasUpdate => {
        event.ports[0].postMessage({ hasUpdate });
      });
      break;

    case 'VERSION_CHECK':
      const currentVersion = event.data.version;
      const storedVersion = event.data.storedVersion;

      if (currentVersion !== storedVersion) {
        // 發送版本更新通知
        event.ports[0].postMessage({
          type: 'VERSION_UPDATE',
          oldVersion: storedVersion,
          newVersion: currentVersion,
        });
      }
      break;
  }
});

/**
 * 推送通知處理
 */
self.addEventListener('push', event => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: './icons/pwa.svg',
    badge: './icons/pwa.svg',
    tag: 'clickfun-notification',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: '開啟遊戲',
      },
      {
        action: 'close',
        title: '關閉',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

/**
 * 通知點擊處理
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(self.clients.openWindow('./'));
  }
});

// === 快取策略實作 ===

/**
 * 應用程式核心檔案請求處理 - 快取優先
 */
async function handleAppShellRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAMES.APP_SHELL);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // 背景更新
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }

    // 快取未命中，從網路獲取
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ App Shell 請求處理失敗:', error);

    // 回退到快取的 index.html
    const cache = await caches.open(CACHE_NAMES.APP_SHELL);
    return await cache.match('./index.html');
  }
}

/**
 * 靜態資源請求處理 - 快取優先，長期快取
 */
async function handleStaticResourceRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ 靜態資源請求處理失敗:', error);
    throw error;
  }
}

/**
 * 圖片請求處理 - 快取優先，壓縮儲存
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAMES.IMAGES);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ 圖片請求處理失敗:', error);

    // 回退到預設圖片
    return new Response('', {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  }
}

/**
 * 動態內容請求處理 - 網路優先
 */
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ 動態請求處理失敗:', error);

    // 回退到快取
    const cache = await caches.open(CACHE_NAMES.DYNAMIC);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // 最終回退
    return new Response('離線中', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// === 工具函數 ===

/**
 * 判斷是否為應用程式核心檔案請求
 */
function isAppShellRequest(request) {
  const url = new URL(request.url);
  return CACHE_CONFIG.APP_SHELL.some(
    path => url.pathname === path || url.pathname === path.replace('./', '/')
  );
}

/**
 * 判斷是否為靜態資源請求
 */
function isStaticResourceRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|json|webmanifest)$/);
}

/**
 * 判斷是否為圖片請求
 */
function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/);
}

/**
 * 背景更新快取
 */
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.warn('⚠️ 背景更新失敗:', error);
  }
}

/**
 * 通知所有客戶端
 */
async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage(message);
  });
}

/**
 * 清理所有快取
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  console.log('🧹 所有快取已清理');
}

/**
 * 檢查更新
 */
async function checkForUpdates() {
  try {
    const response = await fetch('./sw-enhanced.js', { cache: 'no-cache' });
    const newSWContent = await response.text();
    const currentSWContent = await (await fetch(self.location.href)).text();

    return newSWContent !== currentSWContent;
  } catch (error) {
    console.error('❌ 檢查更新失敗:', error);
    return false;
  }
}

console.log(`🎮 ClickFun Enhanced Service Worker ${SW_VERSION} 已載入`);
