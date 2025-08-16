/**
 * Babel 配置文件
 * 配置 JavaScript 轉換選項
 */

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: ['> 1%', 'last 2 versions']
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  
  // 插件配置
  plugins: [
    // 如果需要支援裝飾器語法
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // ['@babel/plugin-proposal-class-properties', { loose: true }]
  ],
  
  // 環境特定配置
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
};
