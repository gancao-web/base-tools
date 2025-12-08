/**
 * 随机生成一个布尔值。
 * @returns 随机布尔值。
 * @example
 * randomBoolean(); // => 随机返回 true 或 false
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}
