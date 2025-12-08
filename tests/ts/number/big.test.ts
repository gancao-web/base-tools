import { describe, it, expect } from 'vitest';
import {
  BigNumber,
  mathPlus,
  mathMinus,
  mathTimes,
  mathDiv,
  mathPow,
  mathRound,
  mathFixed,
  mathCompare,
  mathEqual,
  mathGreaterThan,
  mathGreaterThanOrEqual,
  mathLessThan,
  mathLessThanOrEqual,
} from '../../../src/ts';

describe('ts/number big', () => {
  it('add/sub/mul/div', () => {
    expect(mathPlus(0.1, 0.2)).toBeCloseTo(0.3);
    expect(mathPlus(1, 2, 3, 4)).toBe(10);
    expect(mathMinus(1, 0.9)).toBeCloseTo(0.1);
    expect(mathMinus(10, 1, 2, 3)).toBe(4);
    expect(mathTimes(0.1, 0.2)).toBeCloseTo(0.02);
    expect(mathTimes(2, 3, 4)).toBe(24);
    expect(mathDiv(1, 3)).toBeCloseTo(1 / 3, 10);
    expect(mathDiv(100, 5, 2)).toBe(10);
  });

  it('pow and round', () => {
    expect(mathPow(2, 3)).toBe(8);
    expect(mathRound('1.234', 2)).toBe(1.23);
    expect(mathRound('1.235', 2)).toBe(1.24);
    expect(mathRound('1.299', 2, BigNumber.ROUND_DOWN)).toBe(1.29);
  });

  it('toFixed formatting', () => {
    expect(mathFixed('1')).toBe('1.00');
    expect(+mathFixed('1')).toBe(1);
    expect(mathFixed(1.2345)).toBe('1.23');
    expect(mathFixed(1.2345, 3)).toBe('1.235');
    expect(mathFixed('1.2345', 0, BigNumber.ROUND_UP)).toBe('2');
  });

  it('compare/equal relations', () => {
    expect(mathCompare('2', '10')).toBe(-1);
    expect(mathCompare(3, 3)).toBe(0);
    expect(mathCompare('10', 2)).toBe(1);
    expect(mathEqual('1.0', 1)).toBe(true);
    expect(mathGreaterThan(2, 1)).toBe(true);
    expect(mathGreaterThanOrEqual(2, 2)).toBe(true);
    expect(mathLessThan(1, 2)).toBe(true);
    expect(mathLessThanOrEqual(1, 2)).toBe(true);
    expect(mathLessThanOrEqual(2, 1)).toBe(false);
  });
});
