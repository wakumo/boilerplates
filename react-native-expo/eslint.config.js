const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['dist/*', 'node_modules/*', 'build/*', '.expo/*', 'android/*', 'ios/*'],
    rules: {
      semi: 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
]);
