# language: zh-TW
@MVP
功能: 核心與長尾關鍵字可見性
  作為產品擁有者
  我希望核心與長尾關鍵字能被正確索引並獲得高點擊率
  以便快速取得自然流量與品牌認知

  背景:
    假設 站點已部署且 sitemap.xml 已提交

  @MVP
  情境: 核心關鍵字出現於標題與首頁首屏
    當 我打開 首頁
    那麼 我可以在 <title> 與 H1 中看到「點擊遊戲 Click Fun」
    而且 首屏內容包含「clickfun / Click Fun / 點擊遊戲」語意變體

  @Std
  情境大綱: 主要與長尾關鍵字具備專屬落地頁或段落
    假設 存在可索引頁面 <path>
    當 搜尋字詞為 <keyword>
    那麼 該頁應具備對應 H1、語意段落與內外部連結
    而且 頁面 meta description 含主要詞與 CTA
    例子:
      | keyword                 | path               |
      | 點擊遊戲               | /                  |
      | Click Fun              | /                  |
      | clickfun               | /                  |
      | Clicker Game           | /k/clicker-game    |
      | Idle Clicker           | /k/idle-clicker    |
      | 點擊放置遊戲           | /k/click-idle-zh   |
      | 瀏覽器點擊遊戲         | /k/browser-clicker |

  @AI
  情境: FAQ 與 answers.json 可被 LLM 準確擷取
    假設 存在 /faq 與 /api/answers.json
    當 LLM 擷取「Click Fun 是什麼？」
    那麼 可獲得 1–2 句清楚定義與引導連結（可引用段落）

