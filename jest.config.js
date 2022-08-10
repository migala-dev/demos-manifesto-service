module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  moduleNameMapper: {
    'amazon-cognito-identity-js': '<rootDir>/tests/mocks/amazon-cognito-identity-js/index.js',
    'repositories': '<rootDir>/tests/mocks/repositories/index.js',
    'notifications': '<rootDir>/tests/mocks/notifications/index.js',
    'authenticate': '<rootDir>/tests/mocks/authenticate.js',
  },
};
