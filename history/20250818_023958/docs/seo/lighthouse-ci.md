# Lighthouse CI 與性能預算（指引）

## 目標

- Mobile/Desktop 四維度 100 分
- 初始 JS ≤ 130KB（gzip）、CSS ≤ 50KB、首屏影像 ≤ 200KB

## 建議步驟（後續可自動化）

1. 建立 `.lighthouserc.json`（根目錄）與 `lhci` 指令（package.json scripts）
2. 在 CI（GitHub Actions）新增步驟：建置 → 靜態伺服 → 執行 LHCI → 比對門檻
3. 每次發佈前後執行；失敗即阻擋合併

## `.lighthouserc.json` 範例

```
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 1}],
        "categories:accessibility": ["error", {"minScore": 1}],
        "categories:best-practices": ["error", {"minScore": 1}],
        "categories:seo": ["error", {"minScore": 1}]
      }
    }
  }
}
```

