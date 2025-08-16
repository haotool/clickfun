# SEO 整體策略（Click Fun / clickfun）

## 1. 目標與定位

- 品牌關鍵字：Click Fun、clickfun、ClickFun、Click-Fun
- 核心主題：點擊遊戲、放置點擊、Clicker Game、Idle Clicker、網頁點擊遊戲
- 差異化：PWA、離線可玩、零門檻即玩、極速載入、可分享競榜

## 2. 資訊架構（IA）與內容集群

- 首頁（/）：主題頁「點擊遊戲 Click Fun」+ 主要 CTA
- 子頁：
  - /features：玩法與特性（快、爽、裝飾、競榜）
  - /how-to-play：教學與技巧
  - /leaderboard：競榜（若有）
  - /blog：內容集群（程式化長尾）
  - /faq：常見問題（AEO/LLMO 友善）
  - /legal（terms/privacy）：信任與合規

## 3. 關鍵字策略（精簡）

- 主要：點擊遊戲、Clicker Game、Idle Clicker、Click Fun、clickfun
- 長尾：
  - 點擊遊戲推薦、免費點擊遊戲、瀏覽器點擊遊戲、手機點擊遊戲
  - clicker game online、idle clicker web、best clicker game 2025
  - 點擊放置遊戲、點擊增強遊戲、點擊挑戰
- 程式化頁面：`/k/{slug}` 以模板生成變體（中文/英文/同義詞）。

## 4. 技術 SEO

- robots.txt / sitemap.xml / manifest.json / service worker
- 結構化資料（JSON-LD）：WebSite、SoftwareApplication、VideoObject（若有影片）、FAQPage、BreadcrumbList
- hreflang：`zh-Hant-TW` 與 `en`
- llms.txt：面向 LLM/Answer Engine 的索引與端點說明
- 效能：Lighthouse 100（Performance/SEO/Best Practices/Accessibility）

## 5. AI SEO（GEO/AEO/LLMO）

- Answer Engine Optimization：FAQ/QA 可引用段落 + 結構化 FAQPage
- LLMO：提供 llms.txt 與 JSON API（/api/answers.json）可直接擷取遊戲簡述、玩法、亮點、FAQ
- GEO：建立「可引用」「可驗證」「可重複」的內容模塊，並在部落格提供參考來源與程式碼片段（技術讀者）

## 6. 量化與門檻

- Lighthouse：四項維度皆 100
- Search Console：主要關鍵字 CTR ≥ 15%，前 10 名關鍵字 ≥ 20 組（滾動達成）
- 反向連結：高相關 Ref.domains ≥ 20（白帽）
- 跳出率：首頁 < 35%（以 Analytics 追蹤）

## 7. 執行節奏（簡）

- W1：技術資產 + 內容 MVP + 提交索引
- W2：長尾集群 1 + AEO/LLMO + 初步外鏈
- W3：長尾集群 2 + 媒體/社群 + 效能壓測
- W4：回顧排名/內容擴充 + 外鏈拓展 + 轉化優化

