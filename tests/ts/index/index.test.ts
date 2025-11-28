import { describe, it, expect } from 'vitest';
import { withUnitPx, arrayMove } from '../../../src/ts';

describe('ts module root exports', () => {
  it('allows importing withUnitPx from ts root', () => {
    expect(withUnitPx(12)).toBe('12px');
  });

  it('allows importing arrayMove from ts root', () => {
    expect(arrayMove([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
  });
});
