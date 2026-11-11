import { afterEach, describe, expect, it, vi } from 'vitest';
import { createUniSseTransport } from '../../../src/uni/network/sseTransport';
import { requestReconnectingSse } from '../../../src/shared/network/sseReconnect';
import type { SseReconnectConfig, SseReconnectTask } from '../../../src/shared/network/sseReconnectTypes';

const header = { 'Content-Type': 'text/event-stream' };
const bytes = (text: string) => new TextEncoder().encode(text).buffer;
const flush = async () => { for (let i = 0; i < 40; i++) await Promise.resolve(); };

function setup() {
  const attempts: { options: UniApp.RequestOptions; headers?: (event: any) => void; chunk?: (event: any) => void; abort: ReturnType<typeof vi.fn> }[] = [];
  vi.stubGlobal('uni', { request: vi.fn((options: UniApp.RequestOptions) => {
    const current: typeof attempts[number] = { options, abort: vi.fn() };
    attempts.push(current);
    return {
      abort: current.abort,
      onHeadersReceived(callback: (event: any) => void) { current.headers = callback; },
      offHeadersReceived() {},
      onChunkReceived(callback: (event: any) => void) { current.chunk = callback; },
      offChunkReceived() {},
    };
  }) });
  const native = createUniSseTransport({ url: '/events', timeout: 0 });
  let task!: SseReconnectTask & typeof native.taskMethods;
  const run = (onMessage?: (message: any) => Promise<void>, config: SseReconnectConfig = {}) => requestReconnectingSse({
    url: '/events', timeout: 0, showLoading: false, toastError: false,
    reconnect: { initialDelay: 1, jitter: 0 }, onMessage, ...config,
  }, {
    prepare: () => ({ url: '/events', method: 'GET', header: {} }), transport: native.transport,
    onTaskReady(value) { task = Object.assign(value, native.taskMethods); },
    responseFailure: () => ({ info: { status: 'fail', success: false, e: new Error('invalid') }, relogin: false, msg: '' }),
    showLoading() {}, hideLoading() {}, toast() {}, toLogin() {},
  });
  return { attempts, run, getTask: () => task };
}

describe('uni native SSE reconnect transport', () => {
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('重连使用同一公开任务与监听器，旧分块无效，携带最新确认游标', async () => {
    vi.useFakeTimers();
    const { attempts, run, getTask } = setup();
    const messages: string[] = [];
    const result = run(async (message) => { messages.push(message.raw); });
    const listener = vi.fn(); getTask().onHeadersReceived(listener);
    await flush();
    attempts[0].headers!({ statusCode: 200, header });
    attempts[0].chunk!({ data: bytes('id:one\ndata:first\n\n') });
    await flush();
    attempts[0].options.fail!({ errMsg: 'request:fail offline' });
    await flush(); await vi.advanceTimersByTimeAsync(1);
    expect(attempts).toHaveLength(2);
    expect(attempts[1].options.header['Last-Event-ID']).toBe('one');
    attempts[0].chunk!({ data: bytes('id:late\ndata:late\n\n') });
    attempts[1].headers!({ statusCode: 200, header });
    attempts[1].chunk!({ data: bytes('id:two\ndata:second\n\n') });
    // 原生 success 不等待业务 Promise，逻辑订阅必须在结束前排空。
    attempts[1].options.success!({ statusCode: 200, header, data: '', cookies: [] });
    await result;
    expect(messages).toEqual(['first', 'second']);
    expect(getTask().lastEventId).toBe('two');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('慢处理积压超过上限明确失败，不跳过消息继续推进游标', async () => {
    const { attempts, run, getTask } = setup();
    const result = run(() => new Promise<void>(() => {}));
    const assertion = expect(result).rejects.toThrow('limit');
    await flush(); attempts[0].headers!({ statusCode: 200, header });
    attempts[0].chunk!({ data: bytes('id:one\ndata:wait\n\n') });
    await flush();
    attempts[0].chunk!({ data: bytes(`data:${'x'.repeat(1024 * 1024)}`) });
    await assertion;
    expect(getTask().lastEventId).toBe('');
    expect(attempts).toHaveLength(1);
    expect(attempts[0].abort).toHaveBeenCalled();
  });

  it('不能确认响应状态的原生宿主明确拒绝，不能静默降级', async () => {
    const { attempts, run } = setup();
    const result = run(); const assertion = expect(result).rejects.toThrow('requires response headers and status');
    await flush(); attempts[0].headers!({ header });
    attempts[0].chunk!({ data: bytes('data:one\n\n') });
    await assertion; expect(attempts).toHaveLength(1);
  });

  it('原生结束前取消不会等待尚未完成的业务回调', async () => {
    const { attempts, run, getTask } = setup();
    const result = run(() => new Promise<void>(() => {}));
    const assertion = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    await flush(); attempts[0].headers!({ statusCode: 200, header });
    attempts[0].chunk!({ data: bytes('id:one\ndata:wait\n\n') });
    await flush(); getTask().abort(); await assertion;
    expect(getTask().lastEventId).toBe('');
  });

  it('宿主超时允许恢复时，先排空推送消息再携带已确认游标重连', async () => {
    vi.useFakeTimers();
    const { attempts, run, getTask } = setup();
    let release!: () => void;
    const messages: string[] = [];
    const result = run(async (message) => {
      messages.push(message.raw);
      if (message.raw === 'first') await new Promise<void>((resolve) => { release = resolve; });
    }, { reconnect: { initialDelay: 1, jitter: 0, shouldReconnect: (context) => context.reason === 'timeout' } });
    await flush();
    attempts[0].headers!({ statusCode: 200, header });
    attempts[0].chunk!({ data: bytes('id:one\ndata:first\n\n') });
    attempts[0].chunk!({ data: bytes('id:two\ndata:queued\n\n') });
    await flush();
    attempts[0].options.fail!({ errMsg: 'request:fail timeout' });
    await flush(); await vi.advanceTimersByTimeAsync(10);
    expect(attempts).toHaveLength(1);
    expect(messages).toEqual(['first']);
    expect(getTask().lastEventId).toBe('');
    expect(attempts[0].abort).toHaveBeenCalled();
    release(); await flush(); await vi.advanceTimersByTimeAsync(1);
    expect(attempts).toHaveLength(2);
    expect(attempts[1].options.header['Last-Event-ID']).toBe('two');
    attempts[1].options.success!({ statusCode: 204, header: {}, data: '', cookies: [] });
    await result;
    expect(messages).toEqual(['first', 'queued']);
    expect(getTask().lastEventId).toBe('two');
  });
});
