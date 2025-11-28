import { describe, it, expect, beforeEach } from 'vitest';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '../../../src/web';

const store: Record<string, string> = {};

const mockStorage = {
  getItem(key: string) {
    return key in store ? store[key] : null;
  },
  setItem(key: string, value: string) {
    store[key] = value;
  },
  removeItem(key: string) {
    delete store[key];
  },
  clear() {
    Object.keys(store).forEach((k) => delete store[k]);
  },
  key(index: number) {
    return Object.keys(store)[index] ?? null;
  },
  get length() {
    return Object.keys(store).length;
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
});

beforeEach(() => {
  mockStorage.clear();
});

describe('web/storage utils', () => {
  it('set/get object', () => {
    const user = { id: 1, name: 'Alice' };
    setLocalStorage('user', user);
    expect(getLocalStorage<typeof user>('user')).toEqual(user);
  });

  it('set/get number', () => {
    setLocalStorage('age', 18);
    expect(getLocalStorage<number>('age')).toBe(18);
  });

  it('set/get boolean', () => {
    setLocalStorage('vip', true);
    expect(getLocalStorage<boolean>('vip')).toBe(true);
  });

  it('get returns null for missing key', () => {
    expect(getLocalStorage('missing')).toBeNull();
  });

  it('fallback to raw string when value is non-JSON', () => {
    // 模拟外部写入了非 JSON 的纯字符串
    globalThis.localStorage.setItem('k', 'abc');
    expect(getLocalStorage('k')).toBe('abc');
  });

  it('set with null/undefined removes key', () => {
    setLocalStorage('x', 'value');
    setLocalStorage('x', null);
    expect(getLocalStorage('x')).toBeNull();

    setLocalStorage('y', 'value');
    setLocalStorage('y', undefined);
    expect(getLocalStorage('y')).toBeNull();
  });

  it('removeLocalStorage removes key', () => {
    setLocalStorage('token', 't');
    removeLocalStorage('token');
    expect(getLocalStorage('token')).toBeNull();
  });
});
