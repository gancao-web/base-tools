import { afterEach, describe, expect, it, vi } from 'vitest';
import { setBaseToolsConfig, uploadFile } from '../../src/uni';
import { createUniConfig } from '../helpers/uniConfig';

describe('uni/uploadFile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('按业务响应配置提取泛型结果', async () => {
    const uploadFileApi = vi.fn((option: UniApp.UploadFileOption) => {
      option.success?.({
        data: JSON.stringify({ status: { code: 'ok' }, result: { value: 42 } }),
        statusCode: 200,
      });
      return {};
    });

    vi.stubGlobal('uni', { uploadFile: uploadFileApi });
    setBaseToolsConfig(createUniConfig());

    await expect(
      uploadFile<number>(
        { url: '/upload', filePath: '/tmp/test.txt', name: 'file' },
        {
          resKey: 'result.value',
          msgKey: 'message',
          codeKey: 'status.code',
          successCode: ['ok'],
          reloginCode: ['expired'],
          showLog: false,
          toastError: false,
        },
      ),
    ).resolves.toBe(42);
  });

  it('登录失效时跳转登录页且不重复提示错误', async () => {
    const navigateTo = vi.fn();
    const showToast = vi.fn();
    const uploadFileApi = vi.fn((option: UniApp.UploadFileOption) => {
      option.success?.({
        data: JSON.stringify({ status: { code: 'expired' }, message: '登录已过期' }),
        statusCode: 401,
      });
      return {};
    });

    vi.stubGlobal('uni', { uploadFile: uploadFileApi, navigateTo, showToast });
    setBaseToolsConfig(createUniConfig());

    const response = { status: { code: 'expired' }, message: '登录已过期' };
    await expect(
      uploadFile(
        { url: '/upload', filePath: '/tmp/test.txt', name: 'file' },
        {
          resKey: false,
          msgKey: 'message',
          codeKey: 'status.code',
          successCode: ['ok'],
          reloginCode: ['expired'],
          showLog: false,
        },
      ),
    ).rejects.toEqual(response);

    expect(navigateTo).toHaveBeenCalledWith({ url: '/pages/login/index' });
    expect(showToast).not.toHaveBeenCalled();
  });
});
