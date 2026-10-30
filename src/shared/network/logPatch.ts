import { isPlainObject } from 'es-toolkit';

/** 与上层请求封装共用的内部逻辑报文通道；不进入日志，也不占用调用方补丁字段。 */
export const requestLogSourceKey = Symbol.for('@base-web-kits/request-log-source');
export type RequestLogSource = { data?: unknown; res?: unknown; dataPatch?: unknown; resPatch?: unknown };

/** 仅合并普通对象；数组、标量和特殊对象整体替换，不修改任一输入。 */
export function patchLogValue(source: unknown, patch: unknown): unknown {
  if (patch === undefined) return source;
  const seen = new WeakMap<object, WeakMap<object, Record<string, unknown>>>();
  const merge = (base: unknown, extra: unknown): unknown => {
    if (!isPlainObject(base) || !isPlainObject(extra)) return extra;
    let patches = seen.get(base);
    const cached = patches?.get(extra);
    if (cached) return cached;
    if (!patches) {
      patches = new WeakMap();
      seen.set(base, patches);
    }
    const result: Record<string, unknown> = { ...base };
    patches.set(extra, result);
    for (const key of Object.keys(extra)) {
      const value = Object.prototype.hasOwnProperty.call(base, key) ? base[key] : undefined;
      // 使用数据属性，避免 __proto__/constructor 等报文字段触发原型写入。
      Object.defineProperty(result, key, {
        value: merge(value, extra[key]), enumerable: true, configurable: true, writable: true,
      });
    }
    return result;
  };
  return merge(source, patch);
}

/** Header 按大小写不敏感匹配；清除同名不同大小写的旧项，避免原敏感值残留。 */
export function patchLogHeader(source: unknown, patch: unknown): unknown {
  if (patch === undefined) return source;
  if (!isPlainObject(source) || !isPlainObject(patch)) return patch;
  const result: Record<string, unknown> = { ...source };
  for (const key of Object.keys(patch)) {
    for (const oldKey of Object.keys(result)) {
      if (oldKey.toLowerCase() === key.toLowerCase()) delete result[oldKey];
    }
    Object.defineProperty(result, key, {
      value: patch[key], enumerable: true, configurable: true, writable: true,
    });
  }
  return result;
}
