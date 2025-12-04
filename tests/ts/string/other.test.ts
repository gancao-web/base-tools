import { describe, it, expect } from 'vitest';
import { getByteLength } from '../../../src/ts';

describe('ts/string other', () => {
  it('getByteLength counts UTF-8 bytes', () => {
    expect(getByteLength('abc')).toBe(3);
    expect(getByteLength('中文')).toBe(6);
    expect(getByteLength('😊')).toBe(4);
    expect(getByteLength('a😊中')).toBe(1 + 4 + 3);
  });
});
