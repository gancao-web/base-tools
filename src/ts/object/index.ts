/**
 * 获取对象键名数组（类型安全）。
 * 注：内置 `Object.keys` 与 `lodash-es` 的 `keys` 在 TS 中通常返回 `string[]`，无法精确到 `keyof T`。
 * @param obj 目标对象
 * @returns 类型精确的 `Array<keyof T>`
 * @example
 * const o = { a: 1, b: 'x' };
 * const keys = getObjectKeys(o); // type: ('a' | 'b')[], value: ['a','b']
 */
export function getObjectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as (keyof T)[];
}
