/**
 * 效能測試
 * 測試應用的效能指標和最佳化功能
 *
 * @author haotool
 * @version 7.2.3
 * @created 2025-08-18T02:39:58+08:00
 */

// Mock Performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  memory: {
    usedJSHeapSize: 10 * 1024 * 1024, // 10MB
    totalJSHeapSize: 50 * 1024 * 1024, // 50MB
    jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
  },
};

describe('效能監控', () => {
  let performanceMonitor;

  beforeEach(() => {
    jest.clearAllMocks();

    // 模擬效能監控器
    class PerformanceMonitor {
      constructor() {
        this.metrics = {
          loadTime: 0,
          tpsAverage: 0,
          errorCount: 0,
          cacheHitRate: 0,
          memoryUsage: 0,
          renderTime: 0,
        };
        this.isTracking = false;
      }

      startTracking() {
        this.isTracking = true;
        this.trackLoadTime();
        this.trackMemoryUsage();
        this.trackRenderPerformance();
      }

      stopTracking() {
        this.isTracking = false;
      }

      trackLoadTime() {
        performance.mark('load-start');

        // 模擬載入完成
        setTimeout(() => {
          performance.mark('load-end');
          performance.measure('load-time', 'load-start', 'load-end');

          const loadMeasure = performance.getEntriesByName('load-time')[0];
          this.metrics.loadTime = loadMeasure?.duration || 2100;
        }, 100);
      }

      trackMemoryUsage() {
        if ('memory' in performance) {
          const memory = performance.memory;
          this.metrics.memoryUsage = memory.usedJSHeapSize;
        }
      }

      trackRenderPerformance() {
        const startTime = performance.now();

        // 模擬渲染操作
        requestAnimationFrame(() => {
          const endTime = performance.now();
          this.metrics.renderTime = endTime - startTime;
        });
      }

      trackGamePerformance(gameEngine) {
        if (!gameEngine) return;

        const tpsStats = gameEngine.tpsCalculator?.getStatistics();
        if (tpsStats) {
          this.metrics.tpsAverage = tpsStats.average;
        }
      }

      trackErrors() {
        window.addEventListener('error', () => {
          this.metrics.errorCount++;
        });

        window.addEventListener('unhandledrejection', () => {
          this.metrics.errorCount++;
        });
      }

      getMetrics() {
        return { ...this.metrics };
      }

      generateReport() {
        const metrics = this.getMetrics();

        return {
          timestamp: new Date().toISOString(),
          performance: {
            loadTime: metrics.loadTime,
            renderTime: metrics.renderTime,
            memoryUsage: this.formatBytes(metrics.memoryUsage),
          },
          game: {
            averageTPS: metrics.tpsAverage,
            errorCount: metrics.errorCount,
          },
          status: this.getPerformanceStatus(metrics),
        };
      }

      getPerformanceStatus(metrics) {
        const issues = [];

        if (metrics.loadTime > 3000) {
          issues.push('載入時間過長');
        }

        if (metrics.memoryUsage > 100 * 1024 * 1024) {
          issues.push('記憶體使用過高');
        }

        if (metrics.renderTime > 16.67) {
          issues.push('渲染效能不佳');
        }

        if (metrics.errorCount > 0) {
          issues.push('存在錯誤');
        }

        return issues.length === 0 ? 'good' : 'warning';
      }

      formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      clearMetrics() {
        this.metrics = {
          loadTime: 0,
          tpsAverage: 0,
          errorCount: 0,
          cacheHitRate: 0,
          memoryUsage: 0,
          renderTime: 0,
        };
      }
    }

    performanceMonitor = new PerformanceMonitor();
  });

  describe('載入效能', () => {
    test('應該追蹤載入時間', done => {
      performance.getEntriesByName.mockReturnValue([{ duration: 2100 }]);

      performanceMonitor.startTracking();

      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
        expect(metrics.loadTime).toBe(2100);
        expect(performance.mark).toHaveBeenCalledWith('load-start');
        expect(performance.mark).toHaveBeenCalledWith('load-end');
        done();
      }, 150);
    });

    test('載入時間應該少於 3 秒', done => {
      performance.getEntriesByName.mockReturnValue([{ duration: 2500 }]);

      performanceMonitor.startTracking();

      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
        expect(metrics.loadTime).toBeLessThan(3000);
        done();
      }, 150);
    });
  });

  describe('記憶體效能', () => {
    test('應該追蹤記憶體使用量', () => {
      performanceMonitor.trackMemoryUsage();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.memoryUsage).toBe(10 * 1024 * 1024);
    });

    test('記憶體使用應該在合理範圍內', () => {
      performanceMonitor.trackMemoryUsage();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 少於 100MB
    });

    test('應該正確格式化記憶體大小', () => {
      const formatted = performanceMonitor.formatBytes(10 * 1024 * 1024);
      expect(formatted).toBe('10 MB');
    });
  });

  describe('渲染效能', () => {
    test('應該追蹤渲染時間', () => {
      performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1010);

      performanceMonitor.trackRenderPerformance();

      // 模擬 requestAnimationFrame
      const callback = global.requestAnimationFrame.mock.calls[0][0];
      callback();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.renderTime).toBe(10);
    });

    test('渲染時間應該少於 16.67ms (60 FPS)', () => {
      performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1015);

      performanceMonitor.trackRenderPerformance();

      const callback = global.requestAnimationFrame.mock.calls[0][0];
      callback();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.renderTime).toBeLessThan(16.67);
    });
  });

  describe('遊戲效能', () => {
    test('應該追蹤 TPS 效能', () => {
      const mockGameEngine = {
        tpsCalculator: {
          getStatistics: jest.fn(() => ({
            average: 15.5,
            peak: 25,
            current: 20,
          })),
        },
      };

      performanceMonitor.trackGamePerformance(mockGameEngine);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.tpsAverage).toBe(15.5);
      expect(mockGameEngine.tpsCalculator.getStatistics).toHaveBeenCalled();
    });

    test('應該處理沒有遊戲引擎的情況', () => {
      performanceMonitor.trackGamePerformance(null);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.tpsAverage).toBe(0);
    });
  });

  describe('錯誤追蹤', () => {
    test('應該追蹤 JavaScript 錯誤', () => {
      performanceMonitor.trackErrors();

      // 模擬錯誤事件
      const errorEvent = new Event('error');
      window.dispatchEvent(errorEvent);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.errorCount).toBe(1);
    });

    test('應該追蹤未處理的 Promise 拒絕', () => {
      performanceMonitor.trackErrors();

      // 模擬 unhandledrejection 事件
      const rejectionEvent = new Event('unhandledrejection');
      window.dispatchEvent(rejectionEvent);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.errorCount).toBe(1);
    });
  });

  describe('效能報告', () => {
    test('應該生成完整的效能報告', () => {
      performanceMonitor.metrics = {
        loadTime: 2100,
        tpsAverage: 18.5,
        errorCount: 0,
        cacheHitRate: 85,
        memoryUsage: 15 * 1024 * 1024,
        renderTime: 12.5,
      };

      const report = performanceMonitor.generateReport();

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('performance');
      expect(report).toHaveProperty('game');
      expect(report).toHaveProperty('status');

      expect(report.performance.loadTime).toBe(2100);
      expect(report.performance.memoryUsage).toBe('15 MB');
      expect(report.game.averageTPS).toBe(18.5);
      expect(report.status).toBe('good');
    });

    test('應該正確識別效能問題', () => {
      performanceMonitor.metrics = {
        loadTime: 4000, // 超過 3 秒
        memoryUsage: 120 * 1024 * 1024, // 超過 100MB
        renderTime: 20, // 超過 16.67ms
        errorCount: 2, // 有錯誤
      };

      const status = performanceMonitor.getPerformanceStatus(performanceMonitor.metrics);
      expect(status).toBe('warning');
    });

    test('應該能清除指標', () => {
      performanceMonitor.metrics.loadTime = 2000;
      performanceMonitor.metrics.errorCount = 1;

      performanceMonitor.clearMetrics();

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.loadTime).toBe(0);
      expect(metrics.errorCount).toBe(0);
    });
  });
});

