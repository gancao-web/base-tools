import { cloneDeep, isPlainObject } from 'es-toolkit';
import { startTimer } from '../../ts/time';
import { SseStreamParser } from './SseStreamParser';
import { createLogSnapshot } from './logSnapshot';
import { filterRequestHeader } from './fetch';
import { runRequestEffect, writeRequestLog, type RequestLogOptions, type RequestLogInfo } from './requestLog';
import type {
  SseReconnectConfig, SseReconnectOptions, SseReconnectContext, SseReconnectTask,
  SsePreparedRequest, SseTransport, SseMessageHandler, SseState,
} from './sseReconnectTypes';

const defaults = {
  maxRetries: 5, initialDelay: 1000, maxDelay: 30000, backoffFactor: 2,
  jitter: 0.2, onEof: false, respectServerRetry: true, allowReplay: false,
};

export function normalizeSseReconnect(value: boolean | SseReconnectOptions) {
  const options = { ...defaults };
  if (typeof value === 'object' && value !== null) {
    for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
      if (value[key] !== undefined) Object.assign(options, { [key]: value[key] });
    }
  } else if (value !== true) throw new TypeError('Invalid SSE reconnect options');
  for (const key of ['maxRetries', 'initialDelay', 'maxDelay', 'backoffFactor', 'jitter'] as const) {
    if (!Number.isFinite(options[key]) || options[key] < 0) throw new TypeError(`Invalid SSE ${key}`);
  }
  if (!Number.isSafeInteger(options.maxRetries) || options.backoffFactor < 1 || options.jitter > 1 ||
      options.maxDelay < options.initialDelay || options.maxDelay > 2147483647 || options.initialDelay < 1)
    throw new TypeError('Invalid SSE reconnect limits');
  for (const key of ['onEof', 'respectServerRetry', 'allowReplay'] as const) {
    if (typeof options[key] !== 'boolean') throw new TypeError(`Invalid SSE ${key}`);
  }
  const shouldReconnect = typeof value === 'object' ? value.shouldReconnect : undefined;
  if (shouldReconnect !== undefined && typeof shouldReconnect !== 'function')
    throw new TypeError('Invalid SSE shouldReconnect');
  return { ...options, shouldReconnect };
}

export function getSseRetryDelay(
  options: ReturnType<typeof normalizeSseReconnect>, retry: number, serverRetry?: number,
) {
  const base = options.respectServerRetry && serverRetry !== undefined ? serverRetry : options.initialDelay;
  const delay = base === 0 ? 0 : Math.min(options.maxDelay, base * options.backoffFactor ** Math.min(retry - 1, 1024));
  return Math.max(1, Math.min(options.maxDelay, delay * (1 + (Math.random() * 2 - 1) * options.jitter)));
}

export function setSseLastEventId(header: Record<string, string>, id: string) {
  for (const key of Object.keys(header)) if (key.toLowerCase() === 'last-event-id') delete header[key];
  if (id) header['Last-Event-ID'] = id;
  return header;
}

function getHeader(header: Record<string, unknown>, name: string) {
  const key = Object.keys(header).find((key) => key.toLowerCase() === name);
  return key ? header[key] : undefined;
}

export function acceptsSse(status: number | undefined, header: Record<string, unknown>) {
  const contentType = getHeader(header, 'content-type');
  return status === 200 && typeof contentType === 'string' &&
    contentType.split(';')[0].trim().toLowerCase() === 'text/event-stream';
}

export class SseTransportError extends Error {
  constructor(message: string, readonly permanent = false, readonly timeout = false, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
  }
}

function copyRequestData(data: unknown): unknown {
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const copy = new FormData();
    data.forEach((value, key) => copy.append(key, value));
    return copy;
  }
  if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) return new URLSearchParams(data);
  return isPlainObject(data) || Array.isArray(data) || data instanceof ArrayBuffer || ArrayBuffer.isView(data)
    ? cloneDeep(data) : data;
}

type Failure = {
  context: Omit<SseReconnectContext, 'attempt' | 'retry' | 'lastEventId' | 'defaultRetry'>;
  info: Omit<RequestLogOptions, 'config'>;
  permanent?: boolean;
  relogin?: boolean;
  msg?: string;
};

