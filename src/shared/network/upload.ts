import { startTimer, type Timer } from '../../ts/time';
import {
  getResponseValue,
  type ApiResponseConfig,
  type ApiResponseConfigOptions,
  type ResponseTransformer,
} from './response';
import {
  runRequestEffect,
  writeRequestLog,
  type RequestLogOptions,
  type UploadLogFile,
} from './requestLog';
import type { ApiActionConfig } from './action';

/** 一次上传的内部采集状态，不进入业务返回值。 */
export type UploadLogState = Pick<
  RequestLogOptions,
  'res' | 'businessCode' | 'failureStage' | 'failureCode' | 'httpStatus' | 'responseHeader'
>;

export function getUploadLogFiles(option: {
  name?: string;
  file?: unknown;
  files?: Array<{ name?: string; file?: unknown }>;
}): UploadLogFile[] {
  const items = option.files || [{ name: option.name || 'file', file: option.file }];
  return items.map((item) => {
    const result: UploadLogFile = { fieldName: item.name || option.name || 'file' };
    const file = item.file;
    if (file && typeof file === 'object') {
      for (const key of ['name', 'type', 'size'] as const) {
        const value = (file as Record<string, unknown>)[key];
        if (key === 'size') {
          if (typeof value === 'number' && Number.isFinite(value) && value >= 0)
            result.size = value;
        } else if (typeof value === 'string' && value) result[key] = value;
      }
    }
    return result;
  });
}

/** 只对实际发送的上传输出一次结束；日志不参与业务异常链。 */
export function createUploadLog(
  log: Parameters<typeof writeRequestLog>[0],
  config: RequestLogOptions['config'],
  option: Parameters<typeof getUploadLogFiles>[0],
) {
  const state: UploadLogState = {};
  let timer: Timer | undefined;
  let started = false;
  let ended = false;
  return {
    state,
    start() {
      started = true;
      if (log) timer = startTimer();
      state.failureStage = 'network';
      state.failureCode = 'network_failed';
    },
    response(res: unknown, status?: number, header?: Record<string, unknown>) {
      timer?.end();
      state.res = res;
      if (status !== undefined && status > 0) state.httpStatus = status;
      if (header) state.responseHeader = header;
    },
    networkError(code: 'network_failed' | 'timeout' | 'aborted' | 'http_failed') {
      timer?.end();
      state.failureStage = code === 'http_failed' ? 'http' : 'network';
      state.failureCode = code;
    },
    finish(success: boolean, e?: unknown) {
      if (!started || ended) return;
      ended = true;
      timer?.end();
      if (!log) return;
      runRequestEffect(() =>
        writeRequestLog(log, {
          config: { ...config, method: 'POST' },
          requestType: 'upload',
          status: success ? 'success' : 'fail',
          success,
          ...state,
          ...(e !== undefined ? { e } : {}),
          files: getUploadLogFiles(option),
          httpTimer: timer,
        }),
      );
    },
  };
}

/** 上传响应及业务响应解析配置。 */
export type UploadResponseConfig = ApiResponseConfigOptions & ResponseTransformer;

type UploadToastError<Error> = ApiActionConfig<unknown, Error>['toastError'];

/** 上传接口返回的业务错误。response 保留服务端原始响应，便于调用方继续处理。 */
export class UploadBusinessError extends Error {
  code?: number | string;
  response: unknown;
  relogin: boolean;

  constructor(
    message: string,
    options: { code?: number | string; response: unknown; relogin?: boolean },
  ) {
    super(message);
    this.name = 'UploadBusinessError';
    this.code = options.code;
    this.response = options.response;
    this.relogin = options.relogin ?? false;
  }
}

/** 判断是否配置了上传响应解析；部分配置会被视为配置错误，而不是退回原始字符串。 */
export function hasUploadResponseConfig(config?: ApiResponseConfigOptions) {
  if (!config) return false;

  return [
    config.resKey,
    config.msgKey,
    config.codeKey,
    config.successKey,
    config.successCode,
    config.reloginCode,
  ].some((value) => value !== undefined);
}

/**
 * 按 request 的规则解析上传响应。
 * - 先将默认的字符串响应解析为 JSON；传入对象时直接复用对象。
 * - 成功时提取 resKey；业务失败时抛出带原响应和状态码的错误。
 */
export function parseUploadResponse(
  response: unknown,
  config: ApiResponseConfigOptions,
  state?: UploadLogState,
) {
  if (!hasUploadResponseConfig(config)) return response;

  const missing = ['resKey', 'msgKey', 'codeKey', 'successCode', 'reloginCode'].filter(
    (key) => config[key as keyof ApiResponseConfig] === undefined,
  );
  if (missing.length) {
    throw new TypeError(`上传响应配置缺少: ${missing.join(', ')}`);
  }

  let res = response;
  if (state) {
    state.failureStage = 'response';
    state.failureCode = 'response_parse_failed';
  }
  if (typeof res === 'string') {
    try {
      res = JSON.parse(res);
    } catch {
      throw new UploadBusinessError('响应不是合法 JSON', { response });
    }
  }

  if (state) {
    state.res = res;
    state.failureCode = 'response_result_failed';
  }

  const code = getResponseValue(res, config.codeKey);
  if (state) state.businessCode = code;
  const successCode = config.successKey ? getResponseValue(res, config.successKey) : code;
  const msgValue = getResponseValue(res, config.msgKey);
  const msg = msgValue === undefined || msgValue === null ? '上传失败' : String(msgValue);

  if (config.successCode!.includes(successCode as string | number)) {
    return getResult(res, config.resKey);
  }

  const relogin = config.reloginCode!.includes(code as string | number);
  if (state) {
    state.failureStage = 'business';
    state.failureCode = relogin ? 'login_required' : 'business_failed';
  }
  throw new UploadBusinessError(msg, {
    code: typeof code === 'number' || typeof code === 'string' ? code : undefined,
    response: res,
    relogin,
  });
}

/** 先执行调用方转换，再按上传接口的业务响应配置提取结果。 */
export function transformUploadResponse<T = unknown>(
  response: unknown,
  config?: UploadResponseConfig,
  state?: UploadLogState,
): T {
  if (state) {
    state.res = response;
    state.failureStage = 'response';
    state.failureCode = 'response_transform_failed';
  }
  const transformed = config?.transformResponse ? config.transformResponse(response) : response;
  if (state) state.res = transformed;
  return (
    hasUploadResponseConfig(config)
      ? parseUploadResponse(transformed, config || {}, state)
      : transformed
  ) as T;
}

/**
 * 统一 Web 与 Uni 上传业务错误的提示规则。
 * 登录失效由平台层负责跳转，这里只阻止重复错误提示。
 */
export function resolveUploadToastError<Error = unknown>(
  error: unknown,
  toastError?: UploadToastError<Error>,
): boolean | string {
  if (!(error instanceof UploadBusinessError)) {
    return typeof toastError === 'function'
      ? toastError(error as Error)
      : toastError === undefined
        ? true
        : toastError;
  }
  if (error.relogin) return false;
  if (typeof toastError === 'function') {
    const result = toastError(error as unknown as Error);
    return result === true ? error.message : result;
  }
  if (typeof toastError === 'string') return toastError;
  return toastError === false ? false : error.message;
}

function getResult(res: unknown, resKey?: ApiResponseConfig['resKey']) {
  if (!res || !resKey || typeof res !== 'object') return res;
  return getResponseValue(res, resKey);
}
