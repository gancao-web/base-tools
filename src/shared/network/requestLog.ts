import { dateFormat } from '../../ts/day';
import { createLogSnapshot } from './logSnapshot';
import { patchLogHeader, patchLogValue, requestLogSourceKey, type RequestLogSource } from './logPatch';
import type { Timer } from '../../ts/time';

export type RequestFailureStage = 'prepare' | 'network' | 'http' | 'response' | 'business';
export type RequestType = 'http' | 'upload' | 'sse';
export type SseCloseReason =
  | 'eof'
  | 'caller_completed'
  | 'caller_aborted'
  | 'timeout'
  | 'network_error'
  | 'http_error'
  | 'business_error'
  | 'response_handler_error'
  | 'message_handler_error';
export type UploadLogFile = { fieldName: string; name?: string; type?: string; size?: number };
export type RequestFailureCode =
  | 'request_prepare_failed'
  | 'network_failed'
  | 'timeout'
  | 'aborted'
  | 'http_failed'
  | 'response_parse_failed'
  | 'response_transform_failed'
  | 'response_result_failed'
  | 'sse_message_handler_failed'
  | 'business_failed'
  | 'login_required';

export type RequestLogInfo = {
  name: string;
  requestType?: RequestType;
  files?: UploadLogFile[];
  closeReason?: SseCloseReason;
  receivedAtMs?: number;
  event?: string;
  id?: string;
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
  requestType?: RequestType;
  files?: UploadLogFile[];
  closeReason?: SseCloseReason;
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
  failureCode?: RequestFailureCode | (string & {});
  /** HTTP、上传或整段 SSE 的传输计时器。 */
  httpTimer?: Timer;
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

/** 统一组装结束日志；消息日志单独输出，避免读取结束 getter。 */
export function writeRequestLog(
  log: ((level: 'info' | 'error', info: RequestLogInfo) => unknown) | undefined,
  options: RequestLogOptions,
) {
  if (!log) return;
  runRequestEffect(() => {
    const fmt = 'YYYY-MM-DD HH:mm:ss.SSS';
    const { config, status, fromCache = false } = options;
    const requestType = options.requestType || (config.enableChunked ? 'sse' : 'http');
    const extra = config.logExtra;
    const source = extra ? Reflect.get(extra, requestLogSourceKey) as RequestLogSource | undefined : undefined;
    const httpTiming = fromCache ? undefined : options.httpTimer?.end();
    const error = options.e;
    const info: RequestLogInfo = {
      name: requestType === 'upload' ? 'uploadFile' : 'request',
      requestType,
      status,
      url: config.url,
      data: source && Object.prototype.hasOwnProperty.call(source, 'data') ? source.data : config.data,
      method: config.method,
      header: config.header,
      fromCache,
    };

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
    if (!info.success && options.failureStage !== undefined) info.failureStage = options.failureStage;
    if (!info.success && options.failureCode !== undefined) info.failureCode = options.failureCode;
    // 结束时才读取延迟属性；公共结果不可被项目附加字段篡改。
    const protectedKeys = new Set([
      'name', 'requestType', 'status', 'success', 'businessCode', 'httpStatus',
      'responseHeader', 'failureStage', 'failureCode', 'closeReason', 'fromCache', 'files',
      'networkStartTime', 'networkEndTime', 'networkStartTimeMs', 'networkEndTimeMs',
      'networkDurationMs', 'res', 'e',
      'method', 'data', 'header',
    ]);
    if (extra) {
      for (const key of Object.keys(extra)) {
        if (!protectedKeys.has(key)) info[key] = extra[key];
      }
    }
    // 具体转换错误由实际异常提供，不能借 logExtra 伪造公共失败事实。
    if (
      !info.success && error instanceof Error &&
      (options.failureStage === 'prepare' || options.failureStage === 'response') &&
      'failureCode' in error && typeof error.failureCode === 'string'
    ) {
      info.failureCode = error.failureCode;
    }
    if (options.files) info.files = options.files;
    if (requestType === 'sse') {
      const reason = options.closeReason || (
        info.success ? 'eof' :
        info.failureStage === 'http' ? 'http_error' :
        info.failureStage === 'business' ? 'business_error' :
        info.failureStage === 'response' ? 'response_handler_error' :
        info.failureCode === 'timeout' ? 'timeout' :
        info.failureCode === 'aborted' ? 'caller_aborted' :
        info.failureStage === 'network' ? 'network_error' : undefined
      );
      if (reason) info.closeReason = reason;
    }
    // 没有实际响应时，不用脱敏补丁制造响应；正常 SSE 也不生成汇总正文。
    if ('res' in options || (source && Object.prototype.hasOwnProperty.call(source, 'res'))) {
      if (source && Object.prototype.hasOwnProperty.call(source, 'res')) info.res = source.res;
      else if ('res' in options) info.res = options.res;
      const patch = source && Object.prototype.hasOwnProperty.call(source, 'resPatch') ? source.resPatch : extra?.res;
      if (patch !== undefined) info.res = patchLogValue(info.res, patch);
    }
    const dataPatch = source && Object.prototype.hasOwnProperty.call(source, 'dataPatch') ? source.dataPatch : extra?.data;
    info.data = patchLogValue(info.data, dataPatch);
    info.header = patchLogHeader(info.header, extra?.header);
    if (info.startContext === undefined) delete info.startContext;
    if (info.endContext === undefined) delete info.endContext;
    if (error !== undefined) info.e = serializeRequestError(error);
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
