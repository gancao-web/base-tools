import { describe, it, expect } from 'vitest';
import { getUrlParam, getUrlNumber, getUrlParamAll, appendUrlParam } from '../../../src/ts';

describe('ts/url param', () => {
  it('getUrlParam decodes and handles null/undefined strings', () => {
    expect(getUrlParam('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95')).toBe('测试');
    expect(getUrlParam('a', 'a=1')).toBe('1');
    expect(getUrlParam('list', 'list=[1,2]')).toBe('[1,2]');
    expect(getUrlParam('list', 'list=null')).toBeNull();
    expect(getUrlParam('list', 'list=undefined')).toBeNull();
  });

  it('getUrlNumber returns number or null', () => {
    expect(getUrlNumber('a', 'https://a.com/?a=1')).toBe(1);
    expect(getUrlNumber('a', 'a=1.2')).toBe(1.2);
    expect(getUrlNumber('a', 'a=abc')).toBeNull();
  });

  it('getUrlParamAll returns decoded object', () => {
    expect(getUrlParamAll('a=1&b=2')).toEqual({ a: '1', b: '2' });
    expect(getUrlParamAll('https://a.com/?a=1&b=null')).toEqual({ a: '1' });
  });

  it('appendUrlParam appends and keeps hash', () => {
    const url = appendUrlParam('https://a.com#frag', {
      q: '测试',
      list: [1, 2],
      a: null,
      b: undefined,
    });
    expect(url).toBe('https://a.com?q=%E6%B5%8B%E8%AF%95&list=%5B1%2C2%5D#frag');
  });
});
