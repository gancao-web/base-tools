import BigNumber from 'bignumber.js';

/**
 * 数值入参类型。
 * 支持原生 `number`、`string`（包含小数、科学计数法等）以及 `BigNumber`。
 */
export type NumLike = string | number | BigNumber;

/**
 * 将任意 `NumLike` 统一转换为 `BigNumber` 实例。
 * @param x 任意支持的数值入参。
 * @returns `BigNumber` 实例。
 * @example
 * big('0.1'); // => BigNumber
 * big(0.2);   // => BigNumber
 */
export function big(x: NumLike): BigNumber {
  return x instanceof BigNumber ? x : new BigNumber(x);
}

/**
 * 高精度加法（支持多个参数连加）。
 * @example
 * bigPlus(0.1, 0.2); // => 0.3
 * bigPlus('0.1', '0.2'); // => 0.3
 * bigPlus(1, 2, 3, 4); // => 10  // 多参数连加: 1+2+3+4
 */
export function bigPlus(...rest: NumLike[]) {
  let acc = big(rest[0]);
  for (const x of rest.slice(1)) acc = acc.plus(big(x));
  return acc.toNumber();
}

/**
 * 高精度减法（支持多个参数连减）。
 * @example
 * bigMinus(1, 0.9); // => 0.1
 * bigMinus('1.1', '0.2'); // => 0.9
 * bigMinus(10, 1, 2, 3); // => 4  // 多参数连减: 10-1-2-3
 */
export function bigMinus(...rest: NumLike[]) {
  let acc = big(rest[0]);
  for (const x of rest.slice(1)) acc = acc.minus(big(x));
  return acc.toNumber();
}

/**
 * 高精度乘法（支持多个参数连乘）。
 * @example
 * bigTimes(0.1, 0.2); // => 0.02
 * bigTimes('1.5', '3'); // => 4.5
 * bigTimes(2, 3, 4); // => 24  // 多参数连乘: 2*3*4
 */
export function bigTimes(...rest: NumLike[]) {
  let acc = big(rest[0]);
  for (const x of rest.slice(1)) acc = acc.times(big(x));
  return acc.toNumber();
}

/**
 * 高精度除法（支持多个参数连除）。
 * @example
 * bigDiv(1, 3); // => 0.333333...
 * bigDiv('10', '4'); // => 2.5
 * bigDiv(100, 5, 2); // => 10  // 多参数连除: 100/5/2
 */
export function bigDiv(...rest: NumLike[]) {
  let acc = big(rest[0]);
  for (const x of rest.slice(1)) acc = acc.div(big(x));
  return acc.toNumber();
}

/**
 * 指数运算
 * @param x 底数。
 * @param y 指数。
 * @returns 计算结果。
 * @example
 * bigPow(2, 3); // => 8
 * bigPow('2.5', 2); // => 6.25
 */
export function bigPow(x: NumLike, y: NumLike) {
  return big(x).pow(big(y)).toNumber();
}

/**
 * 四舍五入到指定小数位数
 * @param x 需要舍入的数值。
 * @param dp 保留的小数位数，默认 `0`（取整）。
 * @param rm 舍入模式，默认 `ROUND_HALF_UP`（四舍五入）。
 * @returns 舍入后的数值。
 * @example
 * bigRound(1.6); // => 2
 * bigRound('1.234', 2); // => 1.23
 * bigRound('1.235', 2); // => 1.24
 * bigRound('1.299', 2, BigNumber.ROUND_DOWN); // => 1.29
 */
export function bigRound(x: NumLike, dp = 0, rm: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP) {
  return big(x).decimalPlaces(dp, rm).toNumber();
}

/**
 * 将数值按指定位数格式化为字符串（保留小数位）。
 * @param x 需要格式化的数值。
 * @param dp 保留的小数位数，默认 `2`。
 * @param rm 舍入模式，默认 `ROUND_HALF_UP`（四舍五入）。
 * @returns 格式化后的字符串。
 * @example
 * bigFixed('1'); // => '1.00'
 * +bigFixed('1'); // => 1
 * bigFixed(1.2345); // => '1.23'
 * bigFixed(1.2345, 3); // => '1.235'
 * bigFixed('1.2345', 0, BigNumber.ROUND_UP); // => '2'
 */
export function bigFixed(
  x: NumLike,
  dp = 2,
  rm: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP,
): string {
  return big(x).toFixed(dp, rm);
}

/**
 * 比较两个数值大小。
 * @example
 * bigCompare('2', '10'); // => -1
 * bigCompare(3, 3);      // => 0
 * bigCompare('10', 2);   // => 1
 */
export function bigCompare(a: NumLike, b: NumLike): -1 | 0 | 1 | null {
  return big(a).comparedTo(big(b));
}

/**
 * 判断两个数值是否相等。
 * @example
 * bigEqual('1.0', 1); // => true
 * bigEqual(2, 1); // => false
 */
export function bigEqual(a: NumLike, b: NumLike): boolean {
  return big(a).isEqualTo(big(b));
}

/**
 * 判断 a 是否大于 b。
 * @example
 * bigGreaterThan(2, 1); // => true
 * bigGreaterThan(1, 2); // => false
 */
export function bigGreaterThan(a: NumLike, b: NumLike): boolean {
  return big(a).isGreaterThan(big(b));
}

/**
 * 判断 a 是否大于等于 b。
 * @example
 * bigGreaterThanOrEqual(2, 2); // => true
 * bigGreaterThanOrEqual(1, 2); // => false
 */
export function bigGreaterThanOrEqualTo(a: NumLike, b: NumLike): boolean {
  return big(a).isGreaterThanOrEqualTo(big(b));
}

/**
 * 判断 a 是否小于 b。
 * @example
 * bigLessThan(1, 2); // => true
 * bigLessThan(2, 1); // => false
 */
export function bigLessThan(a: NumLike, b: NumLike): boolean {
  return big(a).isLessThan(big(b));
}

/**
 * 判断 a 是否小于等于 b。
 * @example
 * bigLessThanOrEqual(2, 2); // => true
 * bigLessThanOrEqual(1, 2); // => true
 * bigLessThanOrEqual(2, 1); // => false
 */
export function bigLessThanOrEqual(a: NumLike, b: NumLike): boolean {
  return big(a).isLessThanOrEqualTo(big(b));
}

/**
 * 导出 BigNumber 类
 * @example
 * BigNumber.ROUND_HALF_UP; // 使用类型
 * BigNumber.set(config); // 设置全局配置
 * const bn = new BigNumber('123456.789'); // 创建实例
 */
export { BigNumber };