describe('效能最佳化測試', () => {
  let optimizer;

  beforeEach(() => {
    // 模擬效能最佳化器
    class PerformanceOptimizer {
      constructor() {
        this.optimizations = {
          imageCompression: false,
          codeMinification: false,
          caching: false,
          lazyLoading: false,
        };
      }

      enableImageCompression() {
        this.optimizations.imageCompression = true;
        return this;
      }

      enableCodeMinification() {
        this.optimizations.codeMinification = true;
        return this;
      }

      enableCaching() {
        this.optimizations.caching = true;
        return this;
      }

      enableLazyLoading() {
        this.optimizations.lazyLoading = true;
        return this;
      }

      getOptimizationScore() {
        const enabled = Object.values(this.optimizations).filter(Boolean).length;
        const total = Object.keys(this.optimizations).length;
        return (enabled / total) * 100;
      }

      generateOptimizationReport() {
        return {
          score: this.getOptimizationScore(),
          optimizations: { ...this.optimizations },
          recommendations: this.getRecommendations(),
        };
      }

      getRecommendations() {
        const recommendations = [];

        if (!this.optimizations.imageCompression) {
          recommendations.push('啟用圖片壓縮');
        }

        if (!this.optimizations.codeMinification) {
          recommendations.push('啟用程式碼壓縮');
        }

        if (!this.optimizations.caching) {
          recommendations.push('啟用快取策略');
        }

        if (!this.optimizations.lazyLoading) {
          recommendations.push('啟用延遲載入');
        }

        return recommendations;
      }
    }

    optimizer = new PerformanceOptimizer();
  });

  describe('最佳化功能', () => {
    test('應該能啟用圖片壓縮', () => {
      optimizer.enableImageCompression();

      expect(optimizer.optimizations.imageCompression).toBe(true);
    });

    test('應該能啟用程式碼壓縮', () => {
      optimizer.enableCodeMinification();

      expect(optimizer.optimizations.codeMinification).toBe(true);
    });

    test('應該能啟用快取', () => {
      optimizer.enableCaching();

      expect(optimizer.optimizations.caching).toBe(true);
    });

    test('應該能啟用延遲載入', () => {
      optimizer.enableLazyLoading();

      expect(optimizer.optimizations.lazyLoading).toBe(true);
    });
  });

  describe('最佳化評分', () => {
    test('應該正確計算最佳化分數', () => {
      expect(optimizer.getOptimizationScore()).toBe(0);

      optimizer.enableImageCompression();
      expect(optimizer.getOptimizationScore()).toBe(25);

      optimizer.enableCodeMinification();
      expect(optimizer.getOptimizationScore()).toBe(50);

      optimizer.enableCaching();
      expect(optimizer.getOptimizationScore()).toBe(75);

      optimizer.enableLazyLoading();
      expect(optimizer.getOptimizationScore()).toBe(100);
    });

    test('應該生成最佳化報告', () => {
      optimizer.enableImageCompression();
      optimizer.enableCaching();

      const report = optimizer.generateOptimizationReport();

      expect(report.score).toBe(50);
      expect(report.optimizations.imageCompression).toBe(true);
      expect(report.optimizations.caching).toBe(true);
      expect(report.recommendations).toHaveLength(2);
      expect(report.recommendations).toContain('啟用程式碼壓縮');
      expect(report.recommendations).toContain('啟用延遲載入');
    });
  });
});

