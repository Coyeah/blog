const path = require('path');
const fs = require('fs');
const withImages = require('next-images');

// process.cwd(): 当前 Node.js 进程执行时的工作目录
// __disname:当前模块的目录名
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

module.exports = compose(
  withImages
)({
  pageExtensions: ['jsx', 'js', 'ts', 'tsx'],
  webpack(config, options) {
    // const {
    //   alias
    // } = config.resolve;
    // config.resolve.alias = {
    //   '@': path.resolve(resolveApp('./')),
    //   ...alias,
    // };
    return config;
  }
});