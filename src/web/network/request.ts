import { isPlainObject } from 'es-toolkit';
import { startTimer, type Timer } from '../../ts/time';
import { getBaseToolsConfig } from '../config';
import { SSEParser, type MessageCallback } from '../../ts/buffer/SSEParser';
import {
  createFetchRequest,
  filterRequestData,
  filterRequestHeader,
  handleFetchStreamResponse,
  parseFetchResponse,
  type SseTask,
} from '../../shared/network/fetch';
import {
  getResponseResult,
  getResponseValue,
  type ApiResponseConfig,
  type ResponseTransformer,
} from '../../shared/network/response';
import {
  runRequestEffect,
  writeRequestLog,
  type RequestFailureStage,
  type RequestFailureCode,
  type RequestLogOptions,
} from '../../shared/network/requestLog';
import type { ApiTaskConfig } from '../../shared/network/action';

export { filterRequestData, filterRequestHeader } from '../../shared/network/fetch';

/** 请求方法类型 */
export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

/**
 * 请求参数类型
 * 包含 fetch 原生支持的 BodyInit 类型，以及支持自动 JSON 序列化的对象和数组
 */
export type RequestData =
  | string
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | Record<string, unknown>
  | unknown[]
  | null;

/**
 * 响应数据类型
 */
export type ResponseData = string | ArrayBuffer | Blob | Record<string, unknown> | unknown[] | null;

type RequestResponseConfig = ApiResponseConfig & ResponseTransformer<ResponseData>;

/** 请求前转换上下文 */
export type TransformRequestContext<D extends RequestData = RequestData> = {
  url: string;
  method: RequestMethod;
  header: Record<string, string>;
  data?: D;
};

/** 请求前转换结果 */
export type TransformRequestResult<D extends RequestData = RequestData> = Partial<
  Pick<TransformRequestContext<D>, 'url' | 'header' | 'data'>
>;

/**
 * 发起请求的配置 (对外,参数可选)
 */
export type RequestConfig<D extends RequestData = RequestData> = Partial<RequestConfigBase<D>>;

/**
 * 自定义请求的配置 (接口字段参数必填)
 */
export type RequestConfigBase<D extends RequestData = RequestData> = RequestResponseConfig &
  ApiTaskConfig<RequestTask> & {
    /** 接口地址 */
    url: string;

    /** 请求方法 */
    method?: RequestMethod;

    /** 请求头(会自动过滤undefined, null, "";不过滤0和false; 数字和布尔值会自动转换为字符串) */
    header?: Record<string, string | number | boolean | null | undefined>;

    /** 请求参数 */
    data?: D;

    /** 超时时间 (毫秒), 默认 60000 */
    timeout?: number;

    /** 原生 Fetch 配置扩展 */
    fetchOptions?: Omit<RequestInit, 'method' | 'headers' | 'body' | 'signal'>;

    /** 是否开启流式传输 (如 SSE) */
    enableChunked?: boolean;

    /** 响应类型 (默认 json, enableChunked为true时忽略) */
    responseType?: 'text' | 'arraybuffer' | 'json';

    /** 响应数据的缓存时间, 单位毫秒。仅在成功时缓存；仅缓存在内存，应用退出,缓存消失。(默认0,不开启缓存) */
    cacheTime?: number;

    /** 是否提示接口异常 (默认true) */
    toastError?: boolean;

    /** 是否显示进度条: 支持字符串,自定义文本 (默认true) */
    showLoading?: boolean | string;

    /** 是否输出日志 (默认true) */
    showLog?: boolean;

    /** 成功和失败时,额外输出的日志数据 (可覆盖内部log参数,如'name') */
    logExtra?: Record<string, unknown>;

    /**
     * 请求前的数据转换, 可用于加密 header、data 或重写 url
     * 使用方法签名，使具体 RequestConfig<D> 可以传入默认 RequestConfig 的二次封装
     */
    transformRequest?(
      ctx: TransformRequestContext<D>,
    ): TransformRequestResult<D> | Promise<TransformRequestResult<D>>;

    /**
     * 流式数据接收事件回调 (已完成基础流式解析,返回消息对象)
     * @example
     * function onMessage(msg: SSEMessage) {
     *   console.log(msg);
     *   if(msg.type === 'DONE') { } // 流式传输结束
     *   if(msg.type === 'thinking') { } // 思考中
     *   if(msg.type === 'xx') { } // 各种消息类型
     * }
     */
    onMessage?: MessageCallback;
  };

