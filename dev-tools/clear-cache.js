/**
 * PWA 快取清理工具
 * 用於開發時清理 Service Worker 快取
 */

const fs = require('fs');
const path = require('path');

class CacheCleaner {
  constructor() {
    this.cacheNames = ['clickfun-v7.2.3', 'workbox-precache', 'workbox-runtime'];
  }

  async clearBrowserCache() {
    console.log('🧹 開始清理瀏覽器快取...');

    // 生成清理腳本
    const cleanupScript = `
      // PWA 快取清理腳本
      (async function() {
        console.log('🧹 正在清理 PWA 快取...');
        
        // 清理 Service Worker 快取
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            console.log('🗑️ 註銷 Service Worker:', registration.scope);
            await registration.unregister();
          }
        }
        
        // 清理 Cache Storage
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (let cacheName of cacheNames) {
            console.log('🗑️ 刪除快取:', cacheName);
            await caches.delete(cacheName);
          }
        }
        
        // 清理 Local Storage
        localStorage.clear();
        sessionStorage.clear();
        
        // 清理 IndexedDB (如果有使用)
        if ('indexedDB' in window) {
          // 這裡可以添加 IndexedDB 清理邏輯
        }
        
        console.log('✅ PWA 快取清理完成！');
        alert('✅ PWA 快取已清理完成，請重新載入頁面。');
      })();
    `;

    // 寫入清理腳本檔案
    const scriptPath = path.join(__dirname, 'cache-cleanup.js');
    fs.writeFileSync(scriptPath, cleanupScript);

    console.log(`📝 快取清理腳本已生成: ${scriptPath}`);
    console.log('💡 使用方法:');
    console.log('   1. 在瀏覽器開發者工具的 Console 中執行此腳本');
    console.log('   2. 或在頁面中引入此腳本檔案');

    return scriptPath;
  }

  generateCleanupHTML() {
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Click Fun 快取清理工具</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        button {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            transition: background 0.2s;
        }
        button:hover {
            background: #218838;
        }
        .danger {
            background: #dc3545;
        }
        .danger:hover {
            background: #c82333;
        }
        .log {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-family: monospace;
            font-size: 14px;
            max-height: 300px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧹 Click Fun 快取清理工具</h1>
        <p>此工具可以幫助您清理 PWA 相關的快取，解決開發時的快取問題。</p>
        
        <div>
            <button onclick="clearServiceWorker()">清理 Service Worker</button>
            <button onclick="clearCacheStorage()">清理 Cache Storage</button>
            <button onclick="clearLocalStorage()">清理 Local Storage</button>
            <button onclick="clearAllCache()" class="danger">清理所有快取</button>
        </div>
        
        <div id="log" class="log">
            <div>📋 操作日誌:</div>
        </div>
    </div>

    <script>
        function log(message) {
            const logEl = document.getElementById('log');
            const time = new Date().toLocaleTimeString();
            logEl.innerHTML += \`<div>[\${time}] \${message}</div>\`;
            logEl.scrollTop = logEl.scrollHeight;
        }

        async function clearServiceWorker() {
            log('🔄 開始清理 Service Worker...');
            
            if ('serviceWorker' in navigator) {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                        log(\`🗑️ 註銷 SW: \${registration.scope}\`);
                        await registration.unregister();
                    }
                    log('✅ Service Worker 清理完成');
                } catch (error) {
                    log(\`❌ Service Worker 清理失敗: \${error.message}\`);
                }
            } else {
                log('⚠️ 瀏覽器不支援 Service Worker');
            }
        }

        async function clearCacheStorage() {
            log('🔄 開始清理 Cache Storage...');
            
            if ('caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    for (let cacheName of cacheNames) {
                        log(\`🗑️ 刪除快取: \${cacheName}\`);
                        await caches.delete(cacheName);
                    }
                    log('✅ Cache Storage 清理完成');
                } catch (error) {
                    log(\`❌ Cache Storage 清理失敗: \${error.message}\`);
                }
            } else {
                log('⚠️ 瀏覽器不支援 Cache Storage');
            }
        }

        function clearLocalStorage() {
            log('🔄 開始清理 Local Storage...');
            
            try {
                const localStorageSize = Object.keys(localStorage).length;
                const sessionStorageSize = Object.keys(sessionStorage).length;
                
                localStorage.clear();
                sessionStorage.clear();
                
                log(\`✅ 已清理 \${localStorageSize} 個 localStorage 項目\`);
                log(\`✅ 已清理 \${sessionStorageSize} 個 sessionStorage 項目\`);
            } catch (error) {
                log(\`❌ Local Storage 清理失敗: \${error.message}\`);
            }
        }

        async function clearAllCache() {
            log('🚨 開始清理所有快取...');
            
            await clearServiceWorker();
            await clearCacheStorage();
            clearLocalStorage();
            
            log('🎉 所有快取清理完成！');
            log('💡 建議重新載入頁面以確保變更生效');
            
            if (confirm('快取清理完成！是否要重新載入頁面？')) {
                window.location.reload();
            }
        }

        // 頁面載入時顯示當前快取狀態
        window.addEventListener('load', async () => {
            log('📊 檢查當前快取狀態...');
            
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                log(\`📱 Service Worker 註冊數量: \${registrations.length}\`);
            }
            
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                log(\`💾 Cache Storage 數量: \${cacheNames.length}\`);
                cacheNames.forEach(name => log(\`   - \${name}\`));
            }
            
            const localStorageSize = Object.keys(localStorage).length;
            const sessionStorageSize = Object.keys(sessionStorage).length;
            log(\`🗂️ Local Storage 項目: \${localStorageSize}\`);
            log(\`🗂️ Session Storage 項目: \${sessionStorageSize}\`);
        });
    </script>
</body>
</html>
    `;

    const htmlPath = path.join(__dirname, 'cache-cleanup.html');
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`🌐 快取清理頁面已生成: ${htmlPath}`);
    console.log('💡 在瀏覽器中開啟此頁面即可使用圖形化清理工具');

    return htmlPath;
  }

  async run() {
    console.log('🚀 Click Fun PWA 快取清理工具');
    console.log('================================');

    try {
      await this.clearBrowserCache();
      this.generateCleanupHTML();

      console.log('');
      console.log('✅ 快取清理工具準備完成！');
      console.log('📁 生成的檔案:');
      console.log('   - cache-cleanup.js (腳本檔案)');
      console.log('   - cache-cleanup.html (圖形化工具)');
    } catch (error) {
      console.error('❌ 快取清理工具執行失敗:', error);
    }
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  const cleaner = new CacheCleaner();
  cleaner.run();
}

module.exports = CacheCleaner;
