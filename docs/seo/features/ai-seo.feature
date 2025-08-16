# language: zh-TW
@AI
功能: AI/Answer 引擎最佳化（AEO/LLMO/GEO）
  作為 AI SEO 負責人
  我希望讓 LLM 與 Answer 引擎能直接擷取正確資訊
  以提高推薦率與可引用性

  背景:
    假設 存在 llms.txt 與 /api/answers.json 端點規格

  情境: llms.txt 可讀且提供端點/政策
    當 我存取 /llms.txt
    那麼 看到 端點說明、FAQ/answers.json、聯絡/政策 連結

  情境: answers.json 結構
    當 我請求 /api/answers.json
    那麼 回應包含：name、short_description、how_to_play、highlights、faq[] 與 canonical_url

  情境: FAQPage 與 JSON API 一致
    當 我比對 /faq 與 answers.json
    那麼 問答標題/摘要一致且可引用

