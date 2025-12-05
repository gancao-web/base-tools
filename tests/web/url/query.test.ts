import { describe, it, expect } from 'vitest';
import { getUrlQuery, getUrlQueryNumber, getUrlQueryAll } from '../../../src/web';

describe('web/url query', () => {
  it('getUrlQuery decodes and handles null/undefined strings', () => {
    expect(getUrlQuery('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95')).toBe('测试');
    expect(getUrlQuery('a', 'a=1')).toBe('1');
    expect(getUrlQuery('list', 'list=[1,2]')).toBe('[1,2]');
    expect(getUrlQuery('list', 'list=null')).toBeNull();
    expect(getUrlQuery('list', 'list=undefined')).toBeNull();
  });

  it('getUrlQueryNumber returns number or null', () => {
    expect(getUrlQueryNumber('a', 'https://a.com/?a=1')).toBe(1);
    expect(getUrlQueryNumber('a', 'a=1')).toBe(1);
    expect(getUrlQueryNumber('a', 'a=1.2')).toBe(1.2);
    expect(getUrlQueryNumber('a', 'a=abc')).toBeNull();
  });

  it('getUrlQueryAll returns decoded object', () => {
    expect(getUrlQueryAll('a=1&b=2')).toEqual({ a: '1', b: '2' });
    expect(getUrlQueryAll('https://a.com/?a=1&b=2')).toEqual({ a: '1', b: '2' });
    expect(getUrlQueryAll('a=1&b=null')).toEqual({ a: '1' });
    expect(getUrlQueryAll('a=1&b=undefined')).toEqual({ a: '1' });
  });
});
