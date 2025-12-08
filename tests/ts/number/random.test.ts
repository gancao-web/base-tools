import { describe, it, expect } from 'vitest';
import { randomBoolean } from '../../../src/ts';

describe('ts/number random', () => {
  it('randomBoolean returns boolean', () => {
    const v = randomBoolean();
    expect(typeof v).toBe('boolean');
  });
});
