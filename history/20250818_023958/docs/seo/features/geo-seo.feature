# language: zh-TW
@Std
功能: 在地化與 hreflang（GEO）
  作為在地化負責人
  我希望針對 zh-TW 與 en 提供正確語言與地理信號
  以避免重複內容與提升各地 SERP 表現

  背景:
    假設 有 zh-TW 與 en 版本內容

  情境: hreflang 存在且正確
    當 我檢視 head
    那麼 存在 rel="alternate" hreflang="zh-Hant-TW" 與 "en"

  情境: 語言切換與 canonical
    當 我在 zh 頁面
    那麼 canonical 指向 zh 版本；en 頁面 canonical 指向 en 版本

