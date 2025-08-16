#!/usr/bin/env node

/**
 * 程式碼品質檢查腳本
 * 整合 ESLint 和 Prettier 檢查，提供全面的程式碼品質分析
 *
 * @author: @s123104
 * @version: 1.0.0
 * @created: 2025-01-27T15:45:00+08:00
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeQualityChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.results = {
      eslint: { status: 'pending', details: [] },
      prettier: { status: 'pending', details: [] },
      overall: { status: 'pending', score: 0 },
    };
  }

  /**
   * 執行完整的程式碼品質檢查
   */
  async runFullCheck() {
    console.log('🔍 開始程式碼品質檢查...\n');

    try {
      await this.checkESLint();
      await this.checkPrettier();
      this.calculateOverallScore();
      this.generateReport();
      this.provideRecommendations();
    } catch (error) {
      console.error('❌ 程式碼品質檢查過程中發生錯誤:', error.message);
      process.exit(1);
    }
  }

  /**
   * 檢查 ESLint 規則
   */
  async checkESLint() {
    console.log('📝 檢查 ESLint 規則...');

    try {
      const eslintOutput = execSync('npx eslint . --ext .js,.jsx,.ts,.tsx', {
        cwd: this.projectRoot,
        encoding: 'utf8',
        stdio: 'pipe',
      });

      if (eslintOutput.trim() === '') {
        this.results.eslint.status = 'success';
        this.results.eslint.details.push('✅ ESLint 檢查通過，無發現問題');
      } else {
        this.results.eslint.status = 'warning';
        const issues = eslintOutput.split('\n').filter(line => line.trim());
        this.results.eslint.details.push(`⚠️  發現 ${issues.length} 個 ESLint 問題`);
        this.results.eslint.details.push('詳細問題:');
        issues.forEach(issue => {
          this.results.eslint.details.push(`   • ${issue}`);
        });
      }
    } catch (error) {
      // ESLint 返回非零退出碼表示發現問題
      const errorOutput = error.stdout || error.stderr || '';
      if (errorOutput.includes('ESLint')) {
        this.results.eslint.status = 'warning';
        this.results.eslint.details.push('⚠️  ESLint 發現問題');
        this.results.eslint.details.push('問題詳情:');
        errorOutput
          .split('\n')
          .filter(line => line.trim())
          .forEach(line => {
            this.results.eslint.details.push(`   • ${line}`);
          });
      } else {
        this.results.eslint.status = 'error';
        this.results.eslint.details.push(`❌ ESLint 執行失敗: ${error.message}`);
      }
    }
  }

  /**
   * 檢查 Prettier 格式化
   */
  async checkPrettier() {
    console.log('🎨 檢查 Prettier 格式化...');

    try {
      // 檢查是否有 Prettier 配置
      const prettierConfigExists =
        fs.existsSync(path.join(this.projectRoot, '.prettierrc')) ||
        fs.existsSync(path.join(this.projectRoot, '.prettierrc.js')) ||
        fs.existsSync(path.join(this.projectRoot, '.prettierrc.json'));

      if (!prettierConfigExists) {
        this.results.prettier.status = 'warning';
        this.results.prettier.details.push('⚠️  缺少 Prettier 配置檔案');
        this.results.prettier.details.push('建議創建 .prettierrc 配置檔案');
        return;
      }

      // 檢查程式碼格式化
      try {
        const prettierOutput = execSync('npx prettier --check .', {
          cwd: this.projectRoot,
          encoding: 'utf8',
          stdio: 'pipe',
        });

        this.results.prettier.status = 'success';
        this.results.prettier.details.push('✅ Prettier 格式化檢查通過');
      } catch (error) {
        this.results.prettier.status = 'warning';
        this.results.prettier.details.push('⚠️  發現格式化問題，建議執行 npx prettier --write .');
      }
    } catch (error) {
      this.results.prettier.status = 'error';
      this.results.prettier.details.push(`❌ Prettier 檢查失敗: ${error.message}`);
    }
  }

  /**
   * 計算整體分數
   */
  calculateOverallScore() {
    let totalScore = 0;
    const maxScore = 100;

    // ESLint 分數 (60%)
    const eslintScore = this.getScoreByStatus(this.results.eslint.status) * 0.6;
    totalScore += eslintScore;

    // Prettier 分數 (40%)
    const prettierScore = this.getScoreByStatus(this.results.prettier.status) * 0.4;
    totalScore += prettierScore;

    this.results.overall.score = Math.round(totalScore);
    this.results.overall.status = this.getOverallStatus(totalScore);
  }

  /**
   * 根據狀態計算分數
   */
  getScoreByStatus(status) {
    const scores = {
      success: 100,
      warning: 70,
      error: 30,
      pending: 0,
    };
    return scores[status] || 0;
  }

  /**
   * 獲取整體狀態
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

  /**
   * 生成檢查報告
   */
  generateReport() {
    console.log('\n📊 程式碼品質檢查報告');
    console.log('='.repeat(50));

    // ESLint 檢查結果
    const eslintIcon = this.getStatusIcon(this.results.eslint.status);
    console.log(`\n📝 ESLint 檢查 ${eslintIcon}`);
    console.log(`   狀態: ${this.getStatusText(this.results.eslint.status)}`);
    this.results.eslint.details.forEach(detail => {
      console.log(`   ${detail}`);
    });

    // Prettier 檢查結果
    const prettierIcon = this.getStatusIcon(this.results.prettier.status);
    console.log(`\n🎨 Prettier 檢查 ${prettierIcon}`);
    console.log(`   狀態: ${this.getStatusText(this.results.prettier.status)}`);
    this.results.prettier.details.forEach(detail => {
      console.log(`   ${detail}`);
    });

    // 整體評分
    const overallIcon = this.getStatusIcon(this.results.overall.status);
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🏆 整體品質分數: ${this.results.overall.score}/100 ${overallIcon}`);
    console.log(`📈 程式碼品質狀態: ${this.getStatusText(this.results.overall.status)}`);
  }

  /**
   * 提供改進建議
   */
  provideRecommendations() {
    console.log('\n💡 改進建議');
    console.log('='.repeat(30));

    const recommendations = [];

    if (this.results.eslint.status === 'error') {
      recommendations.push('🔧 修復 ESLint 錯誤: npx eslint . --ext .js,.jsx,.ts,.tsx --fix');
      recommendations.push('📝 檢查 ESLint 配置檔案');
    }

    if (this.results.eslint.status === 'warning') {
      recommendations.push('🔧 修復 ESLint 警告: npx eslint . --ext .js,.jsx,.ts,.tsx --fix');
      recommendations.push('📋 檢查並修復程式碼風格問題');
    }

    if (this.results.prettier.status === 'warning') {
      recommendations.push('🎨 自動格式化程式碼: npx prettier --write .');
      recommendations.push('📋 檢查 Prettier 配置');
    }

    if (this.results.prettier.status === 'error') {
      recommendations.push('🎨 安裝 Prettier: npm install --save-dev prettier');
      recommendations.push('📋 創建 Prettier 配置檔案');
    }

    if (recommendations.length === 0) {
      console.log('🎉 程式碼品質優秀，無需特別改進');
    } else {
      recommendations.forEach(rec => console.log(rec));
    }

    console.log('\n⚡ 快速修復命令:');
    console.log('npm run lint:fix        # 自動修復 ESLint 問題');
    console.log('npm run format          # 自動格式化程式碼');
    console.log('npm run code-quality    # 執行完整品質檢查');
  }

  /**
   * 獲取狀態圖標
   */
  getStatusIcon(status) {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      pending: '⏳',
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
      pending: '待檢查',
    };
    return texts[status] || '未知';
  }

  /**
   * 自動修復 ESLint 問題
   */
  async autoFixESLint() {
    console.log('🔧 自動修復 ESLint 問題...');

    try {
      execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --fix', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });
      console.log('✅ ESLint 自動修復完成');
    } catch (error) {
      console.error('❌ ESLint 自動修復失敗:', error.message);
    }
  }

  /**
   * 自動格式化程式碼
   */
  async autoFormatCode() {
    console.log('🎨 自動格式化程式碼...');

    try {
      execSync('npx prettier --write .', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });
      console.log('✅ 程式碼自動格式化完成');
    } catch (error) {
      console.error('❌ 程式碼自動格式化失敗:', error.message);
    }
  }
}

// 主執行函數
async function main() {
  const checker = new CodeQualityChecker();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'check':
        await checker.runFullCheck();
        break;

      case 'fix':
        await checker.autoFixESLint();
        await checker.autoFormatCode();
        console.log('\n🔄 重新執行品質檢查...');
        await checker.runFullCheck();
        break;

      case 'eslint-fix':
        await checker.autoFixESLint();
        break;

      case 'format':
        await checker.autoFormatCode();
        break;

      case 'help':
      default:
        console.log(`
🔍 ClickFun 程式碼品質檢查工具

使用方法:
  npm run code-quality:check      # 執行完整品質檢查
  npm run code-quality:fix       # 自動修復所有問題
  npm run code-quality:eslint    # 只修復 ESLint 問題
  npm run code-quality:format    # 只格式化程式碼
  npm run code-quality:help      # 顯示此幫助

功能說明:
  • ESLint 規則檢查 (程式碼品質、風格、最佳實踐)
  • Prettier 格式化檢查
  • 自動修復功能
  • 詳細的改進建議
  • 100分制品質評分

更多資訊請查看 .eslintrc.js 和 .prettierrc 配置檔案
        `);
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

export default CodeQualityChecker;
