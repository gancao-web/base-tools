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
import type { ChunkCallback, RequestConfigBase, RequestData, RequestTask } from './request.d';

export * from './request.d';

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回 Promise 和 Task 对象)
 * 基于 fetch API 封装，支持流式请求
 * @param config 请求配置
 * @returns Promise<T> & { task?: RequestTask }
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
      const fillData = isObjectData ? pickBy(data, (val) => val !== undefined) : data;

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
      const appCfg = getAppConfig();
      if (showLoading && appCfg.showLoading) appCfg.showLoading();

      // 2.6 设置超时
      const timeoutId = setTimeout(() => {
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
          if (showLoading && appCfg.hideLoading) appCfg.hideLoading();
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        // 2.8 处理流式响应
        if (enableChunked) {
          if (showLoading && appCfg.hideLoading) appCfg.hideLoading();

          const res = await handleStreamResponse(response, chunkCallback);

          logRequestInfo({ status: 'success', config: logConfig, startTime, res });

          resolve(res as T);
          return;
        }

        // 2.9 处理普通响应
        const resData = await parseResponse(response, responseType);

        // 隐藏 Loading
        if (showLoading && appCfg.hideLoading) appCfg.hideLoading();

        // 响应拦截
        const finalRes = responseInterceptor ? responseInterceptor(resData) : resData;

        // 2.10 业务状态码解析
        const code = getObjectValue(finalRes, codeKey);
        const scode = successKey ? getObjectValue(finalRes, successKey) : code;
        const msg = getObjectValue(finalRes, msgKey);
        const isSuccess = successCode.includes(scode);
        const isRelogin = reloginCode.includes(code);

        logRequestInfo({ status: 'success', config: logConfig, startTime, res: finalRes });

        // 2.11 结果处理
        if (isSuccess) {
          // 业务正常
          if (isCache) {
            requestCache.set(cacheKey, { res: finalRes, expire: Date.now() + cacheTime });
          }
          resolve(getResult(finalRes, resKey) as T);
        } else if (isRelogin) {
          // 登录失效
          reject(finalRes);
          if (appCfg.toLogin) appCfg.toLogin(); // 放在后面,确保reject执行后再跳转登录
        } else {
          // 业务错误
          if (toastError && appCfg.toast) appCfg.toast(String(msg || 'Request Error'));
          reject(finalRes);
        }
      } catch (e: unknown) {
        // 忽略 AbortError (取消请求不视为错误，或者根据需求处理)
        if (e instanceof DOMException && e.name === 'AbortError') {
          // console.warn('Request aborted');
        } else {
          if (toastError && appCfg.toast) appCfg.toast('网络请求失败');
        }

        logRequestInfo({ status: 'fail', config: logConfig, startTime, e });
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
    info.res = cloneDeep(res);
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
async function handleStreamResponse(
  response: Response,
  chunkCallback: ((response: { data: ArrayBuffer }) => void) | null,
) {
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
  let resData: unknown;
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
