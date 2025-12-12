import { cloneDeep, getObjectValue, isPlainObject, pickBy } from '../../ts';
import { getAppConfig } from '../config';
import { toLogin } from '../router';
import { getPlatformOs } from '../system';
import { toast } from '../ui';
import type { AppLogInfo } from '../config';

/** 请求参数 */
export type RequestParams = UniApp.RequestOptions['data'];

/** 请求配置 */
export type RequestConfig = Omit<
  UniApp.RequestOptions,
  'url' | 'data' | 'success' | 'fail' | 'complete'
> & {
  /** 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据 */
  dataKey: string | false;

  /** 接口返回响应消息的字段, 支持"a[0].b.c"的格式 */
  msgKey: string;

  /** 接口返回响应状态码的字段, 支持"a[0].b.c"的格式 */
  codeKey: string;

  /** 成功状态码 */
  successCode: (number | string)[];

  /** 登录过期状态码 */
  reloginCode: (number | string)[];

  /** 是否显示进度条 (默认true) */
  showLoading?: boolean;

  /** 是否提示接口异常 (默认true) */
  toastError?: boolean;

  /** 是否输出日志 (默认true) */
  isLog?: boolean;

  /** 响应数据的缓存时间, 单位毫秒。仅在成功时缓存；仅缓存在内存，应用退出,缓存消失。(默认0,不开启缓存) */
  cacheTime?: number;

  /** 响应拦截 */
  responseInterceptor?: (
    data: UniApp.RequestSuccessCallbackResult['data'],
  ) => UniApp.RequestSuccessCallbackResult['data'];
};

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回promise和task对象)
 * - 需在入口文件初始化应用配置 setAppConfig({ pathLogin, log })
 * @param url 请求地址
 * @param params 请求参数 (已过滤undefined参数)
 * @param config 请求配置
 * @returns Promise<T> & { task?: UniApp.RequestTask }
 * @example
 * // 封装项目的基础请求
 * export function requestApi<T>(url: string, params: RequestParams, config?: RequestConfig) {
 *    return request<T>(HOST + url, params, {
 *      header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
 *      // responseInterceptor: (res) => res, // 响应拦截，可预处理响应数据，如解密 (可选)
 *      dataKey: 'data',
 *      msgKey: 'message',
 *      codeKey: 'status',
 *      successCode: [1],
 *      reloginCode: [-10],
 *      ...config,
 *    });
 * }
 *
 * // 1. 基于上面 requestApi 的普通接口
 * export function apiGoodList(params: { page: number, size: number }) {
 *   return requestApi<GoodItem[]>('/goods/list', params, { dataKey: 'data.list' });
 * }
 *
 * const goodList = await apiGoodList({ page:1, size:10 });
 *
 * // 2. 基于上面 requestApi 的流式接口
 * export function apiChatStream(params: { question: string }) {
 *   return requestApi('/sse/chatStream', params, {
 *     dataKey: false,
 *     showLoading: false,
 *     responseType: 'arraybuffer',
 *     enableChunked: true,
 *   });
 * }
 *
 * const { task } = apiChatStream({question: '你好'}); // 发起流式请求
 *
 * task.onProgressUpdate((res) => {
 *   console.log('ArrayBuffer', res.data); // 接收流式数据
 * });
 *
 * task.offChunkReceived(); // 取消监听,中断流式接收
 * task.abort(); // 取消请求 (若流式已生成,此时abort无效,因为请求已经成功)
 */
