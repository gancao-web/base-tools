import { get, set } from 'es-toolkit/compat';

/**
 * 获取对象键名数组（类型安全）。
 * 注：内置 `Object.keys` 与 `es-toolkit` 的 `keys` 在 TS 中通常返回 `string[]`，无法精确到 `keyof T`。
 * @param obj 目标对象
 * @returns 类型精确的 `Array<keyof T>`
 * @example
 * const o = { a: 1, b: 'x' };
 * const keys = getObjectKeys(o); // type: ('a' | 'b')[], value: ['a','b']
 */
export function getObjectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * 获取对象值。
 * @param obj 目标对象
 * @param path 路径。(点路径：'a.b'、'a[0].b'；数组路径：['a',0,'b'])
 * @returns 值
 * @example
 * const o = { b: { c: 'x' }, users: [{ name: 'john' }, { name: 'jane' }] };
 * const c = getObjectValue(o, 'b.c'); // 点路径: 'x'
 * const name0 = getObjectValue(o, 'users[0].name'); // 数组字符: 'john'
 * const name1 = getObjectValue(o, ['users', 1, 'name']); // 数组路径: 'jane'
 */
export const getObjectValue = get;

/**
 * 设置对象值。
 * @param obj 目标对象
 * @param path 路径。(点路径：'a.b'、'a[0].b'；数组路径：['a',0,'b'])
 * @param value 值
 * @example
 * const o = { b: { c: 'x' }, users: [{ name: 'john' }, { name: 'jane' }] };
 * setObjectValue(o, 'b.c', 'y'); // 点路径
 * setObjectValue(o, ['users', 1, 'name'], 'jane-doe'); // 数组路径
 */
export const setObjectValue = set;
