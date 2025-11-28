import { describe, it, expect } from 'vitest';
import { toMaskText, toMaskPhone, toMaskName } from '../../../src/ts';

describe('ts/string format', () => {
  it('toMaskText basic', () => {
    expect(toMaskText('王小明', 1, 0)).toBe('王**');
    expect(toMaskText('王小明', 1, 1)).toBe('王*明');
    expect(toMaskText('13800138000', 3, 4)).toBe('138****8000');
    expect(toMaskText('', 1, 1)).toBe('');
  });

  it('toMaskPhone', () => {
    expect(toMaskPhone('13800138000')).toBe('138****8000');
  });

  it('toMaskName', () => {
    expect(toMaskName('张三')).toBe('张*');
    expect(toMaskName('王小明')).toBe('王*明');
    expect(toMaskName('')).toBe('');
  });
});
