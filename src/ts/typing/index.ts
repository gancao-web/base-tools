/**
 * 将指定属性设为必填（不改变其他属性）。
 * - 所有属性必填请使用内置的Required<T>
 * @example
 * type User = { id?: number; name?: string; age?: number };
 * type U1 = SetRequired<User, 'id' | 'name'>; // { id: number; name: string; age?: number }
 */
export type SetRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Omit<T, K>;

/**
 * 将指定属性设为可选（不改变其他属性）。
 * - 所有属性可选请使用内置的Partial<T>
 * @example
 * type User = { id: number; name: string; age: number };
 * type U2 = SetOptional<User, 'age'>; // { id: number; name: string; age?: number }
 */
export type SetOptional<T, K extends keyof T> = {
  [P in K]+?: T[P];
} & Omit<T, K>;

/**
 * 深度可选（递归将所有属性设为可选）。
 * @example
 * type T = { a: { b: number }; list: Array<{ id: string }> };
 * type R = DeepPartial<T>;
 */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * 深度必填（递归移除所有可选标记）。
 * @example
 * type T = { a?: { b?: number } };
 * type R = DeepRequired<T>; // { a: { b: number } }
 */
export type DeepRequired<T> = T extends (infer U)[]
  ? DeepRequired<U>[]
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { [K in keyof T]-?: DeepRequired<T[K]> }
      : T;

/**
 * 取消只读（顶层移除 `readonly`）。
 * @example
 * type R = Mutable<Readonly<{ a: number }>>; // { a: number }
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * 深度只读（递归添加 `readonly`）。
 * @example
 * type R = ReadonlyDeep<{ a: { b: number }; list: { id: string }[] }>;
 */
export type ReadonlyDeep<T> = T extends (infer U)[]
  ? ReadonlyArray<ReadonlyDeep<U>>
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> }
      : T;

/**
 * 对象值联合类型。
 * @example
 * type V = ValueOf<{ a: 1; b: 'x' }>; // 1 | 'x'
 */
export type ValueOf<T> = T[keyof T];

/**
 * 根据值类型获取键名联合。
 * @example
 * type Keys = KeysOfType<{ a: string; b: number; c: string }, string>; // 'a' | 'c'
 */
export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/**
 * 按值类型挑选属性。
 * @example
 * type R = PickByType<{ a: string; b: number; c: string }, string>; // { a: string; c: string }
 */
export type PickByType<T, V> = Pick<T, KeysOfType<T, V>>;

/**
 * 可选键名联合。
 * @example
 * type K = OptionalKeys<{ a?: number; b: string }>; // 'a'
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: Pick<T, K> extends Required<Pick<T, K>> ? never : K;
}[keyof T];

/**
 * 必填键名联合。
 * @example
 * type K = RequiredKeys<{ a?: number; b: string }>; // 'b'
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: Pick<T, K> extends Required<Pick<T, K>> ? K : never;
}[keyof T];

/**
 * 联合类型转交叉类型。
 * @example
 * type I = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
 */
export type UnionToIntersection<U> = (U extends unknown ? (x: U) => unknown : never) extends (
  x: infer I,
) => unknown
  ? I
  : never;

/**
 * 合并属性（以 `U` 覆盖 `T` 的同名属性）。
 * @example
 * type R = Merge<{ a: 1; b: 2 }, { b: 3; c: 4 }>; // { a: 1; b: 3; c: 4 }
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * 名义类型（品牌化）。
 * @example
 * type UserId = Brand<number, 'UserId'>;
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * 可空（包含 `null | undefined`）。
 * @example
 * type R = Nullable<string>; // string | null | undefined
 */
export type Nullable<T> = T | null | undefined;

/**
 * 可序列化为 JSON 的值类型。
 */
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [k: string]: JsonValue };
export type JsonArray = Array<JsonValue>;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * 精确匹配形状（不允许多余属性）。
 * @example
 * type Shape = { a: number };
 * type OK = Exact<{ a: number }, Shape>; // { a: number }
 * type NG = Exact<{ a: number; b: 1 }, Shape>; // never
 */
export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;
