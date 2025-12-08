/**
 * 获取url的查询参数值
 * - 采用纯JS解析，因为小程序不支持URLSearchParams
 * @param key 参数名
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的参数值 (若不存在|"null"|"undefined"，则返回 null)
 * @example
 * const q = getUrlParam('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95'); // "测试"
 * const a = getUrlParam('a', 'a=1'); // "1"
 * const list = getUrlParam('list', 'list=[1,2]'); // "[1,2]"
 * const list = getUrlParam('list', 'list=null'); // null
 * const list = getUrlParam('list', 'list=undefined'); // null
 */
export function getUrlParam(key: string, url: string) {
  const raw = url.includes('?') ? url.slice(url.indexOf('?') + 1) : url.includes('=') ? url : '';
  const qs = raw.split('#')[0];
  if (!qs) return null;
  const pairs = qs.split('&').filter(Boolean);
  const decode = (s: string) => {
    try {
      return decodeURIComponent(s.replace(/\+/g, ' '));
    } catch {
      return s;
    }
  };
  for (const pair of pairs) {
    const i = pair.indexOf('=');
    const k = i >= 0 ? pair.slice(0, i) : pair;
    if (decode(k) === key) {
      const v = i >= 0 ? decode(pair.slice(i + 1)) : '';
      return v !== 'null' && v !== 'undefined' ? v : null;
    }
  }
  return null;
}

/**
 * 获取url的查询参数值,并转为number类型
 * @param key 参数名
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的参数值 (若不存在|"非数字字符串"，则返回 null)
 * @example
 * const a = getUrlNumber('a', 'https://a.com/?a=1'); // 1
 * const a = getUrlNumber('a', 'a=1'); // 1
 * const a = getUrlNumber('a', 'a=1.2'); // 1.2
 * const a = getUrlNumber('a', 'a=abc'); // null
 */
export function getUrlNumber(key: string, url: string) {
  const str = getUrlParam(key, url);
  if (!str) return null;

  const num = Number(str);
  return isNaN(num) ? null : num;
}

/**
 * 获取url的所有查询参数值
 * - 采用纯JS解析，因为小程序不支持URLSearchParams
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的键值对象（无参数返回空对象; "null"|"undefined"的参数会被忽略）
 * @example
 * const params = getUrlParams('a=1&b=2'); // { a: "1", b: "2" }
 * const params = getUrlParams('https://a.com/?a=1&b=2'); // { a: "1", b: "2" }
 * const params = getUrlParams('a=1&b=null'); // { a: "1" }
 * const params = getUrlParams('a=1&b=undefined'); // { a: "1" }
 */
export function getUrlParams(url: string) {
  const raw = url.includes('?') ? url.slice(url.indexOf('?') + 1) : url.includes('=') ? url : '';
  const qs = raw.split('#')[0];
  const result: Record<string, string> = {};
  if (!qs) return result;
  const decode = (s: string) => {
    try {
      return decodeURIComponent(s.replace(/\+/g, ' '));
    } catch {
      return s;
    }
  };
  for (const seg of qs.split('&')) {
    if (!seg) continue;
    const i = seg.indexOf('=');
    const k = i >= 0 ? seg.slice(0, i) : seg;
    const v = i >= 0 ? seg.slice(i + 1) : '';
    const dv = decode(v);
    if (dv !== 'null' && dv !== 'undefined') {
      result[decode(k)] = dv;
    }
  }
  return result;
}