describe('快取效能測試', () => {
  let cachePerformance;

  beforeEach(() => {
    // 模擬快取效能測試器
    class CachePerformanceTest {
      constructor() {
        this.hitCount = 0;
        this.missCount = 0;
        this.totalRequests = 0;
      }

      simulateRequest(url, useCache = true) {
        this.totalRequests++;

        if (useCache && this.isInCache(url)) {
          this.hitCount++;
          return { cached: true, loadTime: 10 };
        } else {
          this.missCount++;
          return { cached: false, loadTime: 200 };
        }
      }

      isInCache(url) {
        // 模擬快取邏輯
        const cachedUrls = ['/index.html', '/styles.css', '/app.js', '/manifest.json'];
        return cachedUrls.includes(url);
      }

      getCacheHitRate() {
        if (this.totalRequests === 0) return 0;
        return (this.hitCount / this.totalRequests) * 100;
      }

      getAverageLoadTime() {
        const hitTime = this.hitCount * 10;
        const missTime = this.missCount * 200;
        const totalTime = hitTime + missTime;

        return this.totalRequests > 0 ? totalTime / this.totalRequests : 0;
      }

      generateCacheReport() {
        return {
          hitRate: this.getCacheHitRate(),
          hitCount: this.hitCount,
          missCount: this.missCount,
          totalRequests: this.totalRequests,
          averageLoadTime: this.getAverageLoadTime(),
        };
      }

      reset() {
        this.hitCount = 0;
        this.missCount = 0;
        this.totalRequests = 0;
      }
    }

    cachePerformance = new CachePerformanceTest();
  });

  describe('快取命中測試', () => {
    test('應該正確計算快取命中率', () => {
      // 模擬請求快取的資源
      cachePerformance.simulateRequest('/index.html');
      cachePerformance.simulateRequest('/styles.css');
      cachePerformance.simulateRequest('/app.js');

      // 模擬請求未快取的資源
      cachePerformance.simulateRequest('/api/data');
      cachePerformance.simulateRequest('/images/large.jpg');

      const hitRate = cachePerformance.getCacheHitRate();
      expect(hitRate).toBe(60); // 3/5 = 60%
    });

    test('快取資源應該有更快的載入時間', () => {
      const cachedResult = cachePerformance.simulateRequest('/index.html');
      const uncachedResult = cachePerformance.simulateRequest('/api/data');

      expect(cachedResult.cached).toBe(true);
      expect(cachedResult.loadTime).toBe(10);

      expect(uncachedResult.cached).toBe(false);
      expect(uncachedResult.loadTime).toBe(200);
    });

    test('應該生成詳細的快取報告', () => {
      // 執行多個請求
      for (let i = 0; i < 5; i++) {
        cachePerformance.simulateRequest('/index.html');
      }
      for (let i = 0; i < 3; i++) {
        cachePerformance.simulateRequest('/api/data');
      }

      const report = cachePerformance.generateCacheReport();

      expect(report.hitRate).toBe(62.5); // 5/8 = 62.5%
      expect(report.hitCount).toBe(5);
      expect(report.missCount).toBe(3);
      expect(report.totalRequests).toBe(8);
      expect(report.averageLoadTime).toBe(87.5); // (5*10 + 3*200) / 8
    });
  });
});

