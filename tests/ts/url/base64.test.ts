import { describe, expect, it } from 'vitest';

import { toBase64Url } from '../../../src/ts/url/base64';

describe('toBase64Url', () => {
  it.each(['', 'f', 'fo', 'foo', '水印', 'hello, 世界', '😀', '\ud800'])(
    'matches UTF-8 Base64 URL encoding for %j',
    (value) => {
      const expected = Buffer.from(value, 'utf8')
        .toString('base64')
        .replace(/=+$/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      expect(toBase64Url(value)).toBe(expected);
    },
  );
});
