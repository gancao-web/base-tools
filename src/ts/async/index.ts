/**
 * 将 Promise 包装为 [data, error] 形式, 减少 try-catch 代码量
 * @param p 要包装的 Promise
 * @returns 一个 Promise，其结果为 [data, error] 形式
 * @example
 * const [data, err] = await toAsync(fetch('https://api.example.com/data'));
 * if (err) {
 *   console.error(err);
 *   return;
 * }
 * console.log(data);
 */
export async function toAsync<T>(p: Promise<T>): Promise<[T | null, unknown]> {
  try {
    const data = await p;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}
