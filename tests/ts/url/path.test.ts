import { describe, expect, it } from 'vitest';
import { joinUrlPath } from '../../../src/ts';

describe('ts/url path', () => {
  it('拼接 URL 并清理交界处多余的斜杠', () => {
    expect(joinUrlPath('https://a.com/', '/images/', '/avatar.png')).toBe(
      'https://a.com/images/avatar.png',
    );
  });

  it('忽略空字符串、null 和 undefined', () => {
    expect(joinUrlPath('https://a.com/', '', null, undefined, '/avatar.png')).toBe(
      'https://a.com/avatar.png',
    );
    expect(joinUrlPath('', null, undefined)).toBe('');
  });

  it('第一个有效参数不是 host 时保留开头的斜杠', () => {
    expect(joinUrlPath('', '/images/', 'avatar.png')).toBe('/images/avatar.png');
    expect(joinUrlPath('/', 'images', 'avatar.png')).toBe('/images/avatar.png');
    expect(joinUrlPath('/')).toBe('/');
  });

  it('保留 URL 协议中的双斜杠', () => {
    expect(joinUrlPath('https://a.com///', 'images')).toBe('https://a.com/images');
  });
});
