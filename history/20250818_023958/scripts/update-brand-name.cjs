#!/usr/bin/env node

/**
 * 批量更新品牌名稱：ClickFun → Click Fun
 * 執行時間：2025-08-17T02:24:38+08:00
 * 負責人：鐵漢阿強 (Iron Man Strong)
 * 
 * 排除目錄：node_modules, .git, dist, build, coverage
 * 排除文件：二進制文件、圖片、字體等
 */

const fs = require('fs');
const path = require('path');

// 需要更新的檔案副檔名
const SUPPORTED_EXTENSIONS = [
  '.html', '.js', '.ts', '.jsx', '.tsx', '.vue', 
  '.css', '.scss', '.sass', '.less',
  '.json', '.md', '.txt', '.xml', '.yml', '.yaml',
  '.php', '.py', '.java', '.go', '.rs', '.rb',
  '.sh', '.bat', '.ps1'
];

// 排除的目錄
const EXCLUDED_DIRS = [
  'node_modules', '.git', 'dist', 'build', 'coverage', 
  '.next', '.nuxt', 'vendor', 'target', 'bin', 'obj',
  '.idea', '.vscode', '__pycache__', '.pytest_cache'
];

// 排除的檔案
const EXCLUDED_FILES = [
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.gitignore', '.gitattributes', 'LICENSE', 'CHANGELOG.md'
];

// 更新規則
const UPDATE_RULES = [
  // 基本品牌名稱更新
  { from: /ClickFun/g, to: 'Click Fun' },
  
  // 特殊情況保持不變（檔案名、目錄名、技術標識符等）
  // 這些規則用於回復不應該被更改的情況
];

// 應該保持 ClickFun 的特殊情況（不更新的模式）
const KEEP_CLICKFUN_PATTERNS = [
  // URL 路徑和檔案名
  /\/clickfun\//g,
  /clickfun\./g,
  /clickfun-/g,
  /clickfun_/g,
  // GitHub repository name
  /github\.com\/[^\/]*\/clickfun/g,
  // JavaScript 變數和函數名
  /const\s+clickfun/g,
  /let\s+clickfun/g,
  /var\s+clickfun/g,
  /function\s+clickfun/g,
  // CSS class names and IDs
  /\.clickfun/g,
  /#clickfun/g,
];

let totalFiles = 0;
let updatedFiles = 0;
let totalReplacements = 0;

/**
 * 檢查是否為支援的檔案類型
 */
function isSupportedFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * 檢查是否為排除的目錄
 */
function isExcludedDir(dirName) {
  return EXCLUDED_DIRS.includes(dirName);
}

/**
 * 檢查是否為排除的檔案
 */
function isExcludedFile(fileName) {
  return EXCLUDED_FILES.includes(fileName);
}

/**
 * 更新檔案內容
 */
function updateFileContent(filePath, content) {
  let updatedContent = content;
  let fileReplacements = 0;
  
  // 先保存應該保持 ClickFun 的內容
  const protectedContent = {};
  let protectedIndex = 0;
  
  for (const pattern of KEEP_CLICKFUN_PATTERNS) {
    updatedContent = updatedContent.replace(pattern, (match) => {
      const placeholder = `__PROTECTED_${protectedIndex}__`;
      protectedContent[placeholder] = match;
      protectedIndex++;
      return placeholder;
    });
  }
  
  // 執行基本替換
  for (const rule of UPDATE_RULES) {
    const matches = updatedContent.match(rule.from);
    if (matches) {
      fileReplacements += matches.length;
      updatedContent = updatedContent.replace(rule.from, rule.to);
    }
  }
  
  // 恢復受保護的內容
  for (const [placeholder, originalContent] of Object.entries(protectedContent)) {
    updatedContent = updatedContent.replace(placeholder, originalContent);
  }
  
  return { content: updatedContent, replacements: fileReplacements };
}

/**
 * 處理單個檔案
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: updatedContent, replacements } = updateFileContent(filePath, content);
    
    if (replacements > 0) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ 更新 ${filePath} (${replacements} 個替換)`);
      updatedFiles++;
      totalReplacements += replacements;
    }
    
    totalFiles++;
  } catch (error) {
    if (error.code !== 'EISDIR') {
      console.warn(`⚠️  無法處理檔案 ${filePath}: ${error.message}`);
    }
  }
}

/**
 * 遞歸處理目錄
 */
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        if (!isExcludedDir(item)) {
          processDirectory(itemPath);
        }
      } else if (stat.isFile()) {
        if (isSupportedFile(itemPath) && !isExcludedFile(item)) {
          processFile(itemPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  無法讀取目錄 ${dirPath}: ${error.message}`);
  }
}

/**
 * 主函數
 */
function main() {
  console.log('🚀 開始批量更新品牌名稱：ClickFun → Click Fun');
  console.log('📁 掃描目錄：', process.cwd());
  console.log('');
  
  const startTime = Date.now();
  
  // 從當前目錄開始處理
  processDirectory(process.cwd());
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('');
  console.log('📊 更新完成統計：');
  console.log(`   • 掃描檔案：${totalFiles} 個`);
  console.log(`   • 更新檔案：${updatedFiles} 個`);
  console.log(`   • 總替換數：${totalReplacements} 個`);
  console.log(`   • 執行時間：${duration.toFixed(2)} 秒`);
  
  if (updatedFiles > 0) {
    console.log('');
    console.log('✨ 品牌名稱更新完成！請檢查更改並提交到 Git。');
  } else {
    console.log('');
    console.log('ℹ️  沒有找到需要更新的內容。');
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { updateFileContent, SUPPORTED_EXTENSIONS, EXCLUDED_DIRS };
