#!/usr/bin/env node

/**
 * Click Fun 內容品質分析器
 * 分析關鍵字密度、可讀性、SEO優化指標
 *
 * 建立時間: 2025-08-17T02:12:30+08:00
 * 作者: 文案高手 (Content Master Pro)
 */

const fs = require('fs');
const path = require('path');

class ContentQualityAnalyzer {
  constructor() {
    this.targetKeywords = {
      tier1: ['Click Fun', 'Click Fun', '點擊樂趣遊戲'],
      tier2: ['點擊遊戲', '免費點擊遊戲', '線上點擊遊戲', 'PWA遊戲', 'TPS計算'],
      tier3: [
        '免費線上點擊速度測試遊戲',
        '支援離線的點擊遊戲',
        'TPS計算遊戲',
        '跨平台點擊遊戲',
        '響應式點擊遊戲',
      ],
    };

    this.readabilityWeights = {
      averageWordsPerSentence: 0.3,
      syllableComplexity: 0.2,
      sentenceVariety: 0.2,
      punctuationUsage: 0.15,
      vocabularyDiversity: 0.15,
    };
  }

  // 從 HTML 提取純文字內容
  extractTextFromHTML(htmlContent) {
    // 移除 script, style, head 標籤內容
    let textContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<[^>]+>/g, ' ') // 移除所有 HTML 標籤
      .replace(/\s+/g, ' ') // 合併多個空白
      .trim();

