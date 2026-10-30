import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { request, uploadFile, setBaseToolsConfig } from '../../../src/web';
import { request as requestUni, uploadFile as uploadUni, setBaseToolsConfig as setUniConfig } from '../../../src/uni';
import { createUniConfig } from '../../helpers/uniConfig';
import { SSEParser } from '../../../src/ts/buffer/SSEParser';

const base = {
  url: '/stream', resKey: 'data', msgKey: 'message', codeKey: 'code',
  successCode: [0], reloginCode: [-10], showLoading: false, toastError: false,
};
const encode = (text: string) => new TextEncoder().encode(text);
type StreamConfig = typeof base & {
  enableChunked: boolean;
  logExtra?: Record<string, unknown>;
  onTaskReady?: (task: { abort: () => void }) => void;
  onMessage?: () => void;
};

function mockUni(platform = 'web') {
  vi.stubGlobal('uni', {
    canIUse: () => false,
    getSystemInfoSync: () => ({ platform: 'ios', uniPlatform: platform }),
  });
}

describe('上传与 SSE 日志采集', () => {
  afterEach(() => {
    setBaseToolsConfig({ log: undefined });
    setUniConfig(createUniConfig());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('流式请求返回 void，普通请求保留结果类型，动态开关返回联合类型', async () => {
    mockUni();
    Object.assign(uni, { request: (options: UniApp.RequestOptions) => {
      queueMicrotask(() => options.success?.({
        data: { code: 0, data: 'ok' }, statusCode: 200, header: {}, cookies: [], errMsg: 'request:ok',
      }));
      return { abort: vi.fn() };
    } });
    vi.stubGlobal('fetch', vi.fn((url: string) => Promise.resolve(new Response(
      url === '/http' ? '{"code":0,"data":"ok"}' : 'data: hello\n\n',
    ))));
    const webStream = request<string>({ ...base, enableChunked: true });
    const uniStream = requestUni<string>({ ...base, enableChunked: true });
    const http = request<string>({ ...base, url: '/http' });
    const uniHttp = requestUni<string>({ ...base, url: '/http', enableChunked: false });
    const dynamic = request<string>({ ...base, enableChunked: Boolean(1) });
    expectTypeOf(webStream).toEqualTypeOf<Promise<void>>();
    expectTypeOf(uniStream).toEqualTypeOf<Promise<void>>();
    expectTypeOf(http).toEqualTypeOf<Promise<string>>();
    expectTypeOf(uniHttp).toEqualTypeOf<Promise<string>>();
    expectTypeOf(dynamic).toEqualTypeOf<Promise<string | void>>();
    await expect(Promise.all([webStream, uniStream, http, uniHttp, dynamic])).resolves.toEqual([
      undefined, undefined, 'ok', 'ok', undefined,
    ]);
  });

  it.each(['web', 'uni-h5'])('%s 无业务回调仍采集完整消息，消息不读取结束 getter', async (platform) => {
    mockUni();
    const log = vi.fn();
    setBaseToolsConfig({ log });
    setUniConfig(createUniConfig({ log }));
    let tick = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => tick);
    let endReads = 0;
    const logExtra = {
      startContext: { connection: 'a' },
      get endContext() { endReads++; return { shop: 'b' }; },
    };
    let source!: ReadableStreamDefaultController<Uint8Array>;
    const body = new ReadableStream<Uint8Array>({ start(controller) { source = controller; } });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, {
      headers: { 'content-type': 'text/event-stream' },
    })));
    const run = (config: StreamConfig) => platform === 'web' ? request(config) : requestUni(config);
    const pending = run({ ...base, enableChunked: true, logExtra });
    tick = 10;
    source.enqueue(encode('event: delta\nid: protocol\ndata: {"id":"json",'));
    source.enqueue(encode('"text":"你"}\n\ndata: tail\n'));
    await vi.waitFor(() => expect(log).toHaveBeenCalledTimes(1));
    expect(endReads).toBe(0);
    expect(log.mock.calls[0][1]).toMatchObject({
      name: 'sseMessage', requestType: 'sse', id: 'protocol', event: 'delta',
      data: { id: 'json', text: '你' }, startContext: { connection: 'a' },
      receivedAtMs: expect.any(Number),
    });
    tick = 90;
    source.close();
    await expect(pending).resolves.toBeUndefined();
    expect(endReads).toBe(1);
    expect(log.mock.calls.map((call) => call[1].name)).toEqual(['sseMessage', 'sseMessage', 'request']);
    const end = log.mock.calls[2][1];
    expect(end).toMatchObject({ success: true, closeReason: 'eof', httpStatus: 200,
      responseHeader: { 'content-type': 'text/event-stream' }, networkDurationMs: 90,
      startContext: { connection: 'a' }, endContext: { shop: 'b' },
    });
    expect(end).not.toHaveProperty('res');
  });

  it.each(['web', 'uni-h5'])('%s 同块消息取消后不再输出后续消息', async (platform) => {
    mockUni();
    const log = vi.fn();
    setBaseToolsConfig({ log });
    setUniConfig(createUniConfig({ log }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('data: one\n\ndata: two\n\n')));
    let abort = () => {};
    const onMessage = vi.fn(() => abort());
    const run = (config: StreamConfig) => platform === 'web' ? request(config) : requestUni(config);
    await expect(run({ ...base, enableChunked: true, onMessage,
      onTaskReady: (task) => { abort = () => task.abort(); },
    })).rejects.toMatchObject({ name: 'AbortError' });
    expect(onMessage).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[1][1]).toMatchObject({
      success: false, closeReason: 'aborted', failureStage: 'network', failureCode: 'aborted',
    });
  });

  it('尾消息回调取消不能随后记录 EOF 成功', async () => {
    const log = vi.fn();
    setBaseToolsConfig({ log });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('data: tail\n')));
    let abort = () => {};
    await expect(request({ ...base, enableChunked: true,
      onTaskReady: (task) => { abort = () => task.abort(); }, onMessage: () => abort(),
    })).rejects.toMatchObject({ name: 'AbortError' });
    expect(log.mock.calls.map((call) => call[1].name)).toEqual(['sseMessage', 'request']);
    expect(log.mock.calls[1][1]).toMatchObject({ success: false, closeReason: 'aborted' });
  });

  it('uni H5 建流失败保留 HTTP 信息和错误正文', async () => {
    mockUni();
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"message":"denied"}', { status: 403 })));
    await expect(requestUni({ ...base, enableChunked: true })).rejects.toThrow('HTTP Error 403');
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ requestType: 'sse', success: false,
      closeReason: 'http_error', httpStatus: 403, res: { message: 'denied' }, failureStage: 'http',
    });
  });

  it('Web 建流失败保留非 JSON 正文', async () => {
    const log = vi.fn();
    setBaseToolsConfig({ log });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('denied', { status: 403 })));
    await expect(request({ ...base, enableChunked: true })).rejects.toThrow('HTTP Error 403');
    expect(log.mock.calls[0][1]).toMatchObject({ success: false, closeReason: 'http_error',
      httpStatus: 403, res: 'denied', failureStage: 'http',
    });
  });

  it('uni 原生取消保留先前握手信息，同块后续消息和迟到完成不重复输出', async () => {
    mockUni('mp-weixin');
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    let chunk!: (res: { data: ArrayBuffer }) => void;
    let headers!: (res: { header: Record<string, string>; statusCode: number }) => void;
    let options!: UniApp.RequestOptions;
    Object.assign(uni, { request: (value: UniApp.RequestOptions) => {
      options = value;
      return {
        abort: () => options.fail?.({ errMsg: 'request:fail abort' }),
        onHeadersReceived: (listener: typeof headers) => { headers = listener; },
        onChunkReceived: (listener: typeof chunk) => { chunk = listener; },
      };
    } });
    let abort = () => {};
    const pending = requestUni({ ...base, enableChunked: true,
      onTaskReady: (task) => { abort = () => task.abort(); }, onMessage: () => abort(),
    });
    const rejected = expect(pending).rejects.toMatchObject({ errMsg: 'request:fail abort' });
    headers({ header: { 'content-type': 'text/event-stream' }, statusCode: 200 });
    chunk({ data: encode('data: first\n\ndata: second\n\n').buffer });
    options.success?.({ data: '', statusCode: 200, header: {}, cookies: [], errMsg: 'request:ok' });
    await rejected;
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[1][1]).toMatchObject({ success: false, closeReason: 'aborted',
      httpStatus: 200, responseHeader: { 'content-type': 'text/event-stream' },
    });
  });

  it('uni 原生尾消息先于结束，迟到分块不再采集', async () => {
    mockUni('mp-weixin');
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    let chunk!: (res: { data: ArrayBuffer }) => void;
    let options!: UniApp.RequestOptions;
    Object.assign(uni, {
      request: (value: UniApp.RequestOptions) => {
        options = value;
        return { abort: vi.fn(), onChunkReceived: (listener: typeof chunk) => { chunk = listener; } };
      },
    });
    const pending = requestUni({ ...base, enableChunked: true });
    chunk({ data: encode('data: first\n\ndata: tail\n').buffer });
    options.success?.({ data: '', statusCode: 200, header: {}, cookies: [], errMsg: 'request:ok' });
    await expect(pending).resolves.toBeUndefined();
    chunk({ data: encode('data: late\n\n').buffer });
    expect(log.mock.calls.map((call) => call[1].name)).toEqual(['sseMessage', 'sseMessage', 'request']);
    expect(log.mock.calls[2][1]).toMatchObject({ requestType: 'sse', success: true, closeReason: 'eof' });
    expect(log.mock.calls[2][1]).not.toHaveProperty('res');
  });

  it('uni 上传保留完整响应、合并参数，并隔离日志异步拒绝', async () => {
    const log = vi.fn().mockRejectedValue(new Error('logger'));
    setUniConfig(createUniConfig({ log }));
    vi.stubGlobal('uni', { uploadFile: (options: UniApp.UploadFileOption) => {
      options.success?.({ data: '{"code":0,"data":"url","extra":true}', statusCode: 200 });
      return {};
    } });
    await expect(uploadUni({ url: '/upload', filePath: '/tmp/path', name: 'report',
      data: { folder: 'old', keep: 1 }, formData: { folder: 'new' },
    }, base)).resolves.toBe('url');
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ name: 'uploadFile', requestType: 'upload',
      success: true, businessCode: 0, httpStatus: 200, data: { folder: 'new', keep: 1 },
      res: { code: 0, data: 'url', extra: true }, files: [{ fieldName: 'report' }],
      networkDurationMs: expect.any(Number),
    });
  });

  it('Web 上传解密后完整响应和文件元信息不被提取结果替代', async () => {
    let tick = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => tick);
    class XHR {
      upload = {};
      status = 200;
      responseText = 'cipher';
      onload?: () => void;
      open() {}
      setRequestHeader() {}
      getAllResponseHeaders() { return 'x-test: yes\r\n'; }
      send() { tick = 40; this.onload?.(); }
      abort() {}
    }
    vi.stubGlobal('XMLHttpRequest', XHR);
    const log = vi.fn((_level: string, _info: unknown) => { throw new Error('logger'); });
    setBaseToolsConfig({ log });
    await expect(uploadFile({ url: '/upload', file: new File(['abc'], 'report.txt', { type: 'text/plain' }) }, {
      ...base, transformResponse: () => { tick = 100; return { code: 0, data: 'url', extra: true }; },
    })).resolves.toBe('url');
    expect(log).toHaveBeenCalledOnce();
    expect(log.mock.calls[0][1]).toMatchObject({ success: true, res: { code: 0, data: 'url', extra: true },
      files: [{ fieldName: 'file', name: 'report.txt', type: 'text/plain', size: 3 }],
      responseHeader: { 'x-test': 'yes' }, networkDurationMs: 40,
    });
  });

  it('上传业务失败与解析失败分别记录具体阶段和原始响应', async () => {
    const log = vi.fn();
    setUniConfig(createUniConfig({ log }));
    let text = '{"code":4,"message":"bad","data":null}';
    vi.stubGlobal('uni', { uploadFile: (options: UniApp.UploadFileOption) => {
      options.success?.({ data: text, statusCode: 200 }); return {};
    } });
    await expect(uploadUni({ url: '/upload', name: 'file', filePath: '/tmp/a' }, base)).rejects.toEqual(JSON.parse(text));
    expect(log.mock.calls[0][1]).toMatchObject({ success: false, businessCode: 4,
      failureStage: 'business', failureCode: 'business_failed', httpStatus: 200, res: JSON.parse(text),
    });
    text = 'not json';
    await expect(uploadUni({ url: '/upload', name: 'file', filePath: '/tmp/a' }, base)).rejects.toBe(text);
    expect(log.mock.calls[1][1]).toMatchObject({ success: false,
      failureStage: 'response', failureCode: 'response_parse_failed', res: text,
    });
  });

  it('DONE 的协议信息与业务对象保持独立', () => {
    const business = vi.fn();
    const observer = vi.fn();
    const parser = new SSEParser(business, observer);
    parser.receive(encode('event: delta\nid: 1\ndata: [DONE]\n\n').buffer);
    expect(business).toHaveBeenCalledWith({ type: 'DONE' });
    expect(observer).toHaveBeenCalledWith({ type: 'DONE' }, { event: 'delta', id: '1' });
  });
});
