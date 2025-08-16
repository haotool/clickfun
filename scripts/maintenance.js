#!/usr/bin/env node

/**
 * Click Fun 專案維護監控腳本
 * 監控系統狀態並提供維護建議
 */

const fs = require('fs');
const _path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Click Fun 專案維護監控開始...\n');

// 檢查專案健康狀態
function checkProjectHealth() {
  console.log('1️⃣ 檢查專案健康狀態...');

  const healthChecks = [
    { name: 'package.json', path: 'package.json', required: true },
    { name: 'release.config.js', path: 'release.config.js', required: true },
    { name: 'Git Hooks', path: '.husky/pre-commit', required: true },
    {
      name: 'GitHub Actions',
      path: '.github/workflows/release.yml',
      required: true,
    },
    {
      name: '版本管理文檔',
      path: 'docs/VERSION_MANAGEMENT.md',
      required: true,
    },
    { name: 'CHANGELOG', path: 'CHANGELOG.md', required: true },
  ];

  let allHealthy = true;

  healthChecks.forEach(check => {
    if (fs.existsSync(check.path)) {
      console.log(`   ✅ ${check.name}: 正常`);
    } else if (check.required) {
      console.log(`   ❌ ${check.name}: 缺失 (必需)`);
      allHealthy = false;
    } else {
      console.log(`   ⚠️  ${check.name}: 缺失 (可選)`);
    }
  });

  return allHealthy;
}

// 檢查依賴套件狀態
function checkDependencies() {
  console.log('\n2️⃣ 檢查依賴套件狀態...');

  try {
    // 檢查是否有 package-lock.json
    if (fs.existsSync('package-lock.json')) {
      console.log('   ✅ package-lock.json: 存在');
    } else {
      console.log('   ⚠️  package-lock.json: 缺失，建議執行 npm install');
    }

    // 檢查 node_modules
    if (fs.existsSync('node_modules')) {
      console.log('   ✅ node_modules: 存在');
    } else {
      console.log('   ❌ node_modules: 缺失，請執行 npm install');
      return false;
    }

    return true;
  } catch (error) {
    console.error('   ❌ 依賴檢查失敗:', error.message);
    return false;
  }
}

// 檢查版本號一致性
function checkVersionConsistency() {
  console.log('\n3️⃣ 檢查版本號一致性...');

  try {
    execSync('npm run check-version', { stdio: 'pipe' });
    console.log('   ✅ 版本號一致性檢查通過');
    return true;
  } catch (error) {
    console.log('   ❌ 版本號一致性檢查失敗');
    return false;
  }
}

// 檢查 Git 狀態
function checkGitStatus() {
  console.log('\n4️⃣ 檢查 Git 狀態...');

  try {
    // 檢查是否為 Git 倉庫
    if (!fs.existsSync('.git')) {
      console.log('   ⚠️  此目錄不是 Git 倉庫');
      return false;
    }

    // 檢查 Git 狀態
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });

    if (gitStatus.trim() === '') {
      console.log('   ✅ Git 工作區乾淨');
    } else {
      console.log('   ⚠️  Git 工作區有未提交的變更');
      console.log('      建議執行 git add . && git commit -m "chore: 更新專案狀態"');
    }

    return true;
  } catch (error) {
    console.error('   ❌ Git 狀態檢查失敗:', error.message);
    return false;
  }
}

// 檢查 PWA 功能
function checkPWAFunctionality() {
  console.log('\n5️⃣ 檢查 PWA 功能...');

  try {
    execSync('npm run test-pwa', { stdio: 'pipe' });
    console.log('   ✅ PWA 功能測試通過');
    return true;
  } catch (error) {
    console.log('   ❌ PWA 功能測試失敗');
    return false;
  }
}

// 生成維護報告
function generateMaintenanceReport(results) {
  console.log('\n📊 維護監控報告');
  console.log('=' * 50);

  const totalChecks = results.length;
  const passedChecks = results.filter(r => r).length;
  const failedChecks = totalChecks - passedChecks;

  console.log(`總檢查項目: ${totalChecks}`);
  console.log(`通過: ${passedChecks} ✅`);
  console.log(`失敗: ${failedChecks} ❌`);
  console.log(`健康度: ${Math.round((passedChecks / totalChecks) * 100)}%`);

  if (passedChecks === totalChecks) {
    console.log('\n🎉 專案狀態優秀！所有檢查項目均通過！');
  } else {
    console.log('\n⚠️  發現問題，請檢查失敗的項目');
  }
}

// 提供維護建議
function provideMaintenanceSuggestions(results) {
  console.log('\n🔧 維護建議');
  console.log('=' * 30);

  if (!results[0]) {
    // 專案健康檢查失敗
    console.log('1. 檢查缺失的必需檔案');
    console.log('2. 重新執行 npm run setup');
  }

  if (!results[1]) {
    // 依賴檢查失敗
    console.log('1. 執行 npm install 安裝依賴');
    console.log('2. 檢查 package.json 配置');
  }

  if (!results[2]) {
    // 版本號不一致
    console.log('1. 執行 npm run update-version-files');
    console.log('2. 檢查所有檔案的版本號');
  }

  if (!results[3]) {
    // Git 狀態問題
    console.log('1. 提交未保存的變更');
    console.log('2. 檢查 Git 配置');
  }

  if (!results[4]) {
    // PWA 功能問題
    console.log('1. 檢查 Service Worker 配置');
    console.log('2. 驗證版本檢測邏輯');
  }

  // 定期維護建議
  console.log('\n📅 定期維護建議:');
  console.log('• 每週: 檢查 GitHub Actions 執行狀態');
  console.log('• 每月: 更新依賴套件版本');
  console.log('• 每季度: 審查版本管理策略');
  console.log('• 持續: 收集用戶回饋並優化');
}

// 主執行函數
function main() {
  const results = [
    checkProjectHealth(),
    checkDependencies(),
    checkVersionConsistency(),
    checkGitStatus(),
    checkPWAFunctionality(),
  ];

  generateMaintenanceReport(results);
  provideMaintenanceSuggestions(results);

  // 提供快速修復命令
  console.log('\n⚡ 快速修復命令:');
  console.log('npm run setup          # 重新設置專案');
  console.log('npm run check-version  # 檢查版本號一致性');
  console.log('npm run test-pwa       # 測試 PWA 功能');
  console.log('npm install            # 安裝依賴');
  console.log('git add . && git commit -m "chore: 更新專案狀態"  # 提交變更');
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { main };
