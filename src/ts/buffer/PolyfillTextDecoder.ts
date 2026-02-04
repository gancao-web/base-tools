/**
 * 模拟 TextDecoder 的简单实现
 * @description 用于在不支持 TextDecoder 的环境（如小程序）中进行流式解码
 */
class PolyfillTextDecoder {
  private leftOver: Uint8Array = new Uint8Array(0);

  decode(input?: ArrayBuffer | Uint8Array, options?: { stream?: boolean }): string {
    const stream = options?.stream ?? false;
    let bytes: Uint8Array;

    if (!input) {
      bytes = new Uint8Array(0);
    } else if (input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input);
    } else {
      bytes = input;
    }

    if (this.leftOver.length > 0) {
      const merged = new Uint8Array(this.leftOver.length + bytes.length);
      merged.set(this.leftOver);
      merged.set(bytes, this.leftOver.length);
      bytes = merged;
      this.leftOver = new Uint8Array(0);
    }

    const len = bytes.length;
    if (len === 0) return '';

    const parts: string[] = [];
    let i = 0;
    const replacement = '\uFFFD';
    const isContinuationByte = (b: number) => (b & 0xc0) === 0x80;

    while (i < len) {
      const byte1 = bytes[i];

      // 1字节字符 (0xxxxxxx)
      if (byte1 < 0x80) {
        parts.push(String.fromCharCode(byte1));
        i += 1;
      }
      // 2字节字符 (110xxxxx 10xxxxxx)
      else if (byte1 >= 0xc2 && byte1 < 0xe0) {
        if (i + 1 >= len) {
          if (stream) {
            this.leftOver = bytes.slice(i);
            break;
          }
          parts.push(replacement);
          break;
        }
        const byte2 = bytes[i + 1];
        if (!isContinuationByte(byte2)) {
          parts.push(replacement);
          i += 1;
          continue;
        }
        parts.push(String.fromCharCode(((byte1 & 0x1f) << 6) | (byte2 & 0x3f)));
        i += 2;
      }
      // 3字节字符 (1110xxxx 10xxxxxx 10xxxxxx)
      else if (byte1 >= 0xe0 && byte1 < 0xf0) {
        if (i + 2 >= len) {
          if (stream) {
            this.leftOver = bytes.slice(i);
            break;
          }
          parts.push(replacement);
          break;
        }
        const byte2 = bytes[i + 1];
        const byte3 = bytes[i + 2];
        if (!isContinuationByte(byte2) || !isContinuationByte(byte3)) {
          parts.push(replacement);
          i += 1;
          continue;
        }
        if (byte1 === 0xe0 && byte2 < 0xa0) {
          parts.push(replacement);
          i += 3;
          continue;
        }
        if (byte1 === 0xed && byte2 >= 0xa0) {
          parts.push(replacement);
          i += 3;
          continue;
        }
        const codeUnit = ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
        parts.push(String.fromCharCode(codeUnit));
        i += 3;
      }
      // 4字节字符 (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx) - 处理emoji等
      else if (byte1 >= 0xf0 && byte1 <= 0xf4) {
        if (i + 3 >= len) {
          if (stream) {
            this.leftOver = bytes.slice(i);
            break;
          }
          parts.push(replacement);
          break;
        }
        const byte2 = bytes[i + 1];
        const byte3 = bytes[i + 2];
        const byte4 = bytes[i + 3];
        if (
          !isContinuationByte(byte2) ||
          !isContinuationByte(byte3) ||
          !isContinuationByte(byte4)
        ) {
          parts.push(replacement);
          i += 1;
          continue;
        }
        if (byte1 === 0xf0 && byte2 < 0x90) {
          parts.push(replacement);
          i += 4;
          continue;
        }
        if (byte1 === 0xf4 && byte2 >= 0x90) {
          parts.push(replacement);
          i += 4;
          continue;
        }
        const codepoint =
          ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f);
        const offset = codepoint - 0x10000;
        parts.push(String.fromCharCode(0xd800 + (offset >> 10), 0xdc00 + (offset & 0x3ff)));
        i += 4;
      } else {
        parts.push(replacement);
        i += 1;
      }
    }

    return parts.join('');
  }
}

export default PolyfillTextDecoder;
