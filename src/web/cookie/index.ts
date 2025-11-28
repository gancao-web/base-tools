/**
 * 设置 Cookie（路径默认为 `/`）
 * @param name Cookie 名称
 * @param value Cookie 值（内部已使用 `encodeURIComponent` 编码）
 * @param days 过期天数（从当前时间起算）
 * @example
 * setCookie('token', 'abc', 7);
 */
export function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}; path=/`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}`;
}

/**
 * 获取 Cookie
 * @param name Cookie 名称
 * @returns 若存在返回解码后的值，否则 `null`
 * @example
 * const token = getCookie('token');
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const v = parts.pop()?.split(';').shift();
    return v ? decodeURIComponent(v) : null;
  }
  return null;
}

/**
 * 移除 Cookie（通过设置过期时间为过去）
 * 路径固定为 `/`，确保与默认写入路径一致。
 * @param name Cookie 名称
 * @example
 * removeCookie('token');
 */
export function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
