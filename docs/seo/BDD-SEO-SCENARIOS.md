# 🎭 ClickFun SEO BDD 場景設計

## 📋 BDD (Behaviour Driven Development) SEO 測試場景

**建立時間**: 2025-08-16T18:25:36+08:00  
**測試框架**: Gherkin Language + Jest/Playwright  
**覆蓋範圍**: SEO 技術實施 + AI 搜尋優化

---

## 🔍 Feature 1: 基礎 SEO Meta 標籤優化

### Scenario 1.1: Meta Description 設置

```gherkin
Feature: Meta Description 優化
  作為一個 SEO 專家
  我想要設置完整的 meta description
  以便搜尋引擎能正確理解頁面內容

  Background:
    Given 用戶訪問 ClickFun 主頁面

  Scenario: Meta Description 存在且符合最佳實踐
    When 頁面載入完成
    Then 應該存在 meta description 標籤
    And description 長度應該在 120-160 字符之間
    And description 應該包含主要關鍵字 "點擊遊戲"
    And description 應該包含品牌名稱 "ClickFun"
    And description 應該具有吸引力的行動呼籲

  Scenario: Meta Keywords 設置
    When 頁面載入完成
    Then 應該存在 meta keywords 標籤
    And keywords 應該包含 "點擊遊戲,Click Fun,clickfun,PWA,遊戲"
    And keywords 數量不應超過 10 個
```

### Scenario 1.2: Open Graph 標籤完整性

```gherkin
Feature: Open Graph 社交媒體優化
  作為一個社交媒體使用者
  我想要分享 ClickFun 遊戲連結時
  能顯示正確的預覽圖片和描述

  Scenario: Facebook Open Graph 標籤
    Given 用戶在 Facebook 分享 ClickFun 連結
    When Facebook 爬蟲掃描頁面
    Then 應該存在 og:title 標籤且內容為 "ClickFun - 點擊樂趣遊戲 | 免費線上PWA遊戲"
    And 應該存在 og:description 標籤且長度在 65-90 字符之間
    And 應該存在 og:image 標籤且圖片尺寸為 1200x630
    And 應該存在 og:type 標籤且值為 "website"
    And 應該存在 og:url 標籤且為正確的 canonical URL
    And 應該存在 og:site_name 標籤且值為 "ClickFun"

  Scenario: Twitter Cards 標籤
    Given 用戶在 Twitter 分享 ClickFun 連結
    When Twitter 爬蟲掃描頁面
    Then 應該存在 twitter:card 標籤且值為 "summary_large_image"
    And 應該存在 twitter:title 標籤
    And 應該存在 twitter:description 標籤
    And 應該存在 twitter:image 標籤
    And 應該存在 twitter:site 標籤 (如果有 Twitter 帳號)
```

---

## 🏗️ Feature 2: 結構化數據 (JSON-LD) 實施

### Scenario 2.1: WebApplication Schema 標記

```gherkin
Feature: JSON-LD WebApplication 結構化數據
  作為一個搜尋引擎爬蟲
  我需要理解 ClickFun 是什麼類型的應用程式
  以便在搜尋結果中正確展示

  Scenario: WebApplication Schema 完整性
    Given 搜尋引擎爬蟲訪問 ClickFun 頁面
    When 爬蟲解析 JSON-LD 數據
    Then 應該存在 JSON-LD script 標籤
    And @type 應該為 "WebApplication"
    And name 應該為 "ClickFun"
    And description 應該描述遊戲功能
    And url 應該為主要網域
    And applicationCategory 應該為 "Game"
    And operatingSystem 應該包含 "All"
    And browserRequirements 應該為 "Requires JavaScript"
    And 應該包含 offers 價格資訊 (免費)

  Scenario: VideoGame Schema 擴充標記
    Given 詳細的遊戲資訊需要被搜尋引擎理解
    When 爬蟲解析擴充的 VideoGame schema
    Then 應該包含 gamePlayMode 為 "SinglePlayer"
    And 應該包含 genre 為 "Casual, Arcade"
    And 應該包含 gamePlatform 包括 "Web Browser, Mobile"
    And 應該包含 contentRating 資訊
```

### Scenario 2.2: 組織資訊 Schema

