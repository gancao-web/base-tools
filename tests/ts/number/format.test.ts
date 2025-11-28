import { describe, it, expect } from 'vitest';
import { toChineseCurrency } from '../../../src/ts';

describe('ts/number format - currency upper', () => {
  it('basic integers', () => {
    expect(toChineseCurrency(0)).toBe('零元整');
    expect(toChineseCurrency(1)).toBe('壹元整');
    expect(toChineseCurrency(10)).toBe('拾元整');
    expect(toChineseCurrency(101)).toBe('壹佰零壹元整');
    expect(toChineseCurrency(1001000)).toBe('壹佰万零壹仟元整');
  });

  it('fraction default dp=2', () => {
    expect(toChineseCurrency(0.1)).toBe('零元壹角');
    expect(toChineseCurrency(0.01)).toBe('零元壹分');
    expect(toChineseCurrency(1001.01)).toBe('壹仟零壹元壹分');
  });

  it('precision 3 - 厘', () => {
    expect(toChineseCurrency('1234.567', { precision: 3 })).toBe('壹仟贰佰叁拾肆元伍角陆分柒厘');
  });

  it('rounding', () => {
    expect(toChineseCurrency('1.235', { precision: 2 })).toBe('壹元贰角肆分');
    expect(toChineseCurrency('1.234', { precision: 2 })).toBe('壹元贰角叁分');
  });

  it('negative', () => {
    expect(toChineseCurrency(-1.2)).toBe('负壹元贰角');
  });
});
