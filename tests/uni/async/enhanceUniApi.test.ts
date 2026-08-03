import { afterEach, describe, expect, it, vi } from 'vitest';
import { enhanceUniApi, setBaseToolsConfig } from '../../../src/uni';
import { createUniConfig } from '../../helpers/uniConfig';

type MockOption = {
  success?: (res: { data: string }) => void;
  fail?: (error: unknown) => void;
};

describe('uni/enhanceUniApi', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('响应转换抛错时结束 loading、记录失败、提示错误并 reject', async () => {
    const showLoading = vi.fn();
    const hideLoading = vi.fn();
    const showToast = vi.fn();
    const log = vi.fn();

    vi.stubGlobal('uni', { showLoading, hideLoading, showToast });
    setBaseToolsConfig(createUniConfig({ log }));

    const api = vi.fn((option: MockOption) => {
      option.success?.({ data: 'response' });
    });
    const request = enhanceUniApi(api, 'uploadFile');
    const error = new Error('不存在有效的token，请先登录');

    await expect(
      request(undefined, {
        showLoading: true,
        transformResponse: () => {
          throw error;
        },
      }),
    ).rejects.toBe(error);

    expect(showLoading).toHaveBeenCalledOnce();
    expect(hideLoading).toHaveBeenCalledOnce();
    expect(showToast).toHaveBeenCalledWith({
      icon: 'none',
      title: 'uploadFile fail: 不存在有效的token，请先登录',
      duration: 1000,
    });
    expect(log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ name: 'uploadFile', status: 'fail', e: error }),
    );
    expect(log).not.toHaveBeenCalledWith('info', expect.objectContaining({ name: 'uploadFile' }));
  });

  it('底层失败仍支持自定义错误提示', async () => {
    const showToast = vi.fn();

    vi.stubGlobal('uni', { showToast });
    setBaseToolsConfig(createUniConfig());

    const api = vi.fn((option: MockOption) => {
      option.fail?.({ errMsg: 'network error' });
    });
    const request = enhanceUniApi(api, 'uploadFile');

    await expect(request(undefined, { toastError: '上传失败' })).rejects.toEqual({
      errMsg: 'network error',
    });
    expect(showToast).toHaveBeenCalledWith({
      icon: 'none',
      title: '上传失败',
      duration: 1000,
    });
  });
});
