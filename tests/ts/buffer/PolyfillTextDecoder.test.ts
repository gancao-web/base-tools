import { describe, it, expect } from 'vitest';
import PolyfillTextDecoder from '../../../src/ts/buffer/PolyfillTextDecoder';

function toArrayBufferFromBytes(bytes: number[]) {
  return new Uint8Array(bytes).buffer;
}

function toArrayBufferFromText(text: string) {
  const u8 = Buffer.from(text, 'utf-8');
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

// 兼容旧的测试用例 helper
function bufferToText(buffer: ArrayBuffer) {
  return new PolyfillTextDecoder().decode(buffer);
}

describe('ts/buffer PolyfillTextDecoder', () => {
  describe('static decoding (legacy bufferToText behavior)', () => {
    it('decodes valid UTF-8', () => {
      expect(bufferToText(toArrayBufferFromText('hello'))).toBe('hello');
      expect(bufferToText(toArrayBufferFromText('中文'))).toBe('中文');
      expect(bufferToText(toArrayBufferFromText('😊'))).toBe('😊');
      expect(bufferToText(toArrayBufferFromText('a😊中'))).toBe('a😊中');
    });

    it('replaces invalid UTF-8 sequences', () => {
      const replacement = '\uFFFD';
      expect(bufferToText(toArrayBufferFromBytes([0xc2, 0x41]))).toBe(`${replacement}A`);
      expect(bufferToText(toArrayBufferFromBytes([0xe0, 0x80, 0x80]))).toBe(replacement);
      expect(bufferToText(toArrayBufferFromBytes([0xed, 0xa0, 0x80]))).toBe(replacement);
      expect(bufferToText(toArrayBufferFromBytes([0xf0, 0x80, 0x80, 0x80]))).toBe(replacement);
      expect(bufferToText(toArrayBufferFromBytes([0xf4, 0x90, 0x80, 0x80]))).toBe(replacement);
    });

    it('replaces incomplete trailing sequences in non-stream mode', () => {
      expect(bufferToText(toArrayBufferFromBytes([0xe4, 0xb8]))).toBe('\uFFFD');
      expect(bufferToText(toArrayBufferFromBytes([0xf0, 0x9f, 0x98]))).toBe('\uFFFD');
    });
  });

  describe('streaming decoding', () => {
    it('handles split multi-byte characters correctly', () => {
      const decoder = new PolyfillTextDecoder();
      const text = '你好';
      // '你': [0xe4, 0xbd, 0xa0]
      // '好': [0xe5, 0xa5, 0xbd]

      const bytes = new Uint8Array(Buffer.from(text, 'utf-8'));

      // Split '你' between 2nd and 3rd byte: [0xe4, 0xbd] | [0xa0, ...]
      const chunk1 = bytes.slice(0, 2);
      const chunk2 = bytes.slice(2);

      const str1 = decoder.decode(chunk1, { stream: true });
      expect(str1).toBe(''); // Should be empty as char is incomplete

      const str2 = decoder.decode(chunk2, { stream: true });
      expect(str2).toBe('你好');
    });

    it('handles split 4-byte emoji correctly', () => {
      const decoder = new PolyfillTextDecoder();
      const text = '😊'; // [0xf0, 0x9f, 0x98, 0x8a]

      const bytes = new Uint8Array(Buffer.from(text, 'utf-8'));

      // Feed bytes one by one
      expect(decoder.decode(bytes.slice(0, 1), { stream: true })).toBe('');
      expect(decoder.decode(bytes.slice(1, 2), { stream: true })).toBe('');
      expect(decoder.decode(bytes.slice(2, 3), { stream: true })).toBe('');
      expect(decoder.decode(bytes.slice(3, 4), { stream: true })).toBe('😊');
    });

    it('flushes incomplete bytes when stream is false', () => {
      const decoder = new PolyfillTextDecoder();
      // Incomplete '你' [0xe4, 0xbd]
      const chunk = new Uint8Array([0xe4, 0xbd]);

      // stream: true -> buffer it
      expect(decoder.decode(chunk, { stream: true })).toBe('');

      // stream: false (or default) -> flush and replace with replacement char
      // Note: decode() with no args flushes if implemented, but here we pass undefined
      // Our implementation: decode(undefined, { stream: false }) flushes leftovers
      expect(decoder.decode(undefined, { stream: false })).toBe('\uFFFD');
    });

    it('handles multiple chunks with mixed content', () => {
      const decoder = new PolyfillTextDecoder();
      // "A" + "你" (split) + "好"
      const bytesA = new Uint8Array([0x41]); // 'A'
      const bytesNiPart1 = new Uint8Array([0xe4, 0xbd]); // '你' part 1
      const bytesNiPart2 = new Uint8Array([0xa0]); // '你' part 2
      const bytesHao = new Uint8Array([0xe5, 0xa5, 0xbd]); // '好'

      expect(decoder.decode(bytesA, { stream: true })).toBe('A');
      expect(decoder.decode(bytesNiPart1, { stream: true })).toBe('');

      // When part 2 comes, it should combine with buffered part 1 to emit '你'
      expect(decoder.decode(bytesNiPart2, { stream: true })).toBe('你');
      expect(decoder.decode(bytesHao, { stream: true })).toBe('好');
    });
  });
});
