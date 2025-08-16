module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 自訂規則以支援中文
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 錯誤修復
        'docs', // 文檔更新
        'style', // 程式碼格式調整
        'refactor', // 程式碼重構
        'test', // 測試相關
        'chore', // 雜項任務
        'perf', // 效能優化
        'ci', // CI/CD 配置
        'build', // 建置系統
        'revert', // 回退提交
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
  // 自訂解析器以支援中文字符
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      referenceActions: [
        'close',
        'closes',
        'closed',
        'fix',
        'fixes',
        'fixed',
        'resolve',
        'resolves',
        'resolved',
      ],
      issuePrefixes: ['#'],
      noteKeywords: ['BREAKING CHANGE', '重大變更'],
      fieldPattern: /^-(.*?)-$/,
      revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
      revertCorrespondence: ['header', 'hash'],
      warn() {},
      mergePattern: null,
      mergeCorrespondence: null,
    },
  },
};
