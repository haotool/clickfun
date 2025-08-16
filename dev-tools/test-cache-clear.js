/**
 * 測試自動清除快取功能
 */

class CacheClearTester {
  constructor() {
    this.testResults = [];
  }

  async runTests() {
    console.log('🧪 開始測試自動清除快取功能...');

    try {
      await this.testCacheCreation();
      await this.testVersionUpdate();
      await this.testCacheClear();

      this.displayResults();
    } catch (error) {
      console.error('❌ 測試失敗:', error);
    }
  }

  async testCacheCreation() {
    console.log('📦 測試 1: 創建測試快取...');

    // 創建一些測試快取
    const testCaches = [
      'clickfun-v7.0.0',
      'clickfun-v7.0.0',
      'clickfun-v6.1.0',
      'old-cache-test'
    ];

    for (const cacheName of testCaches) {
      const cache = await caches.open(cacheName);
      await cache.put('/test', new Response('test data'));
    }

    const cacheNames = await caches.keys();
    const createdCaches = testCaches.filter(name => cacheNames.includes(name));

    this.testResults.push({
      test: '創建測試快取',
      passed: createdCaches.length === testCaches.length,
      details: `創建了 ${createdCaches.length}/${testCaches.length} 個快取`
    });
  }

  async testVersionUpdate() {
    console.log('🔄 測試 2: 模擬版本更新...');

    // 模擬舊版本
    localStorage.setItem('app_version', '7.0.0');

    // 檢查版本差異
    const storedVersion = localStorage.getItem('app_version');
    const currentVersion = '7.0.0';
    const needsUpdate = storedVersion !== currentVersion;

    this.testResults.push({
      test: '版本更新檢測',
      passed: needsUpdate,
      details: `舊版本: ${storedVersion}, 新版本: ${currentVersion}`
    });
  }

  async testCacheClear() {
    console.log('🗑️ 測試 3: 清除舊快取...');

    const beforeCaches = await caches.keys();
    console.log('清除前的快取:', beforeCaches);

    // 執行快取清除邏輯
    const currentCacheName = 'clickfun-v7.0.0';
    const cachesToDelete = beforeCaches.filter(
      name => name !== currentCacheName
    );

    await Promise.all(
      cachesToDelete.map(async cacheName => {
        console.log(`清除快取: ${cacheName}`);
        return caches.delete(cacheName);
      })
    );

    const afterCaches = await caches.keys();
    console.log('清除後的快取:', afterCaches);

    const clearedCount = beforeCaches.length - afterCaches.length;

    this.testResults.push({
      test: '快取清除',
      passed: clearedCount > 0,
      details: `清除了 ${clearedCount} 個舊快取，剩餘 ${afterCaches.length} 個`
    });
  }

  displayResults() {
    console.log('\n📊 測試結果:');
    console.log('='.repeat(50));

    let passedTests = 0;
    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅ 通過' : '❌ 失敗';
      console.log(`${index + 1}. ${result.test}: ${status}`);
      console.log(`   詳情: ${result.details}`);

      if (result.passed) {passedTests++;}
    });

    console.log('='.repeat(50));
    console.log(`總結: ${passedTests}/${this.testResults.length} 個測試通過`);

    if (passedTests === this.testResults.length) {
      console.log('🎉 所有測試通過！自動清除快取功能正常運作。');
    } else {
      console.log('⚠️ 部分測試失敗，請檢查快取清除邏輯。');
    }
  }
}

// 如果在瀏覽器環境中運行
if (typeof window !== 'undefined') {
  window.testCacheClear = async () => {
    const tester = new CacheClearTester();
    await tester.runTests();
  };

  console.log('💡 在瀏覽器控制台中執行 testCacheClear() 來測試快取清除功能');
}

// 如果在 Node.js 環境中運行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CacheClearTester;
}