```gherkin
Feature: Organization Schema 標記
  作為一個品牌資訊查詢者
  我想要了解 ClickFun 的開發者資訊
  以便建立信任感

  Scenario: 開發者組織資訊
    When 搜尋引擎解析組織資訊
    Then 應該存在 Organization schema
    And name 應該為開發者名稱
    And 應該包含 sameAs 連結到相關社交媒體 (如果有)
    And 應該包含 contactPoint 資訊
```

---

## 🤖 Feature 3: AI 搜尋引擎優化 (AEO/GEO)

### Scenario 3.1: ChatGPT 遊戲推薦測試

```gherkin
Feature: AI 搜尋引擎內容理解
  作為一個 AI 語言模型
  我需要正確理解 ClickFun 的功能特色
  以便向用戶做出準確推薦

  Scenario: ChatGPT 點擊遊戲詢問回應
    Given 用戶向 ChatGPT 詢問 "推薦一些好玩的點擊遊戲"
    When ChatGPT 搜尋相關資訊
    Then ClickFun 應該出現在推薦列表中
    And 描述應該正確提及 "PWA 支援離線遊戲"
    And 描述應該提及 "TPS 計算功能"
    And 描述應該提及 "粉色×天藍配色主題"

  Scenario: Perplexity 搜尋結果驗證
    Given 用戶在 Perplexity 搜尋 "免費線上點擊遊戲"
    When Perplexity 生成回答
    Then ClickFun 應該被包含在結果中
    And 應該正確引用官方網站 URL
    And 應該提及主要功能特色
```

### Scenario 3.2: llms.txt 檔案實施

```gherkin
Feature: LLM 專用資訊檔案
  作為一個大型語言模型
  我需要存取結構化的產品資訊
  以便提供準確的回答

  Scenario: llms.txt 檔案格式正確性
    Given LLM 爬蟲訪問 /llms.txt
    When 檔案被讀取和解析
    Then 檔案應該存在且可訪問
    And 應該包含產品名稱和簡短描述
    And 應該包含主要功能列表
    And 應該包含技術規格 (PWA, HTML5)
    And 應該包含官方連結
    And 應該使用結構化格式 (YAML 或 JSON)
    And 編碼應該為 UTF-8
```

---

## 📊 Feature 4: 技術 SEO 基礎設施

### Scenario 4.1: Sitemap 生成與提交

```gherkin
Feature: XML Sitemap 搜尋引擎指引
  作為一個搜尋引擎爬蟲
  我需要一個清晰的網站地圖
  以便有效率地爬取所有重要頁面

  Scenario: sitemap.xml 檔案正確性
    Given 搜尋引擎爬蟲訪問 /sitemap.xml
    When sitemap 檔案被解析
    Then 檔案應該存在且格式正確
    And 應該包含主頁面 URL
    And 應該包含 lastmod 時間戳記
    And 應該包含 changefreq 資訊
    And 應該包含 priority 權重設定
    And 所有 URL 都應該可訪問 (200 狀態碼)
    And 檔案大小應該小於 50MB
    And URL 數量應該少於 50,000 個

  Scenario: robots.txt 爬蟲指引
    Given 搜尋引擎爬蟲訪問 /robots.txt
    When robots.txt 檔案被讀取
    Then 檔案應該存在且格式正確
    And 應該包含 User-agent: * 指令
    And 應該允許重要頁面被爬取
    And 應該包含 Sitemap: URL 指向
    And 應該禁止敏感目錄 (如果有)
```

### Scenario 4.2: Canonical URL 設定

```gherkin
Feature: Canonical URL 重複內容處理
  作為一個 SEO 最佳化實踐
  我需要明確指定頁面的標準版本
  以避免重複內容問題

  Scenario: 主頁面 Canonical URL
    Given 用戶訪問 ClickFun 任何變體 URL
    When 頁面載入完成
    Then 應該存在 canonical link 標籤
    And canonical URL 應該指向主要域名
    And canonical URL 應該使用 HTTPS
    And canonical URL 應該不包含查詢參數
    And canonical URL 應該以 / 結尾保持一致性
```

---

## ⚡ Feature 5: Core Web Vitals 與效能

### Scenario 5.1: Lighthouse SEO 評分

