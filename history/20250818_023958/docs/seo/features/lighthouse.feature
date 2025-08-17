# language: zh-TW
@Perf
功能: Lighthouse 100 與性能預算
  作為前端工程師
  我希望持續維持 Lighthouse 四維度 100 分
  以保障使用者體驗與搜尋表現

  背景:
    假設 已設置性能預算與資產壓縮

  情境: 性能預算
    當 我審視資產大小
    那麼 初始 JS ≤ 130KB（gzip），CSS ≤ 50KB，總影像 ≤ 200KB 首屏

  情境: Lighthouse 100（Mobile/Desktop）
    當 我在 CI 執行 Lighthouse
    那麼 Performance/SEO/Best Practices/Accessibility 皆為 100

