import { isPlainObject } from 'es-toolkit';
import { startTimer, type Timer } from '../../ts/time';
import { getBaseToolsConfig } from '../config';
import { toLogin } from '../router';
import { getPlatformOs, getPlatformUni } from '../system';
import { toast } from '../ui';
import { type SSEParser, type MessageCallback } from '../../ts/buffer/SSEParser';
import { createSseParser } from '../../shared/network/sse';
import {
  getResponseResult,
  getResponseValue,
  type ApiResponseConfig,
  type ResponseTransformer,
} from '../../shared/network/response';
import {
  createFetchRequest,
  filterRequestData,
  filterRequestHeader,
  handleFetchStreamResponse,
} from '../../shared/network/fetch';
import {
  runRequestEffect,
  writeRequestLog,
  type RequestFailureCode,
  type RequestLogOptions,
} from '../../shared/network/requestLog';
import type { ApiTaskConfig } from '../../shared/network/action';

/** 请求参数 */
export type RequestData = UniApp.RequestOptions['data'];

/** 请求前转换上下文 */
export type TransformRequestContext<D extends RequestData = RequestData> = {
  url: string;
  method?: string;
  header: Record<string, string | number | boolean>;
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

type UniRequestOptions = Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete' | 'data'>;
type RequestResponseConfig = UniRequestOptions &
  ApiResponseConfig &
  ResponseTransformer<UniApp.RequestSuccessCallbackResult['data']>;

/** 自定义请求的配置 (接口字段参数必填) */
export type RequestConfigBase<D extends RequestData = RequestData> = RequestResponseConfig &
  ApiTaskConfig<UniApp.RequestTask> & {
    /** 请求参数 */
    data?: D;

    /** 响应数据的缓存时间, 单位毫秒。仅在成功时缓存；仅缓存在内存，应用退出,缓存消失。(默认0,不开启缓存) */
    cacheTime?: number;

    /** 是否提示接口异常 (默认true) */
    toastError?: boolean;

    /** 是否显示进度条: 支持字符串,自定义文本 (默认true) */
    showLoading?: boolean | string;

    /** 额外输出的日志数据 */
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

/** 日志请求 */
type RequestLogConfig = {
  url?: string;
  data?: unknown;
  header?: unknown;
  method?: string;
  logExtra?: Record<string, unknown>;
  enableChunked?: boolean;
  resKey?: RequestConfigBase['resKey'];
};

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回promise和task对象)
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ pathLogin, log })
 * @param config 请求配置
 * @example
 * // 封装项目的基础请求
 * export function requestApi<T>(config: RequestConfig) {
 *    return request<T>({
 *      header: { token: 'xx', version: 'xx', tid: 'xx' },
 *      resKey: 'data',
 *      msgKey: 'message',
 *      codeKey: 'status',
 *      successCode: [1],
 *      reloginCode: [-10],
 *      ...config,
 *      url: `${HOST}${config.url}`,
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
 * // 2. 支持参数泛型
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
export function request<_T = unknown, D extends RequestData = RequestData>(
  config: RequestConfigBase<D> & { enableChunked: true },
): Promise<void>;
export function request<T, D extends RequestData = RequestData>(
  config: RequestConfigBase<D> & { enableChunked?: false },
): Promise<T>;
export function request<T, D extends RequestData = RequestData>(
  config: RequestConfigBase<D>,
): Promise<T | void>;
export function request<T, D extends RequestData = RequestData>(config: RequestConfigBase<D>) {
  return new Promise<T | void>((resolve, reject) => {
    const {
      url,
      data,
      header,
      resKey,
      msgKey,
      codeKey,
      successKey,
      successCode,
      reloginCode,
      showLoading = true,
      toastError = true,
      enableChunked,
      cacheTime,
      transformRequest,
      transformResponse,
      onTaskReady,
      onMessage,
      logExtra: _logExtra,
      ...nativeConfig
    } = config;
    let logConfig: RequestLogConfig = config;
    let httpTimer: Timer | undefined;
    let httpStatus: number | undefined;
    let responseHeader: Record<string, unknown> | undefined;
    let businessCode: unknown;
    let finalized = false;
    const captureLog = !!getBaseToolsConfig().log;
    let streamAborted = false;
    let streamParser: SSEParser | undefined;
    // 统一结束请求；状态与是否输出日志无关，日志异常不得阻止 Promise 完成。
    const finish = (info: Omit<RequestLogOptions, 'config'>, result?: T) => {
      if (finalized) return;
      finalized = true;
      if (info.success) resolve(enableChunked ? undefined : (result as T));
      else reject('e' in info ? info.e : info.res);
      runRequestEffect(() =>
        logRequestInfo({
          config: logConfig,
          httpTimer,
          httpStatus,
          responseHeader,
          businessCode,
          ...info,
        }),
      );
    };
    const execute = async () => {
      let fillData = isPlainObject(data) ? filterRequestData(data as Record<string, any>) : data;
      let fillHeader = filterRequestHeader(header);
      let fillUrl = url;
      if (transformRequest) {
        const transformed =
          (await transformRequest({
            url: fillUrl,
            method: config.method,
            header: { ...fillHeader },
            data: fillData as D,
          })) || {};
        if (transformed.url !== undefined) fillUrl = transformed.url;
        if (transformed.header !== undefined) fillHeader = filterRequestHeader(transformed.header);
        if (transformed.data !== undefined)
          fillData = isPlainObject(transformed.data)
            ? filterRequestData(transformed.data as Record<string, any>)
            : transformed.data;
      }
      logConfig = {
        ...config,
        url: fillUrl,
        data: fillData,
        header: fillHeader,
        method: config.method || 'GET',
      };
      const isCache = !enableChunked && cacheTime && cacheTime > 0;
      const cacheKey = isCache ? JSON.stringify({ url: fillUrl, data: fillData }) : '';
      if (isCache) {
        const cached = requestCache.get(cacheKey);
        if (cached && cached.expire > Date.now()) {
          const { res } = cached;
          try {
            const result = getResponseResult(res, resKey) as T;
            businessCode = getResponseValue(res, codeKey);
            finish({ status: 'success', success: true, fromCache: true, res }, result);
          } catch (e) {
            finish({
              status: 'fail',
              success: false,
              fromCache: true,
              e,
              failureStage: 'response',
              failureCode: 'response_result_failed',
            });
          }
          return;
        }
        requestCache.delete(cacheKey);
      }
      if (showLoading)
        runRequestEffect(() =>
          uni.showLoading(typeof showLoading === 'string' ? { title: showLoading } : {}),
        );

      // uni.request 在 H5 端基于 XHR，无法读取响应流；仅 H5 流式请求改用 Fetch。
      if (enableChunked && getPlatformUni() === 'web') {
        const controller = new AbortController();
        const sseTask: { parser: SSEParser | undefined | null } = {
          parser: createSseParser(
            getBaseToolsConfig().log,
            config.logExtra,
            onMessage,
            () => !finalized && !controller.signal.aborted,
          ),
        };
        const headerListeners = new Set<(result: any) => void>();
        const task: UniApp.RequestTask = {
          abort() {
            sseTask.parser = null;
            controller.abort();
          },
          onHeadersReceived(callback) {
            headerListeners.add(callback);
          },
          offHeadersReceived(callback) {
            headerListeners.delete(callback);
          },
        };

        onTaskReady?.(task);

        let isTimeout = false;
        const timeoutId = setTimeout(() => {
          isTimeout = true;
          task.abort();
        }, config.timeout ?? 60000);

        try {
          const {
            url: streamUrl,
            body,
            headers,
          } = createFetchRequest({
            url: fillUrl,
            method: config.method,
            data: fillData,
            header: fillHeader,
          });
          if (captureLog) httpTimer = startTimer();
          const response = await fetch(streamUrl, {
            method: config.method || 'GET',
            headers,
            body,
            signal: controller.signal,
            credentials: config.withCredentials ? 'include' : 'same-origin',
          });

          httpStatus = response.status;
          responseHeader = {};
          response.headers.forEach((value, key) => {
            responseHeader![key] = value;
          });
          headerListeners.forEach((callback) =>
            callback({ header: responseHeader, statusCode: response.status }),
          );

          if (!response.ok) {
            const text = await response.text();
            httpTimer?.end();
            let res: unknown = text;
            try {
              res = JSON.parse(text);
            } catch {
              /* 非 JSON 正文原样保留。 */
            }
            const error = new Error(`HTTP Error ${response.status}`);
            finish({
              status: 'fail',
              success: false,
              res,
              e: error,
              failureStage: 'http',
              failureCode: 'http_failed',
            });
            if (showLoading) runRequestEffect(() => uni.hideLoading());
            if (toastError) runRequestEffect(() => toast(`请求失败: ${error.message}`));
            return;
          }
          await handleFetchStreamResponse(response, sseTask, () => httpTimer?.end());
          httpTimer?.end();

          if (showLoading) runRequestEffect(() => uni.hideLoading());
          finish({ status: 'success', success: true });
        } catch (e) {
          httpTimer?.end();
          if (showLoading) runRequestEffect(() => uni.hideLoading());

          const isAbortError = e instanceof Error && e.name === 'AbortError';
          const error = isAbortError && isTimeout ? new Error('Request Timeout') : e;

          if (toastError && (!isAbortError || isTimeout)) {
            runRequestEffect(() =>
              toast(
                isTimeout
                  ? '请求超时'
                  : `请求失败: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
              ),
            );
          }
          finish({
            status: 'fail',
            success: false,
            e: error,
            failureStage: 'network',
            failureCode: isAbortError ? (isTimeout ? 'timeout' : 'aborted') : 'network_failed',
          });
        } finally {
          clearTimeout(timeoutId);
        }
        return;
      }

      if (captureLog) httpTimer = startTimer();
      const task = uni.request({
        ...nativeConfig,
        enableChunked,
        url: fillUrl,
        data: fillData,
        header: fillHeader,
        success: (xhr) => {
          if (finalized) return;
          httpTimer?.end();
          httpStatus = xhr.statusCode;
          if (captureLog) responseHeader = { ...xhr.header };
          // 先分发尾消息，再结束；尾消息回调也可能同步取消本次连接。
          if (enableChunked && !streamAborted) streamParser?.flush();
          if (finalized) return;
          if (streamAborted) {
            finish({
              status: 'fail',
              success: false,
              failureStage: 'network',
              failureCode: 'aborted',
            });
            if (showLoading) runRequestEffect(() => uni.hideLoading());
            return;
          }
          // 转换失败时保留宿主返回的正文；成功后再替换为转换结果。
          let res = xhr.data;
          let result: unknown;
          let msg: string;
          let isSuccess: boolean;
          let isRelogin: boolean;
          let failureCode: RequestFailureCode = 'response_transform_failed';
          try {
            res = transformResponse ? transformResponse(xhr.data) : xhr.data;
            failureCode = 'response_result_failed';
            businessCode = enableChunked ? undefined : getResponseValue(res, codeKey);
            const scode = enableChunked
              ? ''
              : successKey
                ? getResponseValue(res, successKey)
                : businessCode;
            msg = String((enableChunked ? undefined : getResponseValue(res, msgKey)) ?? '');
            isSuccess = enableChunked ? true : successCode.includes(scode as string | number);
            isRelogin = enableChunked
              ? false
              : reloginCode.includes(businessCode as string | number);
            result = isSuccess && !enableChunked ? getResponseResult(res, resKey) : undefined;
            if (isSuccess && isCache)
              requestCache.set(cacheKey, { res, expire: Date.now() + cacheTime });
          } catch (e) {
            // 原生回调里的异常无法由 execute().catch 捕获。
            finish({
              status: 'fail',
              success: false,
              e,
              failureStage: 'response',
              failureCode,
              res,
            });
            if (showLoading) runRequestEffect(() => uni.hideLoading());
            if (toastError)
              runRequestEffect(() =>
                toast(`请求失败: ${e instanceof Error ? e.message : JSON.stringify(e)}`, 2000),
              );
            return;
          }
          finish(
            {
              status: 'success',
              success: isSuccess,
              ...(!enableChunked ? { res } : {}),
              ...(!isSuccess && {
                failureStage: 'business' as const,
                failureCode: isRelogin ? ('login_required' as const) : ('business_failed' as const),
              }),
            },
            result as T,
          );
          if (showLoading) runRequestEffect(() => uni.hideLoading());
          if (!isSuccess) {
            if (isRelogin) runRequestEffect(() => toLogin());
            else if (toastError) runRequestEffect(() => toast(msg, 2000));
          }
        },
        fail(e) {
          if (finalized) return;
          httpTimer?.end();
          // 只识别宿主约定的明确通知，不用模糊关键词推测。
          const failureCode: RequestFailureCode =
            e.errMsg === 'request:fail timeout'
              ? 'timeout'
              : e.errMsg === 'request:fail abort'
                ? 'aborted'
                : 'network_failed';
          finish({ status: 'fail', success: false, e, failureStage: 'network', failureCode });
          if (showLoading) runRequestEffect(() => uni.hideLoading());
          if (toastError)
            runRequestEffect(() => toast(`请求失败: ${e.errMsg || JSON.stringify(e)}`));
        },
      });
      if (captureLog && enableChunked) {
        // 取消或断流时 success 不会触发，提前保存宿主已经提供的握手信息。
        runRequestEffect(() =>
          task.onHeadersReceived?.((event) => {
            if (finalized) return;
            responseHeader = { ...event.header };
            const status = (event as { statusCode?: number }).statusCode;
            if (typeof status === 'number' && status > 0) httpStatus = status;
          }),
        );
      }
      if (enableChunked || onMessage) {
        streamParser = createSseParser(
          enableChunked ? getBaseToolsConfig().log : undefined,
          config.logExtra,
          onMessage,
          () => !finalized && !streamAborted,
        );
        // @ts-ignore
        task.onChunkReceived?.((res: { data: ArrayBuffer }) => {
          if (!finalized && !streamAborted) streamParser?.receive(res.data);
        });
        const oldAbort = task.abort.bind(task);
        task.abort = () => {
          streamAborted = true;
          // @ts-ignore
          task.offChunkReceived?.();
          oldAbort();
        };
      }
      // 任务已发送；通知回调失败不能把请求改记为准备失败。
      runRequestEffect(() => onTaskReady?.(task));
    };
    execute().catch((e) => {
      if (finalized) return;
      // 同步发送失败没有网络传输，不补造 duration。
      finish({
        status: 'fail',
        success: false,
        e,
        failureStage: 'prepare',
        failureCode: 'request_prepare_failed',
        httpTimer: undefined,
      });
      if (showLoading) runRequestEffect(() => uni.hideLoading());
      if (toastError)
        runRequestEffect(() =>
          toast(`请求失败: ${e instanceof Error ? e.message : JSON.stringify(e)}`, 2000),
        );
    });
  });
}

function logRequestInfo(options: RequestLogOptions) {
  writeRequestLog(getBaseToolsConfig().log, options, (info) => {
    // 保留微信开发工具中复制响应类型的既有便利字段。
    if (
      options.config.enableChunked ||
      options.status !== 'success' ||
      getPlatformOs() !== 'devtools'
    )
      return;
    const result = getResponseResult(options.res, (options.config as RequestLogConfig).resKey);
    if (result && typeof result === 'object') info._res = { text: JSON.stringify(result) };
  });
}
