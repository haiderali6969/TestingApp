module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-country-picker-modal)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
