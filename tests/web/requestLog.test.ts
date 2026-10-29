import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, setBaseToolsConfig } from '../../src/web';
import { request as requestUni, setBaseToolsConfig as setUniConfig } from '../../src/uni';
import { createUniConfig } from '../helpers/uniConfig';
import { writeRequestLog } from '../../src/shared/network/requestLog';

const config = {
  url: '/request-log',
  resKey: 'data',
  msgKey: 'message',
  codeKey: 'status',
  successCode: [1],
  reloginCode: [-10],
  showLoading: false,
  toastError: false,
};

describe('普通请求统一日志', () => {
  afterEach(() => {
    setBaseToolsConfig({ log: undefined, toast: undefined });
    setUniConfig(createUniConfig({ log: undefined }));
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('正文读完停止传输计时，结果提取后才读取附加字段，只输出一条日志', async () => {
    let tick = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => tick);
    let reads = 0;
    const extra = {
      get callerElapsed() {
        reads++;
        return tick;
      },
    };
    const log = vi.fn();
    setBaseToolsConfig({ log });
    const response = new Response('{}', { headers: { 'x-test': 'yes' } });
    vi.spyOn(response, 'text').mockImplementation(async () => {
      tick = 40;
      return '{"status":1,"data":"ok"}';
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(
      request({
        ...config,
        logExtra: extra,
        transformRequest: () => {
          tick = 10;
          return {};
        },
        transformResponse: (res) => {
          tick = 100;
          Object.defineProperty(res, 'data', {
            enumerable: true,
            get: () => {
              tick = 120;
              return 'ok';
            },
          });
          return res;
        },
      }),
    ).resolves.toBe('ok');
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][1]).toMatchObject({
      success: true,
      businessCode: 1,
      httpStatus: 200,
      responseHeader: { 'x-test': 'yes' },
      networkDurationMs: 30,
      callerElapsed: 120,
      networkStartTimeMs: expect.any(Number),
      networkEndTimeMs: expect.any(Number),
    });
    expect(Object.getOwnPropertySymbols(log.mock.calls[0][1])).toHaveLength(0);
    expect(reads).toBe(1);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"status":1,"data":"ok"}')));
    await request({ ...config, ...{ showLog: false }, logExtra: extra });
    expect(reads).toBe(2);
    expect(log).toHaveBeenCalledTimes(2);
  });

  it('准备失败以原异常 reject，无传输时间，失败日志仅一次', async () => {
    const error = new Error('prepare');
    const log = vi.fn();
    setBaseToolsConfig({ log });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      request({
        ...config,
        transformRequest: async () => {
          throw error;
        },
      }),
    ).rejects.toBe(error);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][1]).toMatchObject({
      success: false,
      failureStage: 'prepare',
      failureCode: 'request_prepare_failed',
    });
    expect(log.mock.calls[0][1]).not.toHaveProperty('networkDurationMs');
  });

  it('沿用 logExtra 覆盖语义，不解释调用方的附加信息', async () => {
    const extra = {
      success: false,
      failureStage: 'response',
      failureCode: 'response_parse_failed',
      businessCode: undefined,
      e: { name: 'SyntaxError', message: 'invalid JSON' },
    };
    const log = vi.fn();
    setBaseToolsConfig({ log });
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response('{"status":1,"msg":"bad","res":"cipher","str":"invalid"}')),
    );
    await request({ ...config, logExtra: extra });
    const info = log.mock.calls[0][1];
    expect(info).toMatchObject({
      success: false,
      failureStage: 'response',
      failureCode: 'response_parse_failed',
      e: { name: 'SyntaxError' },
      res: { res: 'cipher', str: 'invalid' },
    });
    expect(info.businessCode).toBeUndefined();
  });

  it('Web 转换失败保留原始正文和异常链，提示只使用外层 message', async () => {
    const cause = Object.assign(new SyntaxError('invalid JSON'), { code: 1001 });
    const error = Object.assign(new Error('响应处理失败', { cause }), { code: 'TRANSFORM' });
    const log = vi.fn();
    const toast = vi.fn();
    setBaseToolsConfig({ log, toast });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('raw response')));
    await expect(
      request({
        ...config,
        responseType: 'text',
        toastError: true,
        data: { id: 1 },
        transformResponse: () => {
          throw error;
        },
      }),
    ).rejects.toBe(error);
    expect(log).toHaveBeenCalledTimes(1);
    const info = log.mock.calls[0][1];
    expect(info).toMatchObject({
      url: '/request-log?id=1',
      data: { id: 1 },
      res: 'raw response',
      failureStage: 'response',
      failureCode: 'response_transform_failed',
      e: {
        name: 'Error',
        message: '响应处理失败',
        code: 'TRANSFORM',
        cause: { name: 'SyntaxError', message: 'invalid JSON', stack: cause.stack, code: 1001 },
      },
    });
    expect(JSON.parse(JSON.stringify(info)).e.cause.message).toBe('invalid JSON');
    expect(toast).toHaveBeenCalledWith({ status: 'fail', msg: '请求失败: 响应处理失败' });
  });

  it('循环 Error.cause 不阻止失败日志输出', () => {
    const error = new Error('cycle');
    error.cause = error;
    const log = vi.fn();
    writeRequestLog(log, { config: {}, status: 'fail', e: error });
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.parse(JSON.stringify(log.mock.calls[0][1])).e).toMatchObject({
      message: 'cycle',
      cause: '[Circular error cause]',
    });
  });

  it('uni 原生响应回调抛错仍 reject，并保留原始正文、异常链和 HTTP 信息', async () => {
    const cause = new SyntaxError('invalid JSON');
    const error = new Error('transform', { cause });
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    vi.stubGlobal('uni', {
      canIUse: () => false,
      getSystemInfoSync: () => ({ platform: 'ios', uniPlatform: 'mp-weixin' }),
      request: (options: UniApp.RequestOptions) => {
        expect(options).not.toHaveProperty('showLog');
        queueMicrotask(() =>
          options.success?.({
            data: 'raw response',
            statusCode: 200,
            header: { test: 'yes' },
            cookies: [],
            errMsg: 'request:ok',
          }),
        );
        return { abort: vi.fn() };
      },
    });
    await expect(
      requestUni({
        ...config,
        ...{ showLog: false },
        transformResponse: () => {
          throw error;
        },
      }),
    ).rejects.toBe(error);
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][1]).toMatchObject({
      success: false,
      httpStatus: 200,
      responseHeader: { test: 'yes' },
      res: 'raw response',
      e: { message: 'transform', cause: { name: 'SyntaxError', message: 'invalid JSON' } },
      failureCode: 'response_transform_failed',
      networkDurationMs: expect.any(Number),
    });
  });

  it('日志异步失败不改变业务结果，缓存命中不伪造 HTTP 信息', async () => {
    const log = vi.fn().mockRejectedValue(new Error('logger'));
    setBaseToolsConfig({ log });
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"status":1,"data":"ok"}'));
    vi.stubGlobal('fetch', fetchMock);
    const cached = { ...config, url: '/request-log/cache', cacheTime: 10000 };
    await expect(request(cached)).resolves.toBe('ok');
    await expect(request(cached)).resolves.toBe('ok');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[1][1]).toMatchObject({ fromCache: true, success: true });
    for (const key of ['httpStatus', 'responseHeader', 'networkDurationMs', 'networkStartTimeMs', 'networkEndTimeMs'])
      expect(log.mock.calls[1][1]).not.toHaveProperty(key);
    log.mockClear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"status":1,"data":"ok"}')));
    await request({ ...config, ...{ showLog: false } });
    expect(log).toHaveBeenCalledTimes(1);
  });
});
