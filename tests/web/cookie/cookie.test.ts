import { describe, it, expect } from 'vitest';
import { setCookie, getCookie, removeCookie } from '../../../src/web';

describe('web/cookie', () => {
  it('set/get/remove cookie', () => {
    // Node 环境下无 document，创建最小可用的 stub
    // @ts-expect-error test env stub
    globalThis.document = { cookie: '' };
    setCookie('token', 'abc', 7);
    expect(getCookie('token')).toBe('abc');
    removeCookie('token');
    expect(getCookie('token')).toBeNull();
  });
});