```gherkin
Feature: Lighthouse SEO 評分優化
  作為一個效能分析工具
  我需要驗證頁面符合 SEO 最佳實踐
  以確保搜尋引擎友好性

  Scenario: Lighthouse SEO 100分檢查
    Given Lighthouse 工具掃描 ClickFun 主頁
    When SEO 檢查完成
    Then SEO 評分應該為 100/100
    And 應該通過 "Document has a meta description" 檢查
    And 應該通過 "Page has successful HTTP status code" 檢查
    And 應該通過 "Document has a title element" 檢查
    And 應該通過 "Document has a valid hreflang" 檢查 (如果多語言)
    And 應該通過 "Image elements have alt attributes" 檢查
    And 應該通過 "Links have descriptive text" 檢查

  Scenario: Core Web Vitals 指標
    Given 用戶在真實環境中訪問 ClickFun
    When 效能指標被測量
    Then LCP (Largest Contentful Paint) 應該 < 2.5 秒
    And FID (First Input Delay) 應該 < 100 毫秒
    And CLS (Cumulative Layout Shift) 應該 < 0.1
    And TTFB (Time to First Byte) 應該 < 800 毫秒
```

---

## 🔧 Feature 6: PWA SEO 特殊優化

### Scenario 6.1: PWA 相關 SEO 元素

```gherkin
Feature: PWA 特有的 SEO 優化
  作為一個 PWA 應用程式
  我需要特殊的 SEO 設定
  以便在應用商店和搜尋中被正確識別

  Scenario: App Manifest SEO 屬性
    Given PWA manifest 檔案被檢查
    When 搜尋引擎解析 manifest
    Then name 和 short_name 應該符合 SEO 關鍵字
    And description 應該包含主要關鍵字
    And categories 應該包含 "games"
    And icons 應該包含多種尺寸
    And theme_color 應該設定正確
    And background_color 應該設定正確
    And display 模式應該適合遊戲 (standalone)

  Scenario: Apple 特定 Meta 標籤
    Given iOS 用戶訪問 ClickFun
    When Safari 解析頁面標籤
    Then 應該存在 apple-mobile-web-app-title
    And 應該存在 apple-mobile-web-app-capable
    And 應該存在 apple-mobile-web-app-status-bar-style
    And 應該存在 apple-touch-icon 多種尺寸
```

---

## 📈 Feature 7: SEO 監控與分析

### Scenario 7.1: Google Search Console 整合

```gherkin
Feature: Search Console 監控設置
  作為一個 SEO 管理員
  我需要監控搜尋表現
  以便持續優化策略

  Scenario: 搜尋引擎提交驗證
    Given ClickFun 網站已部署
    When 向 Google Search Console 提交
    Then 網站驗證應該成功
    And sitemap 提交應該成功
    And 應該開始接收搜尋數據
    And 應該沒有爬取錯誤
    And Core Web Vitals 報告應該顯示 "Good"

  Scenario: 關鍵字排名監控
    Given 目標關鍵字已設定
    When 搜尋引擎排名被追蹤 (1週後)
    Then "ClickFun" 應該在前3名
    And "點擊遊戲" 應該進入前50名
    And "免費點擊遊戲" 應該進入前30名
    And 品牌詞點擊率應該 > 50%
```

---

## 🎯 驗收標準 (Definition of Done)

### 每個 Feature 完成標準：

- [ ] 所有 Scenario 測試通過
- [ ] Lighthouse SEO 評分 100/100
- [ ] W3C HTML 驗證通過
- [ ] Google Rich Results 測試通過
- [ ] Facebook Sharing Debugger 驗證通過
- [ ] Twitter Card Validator 驗證通過
- [ ] 手動測試覆蓋所有主要場景
- [ ] 文檔更新完成

### 整體專案驗收標準：

- [ ] 所有主要關鍵字 Google 搜尋進入前50名
- [ ] AI 搜尋引擎 (ChatGPT/Perplexity) 能正確推薦
- [ ] Core Web Vitals 全項目 "Good"
- [ ] 搜尋引擎收錄率 100%
- [ ] 零 SEO 相關錯誤警告

---

**最後更新**: 2025-08-16T18:25:36+08:00  
**測試框架**: Jest + Playwright + Lighthouse CI  
**執行頻率**: 每次部署前 + 每週監控
