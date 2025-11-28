import { describe, it, expect, vi } from 'vitest';
import {
  toDayjs,
  getDateRangeBefore,
  getDateRangeAfter,
  getCountdownParts,
  getAgeByBirthdate,
} from '../../../src/ts';

describe('ts/day utils', () => {
  it('toDayjs parses various formats', () => {
    expect(toDayjs('2025-11-19').format('YYYY-MM-DD')).toBe('2025-11-19');
    expect(toDayjs('2025/11/19').format('YYYY/MM/DD')).toBe('2025/11/19');
    expect(toDayjs('2025-11-19 12:34:56').format('YYYY-MM-DD HH:mm:ss')).toBe(
      '2025-11-19 12:34:56',
    );
    expect(toDayjs('1765337596').format('X')).toBe('1765337596');
    expect(toDayjs('1765337596913').format('x')).toBe('1765337596913');
  });

  it('getDateRangeBefore/After with date format', () => {
    vi.setSystemTime(new Date('2025-11-19T10:20:30.000Z'));
    expect(getDateRangeBefore(1)).toEqual(['2025-11-18', '2025-11-19']);
    expect(getDateRangeAfter(1)).toEqual(['2025-11-19', '2025-11-20']);
  });

  it('getDateRangeBefore/After with time format returns full-day range', () => {
    vi.setSystemTime(new Date('2025-11-19T10:20:30.000Z'));
    expect(getDateRangeBefore(1, 'YYYY-MM-DD HH:mm:ss')).toEqual([
      '2025-11-18 00:00:00',
      '2025-11-19 23:59:59',
    ]);
    expect(getDateRangeAfter(1, 'YYYY-MM-DD HH:mm:ss')).toEqual([
      '2025-11-19 00:00:00',
      '2025-11-20 23:59:59',
    ]);
  });

  it('getCountdownParts splits diff into padded parts', () => {
    const oneDayOneMs = 24 * 60 * 60 * 1000 + 1234;
    expect(getCountdownParts(oneDayOneMs)).toEqual({
      d: '01',
      h: '00',
      m: '00',
      s: '01',
      ms: '234',
    });
    expect(getCountdownParts(0)).toEqual({ d: '00', h: '00', m: '00', s: '00', ms: '000' });
  });

  it('getAgeByBirthdate returns month when < 12 months and year otherwise', () => {
    vi.setSystemTime(new Date('2025-11-19T10:20:30.000Z'));
    expect(getAgeByBirthdate('2025-05-10')).toEqual({ age: 6, type: 'month' });
    expect(getAgeByBirthdate('2020-11-19')).toEqual({ age: 5, type: 'year' });
    expect(getAgeByBirthdate('2020-12-01')).toEqual({ age: 4, type: 'year' });
  });
});
