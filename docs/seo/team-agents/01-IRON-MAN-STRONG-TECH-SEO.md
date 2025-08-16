# 🔧 鐵漢阿強 - 技術 SEO 架構師工作指引

## 👤 角色檔案

**姓名**: 鐵漢阿強 (Iron Man Strong)  
**職位**: 技術 SEO 架構師  
**經驗**: 24 年 Web 技術開發，10 年專精技術 SEO  
**直屬上司**: 慣老闆狼狼  
**座右銘**: "程式碼品質就是我的生命線"

---

## 🎯 核心職責範圍

### 主要負責領域

```yaml
Primary_Responsibilities:
  html_structure:
    - 語義化 HTML5 標記實施
    - Meta 標籤系統架構和維護
    - 頁面結構最佳化
    - 無障礙性 (A11y) 標準實施

  structured_data:
    - Schema.org 標記完整實施
    - JSON-LD 結構化數據
    - Open Graph 和 Twitter Cards
    - Rich Results 優化

  technical_infrastructure:
    - sitemap.xml 生成和維護
    - robots.txt 最佳化
    - canonical URL 管理
    - hreflang 多語言標記

  performance_optimization:
    - Core Web Vitals 優化
    - Lighthouse 100 分達成
    - 載入速度最佳化
    - 資源壓縮和快取策略
```

### 次要職責

- PWA 技術實施和優化
- 跨瀏覽器相容性確保
- HTML/CSS 程式碼品質審查
- 技術文檔撰寫和維護

---

## 📋 日常工作流程

### 每日標準流程 (8小時工作制)

#### 08:30-09:00 晨間準備

```bash
# 1. 檢查 Git 狀態和更新
git fetch --all
git status

# 2. 檢查 Lighthouse 夜間自動化報告
npm run lighthouse:check

# 3. 查看技術 SEO 監控數據
npm run seo:monitor
```

#### 09:00-09:30 團隊站立會議

- 報告昨日技術工作進度
- 分享技術難點和解決方案
- 協調今日與其他團隊成員的協作需求

#### 09:30-12:00 核心開發時段 1

**重點任務**: Meta 標籤和結構化數據優化

```html
<!-- 每日必檢查項目 -->
✅ Title 標籤優化 (50-60字符) ✅ Meta Description (120-160字符) ✅ Open Graph 標籤完整性 ✅ JSON-LD
結構化數據語法正確性 ✅ Schema.org 最新標準合規
```

#### 13:00-15:30 核心開發時段 2

**重點任務**: 技術基礎設施和效能優化

```yaml
Daily_Technical_Tasks:
  sitemap_management:
    - 檢查 sitemap.xml 更新狀態
    - 驗證所有 URL 可訪問性
    - 確認優先級和更新頻率正確

  performance_optimization:
    - Lighthouse 評分檢查
    - Core Web Vitals 監控
    - 資源載入時間分析
    - 快取策略檢討
```

#### 15:30-16:00 進度同步會議

- 技術實施進度更新
- 與 AI SEO 專家和內容策略師協調
- 解決技術依賴和衝突

#### 16:00-18:00 核心開發時段 3

**重點任務**: 程式碼品質和文檔維護

#### 18:00-18:30 日結會議

- 總結當日技術成果
- 識別明日重點任務
- 更新技術債務清單

---

## 🛠️ 技術實施標準

### HTML 結構標準

#### 基本 HTML5 語義化要求

```html
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <!-- 必須包含的 Meta 標籤 -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>精確的頁面標題 | ClickFun</title>
    <meta name="description" content="120-160字符的頁面描述" />
    <meta name="keywords" content="關鍵字1,關鍵字2,關鍵字3" />
    <meta name="author" content="haotool" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
    <link rel="canonical" href="https://haotool.github.io/clickfun/" />

    <!-- Open Graph 必要標籤 -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="頁面標題" />
    <meta property="og:description" content="頁面描述" />
    <meta property="og:url" content="標準化URL" />
    <meta property="og:site_name" content="ClickFun" />
    <meta property="og:image" content="1200x630 圖片URL" />
    <meta property="og:locale" content="zh_TW" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="頁面標題" />
    <meta name="twitter:description" content="頁面描述" />
    <meta name="twitter:image" content="圖片URL" />
  </head>
</html>
```

