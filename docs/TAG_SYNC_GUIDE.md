# Git 標籤同步與衝突防護指南

> 基於 Context7 semantic-release 最佳實踐構建的標籤管理系統

## 🎯 問題描述

在多人協作的 Git 專案中，特別是使用 semantic-release 自動版本管理時，經常會遇到標籤衝突問題：

- **本機與遠端標籤指向不同提交**：導致 semantic-release 失敗
- **孤立標籤**：本機有但不在當前分支歷史中的標籤
- **推送衝突**：推送標籤時與遠端發生衝突

## 🛠️ 解決方案

### 自動化工具

我們提供了三個自動化工具來解決標籤問題：

#### 1. 標籤同步檢查工具

```bash
npm run tag-sync
```

**功能**：
- 檢查本機與遠端標籤差異
- 自動修復衝突標籤
- 清理孤立標籤
- 同步遠端標籤

#### 2. Git Hooks 防護

```bash
# 安裝防護 hooks
npm run git-hooks:install

# 檢查狀態
npm run git-hooks:status

# 移除 hooks
npm run git-hooks:remove
```

**功能**：
- **pre-push**：防止推送衝突標籤
- **post-checkout**：分支切換時自動同步標籤
- **post-merge**：合併後檢查標籤狀態

#### 3. CI 自動檢查

每次 CI 運行時自動執行標籤檢查，確保發布前標籤狀態正確。

## 📚 使用指南

### 日常開發流程

1. **開始開發前**
   ```bash
   git checkout main
   git pull origin main
   npm run tag-sync  # 同步標籤
   ```

2. **推送代碼時**
   - Git hooks 會自動檢查標籤衝突
   - 如有衝突會阻止推送並提示修復

3. **遇到標籤問題時**
   ```bash
   npm run tag-sync  # 自動修復大部分問題
   ```

### 手動標籤管理

如果自動工具無法解決問題，可以手動處理：

#### 刪除衝突標籤

```bash
# 刪除本機標籤
git tag -d <tag-name>

# 刪除遠端標籤 (需要權限)
git push origin --delete <tag-name>

# 重新從遠端獲取
git fetch origin tag <tag-name>
```

#### 檢查標籤狀態

```bash
# 查看標籤指向的提交
git rev-list -1 <tag-name>

# 檢查提交是否在分支歷史中
git branch --contains <commit-hash>

# 比較本機與遠端標籤
git ls-remote --tags origin
```

## 🔍 故障排除

### 常見問題

#### 1. "HTTP 401: Bad credentials"

**原因**：GitHub 認證問題  
**解決**：
```bash
unset GITHUB_TOKEN
gh auth login
```

#### 2. "tag already exists"

**原因**：標籤衝突  
**解決**：
```bash
npm run tag-sync
```

#### 3. "No url found for submodule"

**原因**：Git 子模組配置問題  
**解決**：清理子模組索引並重新添加目錄

### 檢查清單

發生標籤問題時，按順序檢查：

- [ ] 運行 `npm run tag-sync`
- [ ] 檢查 GitHub 認證狀態
- [ ] 確認當前分支是 main
- [ ] 檢查 .git/config 中的遠端設置
- [ ] 確認有推送權限

## 🛡️ 預防措施

### 團隊協作規範

1. **統一工作流程**
   - 使用相同的分支策略
   - 定期同步主分支
   - 避免手動創建版本標籤

2. **工具使用**
   - 安裝 Git hooks：`npm run git-hooks:install`
   - 定期運行標籤檢查：`npm run tag-sync`
   - 使用 semantic-release 自動版本管理

3. **CI/CD 配置**
   - 在 CI 中添加標籤檢查步驟
   - 確保 semantic-release 配置正確
   - 監控 CI 失敗並及時處理

## 📊 工具技術細節

### 標籤同步檢查工具 (tag-sync-check.cjs)

**檢查邏輯**：
1. 獲取本機和遠端標籤列表
2. 對比標籤指向的提交 SHA
3. 識別衝突和孤立標籤
4. 自動修復問題

**安全特性**：
- 只刪除確認為問題的標籤
- 備份重要信息到日誌
- 支持乾運行模式檢查

### Git Hooks 系統

**pre-push hook**：
```bash
# 檢查即將推送的標籤
while read local_ref local_sha remote_ref remote_sha; do
    # 檢查標籤衝突邏輯
done
```

**post-checkout hook**：
- 分支切換時自動同步標籤
- 靜默運行，不干擾用戶操作

### CI 集成

在 GitHub Actions 工作流程中：
1. 品質檢查階段運行標籤檢查
2. 發布前再次確認標籤狀態
3. 確保 semantic-release 有乾淨的標籤環境

## 🔗 相關資源

- [semantic-release 官方文檔](https://semantic-release.gitbook.io/)
- [Git 標籤管理最佳實踐](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [Context7 標籤管理指南](https://context7.example.com/tag-management)

## 📝 更新日誌

- **v1.0.0** (2025-08-17): 初始版本，包含標籤同步工具和 Git hooks
- 基於 Context7 semantic-release 最佳實踐構建
- 支持自動檢測和修復標籤衝突

---

**注意**：此系統是基於 Context7 最佳實踐設計的，確保與 semantic-release 完美配合，為專案提供穩定可靠的版本管理環境。
