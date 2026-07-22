import { describe, it, expect } from 'vitest';
import { getObjectKeys, omitUndefined } from '../../../src/ts';

describe('ts/object utils', () => {
  it('getObjectKeys returns own enumerable keys', () => {
    const o = { a: 1, b: 'x' };
    const keys = getObjectKeys(o);
    expect(keys.sort()).toEqual(['a', 'b']);
  });

  it('omitUndefined only removes undefined values', () => {
    expect(omitUndefined({ a: 1, b: undefined, c: null, d: false, e: '' })).toEqual({
      a: 1,
      c: null,
      d: false,
      e: '',
    });
  });
});
