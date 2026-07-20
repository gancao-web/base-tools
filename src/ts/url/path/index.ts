/**
 * 拼接 URL 路径，并清理各部分交界处多余的斜杠。
 *
 * 空字符串、`null` 和 `undefined` 会被忽略；协议中的 `://` 以及第一个有效参数
 * 开头的 `/` 会被保留。该函数仅用于拼接路径，不负责解析查询参数或哈希片段。
 *
 * @param parts URL 或路径片段
 * @returns 拼接后的 URL 路径；没有有效片段时返回空字符串
 * @example
 * joinUrlPath('https://a.com/', '/images/', '/avatar.png');
 * // 'https://a.com/images/avatar.png'
 *
 * joinUrlPath('', '/images/', null, 'avatar.png');
 * // '/images/avatar.png'
 */
export function joinUrlPath(...parts: Array<string | null | undefined>) {
  const values = parts.filter((part): part is string => !!part);
  if (!values.length) return '';

  const [first, ...rest] = values;
  const normalizedFirst = first.replace(/\/+$/, '');
  const normalizedRest = rest.map((part) => part.replace(/^\/+|\/+$/g, '')).filter(Boolean);

  if (!normalizedRest.length) {
    return normalizedFirst || (first.startsWith('/') ? '/' : '');
  }

  return `${normalizedFirst}/${normalizedRest.join('/')}`;
}
