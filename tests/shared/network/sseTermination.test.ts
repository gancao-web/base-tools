import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { request, setBaseToolsConfig, type RequestTask } from '../../../src/web';
import { request as requestUni, setBaseToolsConfig as setUniConfig, type RequestTask as UniRequestTask } from '../../../src/uni';
import { createUniConfig } from '../../helpers/uniConfig';
import { SSEParser, type SSEMessage } from '../../../src/ts/buffer/SSEParser';

type Platform = 'web' | 'uni-h5' | 'native';
type Options = {
  method?: 'GET' | 'POST';
  data?: Record<string, unknown>;
  onTaskReady?: (task: RequestTask) => void;
  onMessage?: (message: SSEMessage) => void;
  timeout?: number;
  logExtra?: Record<string, unknown>;
  transformRequest?: () => { header: Record<string, string> };
  transformResponse?: () => string;
};

function setup(platform: Platform, body: string, status = 200, contentType = 'text/event-stream') {
  const log = vi.fn();
  const toLogin = vi.fn();
  const abort = vi.fn();
  const header = { 'content-type': contentType };
  vi.stubGlobal('uni', {
    canIUse: () => false,
    getSystemInfoSync: () => ({ platform: 'ios', uniPlatform: platform === 'native' ? 'mp-weixin' : 'web' }),
    navigateTo: toLogin,
    request: (options: UniApp.RequestOptions) => {
      let hostFinished = false;
      let headers: ((value: { header: typeof header; statusCode: number }) => void) | undefined;
      let chunks: ((value: { data: ArrayBuffer }) => void) | undefined;
      abort.mockImplementation(() => {
        if (!hostFinished) options.fail?.({ errMsg: 'request:fail abort' });
      });
      queueMicrotask(() => {
        headers?.({ header, statusCode: status });
        chunks?.({ data: new TextEncoder().encode(body).buffer });
        hostFinished = true;
        const data = !options.enableChunked && contentType === 'application/json' ? JSON.parse(body) : body;
        options.success?.({ data, header, statusCode: status, cookies: [], errMsg: 'request:ok' });
      });
      return {
        abort,
        onHeadersReceived: (callback: typeof headers) => { headers = callback; },
        onChunkReceived: (callback: typeof chunks) => { chunks = callback; },
      };
    },
  });
  setBaseToolsConfig({ log, toLogin });
  setUniConfig(createUniConfig({ log, pathLogin: `/login-${platform}-${status}-${body.length}` }));
  const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(body, { status, headers: header })));
  vi.stubGlobal('fetch', fetchMock);
  const run = (options: Options = {}) => {
    const config = {
      url: '/stream', method: 'POST' as const,
      resKey: false as const, codeKey: 'code', msgKey: 'message', successCode: [0], reloginCode: [-10],
      enableChunked: true as const, showLoading: false, toastError: false, ...options,
    };
    return platform === 'web' ? request(config) : requestUni(config);
  };
  return { run, log, toLogin, fetchMock, abort };
}

