import { describe, it, expect } from 'vitest';
import { arrayMove } from '../../../src/ts';

describe('ts/array utils', () => {
  it('arrayMove moves element without mutating original', () => {
    const src = [1, 2, 3, 4];
    const res = arrayMove(src, 1, 3); // move 2 to index 3
    expect(res).toEqual([1, 3, 4, 2]);
    expect(src).toEqual([1, 2, 3, 4]);
  });

  it('arrayMove supports generic types', () => {
    const src = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const res = arrayMove(src, 0, 2);
    expect(res.map((x) => x.id)).toEqual([2, 3, 1]);
  });
});
