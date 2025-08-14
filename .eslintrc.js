module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    serviceworker: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    // 遊戲全域變數
    gameState: "writable",
    tpsCalculator: "writable",
    visualEffects: "writable",

    // PWA 相關
    self: "readonly",
    workbox: "readonly",

    // 測試相關
    page: "readonly",
    browser: "readonly",
    jasmine: "readonly",
  },
  rules: {
    // 程式碼品質
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info"],
      },
    ],
    "no-debugger": "error",
    "no-alert": "warn",

    // 程式碼風格
    indent: [
      "error",
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      "error",
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],

    // 最佳實踐
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",

    // ES6+ 特性
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "arrow-spacing": "error",
    "template-curly-spacing": "error",

    // PWA 特定規則
    "no-restricted-globals": [
      "error",
      {
        name: "event",
        message: "使用參數名稱而非全域 event 變數",
      },
    ],

    // 效能相關
    "no-loop-func": "error",
    "no-inner-declarations": "error",
  },
  overrides: [
    {
      files: ["sw.js", "fx.worker.js"],
      env: {
        worker: true,
        serviceworker: true,
      },
      globals: {
        importScripts: "readonly",
        workbox: "readonly",
      },
    },
    {
      files: ["tests/**/*.js", "dev-tools/**/*.test.js"],
      env: {
        jest: true,
      },
      globals: {
        page: "readonly",
        browser: "readonly",
        sleep: "readonly",
        waitForElement: "readonly",
        getGameState: "readonly",
      },
    },
  ],
};
