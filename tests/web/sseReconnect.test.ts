import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, type RequestConfigBase, type RequestTask } from '../../src/web/network/request';
import { setBaseToolsConfig } from '../../src/web/config';
import { getSseRetryDelay, normalizeSseReconnect } from '../../src/shared/network/sseReconnect';

const base: RequestConfigBase = {
  url: '/events', enableChunked: true, reconnect: { initialDelay: 1, jitter: 0 }, timeout: 0,
  resKey: false, codeKey: 'code', msgKey: 'message', successCode: [0], reloginCode: [401],
  showLoading: false, toastError: false,
};
const sse = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } });
const flush = async () => { for (let i = 0; i < 40; i++) await Promise.resolve(); };

describe('request optional SSE reconnect', () => {
  afterEach(() => {
    vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals();
    setBaseToolsConfig({ log: undefined });
  });

  it('等待已接受消息成功后续传，重新转换原始数据，使用一个稳定 task 和最终日志', async () => {
    vi.useFakeTimers();
    let source!: ReadableStreamDefaultController<Uint8Array>;
    const first = new Response(new ReadableStream<Uint8Array>({ start(controller) { source = controller; } }),
      { headers: { 'Content-Type': 'text/event-stream' } });
    const fetchMock = vi.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(sse('id:2\ndata:end\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    const log = vi.fn(); setBaseToolsConfig({ log });
    let task!: RequestTask;
    let release!: () => void;
    const onTaskReady = vi.fn((value: RequestTask) => { task = value; });
    const data = { nested: { count: 0 } };
    let transforms = 0;
    const transformRequest = vi.fn(({ data: value, header }: { data?: typeof data; header: Record<string, string> }) => {
      value!.nested.count++;
      return { data: value, header: { ...header, token: `token-${++transforms}` } };
    });
    const promise = request({ ...base, data, lastEventId: '0', header: { 'last-event-id': 'old' },
      transformRequest, onTaskReady,
      async onMessage(message) {
        if (message.raw === 'one') await new Promise<void>((resolve) => { release = resolve; });
      },
    });
    await flush();
    source.enqueue(new TextEncoder().encode('id:1\ndata:one\n\nid:partial\ndata:unfinished'));
    await flush();
    source.error(new Error('connection lost'));
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(task.lastEventId).toBe('0');
    release(); await flush(); await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBeUndefined();
    expect(task.lastEventId).toBe('2');
    expect(onTaskReady).toHaveBeenCalledTimes(1);
    expect(data.nested.count).toBe(0);
    expect(transformRequest.mock.calls[1][0].data!.nested.count).toBe(1);
    expect(fetchMock.mock.calls[0][1].headers).toMatchObject({ 'Last-Event-ID': '0', token: 'token-1' });
    expect(fetchMock.mock.calls[1][1].headers).toMatchObject({ 'Last-Event-ID': '1', token: 'token-2' });
    expect(fetchMock.mock.calls[1][1].headers).not.toHaveProperty('last-event-id');
    expect(log.mock.calls.filter(([, info]) => info.name === 'request')).toHaveLength(1);
    expect(log.mock.calls.at(-1)?.[1].attemptCount).toBe(2);
  });

  it('空 ID 删除旧头，204 正常停止且不要求 SSE Content-Type', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValueOnce(sse('id:\n\n')).mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base, lastEventId: 'old', reconnect: { initialDelay: 1, onEof: true } });
    await vi.runAllTimersAsync(); await result;
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1].headers).not.toHaveProperty('Last-Event-ID');
  });

  it('连续空 EOF 消耗预算，maxRetries 不包括首次请求', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(sse('')));
    vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base, reconnect: { initialDelay: 1, onEof: true, maxRetries: 2 } });
    const assertion = expect(result).rejects.toThrow('ended');
    await vi.runAllTimersAsync(); await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it.each(['abort', 'complete', 'fail'] as const)('%s 在重试等待期间立即终结且不复活', async (action) => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    let task!: RequestTask;
    const result = request({ ...base, reconnect: true, onTaskReady(value) { task = value; } });
    const assertion = action === 'complete' ? expect(result).resolves.toBeUndefined() : expect(result).rejects.toBeDefined();
    await flush();
    if (action === 'fail') task.fail(new Error('business')); else task[action]();
    await assertion; await vi.runAllTimersAsync();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('永久 pending 回调和异步重试策略不阻塞取消，迟到结果不推进游标', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(sse('id:1\ndata:one\n\n')));
    let task!: RequestTask;
    let release!: () => void;
    const result = request({ ...base, lastEventId: '0', onTaskReady(value) { task = value; },
      onMessage: () => new Promise<void>((resolve) => { release = resolve; }),
    });
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    await flush(); task.abort(); await assertion;
    release(); await flush(); expect(task.lastEventId).toBe('0');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const second = request({ ...base, onTaskReady(value) { task = value; },
      reconnect: { shouldReconnect: () => new Promise<boolean>(() => {}) },
    });
    const secondAssertion = expect(second).rejects.toMatchObject({ name: 'AbortError' });
    await flush(); task.abort(); await secondAssertion;
  });

  it('消息失败不重试，不推进游标，也不交付后续事件', async () => {
    const fetchMock = vi.fn().mockResolvedValue(sse('id:1\ndata:one\n\nid:2\ndata:two\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    let task!: RequestTask;
    const onMessage = vi.fn(async () => { throw new Error('handler'); });
    await expect(request({ ...base, lastEventId: '0', onMessage, onTaskReady(value) { task = value; } })).rejects.toThrow('handler');
    expect(task.lastEventId).toBe('0'); expect(onMessage).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('在 onMessage 内 complete 立即结束，当前未返回回调的 ID 不再提交', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(sse('id:1\ndata:one\n\nid:2\ndata:two\n\n')));
    let task!: RequestTask;
    const onMessage = vi.fn(() => task.complete());
    await request({ ...base, lastEventId: '0', onMessage, onTaskReady(value) { task = value; } });
    await flush(); expect(task.lastEventId).toBe('0'); expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it('非 GET 需要 allowReplay，一次性请求体和配置错误在发送前拒绝', async () => {
    const fetchMock = vi.fn().mockResolvedValue(sse(''));
    vi.stubGlobal('fetch', fetchMock);
    await expect(request({ ...base, method: 'POST' })).rejects.toThrow('allowReplay');
    await expect(request<unknown>({ ...base, data: new ReadableStream(), reconnect: { allowReplay: true }, method: 'POST' })).rejects.toThrow('ReadableStream');
    await expect(request({ ...base, reconnect: { initialDelay: NaN } })).rejects.toThrow('initialDelay');
    expect(fetchMock).not.toHaveBeenCalled();
    await request({ ...base, method: 'POST', data: { text: 'hello' }, reconnect: { allowReplay: true } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('HTTP 错误不受 Content-Type 干扰，Retry-After 不会被 maxDelay 缩短', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('busy', { status: 503, headers: { 'Retry-After': '2' } }))
      .mockResolvedValueOnce(sse(''));
    vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base });
    await flush(); await vi.advanceTimersByTimeAsync(1999); expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); await result; expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockResolvedValueOnce(new Response('busy', { status: 503, headers: { 'Retry-After': '60' } }));
    await expect(request({ ...base })).rejects.toThrow('HTTP Error 503');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('超时默认停止，可由策略显式允许；401 默认停止', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base, timeout: 10 });
    const assertion = expect(result).rejects.toThrow('Timeout');
    await vi.advanceTimersByTimeAsync(10); await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    fetchMock.mockResolvedValueOnce(new Response('{"code":401}', { status: 401 }));
    await expect(request({ ...base })).rejects.toThrow('HTTP Error 401');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('退避合并默认值，协议 retry:0 仍有最小等待且限幅', () => {
    const options = normalizeSseReconnect({ jitter: 0, maxDelay: 2000 });
    expect(options.maxRetries).toBe(5);
    expect(getSseRetryDelay(options, 1)).toBe(1000);
    expect(getSseRetryDelay(options, 10)).toBe(2000);
    expect(getSseRetryDelay(options, 1025, 0)).toBe(1);
  });

  it('不可序列化的请求体属于准备失败，不调用重试策略', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    const data: Record<string, unknown> = {}; data.self = data;
    const shouldReconnect = vi.fn(() => true);
    await expect(request<unknown>({ ...base, method: 'POST', data,
      reconnect: { allowReplay: true, shouldReconnect },
    })).rejects.toThrow('prepare SSE transport');
    expect(fetchMock).not.toHaveBeenCalled(); expect(shouldReconnect).not.toHaveBeenCalled();
  });

  it('异步转换期间取消立即结束，转换完成后不发送请求', async () => {
    let task!: RequestTask;
    let release!: () => void;
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base, onTaskReady(value) { task = value; },
      async transformRequest() { await new Promise<void>((resolve) => { release = resolve; }); return {}; },
    });
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    await flush(); task.abort(); await assertion; release(); await flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('显式策略允许一次超时恢复，策略自身失败则立即停止', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockImplementationOnce(() => new Promise(() => {})).mockResolvedValueOnce(sse(''));
    vi.stubGlobal('fetch', fetchMock);
    const shouldReconnect = vi.fn((context) => context.reason === 'timeout');
    const result = request({ ...base, timeout: 10, reconnect: { initialDelay: 1, jitter: 0, shouldReconnect } });
    await vi.advanceTimersByTimeAsync(11); await result;
    expect(shouldReconnect).toHaveBeenCalledWith(expect.objectContaining({ reason: 'timeout', defaultRetry: false }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    await expect(request({ ...base, reconnect: { shouldReconnect: async () => { throw new Error('policy'); } } })).rejects.toThrow('policy');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('超时恢复前排空已接受的消息，串行处理并使用最后确认游标', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(sse('id:1\ndata:first\n\nid:2\ndata:queued\n\n'))
      .mockResolvedValueOnce(sse('id:3\ndata:next\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    let task!: RequestTask;
    let release!: () => void;
    const messages: string[] = [];
    let processing = 0;
    let maxProcessing = 0;
    const result = request({ ...base, timeout: 10, lastEventId: '0',
      reconnect: { initialDelay: 1, jitter: 0, shouldReconnect: (context) => context.reason === 'timeout' },
      onTaskReady(value) { task = value; },
      async onMessage(message) {
        maxProcessing = Math.max(maxProcessing, ++processing);
        messages.push(message.raw);
        if (message.raw === 'first') await new Promise<void>((resolve) => { release = resolve; });
        processing--;
      },
    });
    await flush(); await vi.advanceTimersByTimeAsync(20);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(messages).toEqual(['first']);
    expect(task.lastEventId).toBe('0');
    release(); await flush(); await vi.advanceTimersByTimeAsync(1);
    await result;
    expect(messages).toEqual(['first', 'queued', 'next']);
    expect(maxProcessing).toBe(1);
    expect(fetchMock.mock.calls[1][1].headers['Last-Event-ID']).toBe('2');
    expect(task.lastEventId).toBe('3');
  });

  it('超时恢复等待中的消息失败会终结订阅，不重连也不提交游标', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(sse('id:1\ndata:first\n\nid:2\ndata:queued\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    let task!: RequestTask;
    let rejectMessage!: (error: unknown) => void;
    const onMessage = vi.fn(() => new Promise<void>((_, reject) => { rejectMessage = reject; }));
    const result = request({ ...base, timeout: 10, lastEventId: '0',
      reconnect: { initialDelay: 1, jitter: 0, shouldReconnect: () => true },
      onTaskReady(value) { task = value; }, onMessage,
    });
    const error = new Error('message failed after timeout');
    const assertion = expect(result).rejects.toBe(error);
    await flush(); await vi.advanceTimersByTimeAsync(20);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    rejectMessage(error); await assertion;
    await vi.runAllTimersAsync();
    expect(task.lastEventId).toBe('0');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it.each(['abort', 'complete', 'fail'] as const)('%s 能立即终止超时恢复的排空等待', async (action) => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(sse('id:1\ndata:first\n\nid:2\ndata:queued\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    let task!: RequestTask;
    let release!: () => void;
    const onMessage = vi.fn(() => new Promise<void>((resolve) => { release = resolve; }));
    const result = request({ ...base, timeout: 10, lastEventId: '0',
      reconnect: { initialDelay: 1, jitter: 0, shouldReconnect: () => true },
      onTaskReady(value) { task = value; }, onMessage,
    });
    const error = new Error('caller failed');
    const assertion = action === 'complete' ? expect(result).resolves.toBeUndefined()
      : action === 'abort' ? expect(result).rejects.toMatchObject({ name: 'AbortError' })
        : expect(result).rejects.toBe(error);
    await flush(); await vi.advanceTimersByTimeAsync(10);
    if (action === 'fail') task.fail(error); else task[action]();
    await assertion;
    release(); await flush(); await vi.runAllTimersAsync();
    expect(task.lastEventId).toBe('0');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('超时恢复未获允许时不等待 pending 消息（策略存在：%s）', async (withPolicy) => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(sse('id:1\ndata:first\n\n'));
    vi.stubGlobal('fetch', fetchMock);
    const result = request({ ...base, timeout: 10,
      reconnect: withPolicy ? { shouldReconnect: () => false } : true,
      onMessage: () => new Promise<void>(() => {}),
    });
    const assertion = expect(result).rejects.toThrow('Timeout');
    await flush(); await vi.advanceTimersByTimeAsync(10); await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
