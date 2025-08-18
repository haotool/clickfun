# 🚀 GitHub Actions 自動發布設置指南

本指南將幫助您設置 Click Fun 專案的 GitHub Actions 自動發布流程。

## 📋 前置需求

1. **GitHub 專案**: 專案必須託管在 GitHub 上
2. **GitHub Token**: 需要 Personal Access Token 或 GitHub App Token
3. **NPM Token** (可選): 如果要發布到 NPM 註冊表

## 🔧 設置步驟

### 步驟 1: 設置 GitHub Secrets

1. 前往您的 GitHub 專案頁面
2. 點擊 `Settings` 標籤
3. 在左側選單中選擇 `Secrets and variables` → `Actions`
4. 點擊 `New repository secret` 添加以下 secrets：

#### 必需的 Secrets

| Secret 名稱    | 說明                    | 獲取方式                   |
| -------------- | ----------------------- | -------------------------- |
| `GITHUB_TOKEN` | GitHub 自動提供的 token | 系統自動生成，無需手動設置 |

#### 可選的 Secrets

| Secret 名稱 | 說明           | 獲取方式          |
| ----------- | -------------- | ----------------- |
| `NPM_TOKEN` | NPM 發布 token | 從 npmjs.com 獲取 |

### 步驟 2: 推送專案到 GitHub

```bash
# 初始化 Git 倉庫（如果還沒有）
git init

# 添加遠端倉庫
git remote add origin https://github.com/username/clickfun.git

# 添加所有檔案
git add .

# 提交變更
git commit -m "feat: 建立專業版本管理系統

- 整合 semantic-release 自動化版本管理
- 實現 PWA 版本檢測和自動更新
- 建立 Git Hooks 和 CI/CD 流程
- 添加完整的文檔和測試腳本"

# 推送到 GitHub
git push -u origin main
```

### 步驟 3: 驗證工作流程

1. 推送程式碼後，前往 `Actions` 標籤
2. 您應該看到 `🚀 自動發布` 工作流程
3. 點擊工作流程查看執行狀態

## 🔄 工作流程觸發

### 自動觸發

- **推送到 main 分支**: 自動執行測試和發布流程
- **手動觸發**: 在 Actions 頁面手動觸發 `workflow_dispatch`

### 觸發條件

工作流程會在以下情況觸發：

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

## 📊 工作流程步驟

### 1. 檢出程式碼

- 使用 `actions/checkout@v4`
- 設置 `fetch-depth: 0` 以獲取完整歷史
- 設置 `persist-credentials: false` 避免權限衝突

### 2. 設定 Node.js

- 使用 `actions/setup-node@v4`
- 自動選擇 LTS 版本
- 啟用 npm 快取

### 3. 安裝依賴

- 執行 `npm ci` 安裝依賴
- 使用 npm 快取提升速度

### 4. 執行測試

- 執行 `npm test` 驗證程式碼
- 確保所有測試通過

### 5. 建置專案

- 執行 `npm run build` 建置專案
- 驗證建置過程無錯誤

### 6. 自動發布

- 使用 `npx semantic-release` 自動發布
- 根據提交訊息自動計算版本號
- 生成 GitHub Release 和變更記錄

### 7. 更新版本號檔案

- 執行 `npm run update-version-files`
- 同步所有檔案的版本號

### 8. 提交版本更新

- 自動提交版本號更新
- 推送到 GitHub 倉庫

## 🎯 提交訊息規範

為了確保自動發布正常工作，請遵循以下提交訊息格式：

### 新功能 (觸發 MINOR 版本更新)

```bash
feat: 新增雙人對戰模式
feat(game): 實現 TPS 計算系統
```

### 錯誤修復 (觸發 PATCH 版本更新)

```bash
fix: 修復手機版按鈕響應問題
fix(ui): 解決版本更新提示顯示問題
```

### 文檔更新 (觸發 PATCH 版本更新)

```bash
docs: 更新版本管理說明
docs(readme): 添加安裝指南
```

### 破壞性變更 (觸發 MAJOR 版本更新)

```bash
feat: 重構遊戲狀態管理系統
BREAKING CHANGE: GameState 物件結構已變更
```

## 🔍 故障排除

### 常見問題

#### 1. 權限錯誤

```
Error: Resource not accessible by integration
```

**解決方案**: 確保 `GITHUB_TOKEN` 有足夠權限

#### 2. 版本號不一致

```
Error: Version numbers do not match
```

**解決方案**: 執行 `npm run update-version-files`

#### 3. 提交訊息格式錯誤

```
Error: Invalid commit message format
```

**解決方案**: 遵循 Conventional Commits 規範

#### 4. 依賴安裝失敗

```
Error: npm install failed
```

**解決方案**: 檢查 `package.json` 和 `package-lock.json`

### 調試步驟

1. **檢查 Actions 日誌**: 查看詳細的錯誤訊息
2. **驗證 Secrets**: 確認所有必要的 secrets 已設置
3. **本地測試**: 執行 `npm run check-version` 檢查版本號
4. **檢查權限**: 確認 GitHub Token 有足夠權限

## 📈 監控和維護

### 定期檢查

- **每週**: 檢查 Actions 執行狀態
- **每月**: 審查發布歷史和版本號
- **每季度**: 更新依賴套件版本

### 效能優化

- **快取策略**: 利用 npm 和 GitHub Actions 快取
- **並行執行**: 優化工作流程步驟順序
- **資源使用**: 監控執行時間和資源消耗

## 🎉 成功指標

### 自動化程度

- ✅ 版本號自動計算和更新
- ✅ 自動生成變更記錄
- ✅ 自動發布 GitHub Release
- ✅ 自動同步所有檔案版本號

### 品質保證

- ✅ 提交前版本號檢查
- ✅ 自動化測試執行
- ✅ 建置驗證
- ✅ 發布前檢查

### 用戶體驗

- ✅ PWA 自動版本檢測
- ✅ 可愛的更新提示
- ✅ 離線支援
- ✅ 中文介面

---

## 📞 技術支援

如果遇到問題，請：

1. 檢查本指南的故障排除部分
2. 查看 GitHub Actions 執行日誌
3. 執行本地測試腳本
4. 提交 GitHub Issue 描述問題

---

**🚀 恭喜！您的專案現在擁有完整的自動化發布流程！**