type ReconnectRequestConfig = SseReconnectConfig & {
  url: string;
  method?: string;
  data?: unknown;
  header?: Record<string, string | number | boolean | null | undefined>;
  timeout?: number;
  logExtra?: Record<string, unknown>;
  onMessage?: SseMessageHandler;
  showLoading?: boolean | string;
  toastError?: boolean;
};

/** 公共逻辑订阅；平台只提供一次传输，不负责重试、游标或业务策略。 */
export function requestReconnectingSse<T>(
  config: ReconnectRequestConfig,
  adapter: {
    prepare(data: unknown): SsePreparedRequest | Promise<SsePreparedRequest>;
    transport: SseTransport;
    onTaskReady(task: SseReconnectTask): void;
    responseFailure(body: unknown, status: number | undefined): {
      info: Omit<RequestLogOptions, 'config'>; relogin: boolean; msg: string;
    };
    log?: (level: 'info' | 'error', info: RequestLogInfo) => unknown;
    showLoading(): void;
    hideLoading(): void;
    toast(message: string): void;
    toLogin(): void;
    onResponseHeaders?(header: Record<string, unknown>, status: number | undefined): void;
  },
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let terminal = false;
    let attempt = 0;
    let failures = 0;
    let cursor = '';
    let serverRetry: number | undefined;
    let cancelTransport: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let waitTimer: ReturnType<typeof setTimeout> | undefined;
    // 每次等待完成即移除取消监听，避免长订阅在同一个 pending Promise 上不断积累 reactions。
    const waiters = new Set<(error: unknown) => void>();
    let logConfig: RequestLogOptions['config'] = { ...config, enableChunked: true };
    let httpStatus: number | undefined;
    let responseHeader: Record<string, unknown> | undefined;
    let httpTimer: ReturnType<typeof startTimer> | undefined;
    let loading = false;
    const notify = (state: SseState, delay?: number, context?: SseReconnectContext) => {
      runRequestEffect(() => config.onSseStateChange?.({ state, attempt, lastEventId: cursor, delay, context }));
    };
    const hideLoading = () => {
      if (loading) { loading = false; runRequestEffect(adapter.hideLoading); }
    };
    const finish = (info: Omit<RequestLogOptions, 'config'>, state: SseState, msg?: string, relogin?: boolean) => {
      if (terminal) return;
      terminal = true;
      clearTimeout(timer);
      clearTimeout(waitTimer);
      for (const stop of waiters) stop(new Error('SSE subscription ended'));
      waiters.clear();
      runRequestEffect(() => cancelTransport?.());
      hideLoading();
      notify(state);
      writeRequestLog(adapter.log, { config: logConfig, httpStatus, responseHeader, httpTimer, attemptCount: attempt, ...info });
      if (info.success) resolve(undefined as T);
      else reject('e' in info ? info.e : info.res);
      if (relogin) runRequestEffect(adapter.toLogin);
      else if (msg && config.toastError !== false) runRequestEffect(() => adapter.toast(msg));
    };
    const task: SseReconnectTask = {
      get lastEventId() { return cursor; },
      abort: () => {
        const error = new Error('SSE request aborted');
        error.name = 'AbortError';
        finish({ status: 'fail', success: false, e: error, failureStage: 'network', failureCode: 'aborted' }, 'aborted');
      },
      complete: () => finish({ status: 'success', success: true, closeReason: 'caller_completed' }, 'completed'),
      fail: (error, businessCode) => finish({ status: 'fail', success: false, e: error, businessCode,
        failureStage: 'business', failureCode: 'business_failed' }, 'failed'),
    };
    const race = <R>(promise: Promise<R>) => new Promise<R>((resolve, reject) => {
      if (terminal) {
        promise.catch(() => {});
        reject(new Error('SSE subscription ended'));
        return;
      }
      const stop = (error: unknown) => reject(error);
      waiters.add(stop);
      promise.then((value) => {
        waiters.delete(stop);
        resolve(value);
      }, (error) => {
        waiters.delete(stop);
        reject(error);
      });
    });
    const handlerFailure = (error: unknown): Failure => ({
      context: { reason: 'response', error }, permanent: true,
      info: { status: 'fail', success: false, e: error, failureStage: 'response', failureCode: 'sse_message_handler_failed' },
    });
    const execute = async () => {
      try {
        const options = normalizeSseReconnect(config.reconnect!);
        if ((config.method || 'GET') !== 'GET' && !options.allowReplay)
          throw new TypeError('SSE reconnect for non-GET requests requires allowReplay');
        if (config.data && typeof (config.data as { getReader?: unknown }).getReader === 'function')
          throw new TypeError('ReadableStream cannot be replayed by SSE reconnect');
        const originalData = copyRequestData(config.data);
        const initialKey = Object.keys(config.header || {}).find((key) => key.toLowerCase() === 'last-event-id');
        const initialId = config.lastEventId !== undefined ? config.lastEventId : initialKey ? config.header?.[initialKey] : '';
        cursor = initialId === undefined || initialId === null ? '' : String(initialId);
        if (/[\0\r\n]/.test(cursor)) throw new TypeError('Invalid SSE lastEventId');
        if (config.timeout !== undefined && (!Number.isFinite(config.timeout) || config.timeout < 0 || config.timeout > 2147483647))
          throw new TypeError('Invalid SSE timeout');
        if (adapter.log) logConfig = { ...logConfig, data: createLogSnapshot(config.data) };
        adapter.onTaskReady(task);
        if (terminal) return;
        if (config.showLoading !== false) { loading = true; runRequestEffect(adapter.showLoading); }
        while (!terminal) {
          attempt++;
          httpStatus = undefined;
          responseHeader = undefined;
          cancelTransport = undefined;
          let prepared = false;
          let active = true;
          let acceptingChunks = true;
          let stream = false;
          let failure: Failure | undefined;
          const parser = new SseStreamParser({
            isActive: () => !terminal && active,
            onMessage: (message) => config.onMessage?.(message),
            onCommit: (id, retry, message) => {
              if (id !== undefined) cursor = id;
              if (retry !== undefined) serverRetry = retry;
              if (message) failures = 0;
            },
          });
          notify('connecting');
          if (terminal) return;
          try {
            const request = await race(Promise.resolve().then(() => adapter.prepare(copyRequestData(originalData))));
            if (terminal) return;
            request.header = setSseLastEventId(filterRequestHeader(request.header), cursor);
            if (!Object.keys(request.header).some((key) => key.toLowerCase() === 'accept')) request.header.Accept = 'text/event-stream';
            // 原始及转换后的单次消费请求体都不得进入重放。
            for (const body of [config.data, request.data]) {
              if (body && typeof (body as { getReader?: unknown }).getReader === 'function')
                throw new TypeError('ReadableStream cannot be replayed by SSE reconnect');
            }
            logConfig = { ...logConfig, url: request.url, method: request.method, header: request.header };
            prepared = true;
            if (!httpTimer && adapter.log) httpTimer = startTimer();
            const timeout = config.timeout ?? 60000;
            const timeoutPromise = new Promise<never>((_, reject) => {
              if (timeout !== 0) timer = setTimeout(() => {
                reject(new SseTransportError('Request Timeout', false, true));
                runRequestEffect(() => cancelTransport?.());
              }, timeout);
            });
            const result = await race(Promise.race([adapter.transport(request, {
              setCancel(cancel) { if (terminal || !acceptingChunks) cancel(); else cancelTransport = cancel; },
              onHeaders(status, header) {
                if (terminal || !acceptingChunks) return false;
                httpStatus = status; responseHeader = header;
                runRequestEffect(() => adapter.onResponseHeaders?.(header, status));
                if (terminal || !acceptingChunks) return false;
                stream = acceptsSse(status, header);
                if (stream) { hideLoading(); notify('connected'); }
                return stream;
              },
              async onChunk(data) {
                if (terminal || !acceptingChunks) return;
                try { parser.receive(data); await race(parser.drain()); }
                catch (error) { failure = handlerFailure(error); throw error; }
              },
            }), timeoutPromise]));
            acceptingChunks = false;
            clearTimeout(timer);
            if (terminal) return;
            httpStatus = result.status; responseHeader = result.header;
            if (result.status === 204) {
              finish({ status: 'success', success: true }, 'completed'); return;
            }
            if (!acceptsSse(result.status, result.header)) {
              const response = adapter.responseFailure(result.body, result.status);
              failure = { ...response, context: { reason: result.status !== 200 ? 'http' : 'response',
                httpStatus: result.status, error: 'e' in response.info ? response.info.e : response.info.res } };
            } else {
              await race(parser.drain());
              if (!options.onEof) { finish({ status: 'success', success: true }, 'completed'); return; }
              const error = new Error('SSE connection ended');
              failure = { context: { reason: 'eof', error }, info: { status: 'fail', success: false, e: error,
                failureStage: 'network', failureCode: 'sse_eof' } };
            }
          } catch (error) {
            if (terminal) return;
            acceptingChunks = false;
            clearTimeout(timer);
            if (!failure && prepared && !(error instanceof SseTransportError && error.timeout)) {
              try { await race(parser.drain()); } catch (e) { failure = handlerFailure(e); }
            }
            if (!failure) {
              const timeout = error instanceof SseTransportError && error.timeout;
              const prepareFailed = !prepared || (error instanceof SseTransportError && error.permanent);
              failure = { context: { reason: timeout ? 'timeout' : prepared ? 'network' : 'response', error },
                permanent: prepareFailed,
                info: { status: 'fail', success: false, e: error,
                  failureStage: prepareFailed ? 'prepare' : 'network',
                  failureCode: timeout ? 'timeout' : prepareFailed ? 'request_prepare_failed' : 'network_failed' } };
            }
          }
          if (terminal) return;
          clearTimeout(timer);
          runRequestEffect(() => cancelTransport?.());
          failures++;
          const defaultRetry = failure.context.reason === 'network' || failure.context.reason === 'eof' ||
            (failure.context.reason === 'http' && [408, 429, 500, 502, 503, 504].includes(failure.context.httpStatus || 0));
          const context: SseReconnectContext = { ...failure.context, attempt, retry: failures, lastEventId: cursor, defaultRetry };
          let retry = false;
          if (!failure.permanent && failures <= options.maxRetries) {
            try {
              retry = options.shouldReconnect ? await race(Promise.resolve().then(() => options.shouldReconnect!(context))) : defaultRetry;
              if (typeof retry !== 'boolean') throw new TypeError('SSE shouldReconnect must return a boolean');
            } catch (error) {
              if (!terminal) finish({ status: 'fail', success: false, e: error, failureStage: 'response',
                failureCode: 'sse_reconnect_handler_failed' }, 'failed', 'SSE 重连策略执行失败');
              return;
            }
          }
          if (terminal) return;
          let minimumDelay = 0;
          const retryAfter = getHeader(responseHeader || {}, 'retry-after');
          if (typeof retryAfter === 'string' && retryAfter.trim()) {
            const value = retryAfter.trim();
            const minimum = /^[0-9]+$/.test(value) ? Number(value) * 1000 :
              /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(value)
                ? Date.parse(value) - Date.now() : NaN;
            if (minimum === Infinity || (Number.isFinite(minimum) && minimum >= 0)) {
              if (minimum > options.maxDelay) {
                retry = false;
                failure.info.e = new Error(`HTTP Error ${httpStatus}: Retry-After exceeds SSE maxDelay`, { cause: failure.context.error });
              }
              else minimumDelay = minimum;
            }
          }
          if (!retry) {
            finish(failure.info, 'failed', failure.msg || 'SSE 请求失败', failure.relogin); return;
          }
          if (context.reason === 'timeout') {
            // 超时只停止接收；确认允许恢复后再排空，防止跨连接并发及丢失已处理游标。
            try { await race(parser.drain()); }
            catch (error) {
              if (!terminal) finish(handlerFailure(error).info, 'failed', 'SSE 消息处理失败');
              return;
            }
            if (terminal) return;
            // 排空中的成功消息可能重置连续失败计数，本次超时仍计为一次失败。
            if (failures === 0) failures = 1;
            context.retry = failures;
            context.lastEventId = cursor;
          }
          active = false;
          const delay = Math.max(minimumDelay, getSseRetryDelay(options, failures, serverRetry));
          notify('reconnecting', delay, context);
          if (terminal) return;
          await race(new Promise<void>((resolve) => { waitTimer = setTimeout(resolve, delay); }));
        }
      } catch (error) {
        if (!terminal) finish({ status: 'fail', success: false, e: error, failureStage: 'prepare',
          failureCode: 'request_prepare_failed' }, 'failed', 'SSE 请求失败');
      }
    };
    execute();
  });
}
