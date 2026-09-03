import { afterEach, describe, expect, it, vi } from 'vitest';
import { request } from '../../src/web';

describe('web/request response key', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('使用候选路径数组解析业务状态和响应数据', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          code: null,
          data: null,
          fallback: { code: 0, data: 'ok' },
          success: 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      request<string>({
        url: '/request-response-keys',
        resKey: ['data', 'fallback.data'],
        msgKey: ['error.message', 'message'],
        codeKey: ['code', 'fallback.code'],
        successKey: ['meta.success', 'success'],
        successCode: [0] as const,
        reloginCode: [-1] as const,
        showLoading: false,
        showLog: false,
        toastError: false,
      }),
    ).resolves.toBe('ok');
  });
});
