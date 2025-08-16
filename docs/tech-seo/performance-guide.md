# ⚡ 效能優化指南 - Lighthouse 100 分達成策略

## 📋 文檔資訊

**建立時間**: 2025-08-17T01:57:37+08:00  
**負責人**: 鐵漢阿強 (Iron Man Strong)  
**版本**: v1.0.0  
**目標**: Lighthouse 四維度 100 分滿分  
**Core Web Vitals**: 全項目 "Good" 等級

---

## 🎯 Core Web Vitals 目標值

### 效能指標標準

```yaml
Core_Web_Vitals_Targets:
  LCP: "< 2.5 秒"     # Largest Contentful Paint
  FID: "< 100 毫秒"   # First Input Delay  
  CLS: "< 0.1"        # Cumulative Layout Shift
  TTFB: "< 800 毫秒"  # Time to First Byte

Lighthouse_Score_Targets:
  Performance: "100/100"
  Accessibility: "100/100" 
  Best_Practices: "100/100"
  SEO: "100/100"

Additional_Metrics:
  FCP: "< 1.8 秒"     # First Contentful Paint
  SI: "< 3.4 秒"      # Speed Index
  TBT: "< 200 毫秒"   # Total Blocking Time
```

---

## 🚀 HTML 效能優化

### 文檔結構最佳化

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <!-- ✅ 關鍵資源優先載入 -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- ✅ 預載關鍵資源 -->
    <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">
    <link rel="preload" href="/js/main.js" as="script">
    
    <!-- ✅ 關鍵 CSS 內聯 -->
    <style>
    /* 首屏關鍵樣式 < 14KB */
    body{margin:0;font-family:system-ui}
    .game-container{max-width:800px;margin:0 auto}
    .click-button{padding:2rem;font-size:2rem}
    </style>
    
    <!-- ✅ 非關鍵 CSS 延遲載入 -->
    <link rel="preload" href="/css/non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/css/non-critical.css"></noscript>
    
    <!-- ✅ DNS 預取 -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <title>ClickFun - 點擊樂趣遊戲 | 免費線上PWA遊戲</title>
</head>
<body>
    <!-- ✅ 關鍵內容優先 -->
    <main class="game-container">
        <h1>ClickFun 點擊遊戲</h1>
        <button class="click-button" id="clickBtn">開始點擊</button>
        <div class="stats">TPS: <span id="tps">0</span></div>
    </main>
    
    <!-- ✅ 非關鍵腳本延遲載入 -->
    <script src="/js/main.js" defer></script>
</body>
</html>
```

### 資源載入優化

```html
<!-- ✅ 圖片最佳化 -->
<img src="icon.webp" 
     alt="ClickFun 圖示"
     width="64" 
     height="64"
     loading="lazy"
     decoding="async">

<!-- ✅ 響應式圖片 -->
<picture>
    <source media="(min-width: 800px)" srcset="hero-large.webp">
    <source media="(min-width: 400px)" srcset="hero-medium.webp">
    <img src="hero-small.webp" alt="ClickFun 遊戲截圖" loading="lazy">
</picture>

<!-- ✅ 背景圖片優化 -->
<div style="background-image: url('hero.webp'); background-size: cover; will-change: transform;"></div>
```

---

## 📦 資源優化策略

### 檔案大小控制

```yaml
Resource_Size_Limits:
  HTML: "< 50KB (gzipped)"
  Critical_CSS: "< 14KB (inline)"
  Total_CSS: "< 100KB (gzipped)"
  JavaScript: "< 200KB (gzipped)"
  Images: 
    Hero: "< 100KB (WebP)"
    Icons: "< 10KB each"
    Total: "< 500KB"
  Fonts: "< 200KB total"

Compression_Standards:
  HTML: "gzip + brotli"
  CSS: "minify + gzip"
  JavaScript: "minify + gzip"
  Images: "WebP + progressive JPEG fallback"
```

### JavaScript 效能優化

```javascript
// ✅ 高效的事件處理
class ClickGame {
    constructor() {
        this.clicks = 0;
        this.startTime = Date.now();
        this.tpsHistory = [];
        
        // 事件委派避免多個監聽器
        document.addEventListener('click', this.handleClick.bind(this));
        
        // 使用 RAF 優化動畫
        this.updateDisplay();
    }
    
    handleClick(event) {
        if (event.target.id === 'clickBtn') {
            this.clicks++;
            
            // 批量 DOM 更新
            requestAnimationFrame(() => {
                this.updateStats();
            });
        }
    }
    
    updateStats() {
        const now = Date.now();
        const timeDiff = (now - this.startTime) / 1000;
        const tps = timeDiff > 0 ? this.clicks / timeDiff : 0;
        
        // 高效 DOM 更新
        document.getElementById('tps').textContent = tps.toFixed(2);
    }
    
