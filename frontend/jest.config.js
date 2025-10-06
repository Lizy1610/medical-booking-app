module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!expo-secure-store|react-native|@react-native|react-navigation|@react-navigation|@unimodules/.*)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
  ],
  moduleNameMapper: {
    '^expo-secure-store$': '<rootDir>/app/__mocks__/expo-secure-store.js',

  },
};
