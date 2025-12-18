import {
  appendUrlParam,
  cloneDeep,
  getObjectValue,
  isPlainObject,
  pickBy,
  toDayjs,
} from '../../ts';
import { getAppConfig } from '../config';
import type { AppLogInfo } from '../config';
import type {
  ChunkCallback,
  RequestConfigBase,
  RequestData,
  RequestTask,
  ResponseData,
} from './request.d';

export * from './request.d';

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回 Promise 和 Task 对象)
 * 基于 fetch API 封装，支持流式请求
 * @param config 请求配置
 * @returns Promise<T> & { task?: RequestTask }
 * @example
 * // 在入口文件完成配置 (确保请求失败有toast提示,登录过期能够触发重新登录,log有日志输出)
 * setBaseToolsConfig({
 * toast: ({ msg, status }) => (status === 'fail' ? message.error(msg) : message.success(msg)),
 * showLoading: () => message.loading('加载中...'),
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
 *      // responseInterceptor: (res) => res, // 响应拦截，可预处理响应数据，如解密 (可选)
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
 * const goodList = await apiGoodList({ data: { page:1, size:10 }, showLoading: false });
 *
 * // 3. 基于上面 requestApi 的流式接口
 * export function apiChatStream(data: { question: string }) {
 *   return requestApi<T>({
 *     url: '/sse/chatStream',
 *     data,
 *     resKey: false,
 *     showLoading: false,
 *     responseType: 'arraybuffer',
 *     enableChunked: true,
 *   });
 * }
 *
 * const { task } = apiChatStream({question: '你好'}); // 发起流式请求
 *
 * task.onChunkReceived((res) => {
 *   console.log('ArrayBuffer', res.data); // 接收流式数据
 * });
 *
 * task.offChunkReceived(); // 取消监听,中断流式接收 (调用时机:流式结束,组件销毁,页面关闭)
 * task.abort(); // 取消请求 (若流式传输中,会中断流并抛出异常)
 */
export function request<T, D extends RequestData = RequestData>(config: RequestConfigBase<D>) {
  // 1. 初始化控制对象
  const controller = new AbortController();
  const signal = controller.signal;
  let chunkCallback: ChunkCallback | null = null;

  // 构造 Task 对象
  const task: RequestTask = {
    abort: () => controller.abort(),
    onChunkReceived: (cb) => {
      chunkCallback = cb;
    },
    offChunkReceived: () => {
      chunkCallback = null;
    },
  };

  // 2. 创建 Promise
  const promise = new Promise<T>((resolve, reject) => {
    const execute = async () => {
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
        responseInterceptor,
        responseType = 'json',
        timeout = 60000,
      } = config;

      const isGet = method === 'GET';
      const isObjectData = isPlainObject(data);
      const isArrayData = !isObjectData && Array.isArray(data);

      // 2.1 参数处理
      // 参数: 过滤undefined, 避免接口处理异常 (不可过滤 null 、 "" 、 false 、 0 这些有效值)
      const fillData = isObjectData ? pickBy(data, (val) => val !== undefined) : data;

      // 请求头: 过滤空值 (undefined 、null 、"" 、false 、0), 因为服务器端接收到的都是字符串
      const fillHeader = (header ? pickBy(header, (val) => !!val) : {}) as Record<string, string>;

      if (!isGet && fillData && (isObjectData || isArrayData) && !fillHeader['Content-Type']) {
        fillHeader['Content-Type'] = 'application/json';
      }

      // 2.2 处理 URL 和 Body
      const fillUrl =
        isGet && isObjectData ? appendUrlParam(url, fillData as Record<string, unknown>) : url;

      const fillBody =
        !isGet && fillData
          ? isObjectData || isArrayData
            ? JSON.stringify(fillData)
            : (fillData as BodyInit)
          : undefined;

      // 2.3 日志与缓存配置
      const logConfig = { ...config, data: fillData, header: fillHeader, url: fillUrl };
      const startTime = Date.now();

      // 2.4 检查缓存
      const isCache = cacheTime && cacheTime > 0;
      const cacheKey = isCache ? JSON.stringify({ url: fillUrl, data: fillData }) : '';

      if (isCache) {
        const res = checkCache(cacheKey);
        if (res) {
          logRequestInfo({
            status: 'success',
            config: logConfig,
            fromCache: true,
            startTime,
            res,
          });
          resolve(getResult(res, resKey) as T);
          return;
        }
      }

      // 2.5 UI 反馈
      const appConfig = getAppConfig();
      if (showLoading) appConfig.showLoading?.();

      // 2.6 设置超时
      let isTimeout = false;
      const timeoutId = setTimeout(() => {
        isTimeout = true;
        controller.abort();
      }, timeout);

      try {
        // 2.7 发起请求
        const response = await fetch(fillUrl, {
          method,
          headers: fillHeader,
          body: fillBody,
          signal,
        });

        if (!response.ok) {
          if (showLoading) appConfig.hideLoading?.();
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        // 2.8 处理流式响应
        if (enableChunked) {
          if (showLoading) appConfig.hideLoading?.();

          const res = await handleStreamResponse(response, chunkCallback);

          logRequestInfo({ status: 'success', config: logConfig, startTime, res });

          resolve(res as T);
          return;
        }

        // 2.9 处理普通响应
        const resData = await parseResponse(response, responseType);

        // 隐藏 Loading
        if (showLoading) appConfig.hideLoading?.();

        // 响应拦截
        const res = responseInterceptor ? responseInterceptor(resData) : resData;

        // 2.10 业务状态码解析
        const code = getObjectValue(res, codeKey);
        const scode = successKey ? getObjectValue(res, successKey) : code;
        const msg = getObjectValue(res, msgKey);
        const isSuccess = successCode.includes(scode);
        const isRelogin = reloginCode.includes(code);

        logRequestInfo({ status: 'success', config: logConfig, startTime, res });

        // 2.11 结果处理
        if (isSuccess) {
          // 业务正常
          if (isCache) requestCache.set(cacheKey, { res, expire: Date.now() + cacheTime });
          resolve(getResult(res, resKey) as T);
        } else if (isRelogin) {
          // 登录失效
          reject(res);
          appConfig.toLogin?.(); // 放在后面,确保reject执行后再跳转登录
        } else {
          // 业务错误
          if (toastError && msg) appConfig.toast?.({ status: 'fail', msg });
          reject(res);
        }
      } catch (e) {
        const status = 'fail';
        const isAbortError = e instanceof DOMException && e.name === 'AbortError'; // 取消请求不视为错误

        if (isAbortError && isTimeout) {
          if (toastError) appConfig.toast?.({ status, msg: '请求超时' });
          const timeoutError = new Error('Request Timeout');
          logRequestInfo({ status, config: logConfig, startTime, e: timeoutError });
          reject(timeoutError);
          return;
        }

        if (!isAbortError && toastError) appConfig.toast?.({ status, msg: '网络请求失败' });
        logRequestInfo({ status, config: logConfig, startTime, e });
        reject(e);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    execute();
  }) as Promise<T> & { task?: RequestTask };

  // 3. 挂载 Task
  promise.task = task;

  return promise;
}

/**
 * 日志输出
 */
function logRequestInfo(options: {
  config: RequestConfigBase<RequestData> & { url?: string };
  fromCache?: boolean;
  startTime: number;
  status: 'success' | 'fail';
  res?: unknown;
  e?: unknown;
}) {
  const { log } = getAppConfig();
  const { isLog = true } = options.config;

  if (!log || !isLog) return;

  const { config, res, fromCache = false, startTime, status, e } = options;
  const { url, data, header, method, extraLog } = config;
  const endTime = Date.now();
  const fmt = 'YYYY-MM-DD HH:mm:ss.SSS';

  const info: AppLogInfo = {
    name: 'request',
    status,
    url,
    data,
    method,
    header,
    fromCache,
    startTime: toDayjs(startTime).format(fmt),
    endTime: toDayjs(endTime).format(fmt),
    duration: endTime - startTime,
    ...extraLog,
  };

  if (status === 'success') {
    info.res = cloneDeep(res); // 深拷贝,避免外部修改对象,造成输出不一致
    log('info', info);
  } else {
    info.e = e;
    log('error', info);
  }
}

/**
 * 获取 resKey 对应的数据
 */
function getResult(res: unknown, resKey?: RequestConfigBase['resKey']) {
  if (!res || !resKey || typeof res !== 'object') return res;
  return getObjectValue(res, resKey);
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

/**
 * 处理流式响应
 */
async function handleStreamResponse(response: Response, chunkCallback: ChunkCallback | null) {
  if (!response.body) throw new Error('Response body is null');

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (chunkCallback && value) {
      chunkCallback({ data: value.buffer });
    }
  }

  return 'Stream Finished';
}

/**
 * 解析响应数据
 */
async function parseResponse(response: Response, responseType: string) {
  let resData: ResponseData;
  if (responseType === 'arraybuffer') {
    resData = await response.arrayBuffer();
  } else if (responseType === 'text') {
    resData = await response.text();
  } else {
    const text = await response.text();
    try {
      resData = JSON.parse(text);
    } catch {
      resData = text;
    }
  }
  return resData;
}