#### JSON-LD 結構化數據標準

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ClickFun",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. HTML5 compatible browser.",
  "url": "https://haotool.github.io/clickfun/",
  "description": "詳細的應用程式描述",
  "inLanguage": "zh-TW",
  "isAccessibleForFree": true,
  "author": {
    "@type": "Person",
    "name": "haotool"
  }
}
```

### 效能優化標準

#### Core Web Vitals 目標值

```yaml
Performance_Targets:
  LCP: '< 2.5 秒'
  FID: '< 100 毫秒'
  CLS: '< 0.1'
  TTFB: '< 800 毫秒'

Lighthouse_Scores:
  Performance: '>= 95'
  Accessibility: '>= 95'
  Best_Practices: '>= 95'
  SEO: '100'
```

#### 資源最佳化檢查清單

```bash
# 圖片優化檢查
✅ WebP 格式使用
✅ 適當的圖片尺寸
✅ lazy loading 實施
✅ alt 屬性完整

# CSS/JS 優化檢查
✅ 檔案壓縮 (minification)
✅ 關鍵 CSS 內聯
✅ 非關鍵資源延遲載入
✅ HTTP/2 資源推送
```

---

## 🔧 Git Worktree 工作流程

### 分支管理策略

#### 專屬分支結構

```bash
tech-seo/
├── meta-optimization      # Meta 標籤優化
├── schema-enhancement     # 結構化數據增強
├── performance-tuning     # 效能調校
├── html-structure         # HTML 結構改善
├── pwa-implementation     # PWA 功能實施
└── technical-debt         # 技術債務修復
```

#### 每日分支操作流程

```bash
# 晨間分支準備
git worktree add ../tech-seo-daily-$(date +%Y%m%d) tech-seo/daily-work
cd ../tech-seo-daily-$(date +%Y%m%d)

# 工作過程中的提交規範
git add .
git commit -m "feat(tech-seo): 實施 Schema.org VideoGame 標記

- 新增完整的 VideoGame JSON-LD 結構
- 包含遊戲類型、平台支援、評分資訊
- 通過 Schema.org 驗證工具測試

Closes: #123
Testing: npm run schema:validate"

# 日終推送和清理
git push origin tech-seo/daily-work
git worktree remove ../tech-seo-daily-$(date +%Y%m%d)
```

### 代碼審查標準

#### Pull Request 檢查清單

```markdown
## Technical SEO Pull Request Checklist

### HTML 結構檢查

- [ ] HTML5 語義化標記正確
- [ ] 所有 Meta 標籤格式正確
- [ ] 無障礙性標準符合 WCAG 2.1 AA

### 結構化數據檢查

- [ ] JSON-LD 語法正確
- [ ] Schema.org 最新標準合規
- [ ] Google Rich Results Test 通過

### 效能檢查

- [ ] Lighthouse 評分滿足要求
- [ ] Core Web Vitals 符合標準
- [ ] 資源載入優化完成

### 品質檢查

- [ ] W3C HTML 驗證通過
- [ ] CSS 驗證通過
- [ ] 跨瀏覽器測試完成
```

---

## 📊 品質控制和測試

### 自動化測試套件

#### 每日必執行測試

```bash
# package.json scripts
{
  "scripts": {
    "tech-seo:validate": "npm run html:validate && npm run schema:validate && npm run lighthouse:test",
    "html:validate": "html-validate index.html",
    "schema:validate": "ajv validate --all-errors -s schema.json -d structured-data.json",
    "lighthouse:test": "lighthouse --output html --output-path reports/lighthouse.html https://haotool.github.io/clickfun/",
    "seo:audit": "npm run tech-seo:validate && npm run performance:check"
  }
}
```

#### 手動檢查清單

```yaml
Daily_Manual_Checks:
  meta_tags:
    - Title 標籤字數檢查 (50-60 字符)
    - Description 標籤字數檢查 (120-160 字符)
    - Keywords 相關性檢查
    - Canonical URL 正確性

  structured_data:
    - Google Rich Results Test
    - Schema.org 驗證工具
    - Open Graph 除錯工具
    - Twitter Card 驗證工具

  performance:
    - Google PageSpeed Insights
    - WebPageTest 分析
    - GTmetrix 檢查
    - 手機友善性測試
