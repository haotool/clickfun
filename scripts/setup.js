#!/usr/bin/env node

/**
 * ClickFun 專案設置腳本
 * 自動安裝依賴並設置 Git Hooks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ClickFun 專案設置開始...\n');

// 檢查 Node.js 版本
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion < 18) {
    console.error('❌ 錯誤: 需要 Node.js 18.0.0 或更高版本');
    console.error(`   當前版本: ${nodeVersion}`);
    console.error('   請升級 Node.js 後重新執行此腳本');
    process.exit(1);
  }

  console.log(`✅ Node.js 版本檢查通過: ${nodeVersion}`);
}

// 安裝依賴
function installDependencies() {
  console.log('\n📦 安裝專案依賴...');

  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 依賴安裝完成');
  } catch (error) {
    console.error('❌ 依賴安裝失敗:', error.message);
    process.exit(1);
  }
}

// 設置 Git Hooks
function setupGitHooks() {
  console.log('\n🔧 設置 Git Hooks...');

  try {
    // 檢查是否為 Git 倉庫
    if (!fs.existsSync('.git')) {
      console.log('⚠️  警告: 此目錄不是 Git 倉庫');
      console.log('   請先執行: git init');
      return;
    }

    // 安裝 Husky
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('✅ Husky 設置完成');

    // 設置 pre-commit hook
    if (!fs.existsSync('.husky/pre-commit')) {
      execSync('npx husky add .husky/pre-commit "npm run check-version"', {
        stdio: 'inherit',
      });
      console.log('✅ Pre-commit hook 設置完成');
    }
  } catch (error) {
    console.error('❌ Git Hooks 設置失敗:', error.message);
    console.log('   請手動執行: npx husky install');
  }
}

// 檢查版本號一致性
function checkVersionConsistency() {
  console.log('\n🔍 檢查版本號一致性...');

  try {
    execSync('npm run check-version', { stdio: 'inherit' });
    console.log('✅ 版本號檢查通過');
  } catch (error) {
    console.error('❌ 版本號檢查失敗:', error.message);
    console.log('   請執行: npm run update-version-files');
  }
}

// 顯示完成訊息
function showCompletionMessage() {
  console.log('\n🎉 ClickFun 專案設置完成！');
  console.log('\n📋 可用的命令:');
  console.log('   npm start          - 啟動開發伺服器');
  console.log('   npm run check-version    - 檢查版本號一致性');
  console.log('   npm run update-version-files - 更新所有檔案版本號');
  console.log('   npm run version:patch     - 更新修訂版本');
  console.log('   npm run version:minor     - 更新次版本');
  console.log('   npm run version:major     - 更新主版本');
  console.log('   npm run release           - 執行自動發布');

  console.log('\n📚 相關文檔:');
  console.log('   docs/VERSION_MANAGEMENT.md - 版本管理最佳實踐');
  console.log('   CHANGELOG.md              - 變更記錄');

  console.log('\n🚀 開始開發吧！');
}

// 主執行函數
function main() {
  try {
    checkNodeVersion();
    installDependencies();
    setupGitHooks();
    checkVersionConsistency();
    showCompletionMessage();
  } catch (error) {
    console.error('❌ 設置過程中發生錯誤:', error.message);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = {
  checkNodeVersion,
  installDependencies,
  setupGitHooks,
  checkVersionConsistency,
};
