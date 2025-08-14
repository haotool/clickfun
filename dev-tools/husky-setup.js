/**
 * Husky Git Hooks 設定腳本
 * 自動設定 pre-commit 和 commit-msg hooks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HuskySetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.huskyDir = path.join(this.projectRoot, '.husky');
  }

  async setup() {
    console.log('🐕 設定 Husky Git Hooks...');

    try {
      // 建立 .husky 目錄
      if (!fs.existsSync(this.huskyDir)) {
        fs.mkdirSync(this.huskyDir, { recursive: true });
      }

      // 建立 pre-commit hook
      this.createPreCommitHook();

      // 建立 commit-msg hook
      this.createCommitMsgHook();

      // 建立 pre-push hook
      this.createPrePushHook();

      console.log('✅ Husky Git Hooks 設定完成！');
    } catch (error) {
      console.error('❌ Husky 設定失敗:', error.message);
      throw error;
    }
  }

  createPreCommitHook() {
    const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 執行 pre-commit 檢查..."

# 檢查是否在 dev-tools 目錄
if [ ! -d "dev-tools" ]; then
  echo "❌ 找不到 dev-tools 目錄"
  exit 1
fi

cd dev-tools

# 安裝依賴（如果需要）
if [ ! -d "node_modules" ]; then
  echo "📦 安裝開發依賴..."
  npm install
fi

# 執行 ESLint 檢查
echo "🔍 執行 ESLint 檢查..."
npm run lint:check || {
  echo "❌ ESLint 檢查失敗，請修復錯誤後再提交"
  exit 1
}

# 執行 Prettier 格式檢查
echo "💅 執行 Prettier 格式檢查..."
npm run format:check || {
  echo "❌ 程式碼格式不符合規範，執行 'npm run format' 修復"
  exit 1
}

# 執行基本測試
echo "🧪 執行基本測試..."
npm run test:quick || {
  echo "❌ 基本測試失敗，請修復後再提交"
  exit 1
}

echo "✅ Pre-commit 檢查通過！"
`;

    const preCommitPath = path.join(this.huskyDir, 'pre-commit');
    fs.writeFileSync(preCommitPath, preCommitContent);
    fs.chmodSync(preCommitPath, '755');

    console.log('📝 建立 pre-commit hook');
  }

  createCommitMsgHook() {
    const commitMsgContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📝 檢查 commit 訊息格式..."

# 讀取 commit 訊息
commit_msg=$(cat $1)

# 檢查 commit 訊息格式
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}"; then
  echo "❌ Commit 訊息格式不正確！"
  echo ""
  echo "正確格式："
  echo "  <類型>(<範圍>): <簡短描述>"
  echo ""
  echo "範例："
  echo "  feat(遊戲): 新增雙人對戰模式"
  echo "  fix(動畫): 修復閃電效果在 Safari 上的問題"
  echo "  docs(README): 更新安裝說明"
  echo ""
  echo "支援的類型："
  echo "  feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
  echo ""
  exit 1
fi

# 檢查標題長度
title_length=$(echo "$commit_msg" | head -n1 | wc -c)
if [ $title_length -gt 72 ]; then
  echo "❌ Commit 訊息標題過長（超過 72 字元）"
  echo "當前長度: $title_length 字元"
  exit 1
fi

echo "✅ Commit 訊息格式正確！"
`;

    const commitMsgPath = path.join(this.huskyDir, 'commit-msg');
    fs.writeFileSync(commitMsgPath, commitMsgContent);
    fs.chmodSync(commitMsgPath, '755');

    console.log('📝 建立 commit-msg hook');
  }

  createPrePushHook() {
    const prePushContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 執行 pre-push 檢查..."

cd dev-tools

# 執行完整測試套件
echo "🧪 執行完整測試套件..."
npm test || {
  echo "❌ 測試失敗，無法推送"
  exit 1
}

# 檢查測試覆蓋率
echo "📊 檢查測試覆蓋率..."
npm run test:coverage || {
  echo "❌ 測試覆蓋率不足，無法推送"
  exit 1
}

echo "✅ Pre-push 檢查通過！"
`;

    const prePushPath = path.join(this.huskyDir, 'pre-push');
    fs.writeFileSync(prePushPath, prePushContent);
    fs.chmodSync(prePushPath, '755');

    console.log('📝 建立 pre-push hook');
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  const setup = new HuskySetup();
  setup.setup().catch(console.error);
}

module.exports = HuskySetup;
