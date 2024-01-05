const commonJestConfig = require('../../jest-config/jest.config');

module.exports = {
  ...commonJestConfig,
  // preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['<rootDir>/../../jest-config/jest-setup.js'],
  // globalSetup: '<rootDir>/../../jest-config/jest.global-setup.ts',
  moduleNameMapper: {
    '\\.(css|jpg|png|svg|less)$': '<rootDir>/../../styleMock.js',
    'nav-(.*)-style': '<rootDir>/../../styleMock.js',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    uuid: require.resolve('uuid'),
  },
};
