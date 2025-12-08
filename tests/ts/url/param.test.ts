import { describe, it, expect } from 'vitest';
import { appendUrlParam } from '../../../src/ts';

describe('ts/url param', () => {
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
