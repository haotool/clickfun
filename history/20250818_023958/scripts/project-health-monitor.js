#!/usr/bin/env node

/**
 * 專案健康監控腳本
 * 監控專案的整體健康狀況和品質指標
 * 版本: 2025.1.16
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 健康檢查項目
const healthChecks = {
  // 依賴管理
  dependencies: {
    name: '依賴管理',
    weight: 15,
    checks: [
      {
        name: 'package-lock.json 存在',
        check: () => fs.existsSync('package-lock.json'),
        message: 'package-lock.json 文件存在，確保依賴版本一致性',
      },
      {
        name: '依賴安全性檢查',
        check: () => {
          try {
            const result = execSync('npm audit --audit-level=moderate --json', {
              encoding: 'utf8',
            });
            const audit = JSON.parse(result);
            return audit.metadata.vulnerabilities.total === 0;
          } catch (error) {
            return false;
          }
        },
        message: '無中高風險安全漏洞',
      },
    ],
  },

  // 測試品質
  testing: {
    name: '測試品質',
    weight: 25,
    checks: [
      {
        name: '測試執行成功',
        check: () => {
          try {
            execSync('npm test --silent', { stdio: 'pipe' });
            return true;
          } catch (error) {
            return false;
          }
        },
        message: '所有測試通過',
      },
      {
        name: '測試覆蓋率達標',
        check: () => {
          try {
            const result = execSync('npm run test:coverage --silent', { encoding: 'utf8' });
            // 檢查覆蓋率是否達到 80%
            const coverageMatch = result.match(/All files.*?(\d+)/);
            if (coverageMatch) {
              const coverage = parseInt(coverageMatch[1]);
              return coverage >= 80;
            }
            return false;
          } catch (error) {
            return false;
          }
        },
        message: '測試覆蓋率 ≥ 80%',
      },
    ],
  },

  // 程式碼品質
  codeQuality: {
    name: '程式碼品質',
    weight: 20,
    checks: [
      {
        name: 'ESLint 檢查通過',
        check: () => {
          try {
            execSync('npm run lint:check --silent', { stdio: 'pipe' });
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'ESLint 檢查通過',
      },
      {
        name: 'Prettier 格式化檢查',
        check: () => {
          try {
            execSync('npm run format:check --silent', { stdio: 'pipe' });
            return true;
          } catch (error) {
            return false;
          }
        },
        message: '程式碼格式化符合標準',
      },
    ],
  },

  // CI/CD 狀態
  cicd: {
    name: 'CI/CD 狀態',
    weight: 20,
    checks: [
      {
        name: 'GitHub Actions 配置存在',
        check: () => fs.existsSync('.github/workflows'),
        message: 'GitHub Actions 工作流程已配置',
      },
      {
        name: 'Release 配置完整',
        check: () => fs.existsSync('release.config.js'),
        message: 'Semantic Release 配置完整',
      },
    ],
  },

  // 文檔完整性
  documentation: {
    name: '文檔完整性',
    weight: 10,
    checks: [
      {
        name: 'README.md 存在',
        check: () => fs.existsSync('README.md'),
        message: 'README.md 文件存在',
      },
      {
        name: 'CHANGELOG.md 存在',
        check: () => fs.existsSync('CHANGELOG.md'),
        message: 'CHANGELOG.md 文件存在',
      },
      {
        name: '專案結構文檔',
        check: () => fs.existsSync('docs/PROJECT_STRUCTURE.md'),
        message: '專案結構文檔完整',
      },
    ],
  },

  // 建置狀態
  build: {
    name: '建置狀態',
    weight: 10,
    checks: [
      {
        name: '建置腳本執行成功',
        check: () => {
          try {
            execSync('npm run build --silent', { stdio: 'pipe' });
            return true;
          } catch (error) {
            return false;
          }
        },
        message: '建置腳本執行成功',
      },
    ],
  },
};

// 執行健康檢查
function runHealthCheck() {
  console.log(`${colors.bright}${colors.cyan}🔍 Click Fun 專案健康檢查${colors.reset}\n`);

  let totalScore = 0;
  let totalWeight = 0;
  const results = {};

  // 執行各項檢查
  for (const [category, config] of Object.entries(healthChecks)) {
    console.log(`${colors.bright}${colors.blue}📋 ${config.name}${colors.reset}`);

    let categoryScore = 0;
    const checks = config.checks;

    for (const check of checks) {
      try {
        const passed = check.check();
        const status = passed ? '✅' : '❌';
        const color = passed ? colors.green : colors.red;

        console.log(`  ${status} ${check.name}`);
        if (passed) {
          console.log(`     ${color}${check.message}${colors.reset}`);
          categoryScore += 1;
        } else {
          console.log(`     ${colors.yellow}需要改善${colors.reset}`);
        }
      } catch (error) {
        console.log(`  ❌ ${check.name}`);
        console.log(`     ${colors.red}檢查執行失敗: ${error.message}${colors.reset}`);
      }
    }

    const categoryPercentage = (categoryScore / checks.length) * 100;
    const categoryWeightedScore = (categoryPercentage / 100) * config.weight;

    totalScore += categoryWeightedScore;
    totalWeight += config.weight;

    results[category] = {
      score: categoryScore,
      total: checks.length,
      percentage: categoryPercentage,
      weightedScore: categoryWeightedScore,
    };

    console.log(
      `   ${colors.cyan}得分: ${categoryScore}/${checks.length} (${categoryPercentage.toFixed(1)}%)${colors.reset}\n`,
    );
  }

  // 計算總分
  const overallScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

  console.log(`${colors.bright}${colors.magenta}📊 總體健康評分${colors.reset}`);
  console.log(`   ${colors.bright}總分: ${overallScore.toFixed(1)}/100${colors.reset}`);

  // 評級
  let grade, gradeColor;
  if (overallScore >= 90) {
    grade = 'A+ (優秀)';
    gradeColor = colors.green;
  } else if (overallScore >= 80) {
    grade = 'A (良好)';
    gradeColor = colors.green;
  } else if (overallScore >= 70) {
    grade = 'B (中等)';
    gradeColor = colors.yellow;
  } else if (overallScore >= 60) {
    grade = 'C (及格)';
    gradeColor = colors.yellow;
  } else {
    grade = 'D (需要改善)';
    gradeColor = colors.red;
  }

  console.log(`   ${colors.bright}評級: ${gradeColor}${grade}${colors.reset}`);

  // 建議
  console.log(`\n${colors.bright}${colors.cyan}💡 改善建議${colors.reset}`);

  if (overallScore < 80) {
    console.log(`   ${colors.yellow}• 專案整體健康狀況需要改善${colors.reset}`);
    console.log(`   ${colors.yellow}• 建議優先處理評分較低的項目${colors.reset}`);
  } else if (overallScore < 90) {
    console.log(`   ${colors.yellow}• 專案健康狀況良好，但仍有改善空間${colors.reset}`);
    console.log(`   ${colors.yellow}• 可以專注於提升評分較低的項目${colors.reset}`);
  } else {
    console.log(`   ${colors.green}• 專案健康狀況優秀！${colors.reset}`);
    console.log(`   ${colors.green}• 建議保持當前水準，持續監控${colors.reset}`);
  }

  // 詳細結果
  console.log(`\n${colors.bright}${colors.cyan}📈 詳細結果${colors.reset}`);
  for (const [category, result] of Object.entries(results)) {
    const categoryName = healthChecks[category].name;
    const color =
      result.percentage >= 80 ? colors.green : result.percentage >= 60 ? colors.yellow : colors.red;
    console.log(`   ${categoryName}: ${color}${result.percentage.toFixed(1)}%${colors.reset}`);
  }

  return {
    overallScore,
    grade,
    results,
  };
}

// 主函數
function main() {
  try {
    const result = runHealthCheck();

    // 如果健康檢查失敗，返回非零退出碼
    if (result.overallScore < 60) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}❌ 健康檢查執行失敗: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 執行主函數
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runHealthCheck, healthChecks };
