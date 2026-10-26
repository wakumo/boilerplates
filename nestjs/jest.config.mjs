import testConfig from './test-config.cjs';

export default {
  injectGlobals: true,
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*[.-](?:e2e-)?spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['@swc/jest'],
  },
  setupFiles: ['<rootDir>/test/setup/test-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setup/global-setup.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  maxWorkers: testConfig.testMaxWorkers,
  testTimeout: 60000,
  testEnvironment: 'node',
  workerIdleMemoryLimit: '1536MB',
  logHeapUsage: true,
  verbose: false,
};
