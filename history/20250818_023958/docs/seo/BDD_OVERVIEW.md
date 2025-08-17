# BDD 規格與落地方式

本專案以 Gherkin 規格描述 SEO 需求，透過「可驗證的敘述」來降低溝通成本與技術債。

## Gherkin 約定

- 語言：繁體中文（必要技術詞保留英文）。
- 標籤：`@MVP`、`@Std`、`@Adv`、`@Ent` 代表階段；`@AI` 代表 AI 搜尋優化；`@Perf` 代表效能。
- 驗收：每個 Scenario 均包含「觀測方式」與「可量化門檻」。

## 映射到落地

- 規格 → 任務：將每個 Scenario 拆解為一或多個開發/內容任務。
- 任務 → 範本：盡量以 templates 中的片段落地，避免重工。
- 驗證 → 工具：Lighthouse、Search Console、Bing WT、結構化資料測試工具等。

## 產出節奏

1. 先滿足 `@MVP`：可索引、可理解（結構化）、可回答（FAQ/QA）。
2. 逐步擴展 `@Std` 與 `@AI`：AEO/LLMO、llms.txt、JSON API 提要。
3. 以 `@Perf` 驗證 Lighthouse 100 與資源預算。

