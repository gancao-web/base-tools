const WK = {
  val: '__l_val',
  exp: '__l_exp',
  wrap: '__l_wrap',
} as const;

/**
 * 写入 localStorage（自动 JSON 序列化）
 * 当 `value` 为 `null` 或 `undefined` 时，会移除该键。
 * 支持保存：对象、数组、字符串、数字、布尔值。
 * @param key 键名
 * @param value 任意可序列化的值
 * @param days 过期天数（从当前时间起算）
 * @example
 * setLocalStorage('user', { id: 1, name: 'Alice' }); // 对象
 * setLocalStorage('age', 18); // 数字
 * setLocalStorage('vip', true); // 布尔值
 * setLocalStorage('token', 'abc123', 7); // 7 天后过期
 */
export function setLocalStorage(key: string, value: unknown, days?: number) {
  if (value === undefined || value === null) {
    removeLocalStorage(key);
    return;
  }

  let toStore: unknown = value;
  if (typeof days === 'number' && days > 0) {
    const ms = days * 24 * 60 * 60 * 1000;
    toStore = {
      [WK.wrap]: true,
      [WK.val]: value,
      [WK.exp]: Date.now() + ms,
    };
  }

  localStorage.setItem(key, JSON.stringify(toStore));
}

/**
 * 读取 localStorage（自动 JSON 反序列化）
 * 若值为合法 JSON，则返回反序列化后的数据；
 * 若值非 JSON（如外部写入的纯字符串），则原样返回字符串。
 * 不存在时返回 `null`。
 * @param key 键名
 * @returns 解析后的值或 `null`
 * @example
 * const user = getLocalStorage<{ id: number; name: string }>('user');
 * const age = getLocalStorage<number>('age');
 * const vip = getLocalStorage<boolean>('vip');
 */
export function getLocalStorage<T = unknown>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === 'object' && WK.wrap in parsed && WK.exp in parsed) {
      if (Date.now() > parsed[WK.exp]) {
        removeLocalStorage(key);
        return null;
      }
      return parsed[WK.val] as T;
    }
    return parsed as T;
  } catch {
    return raw as T;
  }
}

/**
 * 移除 localStorage 指定键
 * @param key 键名
 * @example
 * removeLocalStorage('token');
 */
export function removeLocalStorage(key: string) {
  localStorage.removeItem(key);
}