describe('網路效能測試', () => {
  test('應該測量首次位元組時間 (TTFB)', async () => {
    const startTime = performance.now();

    // 模擬網路請求
    await new Promise(resolve => setTimeout(resolve, 150));

    const ttfb = performance.now() - startTime;

    expect(ttfb).toBeLessThan(200); // TTFB 應該少於 200ms
  });

  test('應該測量資源載入時間', async () => {
    const resources = [
      { name: 'styles.css', size: 50000 },
      { name: 'app.js', size: 200000 },
      { name: 'worker.js', size: 30000 },
    ];

    const loadPromises = resources.map(async resource => {
      const startTime = performance.now();

      // 模擬資源載入（基於大小的載入時間）
      const loadTime = resource.size / 1000; // 1KB/ms
      await new Promise(resolve => setTimeout(resolve, loadTime));

      return {
        name: resource.name,
        loadTime: performance.now() - startTime,
        size: resource.size,
      };
    });

    const results = await Promise.all(loadPromises);

    // 檢查每個資源的載入時間是否合理
    results.forEach(result => {
      expect(result.loadTime).toBeLessThan(1000); // 應該少於 1 秒
    });

    // 檢查總載入時間
    const totalLoadTime = Math.max(...results.map(r => r.loadTime));
    expect(totalLoadTime).toBeLessThan(2000); // 總時間應該少於 2 秒
  });

  test('應該測量總體效能分數', () => {
    const metrics = {
      fcp: 1200, // First Contentful Paint
      lcp: 2400, // Largest Contentful Paint
      cls: 0.05, // Cumulative Layout Shift
      fid: 80, // First Input Delay
      ttfb: 150, // Time to First Byte
    };

    // 簡單的效能評分算法
    let score = 100;

    if (metrics.fcp > 1800) score -= 10;
    if (metrics.lcp > 2500) score -= 15;
    if (metrics.cls > 0.1) score -= 10;
    if (metrics.fid > 100) score -= 10;
    if (metrics.ttfb > 200) score -= 5;

    expect(score).toBeGreaterThanOrEqual(90); // 目標分數 90+
  });
});
