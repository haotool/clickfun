#!/usr/bin/env node

/**
 * 版本號一致性檢查腳本
 * 檢查專案中所有檔案的版本號是否與 package.json 一致
 */

const fs = require('fs');
const path = require('path');

// 讀取 package.json 中的版本號
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const expectedVersion = packageJson.version;

console.log('🔍 檢查版本號一致性...');
console.log(`📦 預期版本: v${expectedVersion}\n`);

// 需要檢查版本號的檔案列表
const filesToCheck = [
  {
    path: 'index.html',
    patterns: [{ name: 'APP_VERSION', regex: /const APP_VERSION = '([^']+)'/ }],
  },
  {
    path: 'sw.js',
    patterns: [
      { name: 'SW_VERSION', regex: /const SW_VERSION = 'clickfun-v([^']+)'/ },
      { name: 'APP_VERSION', regex: /const APP_VERSION = '([^']+)'/ },
    ],
  },
  {
    path: 'sw-enhanced.js',
    patterns: [{ name: 'APP_VERSION', regex: /const APP_VERSION = '([^']+)'/ }],
  },
  {
    path: 'app.webmanifest',
    patterns: [{ name: 'version', regex: /"version": "([^"]+)"/ }],
  },
  {
    path: 'README.md',
    patterns: [
      {
        name: 'Version Badge',
        regex:
          /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/Version-v([^)]+)-ff69b4\.svg\)\]\(\.\)/,
      },
    ],
  },
];

// 檢查檔案版本號
function checkFileVersion(filePath, patterns) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ 檔案不存在: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    let allMatch = true;

    patterns.forEach(pattern => {
      const match = content.match(pattern.regex);
      if (match) {
        const foundVersion = match[1];
        if (foundVersion === expectedVersion) {
          console.log(`✅ ${filePath} - ${pattern.name}: v${foundVersion}`);
        } else {
          console.log(
            `❌ ${filePath} - ${pattern.name}: v${foundVersion} (預期: v${expectedVersion})`
          );
          allMatch = false;
        }
      } else {
        console.log(`⚠️  ${filePath} - ${pattern.name}: 未找到`);
        allMatch = false;
      }
    });

    return allMatch;
  } catch (error) {
    console.error(`❌ 檢查失敗: ${filePath}`, error.message);
    return false;
  }
}

// 檢查 CHANGELOG.md 是否包含最新版本
function checkChangelog() {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    console.log('❌ CHANGELOG.md 不存在');
    return false;
  }

  try {
    const content = fs.readFileSync(changelogPath, 'utf8');
    const versionHeader = `## [${expectedVersion}]`;

    if (content.includes(versionHeader)) {
      console.log(`✅ CHANGELOG.md: 包含版本 v${expectedVersion}`);
      return true;
    } else {
      console.log(`❌ CHANGELOG.md: 缺少版本 v${expectedVersion}`);
      return false;
    }
  } catch (error) {
    console.error('❌ 檢查 CHANGELOG.md 失敗:', error.message);
    return false;
  }
}

// 主執行函數
function main() {
  let allFilesMatch = true;

  // 檢查所有檔案
  filesToCheck.forEach(file => {
    if (!checkFileVersion(file.path, file.patterns)) {
      allFilesMatch = false;
    }
  });

  console.log('');

  // 檢查 CHANGELOG.md
  if (!checkChangelog()) {
    allFilesMatch = false;
  }

  console.log('');

  if (allFilesMatch) {
    console.log('🎉 所有檔案版本號檢查通過！');
    console.log(`🔖 版本: v${expectedVersion}`);
  } else {
    console.log('❌ 發現版本號不一致的問題！');
    console.log('💡 請執行以下命令來修復：');
    console.log('   npm run update-version-files');
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { checkFileVersion, checkChangelog };
