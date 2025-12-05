import { getUrlNumber, getUrlParam, getUrlParamAll } from '../../ts';

/**
 * 获取url的查询参数值
 * - 与 {@link getUrlParam} 相同，只是参数url可选,默认取当前地址
 * @param key 参数名
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的参数值 (若不存在|"null"|"undefined"，则返回 null)
 * @example
 * const q = getUrlQuery('q'); // 默认当前地址
 * const q = getUrlQuery('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95'); // "测试"
 * const a = getUrlQuery('a', 'a=1'); // "1"
 * const list = getUrlQuery('list', 'list=[1,2]'); // "[1,2]"
 * const list = getUrlQuery('list', 'list=null'); // null
 * const list = getUrlQuery('list', 'list=undefined'); // null
 */
export function getUrlQuery(key: string, url = window.location.href) {
  return getUrlParam(key, url);
}

/**
 * 获取url的查询参数值,并转为number类型
 * - 与 {@link getUrlNumber} 相同，只是参数url可选,默认取当前地址
 * @param key 参数名
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的参数值 (若不存在|"非数字字符串"，则返回 null)
 * @example
 * const a = getUrlQueryNumber('a'); // 默认当前地址
 * const a = getUrlQueryNumber('a', 'https://a.com/?a=1'); // 1
 * const a = getUrlQueryNumber('a', 'a=1'); // 1
 * const a = getUrlQueryNumber('a', 'a=1.2'); // 1.2
 * const a = getUrlQueryNumber('a', 'a=abc'); // null
 */
export function getUrlQueryNumber(key: string, url = window.location.href) {
  return getUrlNumber(key, url);
}

/**
 * 获取url的所有查询参数值
 * - 与 {@link getUrlParamAll} 相同，只是参数url可选,默认取当前地址
 * @param url 完整 URL 或仅查询串（如 "a=1&b=2"）
 * @returns 解码后的键值对象（无参数返回空对象; "null"|"undefined"的参数会被忽略）
 * @example
 * const params = getUrlQueryAll(); // 默认当前地址
 * const params = getUrlQueryAll('a=1&b=2'); // { a: "1", b: "2" }
 * const params = getUrlQueryAll('https://a.com/?a=1&b=2'); // { a: "1", b: "2" }
 * const params = getUrlQueryAll('a=1&b=null'); // { a: "1" }
 * const params = getUrlQueryAll('a=1&b=undefined'); // { a: "1" }
 */
export function getUrlQueryAll(url = window.location.href) {
  return getUrlParamAll(url);
}
