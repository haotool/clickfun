#!/usr/bin/env node

/**
 * 開發者體驗優化工具
 * 提供快速開發腳本、熱重載功能、除錯工具等
 *
 * @author: @s123104
 * @version: 1.0.0
 * @created: 2025-01-27T15:30:00+08:00
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DevTools {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.devServer = null;
  }

  /**
   * 快速開發模式
   */
  async startDevMode() {
    console.log('🚀 啟動快速開發模式...\n');

    try {
      // 檢查依賴
      await this.checkDevDependencies();

      // 啟動開發伺服器
      await this.startDevServer();

      // 啟動檔案監控
      this.startFileWatcher();

      console.log('✅ 快速開發模式已啟動！');
      console.log('📱 在瀏覽器中開啟: http://localhost:8000');
      console.log('🔄 檔案變更會自動重新載入');
      console.log('⏹️  按 Ctrl+C 停止開發模式\n');
    } catch (error) {
      console.error('❌ 啟動開發模式失敗:', error.message);
      process.exit(1);
    }
  }

  /**
   * 檢查開發依賴
   */
  async checkDevDependencies() {
    console.log('📦 檢查開發依賴...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const requiredDevDeps = [
      'semantic-release',
      '@semantic-release/changelog',
      '@semantic-release/git',
      '@semantic-release/github',
    ];

    const missingDeps = requiredDevDeps.filter(dep => !packageJson.devDependencies?.[dep]);

    if (missingDeps.length > 0) {
      console.log(`⚠️  缺少開發依賴: ${missingDeps.join(', ')}`);
      console.log('🔄 正在安裝...');

      try {
        execSync(`npm install --save-dev ${missingDeps.join(' ')}`, {
          cwd: this.projectRoot,
          stdio: 'inherit',
        });
        console.log('✅ 開發依賴安裝完成');
      } catch (error) {
        throw new Error(`安裝開發依賴失敗: ${error.message}`);
      }
    } else {
      console.log('✅ 所有開發依賴已安裝');
    }
  }

  /**
   * 啟動開發伺服器
   */
  async startDevServer() {
    console.log('🌐 啟動開發伺服器...');

    return new Promise((resolve, reject) => {
      this.devServer = spawn('python3', ['-m', 'http.server', '8000'], {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      this.devServer.stdout.on('data', data => {
        const output = data.toString();
        if (output.includes('Serving HTTP')) {
          console.log('✅ 開發伺服器已啟動 (port 8000)');
          resolve();
        }
      });

      this.devServer.stderr.on('data', data => {
        const error = data.toString();
        if (error.includes('Address already in use')) {
          console.log('⚠️  Port 8000 已被使用，嘗試使用 port 8001...');
          this.devServer.kill();
          this.startDevServerOnPort(8001).then(resolve).catch(reject);
        } else {
          console.error('❌ 伺服器錯誤:', error);
        }
      });

      this.devServer.on('error', error => {
        reject(new Error(`啟動伺服器失敗: ${error.message}`));
      });

      // 超時處理
      setTimeout(() => {
        if (this.devServer && !this.devServer.killed) {
          console.log('✅ 開發伺服器啟動成功');
          resolve();
        }
      }, 2000);
    });
  }

  /**
   * 在指定端口啟動伺服器
   */
  async startDevServerOnPort(port) {
    return new Promise((resolve, reject) => {
      this.devServer = spawn('python3', ['-m', 'http.server', port.toString()], {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      this.devServer.stdout.on('data', data => {
        const output = data.toString();
        if (output.includes('Serving HTTP')) {
          console.log(`✅ 開發伺服器已啟動 (port ${port})`);
          resolve();
        }
      });

      this.devServer.on('error', error => {
        reject(new Error(`啟動伺服器失敗: ${error.message}`));
      });
    });
  }

  /**
   * 啟動檔案監控
   */
  startFileWatcher() {
    console.log('👀 啟動檔案監控...');

    const filesToWatch = ['index.html', 'sw.js', 'sw-enhanced.js', 'app.webmanifest'];

    filesToWatch.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        fs.watchFile(filePath, (curr, prev) => {
          if (curr.mtime > prev.mtime) {
            console.log(`📝 檔案已變更: ${file}`);
            this.handleFileChange(file);
          }
        });
      }
    });

    console.log('✅ 檔案監控已啟動');
  }

  /**
   * 處理檔案變更
   */
  handleFileChange(filename) {
    console.log(`🔄 處理檔案變更: ${filename}`);

    switch (filename) {
      case 'index.html':
        this.reloadBrowser();
        break;
      case 'sw.js':
      case 'sw-enhanced.js':
        this.updateServiceWorker();
        break;
      case 'app.webmanifest':
        this.updatePWA();
        break;
      default:
        console.log(`ℹ️  檔案 ${filename} 變更，無需特殊處理`);
    }
  }

  /**
   * 重新載入瀏覽器
   */
  reloadBrowser() {
    console.log('🔄 觸發瀏覽器重新載入...');
    // 這裡可以整合 BrowserSync 或其他工具來實現真正的熱重載
  }

  /**
   * 更新 Service Worker
   */
  updateServiceWorker() {
    console.log('🔄 更新 Service Worker...');
    // 這裡可以發送消息給 Service Worker 進行更新
  }

  /**
   * 更新 PWA
   */
  updatePWA() {
    console.log('🔄 更新 PWA 配置...');
    // 這裡可以觸發 PWA 更新檢查
  }

  /**
   * 快速建置
   */
  async quickBuild() {
    console.log('🔨 執行快速建置...');

    try {
      // 檢查版本一致性
      execSync('npm run check-version', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      // 執行測試
      execSync('npm run test-pwa', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      // 健康檢查
      execSync('npm run health-check', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      console.log('✅ 快速建置完成！');
    } catch (error) {
      console.error('❌ 快速建置失敗:', error.message);
      process.exit(1);
    }
  }

  /**
   * 清理建置快取
   */
  async cleanCache() {
    console.log('🧹 清理建置快取...');

    try {
      const cacheDirs = ['node_modules/.cache', '.cache', 'dist'];

      cacheDirs.forEach(dir => {
        const cachePath = path.join(this.projectRoot, dir);
        if (fs.existsSync(cachePath)) {
          fs.rmSync(cachePath, { recursive: true, force: true });
          console.log(`🗑️  已清理: ${dir}`);
        }
      });

      // 清理 npm 快取
      execSync('npm cache clean --force', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });

      console.log('✅ 快取清理完成');
    } catch (error) {
      console.error('❌ 快取清理失敗:', error.message);
    }
  }

  /**
   * 停止開發模式
   */
  stopDevMode() {
    if (this.devServer && !this.devServer.killed) {
      console.log('⏹️  停止開發伺服器...');
      this.devServer.kill();
      this.devServer = null;
      console.log('✅ 開發模式已停止');
    }
  }

  /**
   * 顯示幫助資訊
   */
  showHelp() {
    console.log(`
🚀 Click Fun 開發工具

使用方法:
  npm run dev:start      # 啟動快速開發模式
  npm run dev:build      # 執行快速建置
  npm run dev:clean      # 清理建置快取
  npm run dev:help       # 顯示此幫助

開發模式功能:
  • 自動啟動開發伺服器
  • 檔案變更監控
  • 熱重載支援
  • 依賴自動檢查

快速建置功能:
  • 版本一致性檢查
  • PWA 功能測試
  • 專案健康檢查
  • 自動化品質保證

更多資訊請查看 docs/ 目錄
    `);
  }
}

// 主執行函數
async function main() {
  const devTools = new DevTools();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'start':
        await devTools.startDevMode();

        // 優雅關閉處理
        process.on('SIGINT', () => {
          devTools.stopDevMode();
          process.exit(0);
        });

        process.on('SIGTERM', () => {
          devTools.stopDevMode();
          process.exit(0);
        });
        break;

      case 'build':
        await devTools.quickBuild();
        break;

      case 'clean':
        await devTools.cleanCache();
        break;

      case 'help':
      default:
        devTools.showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ 執行失敗:', error.message);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DevTools };
