import { afterEach, describe, expect, it, vi } from 'vitest';
import { request } from '../../src/web';

describe('web/request', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('透传 fetchOptions，并由请求参数控制 method、headers、body 和 signal', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: 0, data: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      request<string>({
        url: '/request',
        method: 'GET',
        header: { Authorization: 'token' },
        resKey: 'data',
        msgKey: 'message',
        codeKey: 'code',
        successCode: [0],
        reloginCode: [-1],
        fetchOptions: { cache: 'no-store', credentials: 'include' },
        showLoading: false,
        showLog: false,
        toastError: false,
      }),
    ).resolves.toBe('ok');

    expect(fetchMock).toHaveBeenCalledWith(
      '/request',
      expect.objectContaining({
        cache: 'no-store',
        credentials: 'include',
        method: 'GET',
        headers: { Authorization: 'token' },
        body: undefined,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('使用 method、header、fetchOptions 和 responseType 区分内存缓存', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ code: 0, data: fetchMock.mock.calls.length }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const baseConfig = {
      url: '/request-cache-key',
      header: { Authorization: 'token-a' },
      resKey: 'data',
      msgKey: 'message',
      codeKey: 'code',
      successCode: [0],
      reloginCode: [-1],
      cacheTime: 60_000,
      showLoading: false,
      showLog: false,
      toastError: false,
    };

    await expect(request<number>({ ...baseConfig, method: 'GET' })).resolves.toBe(1);
    await expect(request<number>({ ...baseConfig, method: 'GET' })).resolves.toBe(1);
    await expect(request<number>({ ...baseConfig, method: 'POST' })).resolves.toBe(2);
    await expect(
      request<number>({ ...baseConfig, method: 'GET', header: { Authorization: 'token-b' } }),
    ).resolves.toBe(3);
    await expect(
      request<number>({
        ...baseConfig,
        method: 'GET',
        fetchOptions: { credentials: 'include' },
      }),
    ).resolves.toBe(4);
    await expect(
      request<number>({
        ...baseConfig,
        method: 'GET',
        responseType: 'text',
        transformResponse: (response) => JSON.parse(response as string),
      }),
    ).resolves.toBe(5);

    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