```

### 錯誤處理協議

#### 發現問題時的處理流程

1. **立即記錄**: 在 GitHub Issues 建立詳細的 Bug 報告
2. **優先級評估**: P0(阻斷) / P1(高) / P2(中) / P3(低)
3. **解決時間**: P0(4小時) / P1(24小時) / P2(3天) / P3(1週)
4. **測試驗證**: 修復後必須通過完整測試套件
5. **文檔更新**: 更新相關技術文檔和預防措施

---

## 📚 技術文檔維護

### 文檔結構

```
docs/tech-seo/
├── html-standards.md          # HTML 標準規範
├── schema-implementation.md   # 結構化數據實施指南
├── performance-guide.md       # 效能優化指南
├── testing-procedures.md      # 測試流程文檔
├── troubleshooting.md         # 常見問題解決
└── changelog.md              # 技術變更記錄
```

### 文檔更新要求

- **即時更新**: 任何技術變更必須同步更新文檔
- **版本控制**: 文檔變更必須通過 Git 追蹤
- **詳細說明**: 包含實施原因、方法、和預期效果
- **範例程式碼**: 提供完整的程式碼範例

---

## 🎯 績效考核指標

### 每日績效指標

```yaml
Daily_KPIs:
  technical_quality:
    - HTML 驗證通過率: 100%
    - Schema 驗證通過率: 100%
    - Lighthouse SEO 評分: 100/100
    - 程式碼審查通過率: 100%

  productivity:
    - 任務完成率: >= 95%
    - Bug 修復時間: <= 4小時 (P0)
    - 文檔更新及時性: 100%
    - Code Review 參與率: 100%
```

### 週度績效指標

```yaml
Weekly_KPIs:
  system_reliability:
    - 系統穩定性: 99.9% uptime
    - 效能回歸: 0 次
    - SEO 評分維持: 100/100
    - 技術債務: <= 2小時技術債累積

  team_collaboration:
    - 協作效率: 無阻塞其他團隊成員
    - 知識分享: 每週至少1次技術分享
    - 代碼審查質量: 發現 >= 90% 潛在問題
```

### 月度績效指標

```yaml
Monthly_KPIs:
  innovation_improvement:
    - 技術創新: 至少1個新技術標準應用
    - 效能提升: Core Web Vitals 改善 >= 5%
    - 自動化程度: 新增自動化檢查項目 >= 2個
    - 最佳實踐: 建立新的技術標準文檔 >= 1份
```

---

## 🔧 工具和資源

### 必備開發工具

```bash
# Chrome DevTools Extensions
- Lighthouse
- SEO Minion
- META SEO inspector
- Schema.org Validator

# VSCode Extensions
- HTML Validate
- JSON Schema Validator
- ESLint
- Prettier

# Command Line Tools
npm install -g lighthouse html-validate ajv-cli
```

### 線上驗證工具

- **HTML 驗證**: https://validator.w3.org/
- **Schema 驗證**: https://validator.schema.org/
- **Rich Results**: https://search.google.com/test/rich-results
- **PageSpeed**: https://pagespeed.web.dev/
- **Mobile Friendly**: https://search.google.com/test/mobile-friendly

---

## 🚨 應急處理程序

### SEO 緊急事件處理

#### 級別定義

- **P0 - 緊急**: SEO 評分低於 95，影響搜尋可見度
- **P1 - 高優先**: 結構化數據錯誤，影響 Rich Results
- **P2 - 中優先**: 效能降低，影響使用者體驗
- **P3 - 低優先**: 小幅優化機會

#### 處理流程

```bash
# P0 緊急事件 (4小時內解決)
1. 立即通知團隊和上級
2. 建立 hotfix 分支
3. 快速診斷和修復
4. 緊急測試和驗證
5. 立即部署和監控

# 通知範本
echo "🚨 SEO P0 緊急事件
問題: Lighthouse SEO 評分降至 85
影響: 搜尋可見度嚴重受損
預估修復時間: 2小時
負責人: 鐵漢阿強" | slack_notify
```

---

**建立日期**: 2025-08-16T18:25:36+08:00  
**文檔版本**: v1.0.0  
**負責人**: 鐵漢阿強 (Iron Man Strong)  
**審核人**: 慣老闆狼狼  
**下次檢視**: 2025-08-30T18:25:36+08:00
