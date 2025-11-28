/**
 * 随机生成 `a` 到 `b` 的整数（闭区间，包含两端）。
 * - 自动交换边界，按从小到大处理。
 * - 下界向上取整、上界向下取整后再取值。
 * @param a 边界值。
 * @param b 边界值。
 * @returns 闭区间内的随机整数。
 * @example
 * randomInt(0, 10); // => 0..10 之间的随机整数（含 0 与 10）
 * randomInt(10, 0); // => 0..10 之间的随机整数（含 0 与 10）
 * randomInt(5.2, 10.8); // => 6..10 之间取整随机数（含 6 与 10）
 */
export function randomInt(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('min 和 max 必须是有限数值');
  }

  const low = Math.min(a, b);
  const high = Math.max(a, b);

  const minInt = Math.ceil(low);
  const maxInt = Math.floor(high);

  if (maxInt < minInt) {
    throw new RangeError('取整后区间为空');
  }

  if (maxInt === minInt) return minInt;

  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

/**
 * 随机生成 `a` 到 `b` 的浮点数（半开区间，包含下界不包含上界）。
 * - 自动交换边界，按从小到大处理。
 * @param a 边界值。
 * @param b 边界值。
 * @returns 半开区间内的随机浮点数。
 * @example
 * randomFloat(0, 10); // => [0, 10) 内的随机浮点数
 * randomFloat(10, 0); // => [0, 10) 内的随机浮点数
 * randomFloat(5.2, 10.8); // => [5.2, 10.8) 内的随机浮点数
 */
export function randomFloat(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('min 和 max 必须是有限数值');
  }

  const low = Math.min(a, b);
  const high = Math.max(a, b);

  if (high === low) return low;

  return Math.random() * (high - low) + low;
}

/**
 * 随机生成一个布尔值。
 * @returns 随机布尔值。
 * @example
 * randomBoolean(); // => 随机返回 true 或 false
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}
