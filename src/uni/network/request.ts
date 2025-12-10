import { cloneDeep, getObjectValue } from '../../ts';
import { getAppConfig } from '../config';
import { toLogin } from '../router';
import { getPlatformOs } from '../system';
import { toast } from '../ui';
import type { AppLogInfo } from '../config';

export type RequestParam = UniApp.RequestOptions['data'];

/** 请求配置 */
export type RequestConfig = Omit<
  UniApp.RequestOptions,
  'url' | 'data' | 'success' | 'fail' | 'complete'
> & {
  /** 响应数据的处理 */
  onResponse?: (xhrData: unknown) => {
    /** 完整的响应数据 */
    res: unknown;
    /** 消息提示 */
    msg: string;
    /** 是否成功 */
    isSuccess: boolean;
    /** 是否需要登录 */
    isRelogin: boolean;
  };

  /** 是否显示进度条: 默认true */
  showLoading?: boolean;

  /** 是否提示接口异常: 默认true */
  toastError?: boolean;

  /** 获取响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据 */
  dataPath?: string | false;

  /** 是否输出日志 */
  isLog?: boolean;
};

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
 *    return requestBase<T>(HOST + url, param, {
 *      ...config,
 *      dataPath: 'data',
 *      header: { token: 'xx', version: 'xx', tid: 'xx' },
 *      response(res) {
 *        return {
 *          res,
 *          msg: res.message,
 *          isSuccess: res.status === 1,
 *          isRelogin: res.status === -10,
 *        };
 *      },
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
      dataPath = false,
      isLog = true,
      onResponse,
      ...uniConfig
    } = config;

    const { log } = getAppConfig();

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

        // 解析数据
        const { data } = xhr;
        const { res, isSuccess, isRelogin, msg } =
          !uniConfig.enableChunked && onResponse
            ? onResponse(data)
            : { isSuccess: true, isRelogin: false, msg: '', res: data ?? '' };

        // 业务正常的dataPath数据
        const resolveData = isSuccess ? (dataPath ? getObjectValue(res, dataPath) : res) : '';

        // 日志
        if (isLog && log) {
          const info: AppLogInfo = {
            name: 'request',
            status: isSuccess ? 'success' : 'fail',
            url,
            param,
            ...config,
            res: cloneDeep(res), // 深拷贝,避免外部修改对象,造成输出不一致
          };

          if (getPlatformOs() === 'devtools') {
            info.text = JSON.stringify(resolveData); // 微信开发工具额外输出JSON字符串,快捷定义ts
          }

          log('info', info);
        }

        if (isSuccess) {
          // 业务正常
          resolve(resolveData);
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
        log?.('error', { name: 'request', status: 'fail', url, param, ...config, e });
      },
    });
  });

  // 将 task 挂载到 Promise 上
  promise.task = temp.task;

  return promise;
}
