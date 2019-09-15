/**
 * 函数列表逐层运行，如中间件
 * @param  {...Function} funcs 
 * @returns {Function}
 */
export function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}