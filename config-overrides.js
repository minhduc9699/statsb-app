const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@store': path.resolve(__dirname, 'src/store')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  };
  return config;
};