/** 请求任务对象 (用于取消请求) */
export type RequestTask = {
  /** 取消请求 */
  abort: () => void;
};

/** 日志请求 */
type RequestLogConfig = {
  url?: string;
  data?: unknown;
  header?: unknown;
  method?: RequestMethod;
  logExtra?: Record<string, unknown>;
  showLog?: boolean;
  enableChunked?: boolean;
  resKey?: RequestConfigBase['resKey'];
};

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回 Promise 和 Task 对象)
 * 基于 fetch API 封装，支持流式请求
 * @param config 请求配置
 * @example
 * // 在入口文件完成配置 (确保请求失败有toast提示,登录过期能够触发重新登录,log有日志输出)
 * setBaseToolsConfig({
 * toast: ({ msg, status }) => (status === 'fail' ? message.error(msg) : message.success(msg)),
 * showLoading: ({ title }) => message.loading(title || '加载中...'),
 * hideLoading: () => message.destroy(),
 * toLogin: () => reLogin(),
 * log(level, data) {
 *   if (data.name === 'request') {
 *     sendLog('request', data); // 请求日志
 *   } else if (level === 'error') {
 *     sendLog('error', data); // 错误日志
 *   } else {
 *     sendLog('action', data); // 操作日志
 *   }
 * },
 * });
 *
 * // 封装项目的基础请求
 * export function requestApi<T>(config: RequestConfig) {
 *    return request<T>({
 *      header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
 *      // transformRequest: ({ header, data }) => ({ header, data }), // 请求前转换, 如加密请求头和请求参数 (可选)
 *      // transformResponse: (res) => res, // 响应数据的转换, 如解密操作 (可选)
 *      resKey: 'data',
 *      msgKey: 'message',
 *      codeKey: 'status',
 *      successCode: [1],
 *      reloginCode: [-10],
 *      ...config,
 *    });
 * }
 *
 * // 1. 基于上面 requestApi 的普通接口
 * export function apiGoodList(data: { page: number, size: number }) {
 *   return requestApi<GoodItem[]>({ url: '/goods/list', data, resKey: 'data.list' });
 * }
 *
 * const goodList = await apiGoodList({ page:1, size:10 });
 *
 * // 2. 参数泛型的写法
 * export function apiGoodList(config: RequestConfig<{ page: number, size: number }>) {
 *   return requestApi<GoodItem[]>({ url: '/goods/list', resKey: 'data.list', ...config });
 * }
 *
 * const goodList = await apiGoodList({ data: { page:1, size:10 } });
 *
 * // 3. 基于上面 requestApi 的流式接口
 * export function apiChatStream(config: RequestConfig) {
 *   return requestApi({
 *     ...config,
 *     url: '/sse/chatStream',
 *     resKey: false,
 *     showLoading: false,
 *     responseType: 'arraybuffer', // 流式响应类型
 *     enableChunked: true, // 开启分块传输
 *   });
 * }
 *
 * // 初始化请求对象
 * let chatTask: RequestTask;
 * const onTaskReady = (task: RequestTask) => {
 *    chatTask = task;
 * }
 *
 * // 流式监听
 * const onMessage = (msg: SSEMessage) => {
 *   console.log(msg);
 *   if(msg.type === 'DONE') { } // 流式传输结束
 *   if(msg.type === 'thinking') { } // 思考中
 *   if(msg.type === 'xx') { } // 各种消息类型
 * }
 *
 * // 流式发起
 * const data = { content: '你好', chatId: 123 };
 * apiChatStream({ data, onTaskReady, onMessage });
 *
 * // 流式取消 (在组件销毁或页面关闭时调用)
 * chatTask?.abort();
 */
