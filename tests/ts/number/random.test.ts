import { describe, it, expect } from 'vitest';
import { randomInt, randomFloat, randomBoolean } from '../../../src/ts';

describe('ts/number random', () => {
  it('randomInt returns integer within inclusive range', () => {
    for (let i = 0; i < 50; i++) {
      const n = randomInt(0, 10);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it('randomInt swaps bounds and handles decimals', () => {
    for (let i = 0; i < 20; i++) {
      const n = randomInt(10.8, 5.2);
      expect(n).toBeGreaterThanOrEqual(6);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it('randomInt throws on empty integer range', () => {
    expect(() => randomInt(0.1, 0.9)).toThrowError(/区间为空/);
  });

  it('randomFloat returns value within half-open range', () => {
    for (let i = 0; i < 20; i++) {
      const x = randomFloat(5.2, 10.8);
      expect(x).toBeGreaterThanOrEqual(5.2);
      expect(x).toBeLessThan(10.8);
    }
  });

  it('randomFloat swaps bounds and returns low when equal', () => {
    const x = randomFloat(10, 10);
    expect(x).toBe(10);
  });

  it('randomBoolean returns boolean', () => {
    const v = randomBoolean();
    expect(typeof v).toBe('boolean');
  });
});
