#!/usr/bin/env node

/**
 * 專案健康監控腳本
 * 整合依賴安全掃描、版本一致性檢查、程式碼品質監控等功能
 *
 * @author: @s123104
 * @version: 1.0.0
 * @created: 2025-01-27T15:30:00+08:00
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectHealthMonitor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.results = {
      dependencies: { status: 'pending', details: [] },
      versionConsistency: { status: 'pending', details: [] },
      codeQuality: { status: 'pending', details: [] },
      performance: { status: 'pending', details: [] },
      security: { status: 'pending', details: [] }
    };
  }

  /**
   * 執行完整的健康檢查
   */
  async runFullHealthCheck() {
    console.log('🔍 開始專案健康檢查...\n');

    try {
      await this.checkDependencies();
      await this.checkVersionConsistency();
      await this.checkCodeQuality();
      await this.checkPerformance();
      await this.checkSecurity();

      this.generateReport();
      this.provideRecommendations();
    } catch (error) {
      console.error('❌ 健康檢查過程中發生錯誤:', error.message);
      process.exit(1);
    }
  }

  /**
   * 檢查依賴安全性
   */
  async checkDependencies() {
    console.log('📦 檢查依賴安全性...');

    try {
      // 檢查是否有 package-lock.json
      const lockFileExists = fs.existsSync(
        path.join(this.projectRoot, 'package-lock.json')
      );

      if (!lockFileExists) {
        this.results.dependencies.status = 'warning';
        this.results.dependencies.details.push(
          '缺少 package-lock.json，建議執行 npm install'
        );
      }

      // 檢查過期依賴
      try {
        const outdatedOutput = execSync('npm outdated --json', {
          cwd: this.projectRoot,
          encoding: 'utf8'
        });
        const outdated = JSON.parse(outdatedOutput);

        if (Object.keys(outdated).length > 0) {
          this.results.dependencies.status = 'warning';
          this.results.dependencies.details.push(
            `發現 ${Object.keys(outdated).length} 個過期依賴`
          );
        } else {
          this.results.dependencies.status = 'success';
          this.results.dependencies.details.push('所有依賴都是最新版本');
        }
      } catch (error) {
        // npm outdated 返回非零退出碼是正常的
        this.results.dependencies.status = 'success';
        this.results.dependencies.details.push('依賴檢查完成');
      }

      // 檢查安全漏洞
      try {
        const auditOutput = execSync('npm audit --json', {
          cwd: this.projectRoot,
          encoding: 'utf8'
        });
        const audit = JSON.parse(auditOutput);

        if (audit.metadata.vulnerabilities.total > 0) {
          this.results.dependencies.status = 'error';
          this.results.dependencies.details.push(
            `發現 ${audit.metadata.vulnerabilities.total} 個安全漏洞`
          );
        } else {
          this.results.dependencies.details.push('未發現安全漏洞');
        }
      } catch (error) {
        this.results.dependencies.details.push('安全檢查完成');
      }
    } catch (error) {
      this.results.dependencies.status = 'error';
      this.results.dependencies.details.push(`依賴檢查失敗: ${error.message}`);
    }
  }

  /**
   * 檢查版本一致性
   */
  async checkVersionConsistency() {
    console.log('🔍 檢查版本一致性...');

    try {
      const checkVersionOutput = execSync('npm run check-version', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });

      if (checkVersionOutput.includes('✅ 所有檔案版本號檢查通過')) {
        this.results.versionConsistency.status = 'success';
        this.results.versionConsistency.details.push('所有檔案版本號一致');
      } else {
        this.results.versionConsistency.status = 'error';
        this.results.versionConsistency.details.push(
          '版本號不一致，請執行 npm run update-version-files'
        );
      }
    } catch (error) {
      this.results.versionConsistency.status = 'error';
      this.results.versionConsistency.details.push(
        `版本檢查失敗: ${error.message}`
      );
    }
  }

  /**
   * 檢查程式碼品質
   */
  async checkCodeQuality() {
    console.log('📝 檢查程式碼品質...');

    try {
      // 檢查 ESLint 配置
      const eslintConfigExists = fs.existsSync(
        path.join(this.projectRoot, '.eslintrc.js')
      );

      if (eslintConfigExists) {
        try {
          execSync('npx eslint . --ext .js,.jsx,.ts,.tsx', {
            cwd: this.projectRoot,
            stdio: 'pipe'
          });
          this.results.codeQuality.status = 'success';
          this.results.codeQuality.details.push('ESLint 檢查通過');
        } catch (error) {
          this.results.codeQuality.status = 'warning';
          this.results.codeQuality.details.push('ESLint 發現問題，請檢查輸出');
        }
      } else {
        this.results.codeQuality.status = 'warning';
        this.results.codeQuality.details.push('缺少 ESLint 配置');
      }

      // 檢查 Prettier 配置
      const prettierConfigExists = fs.existsSync(
        path.join(this.projectRoot, '.prettierrc')
      );
      if (prettierConfigExists) {
        this.results.codeQuality.details.push('Prettier 配置已設定');
      } else {
        this.results.codeQuality.details.push('建議添加 Prettier 配置');
      }
    } catch (error) {
      this.results.codeQuality.status = 'error';
      this.results.codeQuality.details.push(
        `程式碼品質檢查失敗: ${error.message}`
      );
    }
  }

  /**
   * 檢查效能指標
   */
  async checkPerformance() {
    console.log('⚡ 檢查效能指標...');

    try {
      // 檢查檔案大小
      const indexHtmlPath = path.join(this.projectRoot, 'index.html');
      const indexHtmlStats = fs.statSync(indexHtmlPath);
      const indexHtmlSizeKB = Math.round(indexHtmlStats.size / 1024);

      if (indexHtmlSizeKB > 500) {
        this.results.performance.status = 'warning';
        this.results.performance.details.push(
          `主頁面檔案過大: ${indexHtmlSizeKB}KB`
        );
      } else {
        this.results.performance.status = 'success';
        this.results.performance.details.push(
          `主頁面檔案大小正常: ${indexHtmlSizeKB}KB`
        );
      }

      // 檢查 Service Worker 配置
      const swExists = fs.existsSync(path.join(this.projectRoot, 'sw.js'));
      const swEnhancedExists = fs.existsSync(
        path.join(this.projectRoot, 'sw-enhanced.js')
      );

      if (swExists && swEnhancedExists) {
        this.results.performance.details.push('Service Worker 配置完整');
      } else {
        this.results.performance.status = 'warning';
        this.results.performance.details.push('Service Worker 配置不完整');
      }
    } catch (error) {
      this.results.performance.status = 'error';
      this.results.performance.details.push(`效能檢查失敗: ${error.message}`);
    }
  }

  /**
   * 檢查安全性
   */
  async checkSecurity() {
    console.log('🔒 檢查安全性...');

    try {
      // 檢查 Git Hooks
      const huskyExists = fs.existsSync(path.join(this.projectRoot, '.husky'));
      if (huskyExists) {
        this.results.security.status = 'success';
        this.results.security.details.push('Git Hooks 已配置');
      } else {
        this.results.security.status = 'warning';
        this.results.security.details.push('缺少 Git Hooks 配置');
      }

      // 檢查 .gitignore
      const gitignoreExists = fs.existsSync(
        path.join(this.projectRoot, '.gitignore')
      );
      if (gitignoreExists) {
        this.results.security.details.push('.gitignore 已配置');
      } else {
        this.results.security.status = 'warning';
        this.results.security.details.push('缺少 .gitignore 配置');
      }

      // 檢查敏感資訊
      const sensitivePatterns = [/API_KEY/, /SECRET/, /PASSWORD/, /TOKEN/];

      let hasSensitiveInfo = false;
      const filesToCheck = ['index.html', 'sw.js', 'sw-enhanced.js'];

      for (const file of filesToCheck) {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              hasSensitiveInfo = true;
              break;
            }
          }
        }
      }

      if (hasSensitiveInfo) {
        this.results.security.status = 'error';
        this.results.security.details.push('發現可能的敏感資訊，請檢查');
      } else {
        this.results.security.details.push('未發現明顯的敏感資訊');
      }
    } catch (error) {
      this.results.security.status = 'error';
      this.results.security.details.push(`安全性檢查失敗: ${error.message}`);
    }
  }

  /**
   * 生成健康報告
   */
  generateReport() {
    console.log('\n📊 專案健康檢查報告');
    console.log('='.repeat(50));

    const categories = [
      { key: 'dependencies', name: '依賴管理', icon: '📦' },
      { key: 'versionConsistency', name: '版本一致性', icon: '🔍' },
      { key: 'codeQuality', name: '程式碼品質', icon: '📝' },
      { key: 'performance', name: '效能指標', icon: '⚡' },
      { key: 'security', name: '安全性', icon: '🔒' }
    ];

    let totalScore = 0;
    const maxScore = categories.length * 100;

    categories.forEach(category => {
      const result = this.results[category.key];
      const icon = this.getStatusIcon(result.status);
      const score = this.calculateScore(result.status);
      totalScore += score;

      console.log(`\n${category.icon} ${category.name} ${icon}`);
      console.log(
        `   狀態: ${this.getStatusText(result.status)} (${score}/100)`
      );

      result.details.forEach(detail => {
        console.log(`   • ${detail}`);
      });
    });

    const overallScore = Math.round((totalScore / maxScore) * 100);
    const overallStatus = this.getOverallStatus(overallScore);

    console.log('\n' + '='.repeat(50));
    console.log(
      `🏆 總體健康分數: ${overallScore}/100 ${this.getStatusIcon(overallStatus)}`
    );
    console.log(`📈 專案狀態: ${this.getStatusText(overallStatus)}`);
  }

  /**
   * 提供改進建議
   */
  provideRecommendations() {
    console.log('\n💡 改進建議');
    console.log('='.repeat(30));

    const recommendations = [];

    if (this.results.dependencies.status === 'error') {
      recommendations.push('🔧 執行 npm audit fix 修復安全漏洞');
      recommendations.push('📦 更新過期依賴: npm update');
    }

    if (this.results.versionConsistency.status === 'error') {
      recommendations.push('🔄 執行 npm run update-version-files 同步版本號');
    }

    if (this.results.codeQuality.status === 'warning') {
      recommendations.push('📝 執行 npm run lint 檢查程式碼品質');
      recommendations.push('🎨 執行 npm run format 格式化程式碼');
    }

    if (this.results.performance.status === 'warning') {
      recommendations.push('⚡ 檢查並優化大型檔案');
      recommendations.push('🚀 考慮實作程式碼分割');
    }

    if (this.results.security.status === 'warning') {
      recommendations.push('🔒 配置 Git Hooks 和 .gitignore');
      recommendations.push('🔐 檢查敏感資訊洩露');
    }

    if (recommendations.length === 0) {
      console.log('🎉 專案狀態良好，無需特別改進');
    } else {
      recommendations.forEach(rec => console.log(rec));
    }

    console.log('\n⚡ 快速修復命令:');
    console.log('npm run setup          # 重新設置專案');
    console.log('npm run check-version  # 檢查版本一致性');
    console.log('npm audit fix          # 修復安全漏洞');
    console.log('npm update             # 更新依賴');
  }

  /**
   * 計算分數
   */
  calculateScore(status) {
    const scores = {
      success: 100,
      warning: 70,
      error: 30,
      pending: 0
    };
    return scores[status] || 0;
  }

  /**
   * 獲取狀態圖標
   */
  getStatusIcon(status) {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      pending: '⏳'
    };
    return icons[status] || '❓';
  }

  /**
   * 獲取狀態文字
   */
  getStatusText(status) {
    const texts = {
      success: '優秀',
      warning: '良好',
      error: '需要改進',
      pending: '待檢查'
    };
    return texts[status] || '未知';
  }

  /**
   * 獲取總體狀態
   */
  getOverallStatus(score) {
    if (score >= 90) {
      return 'success';
    }
    if (score >= 70) {
      return 'warning';
    }
    return 'error';
  }
}

// 主執行函數
async function main() {
  const monitor = new ProjectHealthMonitor();
  await monitor.runFullHealthCheck();
}

// 如果直接執行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ 執行失敗:', error);
    process.exit(1);
  });
}

export { ProjectHealthMonitor };
