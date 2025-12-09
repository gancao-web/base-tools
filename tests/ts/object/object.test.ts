import { describe, it, expect } from 'vitest';
import { getObjectKeys, getObjectValue, setObjectValue } from '../../../src/ts';

describe('ts/object utils', () => {
  it('getObjectKeys returns own enumerable keys', () => {
    const o = { a: 1, b: 'x' };
    const keys = getObjectKeys(o);
    expect(keys.sort()).toEqual(['a', 'b']);
  });

  it('getObjectValue gets values correctly', () => {
    const o = { b: { c: 'x' }, users: [{ name: 'john' }, { name: 'jane' }] };
    expect(getObjectValue(o, 'b.c')).toBe('x');
    expect(getObjectValue(o, 'users[0].name')).toBe('john');
    expect(getObjectValue(o, ['users', 1, 'name'])).toBe('jane');
    expect(getObjectValue(o, 'b.d')).toBeUndefined();
  });

  it('setObjectValue sets values correctly', () => {
    const o: any = { b: { c: 'x' }, users: [{ name: 'john' }] };
    
    setObjectValue(o, 'b.c', 'y');
    expect(o.b.c).toBe('y');

    setObjectValue(o, 'users[0].name', 'doe');
    expect(o.users[0].name).toBe('doe');

    setObjectValue(o, ['users', 0, 'age'], 30);
    expect(o.users[0].age).toBe(30);

    setObjectValue(o, 'newProp', 'newVal');
    expect(o.newProp).toBe('newVal');
  });
});
