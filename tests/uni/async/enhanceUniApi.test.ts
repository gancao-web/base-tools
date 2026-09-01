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

  it('不再在通用增强器中转换响应，调用方可自行处理结果', async () => {
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
    await expect(request(undefined, { showLoading: true })).resolves.toEqual({ data: 'response' });

    expect(showLoading).toHaveBeenCalledOnce();
    expect(hideLoading).toHaveBeenCalledOnce();
    expect(showToast).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(
      'info',
      expect.objectContaining({ name: 'uploadFile', status: 'success', res: { data: 'response' } }),
    );
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
