import { describe, it, expect } from 'vitest';
import { getDispositionFileName } from '../../../src/web';

describe('web/load utils', () => {
  it('getDispositionFileName parses RFC5987 filename*', () => {
    const header = "attachment; filename*=UTF-8''%E6%B5%8B%E8%AF%95.pdf";
    expect(getDispositionFileName(header)).toBe('测试.pdf');
  });

  it('getDispositionFileName parses quoted filename', () => {
    const header = 'attachment; filename="report.csv"';
    expect(getDispositionFileName(header)).toBe('report.csv');
  });

  it('getDispositionFileName returns empty on invalid input', () => {
    expect(getDispositionFileName(undefined)).toBe('');
    expect(getDispositionFileName('inline')).toBe('');
  });
});
