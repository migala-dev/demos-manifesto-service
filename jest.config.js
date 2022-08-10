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
    'createPgClient': '<rootDir>/tests/mocks/utils/createPgClient.js',
    'authenticate': '<rootDir>/tests/mocks/authenticate.js',
  },
};
