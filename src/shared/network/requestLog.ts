import { dateFormat } from '../../ts/day';
import { createLogSnapshot } from './logSnapshot';
import type { Timer } from '../../ts/time';

export type RequestFailureStage = 'prepare' | 'network' | 'http' | 'response' | 'business';
export type RequestFailureCode =
  | 'request_prepare_failed'
  | 'network_failed'
  | 'timeout'
  | 'aborted'
  | 'http_failed'
  | 'response_parse_failed'
  | 'response_transform_failed'
  | 'response_result_failed'
  | 'business_failed'
  | 'login_required';

export type RequestLogInfo = {
  name: string;
  status?: 'success' | 'fail';
  success?: boolean;
  businessCode?: string | number;
  httpStatus?: number;
  responseHeader?: Record<string, unknown>;
  failureStage?: RequestFailureStage;
  failureCode?: RequestFailureCode | (string & {});
  networkStartTime?: string;
  networkEndTime?: string;
  networkStartTimeMs?: number;
  networkEndTimeMs?: number;
  networkDurationMs?: number;
  [key: string]: unknown;
};

export type RequestLogOptions = {
  config: {
    url?: string;
    data?: unknown;
    header?: unknown;
    method?: string;
    enableChunked?: boolean;
    logExtra?: Record<string, unknown>;
  };
  status: 'success' | 'fail';
  success?: boolean;
  fromCache?: boolean;
  res?: unknown;
  e?: unknown;
  businessCode?: unknown;
  httpStatus?: number;
  responseHeader?: Record<string, unknown>;
  failureStage?: RequestFailureStage;
  failureCode?: RequestFailureCode;
  /** 普通 HTTP 请求的传输计时器。 */
  httpTimer?: Timer;
  /** SSE 开始时的 Unix 毫秒时间戳。 */
  sseStartMs?: number;
};

/** 日志和 UI 的同步异常、异步拒绝均不得改变请求结果。 */
export function runRequestEffect(effect: () => unknown) {
  try {
    const result = effect();
    if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
      Promise.resolve(result).catch(() => {});
    }
  } catch {
    // 副作用失败不覆盖请求本身的结果。
  }
}

/** 统一组装现有 log；SDK 仅消费结束日志，不参与请求执行。 */
export function writeRequestLog(
  log: ((level: 'info' | 'error', info: RequestLogInfo) => unknown) | undefined,
  options: RequestLogOptions,
  decorate?: (info: RequestLogInfo) => void,
) {
  if (!log) return;
  runRequestEffect(() => {
    const fmt = 'YYYY-MM-DD HH:mm:ss.SSS';
    const { config, status, res, fromCache = false } = options;
    const extra = config.logExtra;
    const httpTiming = fromCache ? undefined : options.httpTimer?.end();
    const error = options.e;
    const info: RequestLogInfo = {
      name: 'request',
      status,
      url: config.url,
      data: config.data,
      method: config.method,
      header: config.header,
      fromCache,
    };

    if (config.enableChunked && options.sseStartMs !== undefined) {
      // SSE 仍沿用旧口径，本轮不扩展流式采集。
      const endTime = Date.now();
      Object.assign(info, {
        networkStartTime: dateFormat(options.sseStartMs, fmt),
        networkEndTime: dateFormat(endTime, fmt),
        networkStartTimeMs: options.sseStartMs,
        networkEndTimeMs: endTime,
        networkDurationMs: endTime - options.sseStartMs,
      });
    } else {
      if (httpTiming)
        Object.assign(info, {
          networkStartTimeMs: httpTiming.startMs,
          networkEndTimeMs: httpTiming.endMs,
          networkDurationMs: httpTiming.durationMs,
          networkStartTime: dateFormat(httpTiming.startMs, fmt),
          networkEndTime: dateFormat(httpTiming.endMs, fmt),
        });
      info.success = options.success === true;
      if (typeof options.businessCode === 'string' || typeof options.businessCode === 'number')
        info.businessCode = options.businessCode;
      if (options.httpStatus !== undefined) info.httpStatus = options.httpStatus;
      if (options.responseHeader) info.responseHeader = options.responseHeader;
      if (!info.success) {
        info.failureStage = options.failureStage;
        info.failureCode = options.failureCode;
      }
    }
    // 保持 logExtra 的覆盖语义；此时结果已确定，展开时才读取延迟属性。
    // 放在正文复制及日志回调之前，调用方计时不会包含日志自身的开销。
    Object.assign(info, extra);
    // transformRequest 抛错,参数处理异常,断网,请求超时或被主动取消此时没有res,不必给日志加上undefined的res
    if ('res' in options) info.res = res;
    if (error !== undefined) info.e = serializeRequestError(error);
    runRequestEffect(() => decorate?.(info));
    // 保持既有 level/status 对应关系，新增失败事实由 success/失败字段表达。
    return log(status === 'fail' ? 'error' : 'info', createLogSnapshot(info));
  });
}

/** 保留标准异常链；普通抛出值沿用原值，循环的 Error.cause 用标记截断。 */
function serializeRequestError(error: unknown, seen = new Set<Error>()): unknown {
  if (!(error instanceof Error)) return error;
  if (seen.has(error)) return '[Circular error cause]';
  seen.add(error);
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...('code' in error && (typeof error.code === 'string' || typeof error.code === 'number')
      ? { code: error.code }
      : {}),
    ...('cause' in error ? { cause: serializeRequestError(error.cause, seen) } : {}),
  };
}
