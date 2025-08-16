/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'puppeteer',
  testMatch: ['<rootDir>/tests/**/*.e2e.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  collectCoverageFrom: ['../*.js', '!../sw.js'],
  coverageDirectory: 'coverage-e2e'
};
