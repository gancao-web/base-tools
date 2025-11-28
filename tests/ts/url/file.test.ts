import { describe, it, expect } from 'vitest';
import { getFileSuffix, getFileType } from '../../../src/ts';

describe('ts/url file', () => {
  it('getFileSuffix handles various names', () => {
    expect(getFileSuffix('avatar.PNG')).toBe('png');
    expect(getFileSuffix('a.tar.gz')).toBe('gz');
    expect(getFileSuffix('.ignore')).toBe('');
    expect(getFileSuffix('abc')).toBe('');
  });

  it('getFileType maps suffix to type', () => {
    expect(getFileType('a.jpg')).toBe('img');
    expect(getFileType('b.MP4')).toBe('video');
    expect(getFileType('c.ods')).toBe('excel');
    expect(getFileType('abc')).toBe('unknown');
  });
});