    return textContent;
  }

  // 關鍵字密度分析
  analyzeKeywordDensity(text) {
    const totalWords = text.split(/\s+/).length;
    const results = {};

    Object.keys(this.targetKeywords).forEach(tier => {
      results[tier] = {};
      this.targetKeywords[tier].forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const matches = text.match(regex) || [];
        const count = matches.length;
        const density = ((count / totalWords) * 100).toFixed(2);

        results[tier][keyword] = {
          count,
          density: parseFloat(density),
          positions: this.findKeywordPositions(text, keyword),
        };
      });
    });

    return results;
  }

  // 找出關鍵字在文本中的位置
  findKeywordPositions(text, keyword) {
    const positions = [];
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const position = match.index / text.length;
      positions.push({
        start: match.index,
        end: regex.lastIndex,
        relativePosition: (position * 100).toFixed(1) + '%',
      });
    }

    return positions;
  }

  // 可讀性分析 (適應中文)
  analyzeReadability(text) {
    const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const characters = text.replace(/\s/g, '').length;

    // 中文適應的可讀性指標
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = characters / words.length;
    const sentenceLengthVariety = this.calculateSentenceLengthVariety(sentences);
    const vocabularyDiversity = this.calculateVocabularyDiversity(words);

    // 可讀性評分 (1-100，100為最佳)
    let readabilityScore = 100;

    // 句子長度懲罰 (理想: 15-25 字)
    if (avgWordsPerSentence > 25) readabilityScore -= (avgWordsPerSentence - 25) * 2;
    if (avgWordsPerSentence < 10) readabilityScore -= (10 - avgWordsPerSentence) * 3;

    // 字符複雜度 (理想: 2-4 字符/詞)
    if (avgCharsPerWord > 5) readabilityScore -= (avgCharsPerWord - 5) * 5;
    if (avgCharsPerWord < 1.5) readabilityScore -= (1.5 - avgCharsPerWord) * 8;

    // 句子變化性獎勵
    readabilityScore += sentenceLengthVariety * 10;

    // 詞彙多樣性獎勵
    readabilityScore += vocabularyDiversity * 15;

    readabilityScore = Math.max(0, Math.min(100, readabilityScore));

    return {
      score: Math.round(readabilityScore),
      details: {
        totalSentences: sentences.length,
        totalWords: words.length,
        avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
        avgCharsPerWord: avgCharsPerWord.toFixed(1),
        sentenceLengthVariety: sentenceLengthVariety.toFixed(2),
        vocabularyDiversity: vocabularyDiversity.toFixed(2),
      },
      grade: this.getReadabilityGrade(readabilityScore),
    };
  }

  // 計算句子長度變化性
  calculateSentenceLengthVariety(sentences) {
    if (sentences.length < 2) return 0;

    const lengths = sentences.map(s => s.trim().length);
    const avgLength = lengths.reduce((a, b) => a + b) / lengths.length;
    const variance =
      lengths.reduce((sum, length) => sum + Math.pow(length - avgLength, 2), 0) / lengths.length;

    return Math.sqrt(variance) / avgLength; // 變異係數
  }

  // 計算詞彙多樣性
  calculateVocabularyDiversity(words) {
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    return uniqueWords.size / words.length;
  }

  // 可讀性等級
  getReadabilityGrade(score) {
    if (score >= 90) return 'A+：極佳可讀性';
    if (score >= 80) return 'A：優秀可讀性';
    if (score >= 70) return 'B：良好可讀性';
    if (score >= 60) return 'C：普通可讀性';
    if (score >= 50) return 'D：需要改進';
    return 'F：可讀性不佳';
  }

  // SEO 優化指標檢查
  analyzeSEOMetrics(htmlContent, textContent) {
    const seoMetrics = {
      titleOptimization: this.analyzeTitleTag(htmlContent),
      metaDescription: this.analyzeMetaDescription(htmlContent),
      headingStructure: this.analyzeHeadingStructure(htmlContent),
      internalLinks: this.analyzeInternalLinks(htmlContent),
      imageOptimization: this.analyzeImageOptimization(htmlContent),
      structuredData: this.analyzeStructuredData(htmlContent),
    };

    return seoMetrics;
  }

  // 分析 Title 標籤
  analyzeTitleTag(htmlContent) {
    const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!titleMatch) return { score: 0, issues: ['缺少 title 標籤'] };

    const title = titleMatch[1].trim();
    const issues = [];
    let score = 100;

    if (title.length > 60) {
      issues.push(`標題過長 (${title.length} 字符，建議 ≤ 60)`);
      score -= 20;
    }
    if (title.length < 30) {
      issues.push(`標題過短 (${title.length} 字符，建議 ≥ 30)`);
      score -= 15;
    }

    // 檢查是否包含主要關鍵字
    const hasMainKeyword = this.targetKeywords.tier1.some(keyword =>
      title.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!hasMainKeyword) {
      issues.push('標題未包含主要品牌關鍵字');
      score -= 30;
    }

    return { score: Math.max(0, score), title, length: title.length, issues };
  }

  // 分析 Meta Description
  analyzeMetaDescription(htmlContent) {
    const metaMatch = htmlContent.match(
      /<meta[^>]+name=['"](description|Description)['"]+[^>]+content=['"]([^'"]*)['"]/i
    );
    if (!metaMatch) return { score: 0, issues: ['缺少 meta description'] };

    const description = metaMatch[2].trim();
    const issues = [];
    let score = 100;

    if (description.length > 160) {
      issues.push(`描述過長 (${description.length} 字符，建議 ≤ 160)`);
      score -= 20;
    }
    if (description.length < 120) {
      issues.push(`描述過短 (${description.length} 字符，建議 ≥ 120)`);
      score -= 10;
    }

    // 檢查關鍵字覆蓋
    let keywordCount = 0;
    this.targetKeywords.tier2.forEach(keyword => {
      if (description.toLowerCase().includes(keyword.toLowerCase())) {
        keywordCount++;
      }
    });

    if (keywordCount < 2) {
      issues.push('描述中關鍵字覆蓋不足，建議包含 2-3 個主要關鍵字');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      description,
      length: description.length,
      keywordCount,
      issues,
    };
  }

  // 分析標題結構
  analyzeHeadingStructure(htmlContent) {
    const headings = {
      h1: (htmlContent.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length,
      h2: (htmlContent.match(/<h2[^>]*>.*?<\/h2>/gi) || []).length,
      h3: (htmlContent.match(/<h3[^>]*>.*?<\/h3>/gi) || []).length,
      h4: (htmlContent.match(/<h4[^>]*>.*?<\/h4>/gi) || []).length,
      h5: (htmlContent.match(/<h5[^>]*>.*?<\/h5>/gi) || []).length,
      h6: (htmlContent.match(/<h6[^>]*>.*?<\/h6>/gi) || []).length,
    };

    const issues = [];
    let score = 100;

    if (headings.h1 === 0) {
      issues.push('缺少 H1 主標題');
      score -= 40;
    } else if (headings.h1 > 1) {
      issues.push(`H1 標籤過多 (${headings.h1} 個，建議只有 1 個)`);
      score -= 20;
    }

    const totalHeadings = Object.values(headings).reduce((a, b) => a + b, 0);
    if (totalHeadings < 3) {
      issues.push('標題結構太簡單，建議增加 H2、H3 層級');
      score -= 15;
    }

    return { score: Math.max(0, score), headings, totalHeadings, issues };
  }

  // 分析內部連結
  analyzeInternalLinks(htmlContent) {
    const allLinks = htmlContent.match(/<a[^>]+href=['"][^'"]*['"][^>]*>/gi) || [];
    const internalLinks = allLinks.filter(
      link => !link.includes('http') || link.includes('haotool.github.io/clickfun')
    );

    const issues = [];
    let score = 100;

    if (internalLinks.length === 0) {
      issues.push('缺少內部連結，不利於 SEO');
      score -= 30;
    }

    // 檢查錨文本
    const anchorTexts = htmlContent.match(/<a[^>]*>([^<]*)<\/a>/gi) || [];
    const genericAnchors = anchorTexts.filter(anchor => {
      const text = anchor
        .replace(/<[^>]*>/g, '')
        .trim()
        .toLowerCase();
      return ['click here', '點擊這裡', 'here', '這裡', 'link', '連結'].includes(text);
    });

    if (genericAnchors.length > 0) {
      issues.push(`發現 ${genericAnchors.length} 個通用錨文本，建議使用描述性文字`);
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      totalLinks: allLinks.length,
      internalLinks: internalLinks.length,
      issues,
    };
  }

  // 分析圖片優化
  analyzeImageOptimization(htmlContent) {
    const images = htmlContent.match(/<img[^>]*>/gi) || [];
    const issues = [];
    let score = 100;

    let missingAlt = 0;
    let missingLazyLoad = 0;

    images.forEach(img => {
      if (!img.includes('alt=')) {
        missingAlt++;
      }
      if (!img.includes('loading=')) {
        missingLazyLoad++;
      }
    });

    if (missingAlt > 0) {
      issues.push(`${missingAlt} 張圖片缺少 alt 屬性`);
      score -= missingAlt * 10;
    }

    if (missingLazyLoad > 0) {
      issues.push(`${missingLazyLoad} 張圖片未啟用延遲載入`);
      score -= missingLazyLoad * 5;
    }

    return {
      score: Math.max(0, score),
      totalImages: images.length,
      missingAlt,
      missingLazyLoad,
      issues,
    };
  }

  // 分析結構化數據
  analyzeStructuredData(htmlContent) {
    const jsonLdScripts =
      htmlContent.match(
        /<script[^>]*type=['"](application\/ld\+json|application\/json)['"]*[^>]*>[\s\S]*?<\/script>/gi
      ) || [];
    const issues = [];
    let score = 100;

    if (jsonLdScripts.length === 0) {
      issues.push('缺少 JSON-LD 結構化數據');
      score -= 40;
    } else {
      // 檢查是否有 FAQ、Product、WebApplication 等類型
      const hasWebApp = jsonLdScripts.some(script => script.includes('"@type": "WebApplication"'));
      const hasVideoGame = jsonLdScripts.some(script => script.includes('"@type": "VideoGame"'));
      const hasFAQ = jsonLdScripts.some(script => script.includes('"@type": "FAQPage"'));

      if (!hasWebApp && !hasVideoGame) {
        issues.push('建議添加 WebApplication 或 VideoGame 結構化數據');
        score -= 15;
      }

      if (!hasFAQ) {
        issues.push('建議添加 FAQ 結構化數據提升搜尋結果');
        score -= 10;
      }
    }

    return { score: Math.max(0, score), totalSchemas: jsonLdScripts.length, issues };
  }

  // 生成完整分析報告
  generateReport(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`檔案不存在: ${filePath}`);
    }

    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const textContent = this.extractTextFromHTML(htmlContent);

    const report = {
      analysis_timestamp: new Date().toISOString(),
      file_path: filePath,
      file_size: fs.statSync(filePath).size,
      content_length: textContent.length,

      keyword_analysis: this.analyzeKeywordDensity(textContent),
      readability_analysis: this.analyzeReadability(textContent),
      seo_metrics: this.analyzeSEOMetrics(htmlContent, textContent),

      overall_score: 0,
      recommendations: [],
    };

    // 計算總體評分
    const scores = [
      report.readability_analysis.score,
      report.seo_metrics.titleOptimization.score,
      report.seo_metrics.metaDescription.score,
      report.seo_metrics.headingStructure.score,
      report.seo_metrics.structuredData.score,
    ];

    report.overall_score = Math.round(scores.reduce((a, b) => a + b) / scores.length);

    // 生成建議
    report.recommendations = this.generateRecommendations(report);

    return report;
  }

  // 生成優化建議
  generateRecommendations(report) {
    const recommendations = [];

    // 可讀性建議
    if (report.readability_analysis.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'readability',
        issue: '可讀性偏低',
        suggestion: '建議調整句子長度，增加句式變化，使用更通俗易懂的詞彙',
      });
    }

    // 關鍵字密度建議
    Object.keys(report.keyword_analysis).forEach(tier => {
      const keywords = report.keyword_analysis[tier];
      Object.keys(keywords).forEach(keyword => {
        const data = keywords[keyword];
        if (data.density < 0.5) {
          recommendations.push({
            priority: tier === 'tier1' ? 'high' : 'medium',
            category: 'keywords',
            issue: `關鍵字「${keyword}」密度過低 (${data.density}%)`,
            suggestion: '建議在內容中適當增加此關鍵字的使用，目標密度 1-2%',
          });
        } else if (data.density > 3) {
          recommendations.push({
            priority: 'medium',
            category: 'keywords',
            issue: `關鍵字「${keyword}」密度過高 (${data.density}%)`,
            suggestion: '建議減少關鍵字重複，使用同義詞或相關詞彙替代',
          });
        }
      });
    });

    // SEO 優化建議
    Object.keys(report.seo_metrics).forEach(metric => {
      const data = report.seo_metrics[metric];
      if (data.score < 80 && data.issues.length > 0) {
        data.issues.forEach(issue => {
          recommendations.push({
            priority: data.score < 50 ? 'high' : 'medium',
            category: 'seo',
            issue: issue,
            suggestion: this.getSEOSuggestion(metric, issue),
          });
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // 獲取 SEO 優化建議
  getSEOSuggestion(metric, issue) {
    const suggestions = {
      titleOptimization: {
        標題過長: '將標題精簡至 50-60 字符，突出核心關鍵字',
        標題過短: '適當延長標題，增加相關關鍵字和吸引力',
        標題未包含主要品牌關鍵字: '在標題前端加入品牌關鍵字「Click Fun」',
      },
      metaDescription: {
        描述過長: '精簡描述至 150-160 字符，突出核心賣點',
        描述過短: '擴充描述內容，增加行動呼籲和關鍵字',
        描述中關鍵字覆蓋不足: '適當加入 2-3 個主要關鍵字，保持自然流暢',
      },
      headingStructure: {
        '缺少 H1 主標題': '添加包含主要關鍵字的 H1 標籤',
        'H1 標籤過多': '確保每頁只有一個 H1 標籤',
        標題結構太簡單: '添加 H2、H3 標籤建立清晰的內容層級',
      },
    };

    return suggestions[metric]?.[issue] || '請參考 SEO 最佳實踐進行優化';
  }

  // 儲存報告
  saveReport(report, outputPath) {
    const reportContent = JSON.stringify(report, null, 2);
    fs.writeFileSync(outputPath, reportContent, 'utf8');

    // 同時生成可讀性較好的 Markdown 報告
    const markdownReport = this.generateMarkdownReport(report);
    const mdPath = outputPath.replace('.json', '.md');
    fs.writeFileSync(mdPath, markdownReport, 'utf8');

    return { jsonPath: outputPath, markdownPath: mdPath };
  }

  // 生成 Markdown 格式報告
  generateMarkdownReport(report) {
    const timestamp = new Date(report.analysis_timestamp).toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
    });

    let markdown = `# Click Fun 內容品質分析報告\n\n`;
    markdown += `**分析時間**: ${timestamp}\n`;
    markdown += `**檔案路徑**: ${report.file_path}\n`;
    markdown += `**總體評分**: ${report.overall_score}/100\n\n`;

    // 總覽
    markdown += `## 📊 評分總覽\n\n`;
    markdown += `| 項目 | 評分 | 等級 |\n`;
    markdown += `|------|------|------|\n`;
    markdown += `| 可讀性 | ${report.readability_analysis.score}/100 | ${report.readability_analysis.grade} |\n`;
    markdown += `| 標題優化 | ${report.seo_metrics.titleOptimization.score}/100 | - |\n`;
    markdown += `| Meta 描述 | ${report.seo_metrics.metaDescription.score}/100 | - |\n`;
    markdown += `| 標題結構 | ${report.seo_metrics.headingStructure.score}/100 | - |\n`;
    markdown += `| 結構化數據 | ${report.seo_metrics.structuredData.score}/100 | - |\n\n`;

    // 關鍵字分析
    markdown += `## 🎯 關鍵字分析\n\n`;
    Object.keys(report.keyword_analysis).forEach(tier => {
      markdown += `### ${tier.toUpperCase()} 關鍵字\n\n`;
      markdown += `| 關鍵字 | 出現次數 | 密度 | 狀態 |\n`;
      markdown += `|--------|----------|------|------|\n`;

      Object.keys(report.keyword_analysis[tier]).forEach(keyword => {
        const data = report.keyword_analysis[tier][keyword];
        const status =
          data.density >= 1 && data.density <= 2
            ? '✅ 理想'
            : data.density < 0.5
              ? '⚠️ 過低'
              : '❌ 過高';
        markdown += `| ${keyword} | ${data.count} | ${data.density}% | ${status} |\n`;
      });
      markdown += `\n`;
    });

    // 可讀性詳情
    markdown += `## 📖 可讀性分析\n\n`;
    markdown += `- **總句數**: ${report.readability_analysis.details.totalSentences}\n`;
    markdown += `- **總詞數**: ${report.readability_analysis.details.totalWords}\n`;
    markdown += `- **平均句長**: ${report.readability_analysis.details.avgWordsPerSentence} 詞/句\n`;
    markdown += `- **詞彙多樣性**: ${report.readability_analysis.details.vocabularyDiversity}\n\n`;

    // 優化建議
    markdown += `## 💡 優化建議\n\n`;
    const priorityEmojis = { high: '🔴', medium: '🟡', low: '🟢' };

    ['high', 'medium', 'low'].forEach(priority => {
      const priorityRecommendations = report.recommendations.filter(r => r.priority === priority);
      if (priorityRecommendations.length > 0) {
        markdown += `### ${priorityEmojis[priority]} ${priority.toUpperCase()} 優先級\n\n`;
        priorityRecommendations.forEach((rec, index) => {
          markdown += `${index + 1}. **${rec.issue}**\n`;
          markdown += `   - 建議: ${rec.suggestion}\n\n`;
        });
      }
    });

    return markdown;
  }
}

// 命令行執行
if (require.main === module) {
  const analyzer = new ContentQualityAnalyzer();
  const filePath = process.argv[2] || 'index.html';
  const outputPath = process.argv[3] || 'content-quality-report.json';

  try {
    console.log(`🔍 分析檔案: ${filePath}`);
    const report = analyzer.generateReport(filePath);
    const { jsonPath, markdownPath } = analyzer.saveReport(report, outputPath);

    console.log(`✅ 分析完成！總體評分: ${report.overall_score}/100`);
    console.log(`📄 JSON 報告: ${jsonPath}`);
    console.log(`📄 Markdown 報告: ${markdownPath}`);

    if (report.recommendations.length > 0) {
      console.log(`\n💡 發現 ${report.recommendations.length} 項優化建議:`);
      report.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.issue}`);
      });
    }
  } catch (error) {
    console.error(`❌ 分析失敗: ${error.message}`);
    process.exit(1);
  }
}

module.exports = ContentQualityAnalyzer;
