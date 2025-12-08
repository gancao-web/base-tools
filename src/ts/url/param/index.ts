/**
 * 将对象参数拼接到 URL
 * - 采用纯JS拼接，因为小程序不支持URLSearchParams
 * @param url 基础地址
 * @param param 将要追加的参数对象；`null/undefined` 值会被忽略，Object 会使用 `JSON.stringify`
 * @returns 拼接后的完整 URL（保留原有哈希片段）
 * @example
 * const url = appendUrlParam('https://a.com', { q: '测试', list: [1, 2], a: null, b: undefined }); // 'https://a.com/?q=%E6%B5%8B%E8%AF%95&list=[1,2]'
 */
export function appendUrlParam(url: string, param: Record<string, unknown>) {
  if (!param || typeof param !== 'object') return url;

  const hashIndex = url.indexOf('#');
  const baseWithoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';

  const [base, existingQs] = baseWithoutHash.split('?');
  const parts: string[] = [];
  if (existingQs) parts.push(existingQs);
  for (const key in param) {
    const rawVal = param[key];
    if (rawVal === null || rawVal === undefined) continue;
    const val = typeof rawVal === 'object' ? JSON.stringify(rawVal) : String(rawVal);
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
  }
  const qs = parts.filter(Boolean).join('&');
  return base + (qs ? `?${qs}` : '') + hash;
}
