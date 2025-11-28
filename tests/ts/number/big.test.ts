import { describe, it, expect } from 'vitest';
import {
  BigNumber,
  bigAdd,
  bigSub,
  bigMul,
  bigDiv,
  bigPow,
  bigRound,
  toFixed,
  bigCompare,
  bigEqual,
  bigGt,
  bigGte,
  bigLt,
  bigLte,
} from '../../../src/ts';

describe('ts/number big', () => {
  it('add/sub/mul/div', () => {
    expect(bigAdd(0.1, 0.2)).toBeCloseTo(0.3);
    expect(bigAdd(1, 2, 3, 4)).toBe(10);
    expect(bigSub(1, 0.9)).toBeCloseTo(0.1);
    expect(bigSub(10, 1, 2, 3)).toBe(4);
    expect(bigMul(0.1, 0.2)).toBeCloseTo(0.02);
    expect(bigMul(2, 3, 4)).toBe(24);
    expect(bigDiv(1, 3)).toBeCloseTo(1 / 3, 10);
    expect(bigDiv(100, 5, 2)).toBe(10);
  });

  it('pow and round', () => {
    expect(bigPow(2, 3)).toBe(8);
    expect(bigRound('1.234', 2)).toBe(1.23);
    expect(bigRound('1.235', 2)).toBe(1.24);
    expect(bigRound('1.299', 2, BigNumber.ROUND_DOWN)).toBe(1.29);
  });

  it('toFixed formatting', () => {
    expect(toFixed('1')).toBe('1.00');
    expect(+toFixed('1')).toBe(1);
    expect(toFixed(1.2345)).toBe('1.23');
    expect(toFixed(1.2345, 3)).toBe('1.235');
    expect(toFixed('1.2345', 0, BigNumber.ROUND_UP)).toBe('2');
  });

  it('compare/equal relations', () => {
    expect(bigCompare('2', '10')).toBe(-1);
    expect(bigCompare(3, 3)).toBe(0);
    expect(bigCompare('10', 2)).toBe(1);
    expect(bigEqual('1.0', 1)).toBe(true);
    expect(bigGt(2, 1)).toBe(true);
    expect(bigGte(2, 2)).toBe(true);
    expect(bigLt(1, 2)).toBe(true);
    expect(bigLte(1, 2)).toBe(true);
    expect(bigLte(2, 1)).toBe(false);
  });
});