    updateDisplay() {
        // 使用 RAF 確保 60 FPS
        requestAnimationFrame(this.updateDisplay.bind(this));
        this.updateStats();
    }
}

// ✅ 延遲初始化
document.addEventListener('DOMContentLoaded', () => {
    new ClickGame();
});
```

### CSS 效能最佳化

```css
/* ✅ 關鍵 CSS (內聯) */
:root {
    --primary: #f6a8d8;
    --secondary: #87ceeb;
    --bg: #ffffff;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: #333;
}

.game-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    text-align: center;
}

.click-button {
    padding: 2rem;
    font-size: 2rem;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    border-radius: 1rem;
    color: white;
    cursor: pointer;
    transition: transform 0.1s ease;
    will-change: transform;
}

.click-button:active {
    transform: scale(0.95);
}

/* ✅ 非關鍵 CSS (外部檔案) */
@media (prefers-reduced-motion: reduce) {
    .click-button {
        transition: none;
    }
}

/* 使用 contain 提升效能 */
.stats-container {
    contain: layout style paint;
}

/* GPU 加速動畫 */
@keyframes pulse {
    0% { transform: scale(1) translateZ(0); }
    50% { transform: scale(1.05) translateZ(0); }
    100% { transform: scale(1) translateZ(0); }
}
```

---

## 🖼️ 圖片優化標準

### 圖片格式和尺寸

```yaml
Image_Optimization:
  formats:
    primary: "WebP"
    fallback: "JPEG/PNG"
    quality: "85-90%"
  
  sizes:
    hero_image: "1200x800"
    og_image: "1200x630"
    icons:
      - "192x192"
      - "512x512"
    thumbnails: "300x200"
  
  compression:
    webp_quality: 85
    jpeg_quality: 85
    png_compression: 9
    
  loading_strategy:
    above_fold: "eager"
    below_fold: "lazy"
    decorative: "lazy"
```

### 圖片實施代碼

```html
<!-- ✅ 現代圖片格式 -->
<picture>
    <source type="image/webp" srcset="
        image-320.webp 320w,
        image-640.webp 640w,
        image-1024.webp 1024w
    ">
    <source type="image/jpeg" srcset="
        image-320.jpg 320w,
        image-640.jpg 640w,
        image-1024.jpg 1024w
    ">
    <img src="image-640.jpg" 
         alt="ClickFun 遊戲界面"
         loading="lazy"
         decoding="async"
         width="640"
         height="427">
</picture>

<!-- ✅ SVG 圖示優化 -->
<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="..." fill="currentColor"/>
</svg>

<!-- ✅ 背景圖片懶載入 -->
<div class="hero-bg" 
     style="background-image: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')" 
     data-bg="hero.webp"></div>
```

---

## 🔤 字型優化

### Web Fonts 效能策略

```html
<!-- ✅ 字型預載入 -->
<link rel="preload" 
      href="/fonts/inter-var.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>

<!-- ✅ 字型顯示策略 -->
<style>
@font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var.woff2') format('woff2-variations');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap; /* 確保文字立即顯示 */
}

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>

<!-- ✅ 系統字型後備 -->
.system-font {
    font-family: 
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        'Roboto',
        sans-serif;
}
```

### 字型子集化

```bash
# 字型優化命令
# 只保留需要的字符
pyftsubset font.ttf \
    --unicodes="U+0020-007F,U+4E00-9FFF" \
    --output-file="font-subset.woff2" \
    --flavor="woff2" \
    --layout-features="*" \
    --glyph-names \
    --symbol-cmap \
    --legacy-cmap \
    --notdef-glyph \
    --notdef-outline \
    --recommended-glyphs
```

---

## ⚡ JavaScript 效能優化

### 關鍵渲染路徑優化

```javascript
// ✅ 首屏內容優先
document.addEventListener('DOMContentLoaded', function() {
    // 立即顯示核心遊戲界面
    initGameUI();
    
    // 延遲載入非關鍵功能
    setTimeout(() => {
        loadAnalytics();
        loadSocialSharing();
    }, 1000);
});

// ✅ 程式碼分割
async function loadAdvancedFeatures() {
    const { AdvancedStats } = await import('./advanced-stats.js');
    const { Animations } = await import('./animations.js');
    
    return { AdvancedStats, Animations };
}

// ✅ Web Workers 處理重計算
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// 使用 Worker 處理統計計算
const statsWorker = new Worker('/workers/stats-worker.js');
statsWorker.postMessage({ clicks: clickData });
```

### 記憶體管理

```javascript
class GameManager {
    constructor() {
        this.clickHistory = new Array(1000); // 固定大小陣列
        this.currentIndex = 0;
        this.stats = new Map(); // 使用 Map 而非 Object
    }
    
    addClick(timestamp) {
        // 循環使用陣列，避免記憶體洩漏
        this.clickHistory[this.currentIndex % 1000] = timestamp;
        this.currentIndex++;
        
        // 清理舊數據
        if (this.currentIndex % 100 === 0) {
            this.cleanupOldData();
        }
    }
    
