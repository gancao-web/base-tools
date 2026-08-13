import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '../../../src/react/hoc/withErrorBoundary';

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('handles caught errors when process is unavailable', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const boundary = new ErrorBoundary({});
    vi.stubGlobal('process', undefined);

    boundary.componentDidCatch(new Error('boom'), {} as React.ErrorInfo);

    expect(consoleError).toHaveBeenCalledOnce();
  });
});
