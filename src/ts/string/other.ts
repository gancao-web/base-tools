/**
 * 获取字节长度 (支持字符串、Buffer/Uint8Array、File/Blob 等类型)
 * - 字符串按 UTF-8 编码计算字节长度（每个字符 1-4 字节）
 * - Buffer/Uint8Array 直接返回字节长度（每个元素 1 字节）
 * - File/Blob 返回文件/Blob 大小（字节数）
 * @param data 输入的数据
 * @returns 数据的字节长度
 * @example
 * getByteLength('abc') // 3
 * getByteLength('中文') // 6
 * getByteLength('😊') // 4
 * getByteLength(new Uint8Array([0x41, 0x42, 0x43])) // 3
 * getByteLength(new File(['abc'], 'test.txt')) // 3
 * getByteLength(new Blob(['中文'], { type: 'text/plain' })) // 6
 */
export function getByteLength(data: string | ArrayBuffer | ArrayBufferView | File | Blob): number {
  if (typeof data === 'string') {
    let byteLen = 0;

    for (let i = 0; i < data.length; i++) {
      const code = data.charCodeAt(i);

      if (code <= 0x7f) {
        byteLen += 1; // （ASCII 基本拉丁）→ 包含数字 0-9、英文字母 A-Z/a-z、常见符号
      } else if (code <= 0x7ff) {
        byteLen += 2; // （拉丁扩展）→ 包含拉丁字母（含变音符）、希腊文、俄文/西里尔文、希伯来文、阿拉伯文等
      } else if (code >= 0xd800 && code <= 0xdbff) {
        byteLen += 4; // （UTF-16 代理项）→ 包含 emoji、稀有汉字（扩展区）、音乐符号等
        i++;
      } else {
        byteLen += 3; // （BMP 绝大部分）→ 包含中文/日文/韩文的大多数字符（CJK 统一汉字）、以及大量其它脚本
      }
    }

    return byteLen;
  }

  // Buffer/Uint8Array
  if ('byteLength' in data) return data.byteLength;

  // File/Blob
  if ('size' in data) return data.size;

  throw new TypeError('getByteLength: Unsupported type');
}
