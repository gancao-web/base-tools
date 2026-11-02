import { SSEParser, type MessageCallback } from '../../ts/buffer/SSEParser';
import PolyfillTextDecoder from '../../ts/buffer/PolyfillTextDecoder';
import { createLogSnapshot } from './logSnapshot';
import { runRequestEffect, serializeRequestError, type RequestLogInfo, type RequestLogOptions } from './requestLog';
import { getResponseValue, type ApiResponseConfig, type ResponseTransformer } from './response';

/** 流已建立且请求尚未结束时可确认业务终态；EOF 或其他终态后调用无效果。普通请求调用时无效果。 */
export type SseTaskControl = {
  /** 确认业务完成，正常停止流；不会根据事件名自动调用，也不等待异步消息处理。 */
  complete: () => void;
  /** 确认业务失败，以原错误或完整消息结束流，并可提供业务码；EOF 后不能修改结果。 */
  fail: (error: unknown, businessCode?: string | number) => void;
};

/** 只在宿主明确给出非 SSE 类型时回退正文解析；缺失类型保留旧的流处理行为。 */
export function isSseResponseHeader(header?: Record<string, unknown>) {
  const key = Object.keys(header || {}).find((name) => name.toLowerCase() === 'content-type');
  const value = key ? header?.[key] : undefined;
  return (
    typeof value !== 'string' ||
    !value ||
    value.split(';')[0].trim().toLowerCase() === 'text/event-stream'
  );
}

/** 非流响应也沿用解密、业务码和登录配置，但绝不把 JSON 成功响应当成成功建流。 */
export function getSseResponseFailure<Input>(
  body: unknown,
  httpStatus: number | undefined,
  config: ApiResponseConfig & ResponseTransformer<Input>,
) {
  let res = body instanceof ArrayBuffer ? new PolyfillTextDecoder().decode(body) : body;
  if (typeof res === 'string') {
    try {
      res = JSON.parse(res);
    } catch {
      /* 错误正文允许是纯文本。 */
    }
  }
  const httpFailed = httpStatus !== undefined && (httpStatus < 200 || httpStatus >= 300);
  const info: Omit<RequestLogOptions, 'config'> = {
    status: 'fail',
    success: false,
    res,
    failureStage: httpFailed ? 'http' : 'response',
    failureCode: httpFailed ? 'http_failed' : 'sse_response_invalid',
  };
  let relogin = false;
  let msg = httpFailed ? `HTTP Error ${httpStatus}` : 'Expected an SSE response';
  try {
    if (!httpFailed) info.failureCode = 'response_transform_failed';
    res = config.transformResponse ? config.transformResponse(res as Input) : res;
    info.res = res;
    if (!httpFailed) info.failureCode = 'response_result_failed';
    const businessCode = getResponseValue(res, config.codeKey);
    info.businessCode = businessCode;
    relogin = config.reloginCode.includes(businessCode as string | number);
    const scode = config.successKey ? getResponseValue(res, config.successKey) : businessCode;
    const businessFailed =
      scode !== undefined && !config.successCode.includes(scode as string | number);
    if (!httpFailed && businessFailed) {
      info.failureStage = 'business';
      info.failureCode = relogin ? 'login_required' : 'business_failed';
    } else if (!httpFailed) info.failureCode = 'sse_response_invalid';
    const message = getResponseValue(res, config.msgKey);
    if ((httpFailed || businessFailed) && message !== undefined && message !== null)
      msg = String(message);
    // 业务失败继续 reject 原始逻辑响应，保持普通请求调用方的错误消费方式。
    if (httpFailed) info.e = new Error(`HTTP Error ${httpStatus}`);
    else if (!businessFailed) info.e = new Error(msg);
  } catch (e) {
    info.e = e;
  }
  return { info, relogin, msg };
}

/** 观察完整消息；不能展开 logExtra，否则会提前触发结束上下文和总计时。 */
export function createSseParser(
  log: ((level: 'info' | 'error', info: RequestLogInfo) => unknown) | undefined,
  extra: Record<string, unknown> | undefined,
  onMessage: MessageCallback | undefined,
  isActive: () => boolean,
) {
  if (!log && !onMessage) return undefined;
  return new SSEParser(
    (message) => {
      if (isActive()) return onMessage?.(message);
    },
    (message, protocol) => {
      if (!isActive() || !log) return;
      const receivedAtMs = Date.now();
      runRequestEffect(() => {
        const info: RequestLogInfo = {
          name: 'sseMessage',
          requestType: 'sse',
          receivedAtMs,
          data: message,
          ...protocol,
        };
        const startContext = extra?.startContext;
        if (startContext !== undefined) info.startContext = startContext;
        return log('info', createLogSnapshot(info));
      });
    },
    (error) => {
      // 只记录消息处理异常；迟到错误不改变结束结果，也不读取结束 getter。
      runRequestEffect(() => {
        if (!log) {
          console.error('SSEParser onMessage error:', error);
          return;
        }
        const info: RequestLogInfo = {
          name: 'sseMessage',
          requestType: 'sse',
          failureStage: 'response',
          failureCode: 'sse_message_handler_failed',
          e: serializeRequestError(error),
        };
        const startContext = extra?.startContext;
        if (startContext !== undefined) info.startContext = startContext;
        return log('error', createLogSnapshot(info));
      });
    },
  );
}
