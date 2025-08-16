#!/usr/bin/env node

/**
 * PWA 版本檢測功能測試腳本
 * 測試版本更新檢測和提示功能
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 PWA 版本檢測功能測試開始...\n');

// 測試版本號一致性
function testVersionConsistency() {
  console.log('1️⃣ 測試版本號一致性...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const currentVersion = packageJson.version;

    // 檢查主要檔案版本號
    const filesToCheck = [
      { path: 'index.html', pattern: /const APP_VERSION = '([^']+)'/ },
      { path: 'sw.js', pattern: /const APP_VERSION = '([^']+)'/ },
      { path: 'app.webmanifest', pattern: /"version": "([^"]+)"/ }
    ];

    let allMatch = true;

    filesToCheck.forEach(file => {
      if (fs.existsSync(file.path)) {
        const content = fs.readFileSync(file.path, 'utf8');
        const match = content.match(file.pattern);

        if (match && match[1] === currentVersion) {
          console.log(`   ✅ ${file.path}: v${match[1]}`);
        } else {
          console.log(`   ❌ ${file.path}: 版本不匹配`);
          allMatch = false;
        }
      }
    });

    if (allMatch) {
      console.log('   🎉 所有檔案版本號一致！');
    } else {
      console.log('   ⚠️  發現版本號不一致問題');
    }

    return allMatch;
  } catch (error) {
    console.error('   ❌ 版本號檢查失敗:', error.message);
    return false;
  }
}

// 測試 Service Worker 配置
function testServiceWorkerConfig() {
  console.log('\n2️⃣ 測試 Service Worker 配置...');

  try {
    const swEnhanced = fs.readFileSync('sw-enhanced.js', 'utf8');

    // 檢查版本檢測邏輯
    const hasVersionCheck = swEnhanced.includes('checkVersionUpdate') ||
                           swEnhanced.includes('VERSION_CHECK');

    // 檢查快取清理邏輯
    const hasCacheCleanup = swEnhanced.includes('clickfun-v') &&
                           swEnhanced.includes('delete');

    if (hasVersionCheck) {
      console.log('   ✅ 版本檢測邏輯已實現');
    } else {
      console.log('   ❌ 版本檢測邏輯缺失');
    }

    if (hasCacheCleanup) {
      console.log('   ✅ 快取清理邏輯已實現');
    } else {
      console.log('   ❌ 快取清理邏輯缺失');
    }

    return hasVersionCheck && hasCacheCleanup;
  } catch (error) {
    console.error('   ❌ Service Worker 檢查失敗:', error.message);
    return false;
  }
}

// 測試版本更新提示樣式
function testVersionUpdateStyles() {
  console.log('\n3️⃣ 測試版本更新提示樣式...');

  try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    // 檢查 CSS 樣式
    const hasToastStyles = indexHtml.includes('.version-update-toast') &&
                           indexHtml.includes('slideInRight') &&
                           indexHtml.includes('bounce');

    // 檢查 JavaScript 函數
    const hasToastFunction = indexHtml.includes('showVersionUpdateToast') &&
                            indexHtml.includes('版本更新檢測到');

    if (hasToastStyles) {
      console.log('   ✅ 版本更新提示樣式已實現');
    } else {
      console.log('   ❌ 版本更新提示樣式缺失');
    }

    if (hasToastFunction) {
      console.log('   ✅ 版本更新提示函數已實現');
    } else {
      console.log('   ❌ 版本更新提示函數缺失');
    }

    return hasToastStyles && hasToastFunction;
  } catch (error) {
    console.error('   ❌ 樣式檢查失敗:', error.message);
    return false;
  }
}

// 測試設定介面版本顯示
function testSettingsVersionDisplay() {
  console.log('\n4️⃣ 測試設定介面版本顯示...');

  try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');

    // 檢查版本顯示區塊
    const hasVersionDisplay = indexHtml.includes('當前版本') &&
                              indexHtml.includes('v${APP_VERSION}');

    if (hasVersionDisplay) {
      console.log('   ✅ 設定介面版本顯示已實現');
    } else {
      console.log('   ❌ 設定介面版本顯示缺失');
    }

    return hasVersionDisplay;
  } catch (error) {
    console.error('   ❌ 設定介面檢查失敗:', error.message);
    return false;
  }
}

// 生成測試報告
function generateTestReport(results) {
  console.log('\n📊 測試報告');
  console.log('=' * 50);

  const totalTests = results.length;
  const passedTests = results.filter(r => r).length;
  const failedTests = totalTests - passedTests;

  console.log(`總測試項目: ${totalTests}`);
  console.log(`通過: ${passedTests} ✅`);
  console.log(`失敗: ${failedTests} ❌`);
  console.log(`成功率: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 所有測試通過！PWA 版本檢測功能完整實現！');
  } else {
    console.log('\n⚠️  發現問題，請檢查失敗的測試項目');
  }
}

// 主測試函數
function runTests() {
  const results = [
    testVersionConsistency(),
    testServiceWorkerConfig(),
    testVersionUpdateStyles(),
    testSettingsVersionDisplay()
  ];

  generateTestReport(results);

  // 提供修復建議
  if (results.includes(false)) {
    console.log('\n🔧 修復建議:');
    console.log('1. 執行 npm run update-version-files 同步版本號');
    console.log('2. 檢查 Service Worker 版本檢測邏輯');
    console.log('3. 驗證版本更新提示樣式');
    console.log('4. 確認設定介面版本顯示');
  }
}

// 執行測試
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
