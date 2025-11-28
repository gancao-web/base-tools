/**
 * 生成UUID
 * @returns UUID字符串
 * @example
 * const uuid = createUuid() // '7982fcfe-5721-4632-bede-6000885be57d'
 */
export function createUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成随机字符串id
 * - 常用于生成元素标签的id (默认加上'id_'前缀, 避免小程序中数字开头的id导致查询节点信息失败)
 * @param prefix 前缀, 默认 'id_'
 * @returns 随机字符串
 * @example
 * const id = createRandId(); // 'id_0rjuuuqv60xi'
 * const id = createRandId('canvas_'); // 'canvas_v82a7ctm09q'
 */
export function createRandId(prefix = 'id_') {
  return `${prefix}${Math.random().toString(36).substring(2, 16)}`;
}

/**
 * 时间+固定位数的随机数字字符串
 * @param digits 随机部分的位数，默认 6
 * @returns 时间+随机数字字符串
 * @example
 * const traceId = createTimeRandId(); // '1763002648039123456'
 * const traceId = createTimeRandId(8); // '176300264803912345678'
 */
export function createTimeRandId(digits: number = 6) {
  const base = 10 ** (digits - 1);
  const range = 9 * base;
  const randomInt = Math.floor(Math.random() * range) + base;

  return `${Date.now()}${randomInt}`;
}