export function request<T, D extends RequestData = RequestData>(config: RequestConfigBase<D>) {
  const {
    url,
    data,
    header,
    method = 'GET',
    resKey,
    msgKey,
    codeKey,
    successKey,
    successCode,
    reloginCode,
    showLoading = true,
    toastError = true,
    enableChunked = false,
    cacheTime,
    transformRequest,
    transformResponse,
    responseType = 'json',
    timeout = 60000,
    fetchOptions,
    onTaskReady,
    onMessage,
  } = config;
  const controller = new AbortController();
  const sseTask: SseTask = { parser: onMessage ? new SSEParser(onMessage) : undefined };
  const task: RequestTask = {
    abort: () => {
      sseTask.parser = null;
      controller.abort();
    },
  };

  return new Promise<T>((resolve, reject) => {
    const appConfig = getBaseToolsConfig();
    const captureLog = config.showLog !== false && !!appConfig.log && !enableChunked;
    let logConfig: RequestLogConfig = config;
    let httpTimer: Timer | undefined;
    let httpStatus: number | undefined;
    let responseHeader: Record<string, unknown> | undefined;
    let failureStage: RequestFailureStage = 'prepare';
    let failureCode: RequestFailureCode = 'request_prepare_failed';
    let businessCode: unknown;
    let responseBody: unknown;
    let hasResponseBody = false;
    let fromCache = false;
    let logged = false;
    let isTimeout = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let sseStartMs = Date.now();
    const finish = (info: Omit<RequestLogOptions, 'config'>) => {
      if (logged) return;
      logged = true;
      logRequestInfo({
        config: logConfig,
        httpTimer,
        httpStatus,
        responseHeader,
        businessCode,
        sseStartMs,
        fromCache,
        ...info,
      });
    };

    const execute = async () => {
      try {
        onTaskReady?.(task);
        let fillData = isPlainObject(data) ? filterRequestData(data) : data;
        let fillHeader = filterRequestHeader(header);
        let fillUrl = url;
        if (transformRequest) {
          const transformed =
            (await transformRequest({
              url: fillUrl,
              method,
              header: { ...fillHeader },
              data: fillData as D,
            })) || {};
          if (transformed.url !== undefined) fillUrl = transformed.url;
          if (transformed.header !== undefined)
            fillHeader = filterRequestHeader(transformed.header);
          if (transformed.data !== undefined)
            fillData = isPlainObject(transformed.data)
              ? filterRequestData(transformed.data as Record<string, any>)
              : transformed.data;
        }
        const fetchRequest = createFetchRequest({
          url: fillUrl,
          method,
          data: fillData,
          header: fillHeader,
        });
        fillUrl = fetchRequest.url;
        fillHeader = fetchRequest.headers;
        logConfig = { ...config, data: fillData, header: fillHeader, url: fillUrl, method };
        sseStartMs = Date.now();

        const isCache = !enableChunked && cacheTime && cacheTime > 0;
        const cacheKey = isCache
          ? JSON.stringify({
              url: fillUrl,
              method,
              header: fillHeader,
              data: fillData,
              fetchOptions,
              responseType,
            })
          : '';
        if (isCache) {
          const res = checkCache(cacheKey);
          if (res) {
            fromCache = true;
            responseBody = res;
            hasResponseBody = true;
            failureStage = 'response';
            failureCode = 'response_result_failed';
            const result = getResponseResult(res, resKey) as T;
            businessCode = getResponseValue(res, codeKey);
            finish({ status: 'success', success: true, fromCache: true, res });
            resolve(result);
            return;
          }
        }

        if (showLoading)
          runRequestEffect(() =>
            appConfig.showLoading?.(typeof showLoading === 'string' ? { title: showLoading } : {}),
          );
        timeoutId = setTimeout(() => {
          isTimeout = true;
          controller.abort();
        }, timeout);
        const requestInit: RequestInit = {
          ...fetchOptions,
          method,
          headers: fillHeader,
          body: fetchRequest.body,
          signal: controller.signal,
        };
        failureStage = 'network';
        failureCode = 'network_failed';
        if (captureLog) httpTimer = startTimer();
        const response = await fetch(fillUrl, requestInit);
        httpStatus = response.status;
        if (captureLog) {
          responseHeader = {};
          response.headers.forEach((value, key) => {
            responseHeader![key] = value;
          });
        }

        if (enableChunked && response.ok) {
          if (showLoading) runRequestEffect(() => appConfig.hideLoading?.());
          const res = await handleFetchStreamResponse(response, sseTask);
          finish({ status: 'success', success: true, res });
          resolve(res as T);
          return;
        }

        // 正文只读一次；读完立即停表，JSON 解析、解密和业务判断不计入传输。
        const resData = await parseFetchResponse(response, responseType, () => {
          httpTimer?.end();
          // 正文读取完成前仍属于传输阶段，取消、超时和断流按网络失败记录。
          if (!response.ok) {
            failureStage = 'http';
            failureCode = 'http_failed';
          }
        });
        // 转换失败时仍保留已读取的正文；成功后再替换为转换结果。
        responseBody = resData;
        hasResponseBody = true;
        failureStage = 'response';
        failureCode = 'response_transform_failed';
        const res = transformResponse ? transformResponse(resData) : resData;
        responseBody = res;
        failureCode = 'response_result_failed';
        businessCode = getResponseValue(res, codeKey);
        const scode = successKey ? getResponseValue(res, successKey) : businessCode;
        const msgValue = getResponseValue(res, msgKey);
        const msg = String(msgValue ?? '');
        const isSuccess = successCode.includes(scode as string | number);
        const isRelogin = reloginCode.includes(businessCode as string | number);
        // 结果提取可能抛错，必须在记成功日志前完成。
        const result = isSuccess ? (getResponseResult(res, resKey) as T) : undefined;
        if (isSuccess && isCache)
          requestCache.set(cacheKey, { res, expire: Date.now() + cacheTime });
        finish({
          status: 'success',
          success: isSuccess,
          res,
          ...(!isSuccess && {
            failureStage: 'business' as const,
            failureCode: isRelogin ? ('login_required' as const) : ('business_failed' as const),
          }),
        });
        if (showLoading) runRequestEffect(() => appConfig.hideLoading?.());
        if (isSuccess) resolve(result as T);
        else {
          reject(res);
          if (isRelogin) runRequestEffect(() => appConfig.toLogin?.());
          else if (toastError && msg)
            runRequestEffect(() => appConfig.toast?.({ status: 'fail', msg }));
        }
      } catch (e) {
        httpTimer?.end();
        const isAbortError = e instanceof Error && e.name === 'AbortError';
        const error = isAbortError && isTimeout ? new Error('Request Timeout') : e;
        finish({
          status: 'fail',
          success: false,
          e: error,
          failureStage,
          ...(hasResponseBody ? { res: responseBody } : {}),
          failureCode:
            failureStage === 'network' && isAbortError
              ? isTimeout
                ? 'timeout'
                : 'aborted'
              : failureCode,
        });
        reject(error);
        if (showLoading) runRequestEffect(() => appConfig.hideLoading?.());
        if (toastError && (!isAbortError || isTimeout))
          runRequestEffect(() =>
            appConfig.toast?.({
              status: 'fail',
              msg: isTimeout
                ? '请求超时'
                : `请求失败: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
            }),
          );
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };
    // 包含请求准备阶段，不能只捕获 fetch 后的异常。
    execute();
  });
}

function logRequestInfo(options: RequestLogOptions) {
  writeRequestLog(getBaseToolsConfig().log, options);
}

/**
 * 检查缓存
 */
function checkCache(cacheKey: string) {
  const cached = requestCache.get(cacheKey);
  if (!cached) return null;
  if (cached.expire <= Date.now()) {
    requestCache.delete(cacheKey);
    return null;
  }
  return cached.res;
}