afterEach(() => {
  vi.useRealTimers();
  setBaseToolsConfig({ log: undefined, toLogin: undefined });
  setUniConfig(createUniConfig());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.each<Platform>(['web', 'uni-h5', 'native'])('%s SSE 终态', (platform) => {
  it('日志允许覆盖 url/header，但不允许覆盖实际 method 或公共结果', async () => {
    const { run, log, fetchMock } = setup(platform, 'data: ok\n\n');
    await run({ logExtra: {
      url: '/redacted', header: { Authorization: '***' }, method: 'GET', success: false,
    } });
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({
      url: '/redacted', header: { Authorization: '***' }, method: 'POST', success: true,
    });
    if (platform !== 'native') {
      expect(fetchMock.mock.calls[0][0]).toBe('/stream');
      expect(fetchMock.mock.calls[0][1].method).toBe('POST');
      expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
    }
  });

  it('非 2xx 的 JSON 成功码也不能变成成功建流', async () => {
    const { run, log } = setup(platform, '{"code":0,"data":"denied"}', 403, 'application/json');
    await expect(run()).rejects.toThrow('HTTP Error 403');
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ success: false, closeReason: 'http_error',
      httpStatus: 403, failureStage: 'http', failureCode: 'http_failed', businessCode: 0,
      res: { code: 0, data: 'denied' },
    });
  });

  it('HTTP 200 登录失效 JSON 沿用登录处理，不生成消息或 EOF 成功', async () => {
    const body = { code: -10, message: 'expired' };
    const { run, log, toLogin } = setup(platform, JSON.stringify(body), 200, 'application/json');
    await expect(run()).rejects.toEqual(body);
    expect(toLogin).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ success: false, closeReason: 'business_error',
      httpStatus: 200, businessCode: -10, failureCode: 'login_required', res: body,
    });
  });

  it('HTTP 200 JSON 成功响应仍是响应类型错误', async () => {
    const { run, log } = setup(platform, '{"code":0}', 200, 'application/json');
    await expect(run()).rejects.toThrow('Expected an SSE response');
    expect(log.mock.calls[0][1]).toMatchObject({ closeReason: 'response_handler_error',
      failureStage: 'response', failureCode: 'sse_response_invalid', res: { code: 0 },
    });
  });

  it('正常提前完成只输出当前消息和一次 caller_completed，宿主取消不推翻结果', async () => {
    const { run, log } = setup(platform, 'data: done\n\ndata: late\n\n');
    let task!: RequestTask;
    await expect(run({
      onTaskReady: (value) => { task = value; },
      onMessage: () => { task.complete(); task.abort(); task.complete(); },
    })).resolves.toBeUndefined();
    expect(log.mock.calls.map((call) => call[1].name)).toEqual(['sseMessage', 'request']);
    expect(log.mock.calls[1][1]).toMatchObject({ success: true, closeReason: 'caller_completed' });
    expect(log.mock.calls[1][1]).not.toHaveProperty('res');
  });

  it('业务主动失败使用原错误和业务码，不误记主动取消', async () => {
    const { run, log } = setup(platform, 'data: failed\n\ndata: late\n\n');
    let task!: RequestTask;
    const error = { type: 'error', code: 123, message: 'business rejected' };
    await expect(run({
      onTaskReady: (value) => { task = value; }, onMessage: () => task.fail(error, 123),
    })).rejects.toBe(error);
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[1][1]).toMatchObject({ success: false, closeReason: 'business_error', businessCode: 123, e: error });
  });

  it.each([false, true])('消息处理异常自动终止流并保留原异常，异步=%s', async (asyncCallback) => {
    const { run, log } = setup(platform, 'data: first\n\ndata: second\n\n');
    const error = new Error('callback failed');
    await expect(run({
      onMessage: asyncCallback ? async () => { throw error; } : () => { throw error; },
    })).rejects.toBe(error);
    const ends = log.mock.calls.filter((call) => call[1].name === 'request');
    expect(ends).toHaveLength(1);
    expect(ends[0][1]).toMatchObject({ success: false, closeReason: 'message_handler_error',
      failureStage: 'response', failureCode: 'sse_message_handler_failed', e: { message: error.message },
    });
    expect(log.mock.calls.at(-1)?.[1].name).toBe('request');
  });

  it('响应转换异常归属响应处理失败', async () => {
    const { run, log } = setup(platform, '{}', 200, 'application/json');
    const error = new Error('decrypt failed');
    await expect(run({ transformResponse: () => { throw error; } })).rejects.toBe(error);
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ closeReason: 'response_handler_error',
      failureStage: 'response', failureCode: 'response_transform_failed',
    });
  });

  it('解析器异常归属响应处理失败', async () => {
    const { run, log } = setup(platform, 'data: first\n\n');
    const error = new Error('decoder failed');
    vi.spyOn(SSEParser.prototype, 'receive').mockImplementation(() => { throw error; });
    await expect(run({ onMessage() {} })).rejects.toBe(error);
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ closeReason: 'response_handler_error',
      failureStage: 'response', failureCode: 'response_parse_failed',
    });
  });

  it('EOF 等待异步消息处理，迟到拒绝不会提前生成成功日志', async () => {
    const { run, log } = setup(platform, 'data: first\n\n');
    let fail!: (error: Error) => void;
    const callback = new Promise<void>((_resolve, reject) => { fail = reject; });
    const error = new Error('late failure');
    const pending = expect(run({ onMessage: () => callback })).rejects.toBe(error);
    await vi.waitFor(() => expect(log).toHaveBeenCalledOnce());
    fail(error);
    await pending;
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[1][1]).toMatchObject({ closeReason: 'message_handler_error', success: false });
  });

  it('EOF 等待异步处理成功，业务处理时间不计入网络耗时', async () => {
    const { run, log } = setup(platform, 'data: first\n\n');
    let tick = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => tick);
    let done!: () => void;
    const callback = new Promise<void>((resolve) => { done = resolve; });
    const pending = run({ onMessage: () => { tick = 20; return callback; } });
    await vi.waitFor(() => expect(log).toHaveBeenCalledOnce());
    tick = 90;
    done();
    await expect(pending).resolves.toBeUndefined();
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ closeReason: 'eof', success: true, networkDurationMs: 20 });
  });

  it('EOF 等待异步消息期间调用方仍能取消', async () => {
    const { run, log } = setup(platform, 'data: first\n\n');
    let task!: RequestTask;
    const callback = new Promise<void>(() => {});
    const pending = run({ onTaskReady: (value) => { task = value; }, onMessage: () => callback });
    const result = pending.then(() => 'resolved', () => 'rejected');
    await vi.waitFor(() => expect(log).toHaveBeenCalledOnce());
    task.abort();
    expect(await result).toBe('rejected');
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ closeReason: 'caller_aborted', failureCode: 'aborted', success: false });
  });

  it('EOF 等待异步消息期间超时仍能终止请求', async () => {
    vi.useFakeTimers();
    const { run, log } = setup(platform, 'data: first\n\n');
    const callback = new Promise<void>(() => {});
    const pending = expect(run({ timeout: 10, onMessage: () => callback })).rejects.toThrow('Request Timeout');
    await vi.advanceTimersByTimeAsync(11);
    await pending;
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ closeReason: 'timeout', failureCode: 'timeout', success: false });
  });

  it('EOF 已确定结果后，迟到的 fail 或取消不推翻结果', async () => {
    const { run, log } = setup(platform, 'data: first\n\n');
    let task!: RequestTask;
    await expect(run({
      onTaskReady: (value) => { task = value; },
    })).resolves.toBeUndefined();
    task.fail(new Error('late failure'));
    task.abort();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ success: true, closeReason: 'eof' });
  });
});

