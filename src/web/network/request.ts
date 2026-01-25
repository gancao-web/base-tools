import {
  appendUrlParam,
  cloneDeep,
  getObjectValue,
  isPlainObject,
  toDayjs,
} from '@base-web-kits/base-tools-ts';
import { getBaseToolsConfig } from '../config';
import type { AppLogInfo } from '../config';

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

/**
 * 发起请求的配置 (对外,参数可选)
 */
export type RequestConfig<D extends RequestData = RequestData> = Partial<RequestConfigBase<D>>;

/**
 * 自定义请求的配置 (接口字段参数必填)
 */
export type RequestConfigBase<D extends RequestData = RequestData> = {
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

  /** 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据 */
  resKey: string | false;

  /** 接口返回响应消息的字段, 支持"a[0].b.c"的格式 */
  msgKey: string;

  /** 接口返回响应状态码的字段, 支持"a[0].b.c"的格式 */
  codeKey: string;

  /** 接口返回成功状态码的字段, 支持"a[0].b.c"的格式 (默认取 codeKey) */
  successKey?: string;

  /** 成功状态码 */
  successCode: (number | string)[];

  /** 登录过期状态码 */
  reloginCode: (number | string)[];

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

  /** 响应数据的转换 */
  resMap?: (data: ResponseData) => ResponseData;

  /** 获取task对象, 用于取消请求或监听流式数据 */
  onTaskReady?: (task: RequestTask) => void;
};

/**
 * 请求任务对象 (用于取消请求或监听流式数据)
 */
export interface RequestTask {
  /** 取消请求 */
  abort: () => void;

  /** 监听流式数据块接收事件 */
  onChunkReceived: (callback: ChunkCallback) => void;

  /** 取消监听流式数据块接收事件 */
  offChunkReceived: () => void;
}

/**
 * 流式数据块接收事件回调
 */
export type ChunkCallback = (response: { data: ArrayBuffer }) => void;

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
 *      // resMap: (res) => res, // 响应拦截，可预处理响应数据，如解密 (可选)
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
 * // 流式监听
 * const onTaskReady = (task: RequestTask) => {
 *    task.onChunkReceived((res) => {
 *      console.log('ArrayBuffer', res.data);
 *    });
 * }
 *
 * // 流式发起
 * const data: ChatData = { content: '你好', conversationId: 123 };
 * await apiChatStream({ data, onTaskReady });
 *
 * // 流式取消 (在组件销毁或页面关闭时调用)
 * task?.offChunkReceived(); // 取消监听,中断流式接收
 * task?.abort(); // 取消请求 (若流式已生成,此时abort无效,因为请求已成功)
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
    resMap,
    responseType = 'json',
    timeout = 60000,
    onTaskReady,
  } = config;

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
  onTaskReady?.(task);

  // 2. 创建 Promise
  return new Promise<T>((resolve, reject) => {
    const execute = async () => {
      const isGet = method === 'GET';
      const isObjectData = isPlainObject(data);
      const isArrayData = !isObjectData && Array.isArray(data);

      // 2.1 参数处理
      // 参数过滤 undefined
      const fillData = isObjectData ? filterRequestData(data) : data;

      // 请求头过滤空值 (undefined, null, "")
      const fillHeader = filterRequestHeader(header);

      // 获取 Content-Type (忽略大小写)
      const contentTypeKey = Object.keys(fillHeader).find(
        (k) => k.toLowerCase() === 'content-type',
      );
      const contentType = contentTypeKey ? String(fillHeader[contentTypeKey]).toLowerCase() : '';

      if (!isGet && fillData && (isObjectData || isArrayData) && !contentType) {
        fillHeader['Content-Type'] = 'application/json';
      }

      // 2.2 处理 URL 和 Body
      const fillUrl =
        isGet && isObjectData ? appendUrlParam(url, fillData as Record<string, unknown>) : url;

      let fillBody: BodyInit | null | undefined;

      if (!isGet && fillData) {
        if (isObjectData && contentType.includes('application/x-www-form-urlencoded')) {
          // application/x-www-form-urlencoded: 转换为 URLSearchParams
          fillBody = toSearchParams(fillData as Record<string, unknown>);
        } else if (isObjectData && contentType.includes('multipart/form-data')) {
          // multipart/form-data: 转换为 FormData
          fillBody = toFormData(fillData as Record<string, unknown>);
          // 删除 Content-Type, 让 fetch 自动生成 boundary
          if (contentTypeKey) delete fillHeader[contentTypeKey];
        } else if (isObjectData || isArrayData) {
          fillBody = JSON.stringify(fillData);
        } else {
          fillBody = fillData as BodyInit;
        }
      }

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
      const appConfig = getBaseToolsConfig();
      if (showLoading)
        appConfig.showLoading?.(typeof showLoading === 'string' ? { title: showLoading } : {});

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
        const res = resMap ? resMap(resData) : resData;

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
  });
}

/**
 * 参数过滤undefined, 避免接口处理异常 (不可过滤 null 、 "" 、 false 、 0 这些有效值)
 */
export function filterRequestData(data: Record<string, any>) {
  const res: Record<string, any> = {};
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined) res[k] = v;
  });
  return res;
}

/**
 * 请求头过滤空值 (undefined, null, ""), 不过滤0和false
 */
export function filterRequestHeader(header: RequestConfigBase['header']) {
  const newHeader: Record<string, string> = {};
  if (header) {
    Object.entries(header).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') newHeader[k] = String(v);
    });
  }
  return newHeader;
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
  const { log } = getBaseToolsConfig();
  const { showLog = true } = options.config;

  if (!log || !showLog) return;

  const { config, res, fromCache = false, startTime, status, e } = options;
  const { url, data, header, method, logExtra } = config;
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
    ...logExtra,
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

/**
 * 转换为 URLSearchParams
 */
function toSearchParams(data: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const key in data) {
    const val = data[key];
    // undefined 已在 fillData 阶段过滤，此处仅需判断 null
    // null 在 Form 中会被转为字符串 "null"，通常不符合预期，故过滤
    if (val === null) continue;
    if (Array.isArray(val)) {
      val.forEach((v) => params.append(key, typeof v === 'object' ? JSON.stringify(v) : String(v)));
    } else {
      params.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    }
  }
  return params;
}

/**
 * 转换为 FormData
 */
function toFormData(data: Record<string, unknown>) {
  const formData = new FormData();
  for (const key in data) {
    const val = data[key];
    // undefined 已在 fillData 阶段过滤，此处仅需判断 null
    // null 在 Form 中会被转为字符串 "null"，通常不符合预期，故过滤
    if (val === null) continue;
    if (Array.isArray(val)) {
      val.forEach((v) =>
        formData.append(
          key,
          v instanceof Blob ? v : typeof v === 'object' ? JSON.stringify(v) : String(v),
        ),
      );
    } else {
      formData.append(
        key,
        val instanceof Blob ? val : typeof val === 'object' ? JSON.stringify(val) : String(val),
      );
    }
  }
  return formData;
}
