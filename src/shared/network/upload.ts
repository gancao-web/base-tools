import {
  getResponseValue,
  type ApiResponseConfig,
  type ApiResponseConfigOptions,
  type ResponseTransformer,
} from './response';
import type { ApiActionConfig } from './action';

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
export function parseUploadResponse(response: unknown, config: ApiResponseConfigOptions) {
  if (!hasUploadResponseConfig(config)) return response;

  const missing = ['resKey', 'msgKey', 'codeKey', 'successCode', 'reloginCode'].filter(
    (key) => config[key as keyof ApiResponseConfig] === undefined,
  );
  if (missing.length) {
    throw new TypeError(`上传响应配置缺少: ${missing.join(', ')}`);
  }

  let res = response;
  if (typeof res === 'string') {
    try {
      res = JSON.parse(res);
    } catch {
      throw new UploadBusinessError('响应不是合法 JSON', { response });
    }
  }

  const code = getResponseValue(res, config.codeKey);
  const successCode = config.successKey ? getResponseValue(res, config.successKey) : code;
  const msgValue = getResponseValue(res, config.msgKey);
  const msg = msgValue === undefined || msgValue === null ? '上传失败' : String(msgValue);

  if (config.successCode!.includes(successCode as string | number)) {
    return getResult(res, config.resKey);
  }

  const relogin = config.reloginCode!.includes(code as string | number);
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
): T {
  const transformed = config?.transformResponse ? config.transformResponse(response) : response;
  return (
    hasUploadResponseConfig(config) ? parseUploadResponse(transformed, config || {}) : transformed
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
