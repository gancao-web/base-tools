import { afterEach, describe, expect, it, vi } from 'vitest';
import { setBaseToolsConfig, UploadBusinessError, uploadFile } from '../../../src/web';

describe('web/uploadFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('字符串化额外参数并忽略 null 和 undefined', async () => {
    const entries: Array<[string, unknown]> = [];

    class MockFormData {
      append(name: string, value: unknown) {
        entries.push([name, value]);
      }
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 200;
      responseText = 'ok';
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    const file = new File(['content'], 'test.txt');
    const result = await uploadFile(
      {
        url: '/upload',
        file,
        data: {
          text: 'value',
          count: 1,
          enabled: true,
          empty: null,
          missing: undefined,
          json: JSON.stringify({ id: 1 }),
        },
      },
      { showLog: false, toastError: false },
    );

    expect(result).toBe('ok');
    expect(entries).toEqual([
      ['text', 'value'],
      ['count', '1'],
      ['enabled', 'true'],
      ['json', '{"id":1}'],
      ['file', file],
    ]);
  });

  it('按响应配置解析 JSON 并提取 resKey', async () => {
    class MockFormData {
      append() {}
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 200;
      responseText = JSON.stringify({ status: { code: 'ok' }, result: { value: 42 } });
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    await expect(
      uploadFile(
        { url: '/upload', file: new File(['content'], 'test.txt') },
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

  it('业务失败时按 msgKey reject 原始响应', async () => {
    class MockFormData {
      append() {}
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 200;
      responseText = JSON.stringify({ status: { code: 'bad' }, message: '文件类型不支持' });
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    const response = { status: { code: 'bad' }, message: '文件类型不支持' };
    const toastError = vi.fn(() => false);
    await expect(
      uploadFile(
        { url: '/upload', file: new File(['content'], 'test.txt') },
        {
          resKey: false,
          msgKey: 'message',
          codeKey: 'status.code',
          successCode: ['ok'],
          reloginCode: ['expired'],
          showLog: false,
          toastError,
        },
      ),
    ).rejects.toEqual(response);
    expect(toastError).toHaveBeenCalledWith(expect.any(UploadBusinessError));
  });

  it('命中 reloginCode 时触发登录且不弹失败提示', async () => {
    class MockFormData {
      append() {}
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 200;
      responseText = JSON.stringify({ status: { code: 'expired' }, message: '登录已过期' });
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    const toLogin = vi.fn();
    setBaseToolsConfig({ toLogin });
    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    const response = { status: { code: 'expired' }, message: '登录已过期' };
    await expect(
      uploadFile(
        { url: '/upload', file: new File(['content'], 'test.txt') },
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
    expect(toLogin).toHaveBeenCalledOnce();
  });

  it('非 2xx 的 JSON 响应仍按业务状态码触发登录且只关闭一次 Loading', async () => {
    class MockFormData {
      append() {}
    }

    class MockXMLHttpRequest {
      upload = { onprogress: null };
      status = 401;
      responseText = JSON.stringify({ status: { code: 'expired' }, message: '登录已过期' });
      timeout = 0;
      onload?: () => void;

      open() {}

      setRequestHeader() {}

      send() {
        this.onload?.();
      }

      abort() {}
    }

    const toLogin = vi.fn();
    const showLoading = vi.fn();
    const hideLoading = vi.fn();
    const toast = vi.fn();
    setBaseToolsConfig({ toLogin, showLoading, hideLoading, toast });
    vi.stubGlobal('FormData', MockFormData);
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);

    const response = { status: { code: 'expired' }, message: '登录已过期' };
    await expect(
      uploadFile(
        { url: '/upload', file: new File(['content'], 'test.txt') },
        {
          resKey: false,
          msgKey: 'message',
          codeKey: 'status.code',
          successCode: ['ok'],
          reloginCode: ['expired'],
          showLoading: true,
          showLog: false,
        },
      ),
    ).rejects.toEqual(response);

    expect(showLoading).toHaveBeenCalledOnce();
    expect(hideLoading).toHaveBeenCalledOnce();
    expect(toLogin).toHaveBeenCalledOnce();
    expect(toast).not.toHaveBeenCalled();
  });
});
