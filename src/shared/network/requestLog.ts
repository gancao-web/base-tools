import { cloneDeep } from 'es-toolkit';
import { dateFormat } from '../../ts/day';
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
  failureCode?: RequestFailureCode;
  startTime?: string;
  endTime?: string;
  startTimeMs?: number;
  endTimeMs?: number;
  duration?: number;
  [key: string]: unknown;
};

export type RequestLogOptions = {
  config: {
    url?: string;
    data?: unknown;
    header?: unknown;
    method?: string;
    showLog?: boolean;
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
  if (!log || options.config.showLog === false) return;
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
        startTime: dateFormat(options.sseStartMs, fmt),
        endTime: dateFormat(endTime, fmt),
        duration: endTime - options.sseStartMs,
      });
    } else {
      if (httpTiming)
        Object.assign(info, {
          startTimeMs: httpTiming.startMs,
          endTimeMs: httpTiming.endMs,
          duration: httpTiming.durationMs,
          startTime: dateFormat(httpTiming.startMs, fmt),
          endTime: dateFormat(httpTiming.endMs, fmt),
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
    if ('res' in options) info.res = cloneDeep(res);
    if (error !== undefined)
      info.e =
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error;
    runRequestEffect(() => decorate?.(info));
    // 保持既有 level/status 对应关系，新增失败事实由 success/失败字段表达。
    return log(status === 'fail' ? 'error' : 'info', info);
  });
}
