/* eslint-disable */
export default {
  displayName: 'ngxs-testing',
  testEnvironment: './FixJSDOMEnvironment.ts',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/ngxs-testing',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
