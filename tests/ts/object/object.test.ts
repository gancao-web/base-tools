import { describe, it, expect } from 'vitest';
import { getObjectKeys } from '../../../src/ts';

describe('ts/object utils', () => {
  it('getObjectKeys returns own enumerable keys', () => {
    const o = { a: 1, b: 'x' };
    const keys = getObjectKeys(o);
    expect(keys.sort()).toEqual(['a', 'b']);
  });
});
