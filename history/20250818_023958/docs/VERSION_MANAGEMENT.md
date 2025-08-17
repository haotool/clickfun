# 📋 版本管理最佳實踐

本專案採用業界標準的語義化版本控制和自動化版本管理系統，確保版本號的一致性和可追蹤性。

## 🎯 版本號規範

### 語義化版本控制 2.0.0

版本號格式：`MAJOR.MINOR.PATCH`

- **MAJOR** (主版本號): 不相容的 API 修改
- **MINOR** (次版本號): 向下相容的功能性新增
- **PATCH** (修訂版本號): 向下相容的問題修正

### 版本號範例

```
7.0.0 → 7.0.1  (修訂版本 - 錯誤修復)
7.0.1 → 7.1.0  (次版本 - 新功能)
7.1.0 → 8.0.0  (主版本 - 破壞性變更)
```

## 🚀 自動化版本管理

### 快速版本更新

```bash
# 修訂版本 (7.0.0 → 7.0.1)
npm run version:patch

# 次版本 (7.0.0 → 7.1.0)
npm run version:minor

# 主版本 (7.0.0 → 8.0.0)
npm run version:major
```

### 版本號檢查

```bash
# 檢查所有檔案版本號一致性
npm run check-version

# 手動更新所有檔案版本號
npm run update-version-files
```

### 自動發布

```bash
# 執行完整發布流程
npm run release
```

## 📝 提交訊息規範

### 提交類型

| 類型               | 說明                     | 版本影響 |
| ------------------ | ------------------------ | -------- |
| `feat:`            | 新功能                   | MINOR    |
| `fix:`             | 錯誤修復                 | PATCH    |
| `docs:`            | 文檔更新                 | PATCH    |
| `style:`           | 程式碼格式調整           | PATCH    |
| `refactor:`        | 程式碼重構               | PATCH    |
| `perf:`            | 效能改善                 | PATCH    |
| `test:`            | 測試相關                 | PATCH    |
| `chore:`           | 建置程序或輔助工具的變動 | PATCH    |
| `BREAKING CHANGE:` | 破壞性變更               | MAJOR    |

### 提交訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交訊息範例

```bash
# 新功能
feat(game): 新增雙人對戰模式

# 錯誤修復
fix(ui): 修復手機版按鈕響應問題

# 破壞性變更
feat(api): 重構遊戲狀態管理

BREAKING CHANGE: GameState 物件結構已變更

# 文檔更新
docs: 更新版本管理說明
```

## 🔧 技術實現

### 核心工具

- **semantic-release**: 自動化版本管理和發布
- **Husky**: Git Hooks 管理
- **Conventional Commits**: 標準化提交訊息規範

### 自動化腳本

- **`scripts/update-version.js`**: 自動更新所有檔案版本號
- **`scripts/check-version.js`**: 檢查版本號一致性
- **`.husky/pre-commit`**: 提交前版本號檢查

### CI/CD 整合

- **GitHub Actions**: 自動發布工作流程
- **版本檢查**: 每次提交自動檢查版本號一致性
- **自動發布**: 符合規範的提交自動觸發發布

## 📊 版本號追蹤

### 需要同步的檔案

- `package.json` - 主要版本號來源
- `index.html` - APP_VERSION 常數
- `sw.js` - Service Worker 版本號
- `sw-enhanced.js` - 增強版 Service Worker 版本號
- `app.webmanifest` - PWA 清單版本號
- `README.md` - 版本徽章和說明
- `CHANGELOG.md` - 變更記錄

### 版本號檢查流程

1. **提交前檢查**: Husky pre-commit hook 自動檢查
2. **手動檢查**: 執行 `npm run check-version`
3. **CI 檢查**: GitHub Actions 自動檢查
4. **發布檢查**: semantic-release 發布前檢查

## 🎮 PWA 版本管理

### 版本檢測機制

- **Service Worker**: 自動檢測新版本
- **快取管理**: 版本更新時自動清理舊快取
- **用戶提示**: 檢測到更新時顯示可愛的粉藍色提示

### 自動更新流程

1. 用戶開啟應用程式
2. 檢查本地儲存的版本號
3. 與當前版本比較
4. 發現更新時顯示提示
5. 自動清理舊快取
6. 重新載入應用程式

## 🚨 常見問題

### 版本號不一致

```bash
# 檢查問題
npm run check-version

# 修復問題
npm run update-version-files
```

### 提交被拒絕

檢查提交訊息是否符合規範：

```bash
# 正確格式
feat: 新增遊戲功能

# 錯誤格式
add new feature
```

### 版本更新失敗

```bash
# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install

# 重新執行版本更新
npm run version:patch
```

## 📚 相關資源

- [語義化版本控制 2.0.0](https://semver.org/lang/zh-TW/)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hant/)
- [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)
- [Husky Git Hooks](https://typicode.github.io/husky/)

## 🔄 版本管理流程圖

```
開發 → 提交 → 檢查 → 發布 → 部署
  ↓      ↓      ↓      ↓      ↓
編寫  遵循規範  自動檢查  自動發布  自動部署
程式   提交訊息  版本一致性  版本號  新版本
```

---

**注意**: 請嚴格遵循提交訊息規範，確保自動化版本管理系統正常運作。
