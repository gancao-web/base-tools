import { describe, it, expect } from 'vitest';
import { getStringByteLength } from '../../../src/ts';

describe('ts/string other', () => {
  it('getStringByteLength counts UTF-8 bytes', () => {
    expect(getStringByteLength('abc')).toBe(3);
    expect(getStringByteLength('中文')).toBe(6);
    expect(getStringByteLength('😊')).toBe(4);
    expect(getStringByteLength('a😊中')).toBe(1 + 4 + 3);
  });
});