it.each<Platform>(['web', 'uni-h5'])('%s 超时保留原始异常链', async (platform) => {
  vi.useFakeTimers();
  const { run, log, fetchMock } = setup(platform, '');
  const original = new DOMException('aborted by timer', 'AbortError');
  fetchMock.mockImplementation((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
    init.signal?.addEventListener('abort', () => reject(original));
  }));
  const pending = expect(run({ timeout: 10 })).rejects.toMatchObject({ message: 'Request Timeout', cause: original });
  await vi.advanceTimersByTimeAsync(11);
  await pending;
  expect(log.mock.calls[0][1]).toMatchObject({ closeReason: 'timeout',
    e: { cause: { name: 'AbortError', message: original.message } },
  });
});

it('uni H5 日志保留 Fetch 转换后的查询地址和实际请求头', async () => {
  const { run, log, fetchMock } = setup('uni-h5', 'data: ok\n\n');
  await run({ method: 'GET', data: { keyword: 'query' } });
  expect(log.mock.calls.at(-1)?.[1]).toMatchObject({ url: '/stream?keyword=query', header: { Accept: 'text/event-stream' } });
  expect(fetchMock.mock.calls[0][0]).toBe('/stream?keyword=query');
});

it.each<Platform>(['web', 'uni-h5'])('%s 在上层重组公共头后补充 Accept 和 JSON Content-Type', async (platform) => {
  const { run, log, fetchMock } = setup(platform, 'data: ok\n\n');
  await run({ data: { question: 'test' }, transformRequest: () => ({ header: { token: 'token' } }) });
  const expected = { token: 'token', Accept: 'text/event-stream', 'Content-Type': 'application/json' };
  expect(fetchMock.mock.calls[0][1].headers).toEqual(expected);
  expect(log.mock.calls.at(-1)?.[1].header).toEqual(expected);
});

it('统一请求回调提供取消和 SSE 任务控制方法', async () => {
  expectTypeOf<RequestTask['complete']>().toEqualTypeOf<() => void>();
  expectTypeOf<RequestTask['fail']>().toEqualTypeOf<(error: unknown, businessCode?: string | number) => void>();
  expectTypeOf<UniRequestTask>().toMatchTypeOf<UniApp.RequestTask>();
  const config = { url: '/stream', resKey: false as const, codeKey: 'code', msgKey: 'message',
    successCode: [0], reloginCode: [-10], showLoading: false, toastError: false };
  setup('web', 'data: ok\n\n');
  await request({ ...config, enableChunked: true, onTaskReady: (task) => {
    expectTypeOf(task).toEqualTypeOf<RequestTask>();
  } });
  setup('native', 'data: ok\n\n');
  await requestUni({ ...config, enableChunked: true, onTaskReady: (task) => {
    expectTypeOf(task).toEqualTypeOf<UniRequestTask>();
  } });
  setup('web', '{"code":0}', 200, 'application/json');
  await request({ ...config, enableChunked: false, onTaskReady: (task) => {
    expectTypeOf(task).toEqualTypeOf<RequestTask>();
  } });
  setup('native', '{"code":0}', 200, 'application/json');
  await requestUni({ ...config, enableChunked: false, onTaskReady: (task) => {
    expectTypeOf(task).toEqualTypeOf<UniRequestTask>();
  } });
});