    cleanupOldData() {
        const cutoff = Date.now() - 60000; // 保留1分鐘數據
        this.stats.forEach((value, key) => {
            if (value.timestamp < cutoff) {
                this.stats.delete(key);
            }
        });
    }
    
    destroy() {
        // 清理資源
        this.clickHistory = null;
        this.stats.clear();
        this.stats = null;
    }
}
```

---

## 📱 響應式效能優化

### 設備適應性優化

```css
/* ✅ 媒體查詢優化 */
@media (max-width: 768px) {
    .game-container {
        padding: 0.5rem;
    }
    
    .click-button {
        font-size: 1.5rem;
        padding: 1.5rem;
    }
}

/* ✅ 高DPI顯示器優化 */
@media (-webkit-min-device-pixel-ratio: 2) {
    .icon {
        background-image: url('icon@2x.webp');
        background-size: 24px 24px;
    }
}

/* ✅ 深色模式優化 */
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #1a1a1a;
        --text: #ffffff;
    }
}

/* ✅ 減少動畫 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 🔧 效能監控

### 效能指標收集

```javascript
// ✅ Core Web Vitals 監控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
    // 發送到分析服務
    console.log('Metric:', metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// ✅ 自定義效能監控
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observer = new PerformanceObserver(this.handleEntries.bind(this));
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }
    
    handleEntries(list) {
        for (const entry of list.getEntries()) {
            this.metrics[entry.name] = entry.startTime;
        }
    }
    
    mark(name) {
        performance.mark(name);
    }
    
    measure(name, start, end) {
        performance.measure(name, start, end);
        const measure = performance.getEntriesByName(name)[0];
        this.metrics[name] = measure.duration;
    }
}
```

### Lighthouse CI 配置

```json
{
  "ci": {
    "collect": {
      "url": ["https://haotool.github.io/clickfun/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 1.0}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 1.0}],
        "categories:seo": ["error", {"minScore": 1.0}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 🛠️ 效能調試工具

### 開發者工具使用

```bash
# ✅ Lighthouse 命令列
lighthouse https://haotool.github.io/clickfun/ \
    --output html \
    --output-path ./reports/lighthouse.html \
    --chrome-flags="--headless"

# ✅ WebPageTest 自動化
curl -X POST "https://www.webpagetest.org/runtest.php" \
    -d "url=https://haotool.github.io/clickfun/" \
    -d "k=YOUR_API_KEY" \
    -d "f=json"

# ✅ 壓縮檢查
gzip -c index.html | wc -c  # 檢查 gzip 後大小
brotli -c index.html | wc -c  # 檢查 brotli 後大小
```

### 效能預算配置

```json
{
  "budget": [
    {
      "resourceSizes": [
        {
          "resourceType": "document",
          "budget": 50
        },
        {
          "resourceType": "script", 
          "budget": 200
        },
        {
          "resourceType": "stylesheet",
          "budget": 100
        },
        {
          "resourceType": "image",
          "budget": 500
        },
        {
          "resourceType": "font",
          "budget": 200
        },
        {
          "resourceType": "total",
          "budget": 1000
        }
      ]
    }
  ]
}
```

---

## 📋 效能檢查清單

### 上線前檢查

```yaml
Performance_Checklist:
  lighthouse_scores:
    - [ ] Performance: 100/100
    - [ ] Accessibility: 100/100  
    - [ ] Best Practices: 100/100
    - [ ] SEO: 100/100

  core_web_vitals:
    - [ ] LCP < 2.5 秒
    - [ ] FID < 100 毫秒
    - [ ] CLS < 0.1
    - [ ] TTFB < 800 毫秒

  resource_optimization:
    - [ ] HTML < 50KB (gzipped)
    - [ ] CSS < 100KB (gzipped)
    - [ ] JavaScript < 200KB (gzipped)
    - [ ] 圖片總計 < 500KB
    - [ ] 字型總計 < 200KB

  loading_optimization:
    - [ ] 關鍵資源預載入
    - [ ] 非關鍵資源延遲載入
    - [ ] 圖片懶載入
    - [ ] 字型顯示策略設定

  mobile_optimization:
    - [ ] 響應式設計測試
    - [ ] 觸控友善性
    - [ ] 視窗適配
    - [ ] 離線功能測試
```

### 定期監控

- [ ] 每週 Lighthouse 評分檢查
- [ ] 每月 Core Web Vitals 分析  
- [ ] 每季度效能預算檢視
- [ ] 持續監控真實用戶指標 (RUM)

---

**文檔維護**: 鐵漢阿強 (Iron Man Strong)  
**最後更新**: 2025-08-17T01:57:37+08:00  
**效能目標**: Lighthouse 100 分 + Core Web Vitals 全綠  
**監控頻率**: 每日自動化檢查
