#!/usr/bin/env node

/**
 * 版本號自動更新腳本
 * 根據 package.json 中的版本號，自動更新專案中所有相關檔案的版本號
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 獲取 __dirname 的 ES 模組等效
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取 package.json 中的版本號
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

console.log(`🔄 開始更新版本號至 v${newVersion}...`);

// 需要更新版本號的檔案列表
const filesToUpdate = [
  {
    path: 'index.html',
    patterns: [
      {
        regex: /"softwareVersion": "[\d.]+"/g,
        replacement: `"softwareVersion": "${newVersion}"`,
      },
      {
        regex: /"version": "[\d.]+"/g,
        replacement: `"version": "${newVersion}"`,
      },
      {
        regex: />\s*v[\d.]+\s*</g,
        replacement: `>v${newVersion}<`,
      },
      {
        regex: /const APP_VERSION = '[\d.]+';/g,
        replacement: `const APP_VERSION = '${newVersion}';`,
      },
    ],
  },
  {
    path: 'sw.js',
    patterns: [
      {
        regex: /const SW_VERSION = 'clickfun-v[\d.]+';/,
        replacement: `const SW_VERSION = 'clickfun-v${newVersion}';`,
      },
      {
        regex: /const APP_VERSION = '[\d.]+';/,
        replacement: `const APP_VERSION = '${newVersion}';`,
      },
    ],
  },
  {
    path: 'sw-enhanced.js',
    patterns: [
      {
        regex: /const APP_VERSION = '[\d.]+';/,
        replacement: `const APP_VERSION = '${newVersion}';`,
      },
    ],
  },
  {
    path: 'app.webmanifest',
    patterns: [
      {
        regex: /"version": "[\d.]+"/,
        replacement: `"version": "${newVersion}"`,
      },
    ],
  },
  {
    path: 'README.md',
    patterns: [
      {
        regex:
          /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/Version-v[\d.]+-ff69b4\.svg\)\]\(\.\)/,
        replacement: `[![Version](https://img.shields.io/badge/Version-v${newVersion}-ff69b4.svg)](.)`,
      },
    ],
  },
  {
    path: 'dev-tools/package.json',
    patterns: [
      {
        regex: /"version": "[\d.]+"/,
        replacement: `"version": "${newVersion}"`,
      },
    ],
  },
  {
    path: 'dev-tools/clear-cache.js',
    patterns: [
      {
        regex: /'clickfun-v[\d.]+'/g,
        replacement: `'clickfun-v${newVersion}'`,
      },
    ],
  },
  {
    path: 'dev-tools/cache-test.html',
    patterns: [
      {
        regex: /const APP_VERSION = '[\d.]+';/,
        replacement: `const APP_VERSION = '${newVersion}';`,
      },
      {
        regex: /'clickfun-v[\d.]+'/g,
        replacement: `'clickfun-v${newVersion}'`,
      },
    ],
  },
  {
    path: 'dev-tools/test-cache-clear.js',
    patterns: [
      {
        regex: /'clickfun-v[\d.]+'/g,
        replacement: `'clickfun-v${newVersion}'`,
      },
      {
        regex: /const currentVersion = '[\d.]+';/,
        replacement: `const currentVersion = '${newVersion}';`,
      },
    ],
  },
];

// 更新檔案版本號
function updateFileVersion(filePath, patterns) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  檔案不存在: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;

    patterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 已更新: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  無需更新: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 更新失敗: ${filePath}`, error.message);
    return false;
  }
}

// 更新 CHANGELOG.md 的版本號
function updateChangelog() {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    console.log('⚠️  CHANGELOG.md 不存在，跳過更新');
    return;
  }

  try {
    let content = fs.readFileSync(changelogPath, 'utf8');

    // 檢查是否已經有最新版本的記錄
    const versionHeader = `## [${newVersion}]`;
    if (content.includes(versionHeader)) {
      console.log('ℹ️  CHANGELOG.md 已包含最新版本');
      return;
    }

    // 在開頭插入新版本記錄
    const today = new Date().toISOString().split('T')[0];
    const newVersionEntry = `## [${newVersion}] - ${today}

### ✨ 新功能

- 版本號自動化更新系統
- 語義化版本控制
- PWA 自動版本檢測

### 🔧 技術改進

- 整合 semantic-release
- 自動化版本管理
- 統一版本號格式

---

`;

    content = newVersionEntry + content;
    fs.writeFileSync(changelogPath, content, 'utf8');
    console.log('✅ 已更新: CHANGELOG.md');
  } catch (error) {
    console.error('❌ 更新 CHANGELOG.md 失敗:', error.message);
  }
}

// 主執行函數
function main() {
  console.log(`📦 當前版本: v${newVersion}`);

  let updatedCount = 0;

  // 更新所有檔案
  filesToUpdate.forEach(file => {
    if (updateFileVersion(file.path, file.patterns)) {
      updatedCount++;
    }
  });

  // 更新 CHANGELOG.md
  updateChangelog();

  console.log('\n🎉 版本號更新完成！');
  console.log(`📊 總共更新了 ${updatedCount} 個檔案`);
  console.log(`🔖 新版本: v${newVersion}`);

  // 顯示需要手動檢查的檔案
  console.log('\n📝 請檢查以下檔案是否需要手動更新版本號:');
  console.log('   - dev-tools/ 目錄下的測試檔案');
  console.log('   - 其他可能包含版本號的檔案');
}

// 執行主函數
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateFileVersion, updateChangelog };
