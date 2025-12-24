import { describe, it, expect, vi } from 'vitest';
import { createUUID, createViewRandId, createTimeRandId } from '../../../src/ts';

describe('ts/string random', () => {
  it('createUUID v4 format', () => {
    const uuid = createUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('createViewRandId with default and custom prefix', () => {
    const id1 = createViewRandId();
    expect(id1.startsWith('id_')).toBe(true);

    const id2 = createViewRandId('canvas_');
    expect(id2.startsWith('canvas_')).toBe(true);
  });

  it('createTimeRandId length and numeric tail', () => {
    vi.setSystemTime(new Date('2025-11-19T00:00:00.000Z'));
    const s6 = createTimeRandId();
    expect(s6).toMatch(/^\d+\d{6}$/);
    const s8 = createTimeRandId(8);
    expect(s8).toMatch(/^\d+\d{8}$/);
  });
});
