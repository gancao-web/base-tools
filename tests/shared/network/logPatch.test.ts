import { afterEach, describe, expect, it, vi } from 'vitest';
import { patchLogHeader, patchLogValue, requestLogSourceKey } from '../../../src/shared/network/logPatch';
import { writeRequestLog } from '../../../src/shared/network/requestLog';
import { request, setBaseToolsConfig } from '../../../src/web';
import { request as requestUni, uploadFile, setBaseToolsConfig as setUniConfig } from '../../../src/uni';
import { createUniConfig } from '../../helpers/uniConfig';

const responseConfig = {
  resKey: 'data', codeKey: 'code', msgKey: 'message', successCode: [0], reloginCode: [-10],
  showLoading: false, toastError: false,
};

afterEach(() => {
  setBaseToolsConfig({ log: undefined });
  setUniConfig(createUniConfig());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('日志局部脱敏', () => {
  it('递归覆盖普通对象，保留同级字段，不修改原报文或补丁', () => {
    const profile = Object.freeze({ phone: 'private', name: 'user' });
    const data = Object.freeze({ profile, enabled: true });
    const source = Object.freeze({ code: 0, data });
    const patch = Object.freeze({ data: Object.freeze({ profile: Object.freeze({ phone: '***' }) }) });
    expect(patchLogValue(source, patch)).toEqual({ code: 0, data: { profile: { phone: '***', name: 'user' }, enabled: true } });
    expect(source.data.profile.phone).toBe('private');
    expect(patch).toEqual({ data: { profile: { phone: '***' } } });
  });

  it('数组和非普通对象整体替换，支持 null/false/0/空字符串，根 undefined 不覆盖', () => {
    const source = { items: [{ phone: 'private', name: 'user' }], value: true, count: 5, text: 'private', detail: {} };
    expect(patchLogValue(source, { items: ['***'], value: false, count: 0, text: '', detail: null })).toEqual({
      items: ['***'], value: false, count: 0, text: '', detail: null,
    });
    expect(patchLogValue(source, undefined)).toBe(source);
    expect(patchLogValue('private', '***')).toBe('***');
    expect(patchLogValue(new Date(), '***')).toBe('***');
    expect(patchLogValue(source, null)).toBeNull();
  });

  it('header 不区分大小写并移除重复别名，保留其他请求头', () => {
    const source = Object.freeze({ Authorization: 'private', authorization: 'alias-private', 'Content-Type': 'application/json' });
    expect(patchLogHeader(source, { AUTHORIZATION: '***' })).toEqual({
      AUTHORIZATION: '***', 'Content-Type': 'application/json',
    });
    expect(source.Authorization).toBe('private');
    expect(source.authorization).toBe('alias-private');
  });

  it('循环普通对象可合并，报文中的原型字段不会修改对象原型', () => {
    const source: Record<string, unknown> = { phone: 'private' };
    source.self = source;
    const patch: Record<string, unknown> = { phone: '***' };
    patch.self = patch;
    const result = patchLogValue(source, patch) as Record<string, unknown>;
    expect(result.self).toBe(result);
    expect(result.phone).toBe('***');
    const extra = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}}}');
    const merged = patchLogValue({}, extra) as Record<string, unknown>;
    expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    expect({}).not.toHaveProperty('polluted');
    expect(Object.hasOwn(merged, '__proto__')).toBe(true);
  });

  it('先取内部完整逻辑报文，再应用调用方补丁；内部通道不进入日志', () => {
    const log = vi.fn();
    const original = { phone: 'private', keep: true };
    const originalRes = { code: 0, data: { phone: 'private', name: 'user' } };
    const extra = { data: original, res: originalRes };
    Object.defineProperty(extra, requestLogSourceKey, { value: {
      data: original, dataPatch: { phone: '***' },
      res: originalRes, resPatch: { data: { phone: '***' } },
    } });
    writeRequestLog(log, { config: { data: 'cipher', logExtra: extra }, status: 'success', success: true, res: 'cipher' });
    const info = log.mock.calls[0][1];
    expect(info.data).toEqual({ phone: '***', keep: true });
    expect(info.res).toEqual({ code: 0, data: { phone: '***', name: 'user' } });
    expect(Object.getOwnPropertySymbols(info)).toHaveLength(0);
    info.data.keep = false;
    info.res.data.name = 'changed';
    expect(original.keep).toBe(true);
    expect(originalRes.data.name).toBe('user');
  });

  it('请求的网络参数、业务返回和缓存不受日志补丁影响', async () => {
    const log = vi.fn();
    setBaseToolsConfig({ log });
    const result = { phone: 'private', name: 'user' };
    const response = { code: 0, data: result };
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}'));
    vi.stubGlobal('fetch', fetchMock);
    const data = { profile: { phone: 'private', name: 'user' }, keep: true };
    const config = { ...responseConfig, url: '/log-patch-cache', method: 'POST' as const,
      data, header: { Authorization: 'private', version: '1' }, cacheTime: 60000,
      transformResponse: () => response,
    };
    const logExtra = { method: 'GET', header: { authorization: '***' },
      data: { profile: { phone: '***' } }, res: { data: { phone: '***' } },
    };
    expect(await request({ ...config, logExtra })).toBe(result);
    expect(await request({ ...config, logExtra })).toBe(result);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('private');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(data);
    for (const call of log.mock.calls) {
      expect(call[1]).toMatchObject({ method: 'POST', header: { authorization: '***', version: '1' },
        data: { profile: { phone: '***', name: 'user' }, keep: true },
        res: { code: 0, data: { phone: '***', name: 'user' } },
      });
      expect(call[1].header).not.toHaveProperty('Authorization');
    }
    expect(log.mock.calls[1][1].fromCache).toBe(true);
    expect(result.phone).toBe('private');
    expect(data.profile.phone).toBe('private');
  });

  it('uni 成功与业务失败日志均可脱敏，业务报文不受影响', async () => {
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    const response = { code: 4, message: 'failed', data: { phone: 'private', name: 'user' } };
    vi.stubGlobal('uni', {
      canIUse: () => false,
      getSystemInfoSync: () => ({ platform: 'devtools', uniPlatform: 'mp-weixin' }),
      request: (options: UniApp.RequestOptions) => {
        queueMicrotask(() => options.success?.({ data: response, header: {}, statusCode: 200, cookies: [], errMsg: 'request:ok' }));
        return { abort() {} };
      },
    });
    await expect(requestUni({ ...responseConfig, url: '/failed', logExtra: { res: { data: { phone: '***' } } } })).rejects.toBe(response);
    expect(log.mock.calls[0][1]).toMatchObject({ success: false, businessCode: 4, res: { data: { phone: '***', name: 'user' } } });
    response.code = 0;
    await requestUni({ ...responseConfig, url: '/success', logExtra: { res: { data: { phone: '***' } } } });
    expect(log.mock.calls[1][1].res).toEqual({ code: 0, message: 'failed', data: { phone: '***', name: 'user' } });
    expect(response.data.phone).toBe('private');
  });

  it('上传在结果提取前脱敏日志，保留完整响应和普通表单其他字段', async () => {
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    const raw = { code: 0, data: { url: '/file', secret: 'private' }, keep: true };
    vi.stubGlobal('uni', { uploadFile: (options: UniApp.UploadFileOption) => {
      options.success?.({ data: JSON.stringify(raw), statusCode: 200 });
      return {};
    } });
    const res = await uploadFile({ url: '/upload', filePath: '/tmp/file', name: 'file', data: { token: 'private', folder: 'public' } }, {
      ...responseConfig, resKey: 'data.url', logExtra: { data: { token: '***' }, res: { data: { secret: '***' } } },
    });
    expect(res).toBe('/file');
    expect(log.mock.calls[0][1]).toMatchObject({ data: { token: '***', folder: 'public' },
      res: { code: 0, data: { url: '/file', secret: '***' }, keep: true },
    });
  });

  it('网络失败或正常 SSE 没有响应正文时，不凭补丁制造 res', () => {
    const log = vi.fn();
    for (const enableChunked of [false, true]) {
      writeRequestLog(log, { config: { enableChunked, logExtra: { res: { data: { phone: '***' } } } },
        status: enableChunked ? 'success' : 'fail', success: enableChunked,
      });
    }
    for (const call of log.mock.calls) expect(call[1]).not.toHaveProperty('res');
  });
});
