import {
  cloneDeep,
  getObjectValue,
  isPlainObject,
  pickBy,
  toDayjs,
} from '@base-web-kits/base-tools-ts';
import { getBaseToolsConfig } from '../config';
import { toLogin } from '../router';
import { getPlatformOs } from '../system';
import { toast } from '../ui';
import type { AppLogInfo } from '../config';

/** 请求参数 */
export type RequestData = UniApp.RequestOptions['data'];

/**
 * 发起请求的配置 (对外,参数可选)
 */
export type RequestConfig<D extends RequestData = RequestData> = Partial<RequestConfigBase<D>>;

/** 自定义请求的配置 (接口字段参数必填) */
export type RequestConfigBase<D extends RequestData = RequestData> = Omit<
  UniApp.RequestOptions,
  'success' | 'fail' | 'complete' | 'data'
> & {
  /** 请求参数 */
  data?: D;

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

  /** 是否显示进度条: 支持字符串,自定义文本 (默认true) */
  showLoading?: boolean | string;

  /** 是否提示接口异常 (默认true) */
  toastError?: boolean;

  /** 是否输出日志 (默认true) */
  isLog?: boolean;

  /** 额外输出的日志数据 */
  logExtra?: Record<string, unknown>;

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
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ pathLogin, log })
 * @param config 请求配置
 * @example
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
 * task.abort(); // 取消请求 (若流式已生成,此时abort无效,因为请求已经成功)
 */
export function request<T, D extends RequestData = RequestData>(config: RequestConfigBase<D>) {
  return new Promise<T>((resolve, reject) => {
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
      responseInterceptor,
    } = config;

    // 参数: 过滤undefined, 避免接口处理异常 (不可过滤 null 、 "" 、 false 这些有效值)
    const fillData = isPlainObject(data) ? pickBy(data, (val) => val !== undefined) : data;

    // 请求头: 过滤空值 (undefined, null, ""), 不过滤0和false
    const emptyValue = [undefined, null, ''];
    const fillHeader = header ? pickBy(header, (val) => !emptyValue.includes(val)) : {};

    // 日志输出的config
    const logConfig = { ...config, data: fillData, header: fillHeader };

    // 记录请求开始时间
    const startTime = Date.now();

    // 缓存处理
    const isCache = cacheTime && cacheTime > 0;
    const cacheKey = isCache ? JSON.stringify({ url, data: fillData }) : '';
    if (isCache) {
      const cached = requestCache.get(cacheKey);
      if (cached) {
        if (cached.expire > startTime) {
          const { res } = cached;
          logRequestInfo({ status: 'success', config: logConfig, fromCache: true, startTime, res });
          resolve(getResult(res, resKey)); // 返回缓存数据
          return;
        }
        requestCache.delete(cacheKey); // 删除过期缓存
      }
    }

    // 显示进度条
    if (showLoading) uni.showLoading(typeof showLoading === 'string' ? { title: showLoading } : {});

    // 发送请求
    uni.request({
      ...config,
      data: fillData,
      header: fillHeader,
      success: (xhr) => {
        // 隐藏进度条 (不能写在complete回调,否则toast会被hideLoading隐藏)
        if (showLoading) uni.hideLoading();

        // 响应拦截
        const res = responseInterceptor ? responseInterceptor(xhr.data) : xhr.data;

        // 解析数据 (分块传输会先不断执行task.onChunkReceived回调,流式传输完毕才执行success回调)
        const code = enableChunked ? '' : getObjectValue(res, codeKey);
        const scode = enableChunked ? '' : successKey ? getObjectValue(res, successKey) : code;
        const msg = enableChunked ? '' : getObjectValue(res, msgKey);
        const isSuccess = enableChunked ? true : successCode.includes(scode);
        const isRelogin = enableChunked ? false : reloginCode.includes(code);

        // 缓存数据
        if (isSuccess && isCache) {
          requestCache.set(cacheKey, { res, expire: Date.now() + cacheTime });
        }

        // 日志
        logRequestInfo({ status: 'success', config: logConfig, startTime, res });

        if (isSuccess) {
          // 业务正常
          resolve(getResult(res, resKey));
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
        // 上报日志
        logRequestInfo({ status: 'fail', config: logConfig, startTime, e });
        // 失败回调
        reject(e);
      },
    });
  });
}

/**
 * 日志输出
 */
function logRequestInfo(options: {
  config: RequestConfigBase<RequestData>;
  fromCache?: boolean;
  startTime: number;
  status: 'success' | 'fail';
  res?: unknown;
  e?: unknown;
}) {
  const { log } = getBaseToolsConfig();
  const { isLog = true } = options.config;

  if (!log || !isLog) return;

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
    // 深拷贝,避免外部修改对象,造成输出不一致
    info.res = cloneDeep(res);

    // 微信开发工具输出JSON字符串,快捷复制定义ts (使用对象的形式,避免控制台展开根对象时占用太多屏幕)
    if (getPlatformOs() === 'devtools' && res && typeof res === 'object') {
      const result = getResult(res, config.resKey);

      if (result && typeof result === 'object') {
        info._res = { text: JSON.stringify(result) };
      }
    }
    log('info', info);
  } else {
    // 失败日志
    info.e = e;
    log('error', info);
  }
}

// 获取 resKey 对应的数据
function getResult(res: unknown, resKey?: RequestConfigBase['resKey']) {
  if (!res || !resKey || typeof res !== 'object') return res;

  return getObjectValue(res, resKey);
}