export function request<T>(url: string, params: RequestParams, config: RequestConfig) {
  // 请求对象
  const temp: { task?: UniApp.RequestTask } = {};

  // 创建promise
  const promise: Promise<T> & { task?: UniApp.RequestTask } = new Promise((resolve, reject) => {
    const {
      dataKey,
      msgKey,
      codeKey,
      successCode,
      reloginCode,
      showLoading = true,
      toastError = true,
      isLog = true,
      cacheTime,
      responseInterceptor,
      ...uniConfig
    } = config;

    const { header, method } = uniConfig;

    // 参数: 过滤undefined, 避免接口处理异常 (不可过滤 null 、 "" 、 false 这些有效值)
    const fillParams = isPlainObject(params) ? pickBy(params, (val) => val !== undefined) : params;

    // 请求头: 过滤空值 (undefined, null, "", false), 因为服务器端接收到的都是字符串
    const fillHeader = header ? pickBy(header, (val) => !!val || val === 0) : {};

    // 日志输出的config
    const logConfig = { isLog, header: fillHeader, method, dataKey };

    // 缓存处理
    const isCache = cacheTime && cacheTime > 0;
    const cacheKey = isCache ? JSON.stringify({ url, params: fillParams }) : '';
    if (isCache) {
      const cached = requestCache.get(cacheKey);
      if (cached && cached.expire > Date.now()) {
        const { res } = cached;
        logRequestInfo({ url, params: fillParams, config: logConfig, res, isFromCache: true });
        const data = dataKey ? getObjectValue(res, dataKey) : res;
        resolve(data as T);
        return;
      }
    }

    // 显示进度条
    if (showLoading) uni.showLoading();

    // 发送请求
    temp.task = uni.request({
      ...uniConfig,
      url,
      data: fillParams,
      header: fillHeader,
      success: (xhr) => {
        // 隐藏进度条 (不能写在complete回调,否则toast会被hideLoading隐藏)
        if (showLoading) uni.hideLoading();

        // 响应拦截
        const res = responseInterceptor ? responseInterceptor(xhr.data) : xhr.data;

        // 解析数据
        const code = getObjectValue(res, codeKey);
        const msg = getObjectValue(res, msgKey);
        const isSuccess = successCode.includes(code);
        const isRelogin = reloginCode.includes(code);

        // 缓存数据
        if (isSuccess && isCache) {
          requestCache.set(cacheKey, { res, expire: Date.now() + cacheTime });
        }

        // 日志
        logRequestInfo({ url, params: fillParams, config: logConfig, res });

        if (isSuccess) {
          // 业务正常
          const data = dataKey ? getObjectValue(res, dataKey) : res;
          resolve(data as T);
        } else if (isRelogin) {
          // 重新登录
          toLogin();
          reject(res);
        } else {
          // 业务异常
          if (toastError) toast(msg, 2000);
          reject(res);
        }
      },

      fail(e) {
        // 隐藏进度条 (不能写在complete回调,否则toast会被hideLoading隐藏)
        if (showLoading) uni.hideLoading();
        // 请求异常
        if (toastError) toast('请求失败,请检查网络');
        reject(e);
        // 上报日志
        const { log } = getAppConfig();
        log?.('error', { name: 'request', status: 'fail', url, params: fillParams, ...config, e });
      },
    });
  });

  // 将 task 挂载到 Promise 上
  promise.task = temp.task;

  return promise;
}

/**
 * 日志输出 (config.isLog 为 true 时有效)
 * - 需在入口文件初始化应用配置 setAppConfig({ log })
 * @param options 日志选项
 * @param options.url 请求URL
 * @param options.params 请求参数
 * @param options.config 请求配置
 * @param options.res 响应数据
 * @param options.isFromCache 响应数据是否从缓存中获取的
 * @example
 * logRequestInfo({ url, params, config, res });
 */
export function logRequestInfo(options: {
  url: string;
  params: RequestParams;
  config: Pick<RequestConfig, 'isLog' | 'header' | 'method' | 'dataKey'>;
  res: unknown;
  isFromCache?: boolean;
}) {
  const { log } = getAppConfig();
  const { isLog = true } = options.config;

  if (!log || !isLog) return;

  const { url, params, config, res, isFromCache } = options;
  const { header, method } = config;

  const info: AppLogInfo = {
    name: 'request',
    url,
    params,
    method,
    header,
    res: cloneDeep(res), // 深拷贝,避免外部修改对象,造成输出不一致
  };

  if (isFromCache) info.isFromCache = true;

  if (getPlatformOs() === 'devtools') {
    const { dataKey } = config;
    const data = dataKey ? getObjectValue(res, dataKey) : res;

    if (data && typeof data === 'object') {
      info.text = JSON.stringify(data); // 微信开发工具额外输出JSON字符串,快捷定义ts
    }
  }

  log('info', info);
}
