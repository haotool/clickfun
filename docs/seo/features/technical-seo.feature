# language: zh-TW
@MVP @Perf
功能: 技術 SEO 與索引可見性
  為了讓搜尋與 AI 引擎正確理解並索引
  作為開發者
  我需要完整且正確的技術資產

  背景:
    假設 專案根目錄含 index.html 與 PWA 資產

  情境: robots.txt 與 sitemap.xml 可用
    當 我存取 /robots.txt 與 /sitemap.xml
    那麼 皆回應 200 並包含對應路徑

  情境: JSON-LD 結構化資料完整
    當 我檢視首頁 HTML head
    那麼 存在 WebSite 與 SoftwareApplication 的 JSON-LD
    而且 FAQPage 於 /faq 提供問答

  情境: PWA 與快取策略
    當 瀏覽器安裝 PWA
    那麼 manifest 與 service worker 生效且離線可存取首頁

  情境: hreflang 與語言宣告
    當 我檢視 head
    那麼 存在 zh-Hant-TW 與 en 的 hreflang 連結

  @Perf
  情境: Lighthouse 門檻
    當 執行 Lighthouse（Mobile/Desktop）
    那麼 Performance/Best Practices/SEO/Accessibility 皆為 100

