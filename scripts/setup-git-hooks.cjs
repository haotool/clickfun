#!/usr/bin/env node

/**
 * Git Hooks 設置腳本
 * 防止標籤衝突和不當推送
 * 基於 Context7 semantic-release 最佳實踐
 * 
 * @author s123104  
 * @version 1.0.0
 * @created 2025-08-17T16:35:00+08:00
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOKS_DIR = '.git/hooks';
const HOOKS_TO_SETUP = ['pre-push', 'post-checkout', 'post-merge'];

/**
 * Pre-push hook - 防止推送衝突標籤
 */
const PRE_PUSH_HOOK = `#!/bin/bash
# Pre-push hook - 防止標籤衝突
# 基於 Context7 semantic-release 最佳實踐

set -e

echo "🔍 檢查標籤衝突..."

# 獲取即將推送的標籤
while read local_ref local_sha remote_ref remote_sha
do
    if [[ "$remote_ref" =~ refs/tags/ ]]; then
        tag_name=\${remote_ref#refs/tags/}
        
        # 檢查遠端是否已有此標籤
        if git ls-remote --exit-code --tags origin "\$tag_name" >/dev/null 2>&1; then
            remote_commit=\$(git ls-remote origin "refs/tags/\$tag_name" | cut -f1)
            local_commit=\$(git rev-list -1 "\$tag_name")
            
            if [ "\$remote_commit" != "\$local_commit" ]; then
                echo "❌ 錯誤: 標籤 \$tag_name 在遠端已存在且指向不同提交"
                echo "   本機: \$local_commit"
                echo "   遠端: \$remote_commit"
                echo "   請執行: npm run tag-sync 來修復此問題"
                exit 1
            fi
        fi
    fi
done

echo "✅ 標籤檢查通過"
exit 0
`;

/**
 * Post-checkout hook - 自動同步標籤
 */
const POST_CHECKOUT_HOOK = `#!/bin/bash
# Post-checkout hook - 自動同步標籤
# 基於 Context7 semantic-release 最佳實踐

previous_head=\$1
new_head=\$2
branch_checkout=\$3

# 只在分支切換時執行
if [ "\$branch_checkout" = "1" ]; then
    echo "🔄 自動同步遠端標籤..."
    git fetch --tags --prune --quiet
    echo "✅ 標籤同步完成"
fi
`;

/**
 * Post-merge hook - 合併後檢查標籤
 */
const POST_MERGE_HOOK = `#!/bin/bash
# Post-merge hook - 合併後檢查標籤
# 基於 Context7 semantic-release 最佳實踐

echo "🔍 檢查合併後的標籤狀態..."

# 檢查是否有標籤衝突
if node scripts/tag-sync-check.js --check-only 2>/dev/null; then
    echo "✅ 標籤狀態正常"
else
    echo "⚠️  發現標籤問題，建議執行: npm run tag-sync"
fi
`;

const HOOK_CONTENTS = {
  'pre-push': PRE_PUSH_HOOK,
  'post-checkout': POST_CHECKOUT_HOOK,
  'post-merge': POST_MERGE_HOOK
};

/**
 * 設置 Git Hooks
 */
function setupGitHooks() {
  console.log('🔧 設置 Git Hooks...');

  // 確保 hooks 目錄存在
  if (!fs.existsSync(HOOKS_DIR)) {
    console.error('❌ .git/hooks 目錄不存在，請確保在 Git 倉庫中執行');
    process.exit(1);
  }

  HOOKS_TO_SETUP.forEach(hookName => {
    const hookPath = path.join(HOOKS_DIR, hookName);
    const hookContent = HOOK_CONTENTS[hookName];

    console.log(`📝 設置 ${hookName} hook...`);

    // 備份現有 hook
    if (fs.existsSync(hookPath)) {
      const backupPath = `${hookPath}.backup.${Date.now()}`;
      fs.copyFileSync(hookPath, backupPath);
      console.log(`   📦 現有 hook 已備份到: ${backupPath}`);
    }

    // 寫入新 hook
    fs.writeFileSync(hookPath, hookContent);
    
    // 設置執行權限
    try {
      execSync(`chmod +x "${hookPath}"`);
      console.log(`   ✅ ${hookName} hook 設置完成`);
    } catch (error) {
      console.error(`   ❌ 設置執行權限失敗: ${error.message}`);
    }
  });

  console.log('🎉 Git Hooks 設置完成！');
  console.log('');
  console.log('設置的 Hooks:');
  console.log('  - pre-push: 防止推送衝突標籤');
  console.log('  - post-checkout: 自動同步遠端標籤');  
  console.log('  - post-merge: 合併後檢查標籤狀態');
}

/**
 * 移除 Git Hooks
 */
function removeGitHooks() {
  console.log('🗑️  移除 Git Hooks...');

  HOOKS_TO_SETUP.forEach(hookName => {
    const hookPath = path.join(HOOKS_DIR, hookName);
    
    if (fs.existsSync(hookPath)) {
      fs.unlinkSync(hookPath);
      console.log(`   ✅ 已移除 ${hookName} hook`);
    }
  });

  console.log('🎉 Git Hooks 移除完成！');
}

/**
 * 檢查 Hooks 狀態
 */
function checkHooksStatus() {
  console.log('🔍 檢查 Git Hooks 狀態...');
  
  HOOKS_TO_SETUP.forEach(hookName => {
    const hookPath = path.join(HOOKS_DIR, hookName);
    const exists = fs.existsSync(hookPath);
    const status = exists ? '✅ 已安裝' : '❌ 未安裝';
    console.log(`  ${hookName}: ${status}`);
  });
}

// 主程序
const command = process.argv[2];

switch (command) {
  case 'install':
  case 'setup':
    setupGitHooks();
    break;
  case 'remove':
  case 'uninstall':
    removeGitHooks();
    break;
  case 'status':
  case 'check':
    checkHooksStatus();
    break;
  default:
    console.log('Git Hooks 管理工具');
    console.log('');
    console.log('用法:');
    console.log('  node scripts/setup-git-hooks.js [命令]');
    console.log('');
    console.log('命令:');
    console.log('  install, setup    安裝 Git Hooks');
    console.log('  remove, uninstall 移除 Git Hooks');
    console.log('  status, check     檢查 Hooks 狀態');
    break;
}
