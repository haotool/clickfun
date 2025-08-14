module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:8080"],
      startServerCommand: "cd dev-tools && npm run serve",
      startServerReadyPattern: "Available on",
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
        "categories:pwa": ["error", { minScore: 0.9 }],

        // PWA 特定檢查
        "service-worker": "error",
        "installable-manifest": "error",
        "splash-screen": "warn",
        "themed-omnibox": "warn",
        "content-width": "error",
        viewport: "error",

        // 效能指標
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],

        // 可用性檢查
        "color-contrast": "error",
        "tap-targets": "error",
        "meta-viewport": "error",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
