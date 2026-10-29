const BASE64_LIMIT = 4096;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * 有选择地生成日志快照，仅替换日志中的文件载荷，不修改原始数据：
 * - File、Blob 记录大小、MIME 和适用的文件名；ArrayBuffer、类型化数组、DataView 记录类型和字节大小。
 * - 可识别的 ReadableStream、WritableStream、TransformStream 仅记录类型，不读取或消费流。
 * - 完整且编码合法的 base64 Data URL，编码正文超过 4096 字符才生成摘要；
 *   裸 base64 还须匹配 PNG、JPEG、GIF、WebP、PDF、ZIP、GZIP 文件头，否则原样保留。
 * - FormData 转为条目数组并保留重名字段；对象、数组、Map、Set 等递归处理其中的值。
 * 普通长文本、富文本、未知编码均完整保留，不解析正文、HTML 或 JSON 字符串中嵌入的 base64。
 */
export function createLogSnapshot<T>(value: T): T {
  const seen = new WeakMap<object, unknown>();
  const visit = (input: unknown): unknown => {
    if (typeof input === 'string') return snapshotString(input);
    if (!input || typeof input !== 'object') return input;
    if (seen.has(input)) return seen.get(input);
    if (typeof Blob !== 'undefined' && input instanceof Blob) {
      const name =
        typeof File !== 'undefined' && input instanceof File ? `, name=${input.name}` : '';
      return `[${name ? 'File' : 'Blob'}：size=${input.size}, type=${input.type || 'unknown'}${name}]`;
    }
    if (typeof ArrayBuffer !== 'undefined') {
      if (input instanceof ArrayBuffer)
        return `[ArrayBuffer：byteLength=${input.byteLength}]`;
      if (ArrayBuffer.isView(input))
        return `[${Object.prototype.toString.call(input).slice(8, -1)}：byteLength=${input.byteLength}]`;
    }
    if (typeof ReadableStream !== 'undefined' && input instanceof ReadableStream)
      return '[ReadableStream]';
    if (typeof WritableStream !== 'undefined' && input instanceof WritableStream)
      return '[WritableStream]';
    if (typeof TransformStream !== 'undefined' && input instanceof TransformStream)
      return '[TransformStream]';
    if (typeof FormData !== 'undefined' && input instanceof FormData) {
      const entries: unknown[] = [];
      seen.set(input, entries);
      input.forEach((entry, key) => entries.push([key, visit(entry)]));
      return entries;
    }
    if (input instanceof Date) return new Date(input.getTime());
    if (input instanceof RegExp) {
      const copy = new RegExp(input.source, input.flags);
      copy.lastIndex = input.lastIndex;
      return copy;
    }
    if (input instanceof Map) {
      const copy = new Map();
      seen.set(input, copy);
      input.forEach((entry, key) => copy.set(visit(key), visit(entry)));
      return copy;
    }
    if (input instanceof Set) {
      const copy = new Set();
      seen.set(input, copy);
      input.forEach((entry) => copy.add(visit(entry)));
      return copy;
    }
    // 未识别的内建类型可能依赖内部槽，不能仅复制原型伪造实例。
    const tag = Object.prototype.toString.call(input);
    if (!Array.isArray(input) && !(input instanceof Error) && tag !== '[object Object]')
      return input;
    const copy = Array.isArray(input)
      ? new Array(input.length)
      : Object.create(Object.getPrototypeOf(input));
    seen.set(input, copy);
    const keys = new Set<string | symbol>(
      Reflect.ownKeys(input).filter((key) =>
        Object.prototype.propertyIsEnumerable.call(input, key),
      ),
    );
    if (input instanceof Error) {
      for (const key of ['name', 'message', 'stack', 'cause']) {
        if (key in input) keys.add(key);
      }
    }
    for (const key of keys) {
      let entry: unknown;
      try {
        entry = visit((input as Record<string | symbol, unknown>)[key]);
      } catch {
        entry = '[Unable to read log field]';
      }
      Object.defineProperty(copy, key, {
        value: entry,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return copy;
  };
  return visit(value) as T;
}

/** 只识别完整编码；不解析正文、HTML 或 JSON 中嵌入的内容。 */
function base64Prefix(value: string): number[] | undefined {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0;
  const length = value.length - padding;
  if (length % 4 === 1 || (padding && value.length % 4 !== 0)) return;
  if (padding && padding !== (4 - (length % 4)) % 4) return;
  if (/[^A-Za-z0-9+/_=-]/.test(value) || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(value)) return;
  if (/[+/]/.test(value) && /[-_]/.test(value)) return;
  const digit = (char: string) => ALPHABET.indexOf(char === '-' ? '+' : char === '_' ? '/' : char);
  const tail = digit(value[length - 1]);
  if ((length % 4 === 2 && (tail & 15) !== 0) || (length % 4 === 3 && (tail & 3) !== 0)) return;
  const bytes: number[] = [];
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < Math.min(length, 16); i++) {
    buffer = (buffer << 6) | digit(value[i]);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 255);
    }
  }
  return bytes;
}

function fileType(bytes: number[]): string | undefined {
  const matches = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[index + offset] === byte);
  if (matches([137, 80, 78, 71, 13, 10, 26, 10])) return 'image/png';
  if (matches([255, 216, 255])) return 'image/jpeg';
  if (matches([71, 73, 70, 56, 55, 97]) || matches([71, 73, 70, 56, 57, 97])) return 'image/gif';
  if (matches([82, 73, 70, 70]) && matches([87, 69, 66, 80], 8)) return 'image/webp';
  if (matches([37, 80, 68, 70, 45])) return 'application/pdf';
  if (matches([80, 75, 3, 4]) || matches([80, 75, 5, 6]) || matches([80, 75, 7, 8]))
    return 'application/zip';
  if (matches([31, 139, 8])) return 'application/gzip';
}

function snapshotString(value: string): string {
  if (value.length <= BASE64_LIMIT) return value;
  const prefix = /^data:([^,\s<>]*);base64,/.exec(value);
  const body = prefix ? value.slice(prefix[0].length) : value;
  if (body.length <= BASE64_LIMIT) return value;
  const bytes = base64Prefix(body);
  if (!bytes) return value;
  const type = prefix ? prefix[1].split(';')[0] || 'text/plain' : fileType(bytes);
  return type ? `[base64：type=${type}, encodedLength=${body.length}]` : value;
}
