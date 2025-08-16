/**
 * @type {import('semantic-release').GlobalConfig}
 * 基於 Context7 最佳實踐的現代化 semantic-release 配置
 * [context7:semantic-release/semantic-release:2025-08-16T18:26:00+08:00]
 */
module.exports = {
  branches: [
    'main',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
    // 維護分支支援
    '+([0-9])?(.{+([0-9]),x}).x'
  ],
  plugins: [
    // 提交分析器 - 使用最新配置
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'test', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { breaking: true, release: 'major' },
        ],
      },
    ],
    // 發布說明生成器
    '@semantic-release/release-notes-generator',
    // 變更記錄生成器
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle: '# 📋 更新記錄\n\n所有重要變更都會記錄在此文件中。',
      },
    ],
    // 執行自定義命令
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run update-version-files',
        publishCmd: 'npm run post-publish',
      },
    ],
    // Git 提交配置
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    // GitHub 發布配置 - 支援討論和資產上傳
    [
      '@semantic-release/github',
      {
        successComment: '🎉 此議題已在版本 ${nextRelease.version} 中發布',
        failComment: '❌ 發布失敗，請檢查 CI 日誌',
        releasedLabels: ['released'],
        addReleases: 'bottom',
      },
    ],
  ],
  // 使用 conventional commits 預設
  preset: 'conventionalcommits',
  // 標籤格式
  tagFormat: 'v${version}',
  // 解析器選項
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING-CHANGE'],
  },
  // 寫入器選項
  writerOpts: {
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: 'header',
  },
};
