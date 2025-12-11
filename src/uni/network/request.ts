import { cloneDeep, getObjectValue } from '../../ts';
import { getAppConfig } from '../config';
import { toLogin } from '../router';
import { getPlatformOs } from '../system';
import { toast } from '../ui';
import type { AppLogInfo } from '../config';

/** 请求参数 */
export type RequestParam = UniApp.RequestOptions['data'];

/** 请求配置 */
export type RequestConfig = Omit<
  UniApp.RequestOptions,
  'url' | 'data' | 'success' | 'fail' | 'complete'
> & {
  /** 响应拦截 */
  responseInterceptor?: (
    data: UniApp.RequestSuccessCallbackResult['data'],
  ) => UniApp.RequestSuccessCallbackResult['data'];

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

  /** 是否显示进度条: 默认true */
  showLoading?: boolean;

  /** 是否提示接口异常: 默认true */
  toastError?: boolean;

  /** 是否输出日志 */
  isLog?: boolean;

  /** 响应数据的缓存时间, 单位毫秒。仅在成功时缓存；仅缓存在内存，应用退出,缓存消失；默认0,不开启缓存 */
  cacheTime?: number;
};

/** 请求缓存 */
const requestCache = new Map<string, { res: unknown; expire: number }>();

/**
 * 基础请求 (返回promise和task对象)
 * - 需在入口文件初始化应用配置 setAppConfig({ pathLogin, log })
 * @param url 请求地址
 * @param param 请求参数
 * @param config 请求配置
 * @returns Promise<T> & { task?: UniApp.RequestTask }
 * @example
 * // 项目基础请求的封装
 * export function requestApi<T>(url: string, param: RequestParam, config?: RequestConfig) {
 *    return request<T>(HOST + url, param, {
 *      dataKey: 'data',
 *      msgKey: 'message',
 *      codeKey: 'status',
 *      successCode: [1],
 *      reloginCode: [-10],
 *      header: { token: 'xx', version: 'xx', tid: 'xx' },
 *      ...config,
 *    });
 * }
 */
export function request<T>(url: string, param: RequestParam, config: RequestConfig) {
  // 请求对象
  const temp: { task?: UniApp.RequestTask } = {};

  // 创建promise
  const promise: Promise<T> & { task?: UniApp.RequestTask } = new Promise((resolve, reject) => {
    const {
      showLoading = true,
      toastError = true,
      isLog = true,
      responseInterceptor,
      dataKey,
      msgKey,
      codeKey,
      successCode,
      reloginCode,
      cacheTime,
      ...uniConfig
    } = config;

    // 缓存处理
    const isCache = cacheTime && cacheTime > 0;
    const cacheKey = isCache ? JSON.stringify({ url, param }) : '';
    if (isCache) {
      const cached = requestCache.get(cacheKey);
      if (cached && cached.expire > Date.now()) {
        const { res } = cached;
        const data = dataKey === false ? res : getObjectValue(res, dataKey);
        logRequestInfo({ isLog, url, param, config, res, isSuccess: true, data });
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
      data: param,
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

        // 业务数据
        const data = dataKey === false ? res : getObjectValue(res, dataKey);

        // 日志
        logRequestInfo({ isLog, url, param, config, res, isSuccess, data });

        if (isSuccess) {
          // 业务正常
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
        log?.('error', { name: 'request', status: 'fail', url, param, ...config, e });
      },
    });
  });

  // 将 task 挂载到 Promise 上
  promise.task = temp.task;

  return promise;
}

// 日志输出
function logRequestInfo(options: {
  isLog: boolean;
  url: string;
  param: RequestParam;
  config: RequestConfig;
  res: unknown;
  isSuccess: boolean;
  data?: unknown;
}) {
  const { log } = getAppConfig();

  if (!log || !options.isLog) return;

  const { url, param, config, res, isSuccess, data } = options;

  const info: AppLogInfo = {
    name: 'request',
    status: isSuccess ? 'success' : 'fail',
    url,
    param,
    ...config,
    res: cloneDeep(res), // 深拷贝,避免外部修改对象,造成输出不一致
  };

  if (getPlatformOs() === 'devtools') {
    info.text = JSON.stringify(data); // 微信开发工具额外输出JSON字符串,快捷定义ts
  }

  log('info', info);
}
