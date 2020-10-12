const {defaults} = require('jest-config');
// require('@testing-library/jest-dom');

module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom']
  // ...
};