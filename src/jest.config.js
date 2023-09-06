/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  displayName: 'Modules',
  // preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePaths: [
    '<rootDir>',
  ],
  transform: {
    ".ts": ['ts-jest', {
      useESM: true,
      /** 
       * ts-jest preset currently has an issue with the 'verbatimModuleSyntax' typescript option:
       * This whole transform bit should be removed once this is resolved:
       * https://github.com/kulshekhar/ts-jest/issues/4081
       */
      isolatedModules: true,
    }]
  },
  // Module Name settings required to make chalk work with jest
  moduleNameMapper: {
    '#(.*)': '<rootDir>/node_modules/$1',
    // 'lowdb': '<rootDir>/node_modules/lowdb/lib',
    // 'steno': '<rootDir>/node_modules/steno/lib',
  },
  transformIgnorePatterns: [
    'node_modules/(?!=chalk)/',
  ],
};
