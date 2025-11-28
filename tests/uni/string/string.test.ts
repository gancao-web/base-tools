import { describe, it, expect } from 'vitest';
import { withUnitRpx } from '../../../src/uni';

describe('uni/string utils', () => {
  it('withUnitRpx adds rpx to numeric input', () => {
    expect(withUnitRpx(10)).toBe('10rpx');
    expect(withUnitRpx('10')).toBe('10rpx');
    expect(withUnitRpx('10px')).toBe('10px');
    expect(withUnitRpx('auto')).toBe('auto');
    expect(withUnitRpx('30%')).toBe('30%');
    expect(withUnitRpx('')).toBe('');
    expect(withUnitRpx(0)).toBe('0rpx');
  });
});
