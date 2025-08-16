#!/usr/bin/env node

/**
 * 測試覆蓋率提升腳本
 * 基於 Context7 最佳實踐自動化提升測試覆蓋率
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

// 覆蓋率目標配置
const COVERAGE_TARGETS = {
  global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  './src/components/': { branches: 70, statements: 70 },
  './src/core/': { branches: 90, functions: 90, lines: 90, statements: 90 },
  './scripts/': { branches: 70, functions: 70, lines: 70, statements: 70 },
};

// 分析覆蓋率報告
function analyzeCoverageReport() {
  console.log(`${colors.bright}${colors.blue}📊 分析測試覆蓋率報告${colors.reset}\n`);

  try {
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (!fs.existsSync(coveragePath)) {
      console.log(
        `${colors.yellow}⚠️  覆蓋率報告不存在，請先執行 npm run test:coverage${colors.reset}`
      );
      return null;
    }

    const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    return coverageData;
  } catch (error) {
    console.log(`${colors.red}❌ 讀取覆蓋率報告失敗: ${error.message}${colors.reset}`);
    return null;
  }
}

// 檢查覆蓋率目標達成狀況
function checkCoverageTargets(coverageData) {
  console.log(`${colors.bright}${colors.cyan}🎯 檢查覆蓋率目標達成狀況${colors.reset}\n`);

  const results = {};
  let overallScore = 0;
  let totalTargets = 0;

  for (const [path, targets] of Object.entries(COVERAGE_TARGETS)) {
    const pathData = coverageData[path] || coverageData.total;
    const pathResults = {};
    let pathScore = 0;
    let pathTargets = 0;

    console.log(`${colors.bright}${path}${colors.reset}`);

    for (const [metric, target] of Object.entries(targets)) {
      const actual = pathData[metric] || 0;
      const achieved = actual >= target;
      const percentage = ((actual / target) * 100).toFixed(1);

      pathResults[metric] = { actual, target, achieved, percentage };
      pathScore += achieved ? 1 : 0;
      pathTargets += 1;

      const status = achieved ? '✅' : '❌';
      const color = achieved ? colors.green : colors.red;

      console.log(
        `  ${status} ${metric}: ${color}${actual}%${colors.reset} / ${target}% (${percentage}%)`
      );
    }

    const pathPercentage = (pathScore / pathTargets) * 100;
    results[path] = {
      ...pathResults,
      score: pathScore,
      total: pathTargets,
      percentage: pathPercentage,
    };

    overallScore += pathScore;
    totalTargets += pathTargets;

    console.log(
      `   ${colors.cyan}得分: ${pathScore}/${pathTargets} (${pathPercentage.toFixed(1)}%)${colors.reset}\n`
    );
  }

  const overallPercentage = totalTargets > 0 ? (overallScore / totalTargets) * 100 : 0;

  console.log(`${colors.bright}${colors.magenta}📈 總體覆蓋率達成狀況${colors.reset}`);
  console.log(
    `   ${colors.bright}總分: ${overallScore}/${totalTargets} (${overallPercentage.toFixed(1)}%)${colors.reset}`
  );

  return { results, overallScore, totalTargets, overallPercentage };
}

// 生成覆蓋率改善建議
function generateImprovementSuggestions(coverageData, analysis) {
  console.log(`${colors.bright}${colors.cyan}💡 覆蓋率改善建議${colors.reset}\n`);

  const suggestions = [];

  for (const [path, pathData] of Object.entries(analysis.results)) {
    if (pathData.percentage < 100) {
      console.log(`${colors.bright}${path}${colors.reset}`);

      for (const [metric, metricData] of Object.entries(pathData)) {
        if (metric === 'score' || metric === 'total' || metric === 'percentage') continue;

        if (!metricData.achieved) {
          const shortfall = metricData.target - metricData.actual;
          const improvement = ((shortfall / metricData.target) * 100).toFixed(1);

          console.log(
            `  ${colors.yellow}• ${metric}: 需要提升 ${shortfall}% (${improvement}%)${colors.reset}`
          );

          suggestions.push({
            path,
            metric,
            current: metricData.actual,
            target: metricData.target,
            shortfall,
            improvement: parseFloat(improvement),
          });
        }
      }
      console.log('');
    }
  }

  // 按改善幅度排序建議
  suggestions.sort((a, b) => b.improvement - a.improvement);

  if (suggestions.length > 0) {
    console.log(`${colors.bright}${colors.yellow}🚀 優先改善項目${colors.reset}`);
    suggestions.slice(0, 5).forEach((suggestion, index) => {
      console.log(
        `  ${index + 1}. ${suggestion.path} - ${suggestion.metric}: ${suggestion.current}% → ${suggestion.target}%`
      );
    });
  }

  return suggestions;
}

// 生成測試模板
function generateTestTemplates(suggestions) {
  console.log(`\n${colors.bright}${colors.cyan}📝 生成測試模板${colors.reset}\n`);

  for (const suggestion of suggestions.slice(0, 3)) {
    const fileName = path.basename(suggestion.path);
    const testFileName = `${fileName.replace('.js', '')}.test.js`;

    console.log(`${colors.bright}${suggestion.path}${colors.reset}`);
    console.log(`  測試文件: ${colors.cyan}${testFileName}${colors.reset}`);
    console.log(
      `  目標: ${suggestion.metric} 從 ${suggestion.current}% 提升到 ${suggestion.target}%`
    );
    console.log(
      `  改善幅度: ${colors.yellow}${suggestion.improvement.toFixed(1)}%${colors.reset}\n`
    );
  }
}

// 執行覆蓋率檢查
function runCoverageCheck() {
  console.log(`${colors.bright}${colors.cyan}🔍 執行測試覆蓋率檢查${colors.reset}\n`);

  try {
    console.log('🧪 執行測試並收集覆蓋率...');
    execSync('npm run test:coverage', { stdio: 'inherit' });

    console.log('\n📊 分析覆蓋率報告...');
    const coverageData = analyzeCoverageReport();

    if (!coverageData) {
      return;
    }

    const analysis = checkCoverageTargets(coverageData);
    const suggestions = generateImprovementSuggestions(coverageData, analysis);

    if (suggestions.length > 0) {
      generateTestTemplates(suggestions);
    }

    // 如果覆蓋率未達標，返回非零退出碼
    if (analysis.overallPercentage < 80) {
      console.log(
        `\n${colors.yellow}⚠️  整體覆蓋率未達標 (${analysis.overallPercentage.toFixed(1)}% < 80%)${colors.reset}`
      );
      process.exit(1);
    } else {
      console.log(
        `\n${colors.green}🎉 整體覆蓋率已達標 (${analysis.overallPercentage.toFixed(1)}% ≥ 80%)${colors.reset}`
      );
    }
  } catch (error) {
    console.error(`${colors.red}❌ 覆蓋率檢查執行失敗: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 主函數
function main() {
  try {
    runCoverageCheck();
  } catch (error) {
    console.error(`${colors.red}❌ 腳本執行失敗: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 執行主函數
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runCoverageCheck, analyzeCoverageReport, checkCoverageTargets };
