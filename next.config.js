const withLess = require('@zeit/next-less');
const withImages = require('next-images');
const withCSS = require('@zeit/next-css');

function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

module.exports = compose(
  withCSS,
  withLess,
  withImages
)({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  webpack(config, options) {
    return config
  }
})