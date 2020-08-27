module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 100,
      lines: 100,
      statements: -10,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'index.js'],
  testMatch: ['**/__tests__/**/*.spec.js', '**/tests/**/*.spec.js'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  setupFiles: ['./__tests__/setupTests.js'],
};
