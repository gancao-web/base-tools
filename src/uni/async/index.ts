import { cloneDeep } from 'es-toolkit';
import { getBaseToolsConfig, toast } from '../index';
import type { AppLogInfo } from '../index';

type UniCallbacks<Res, Err> = {
  success?: (res: Res) => void;
  fail?: (err: Err) => void;
  complete?: () => void;
};

type UniApi<Option, Res, Err> = (option: Option & UniCallbacks<Res, Err>) => void;

type OmitOption<T> = Omit<T, 'success' | 'fail' | 'complete'>;

/**
 * uni api 的调用配置
 */
export type UniApiConfig<Res = any, Err = any, Task = any> = {
  /** 操作成功的toast提示, 默认不显示 */
  toastSuccess?: ((res: Res) => false | string) | false | string;

  /** 是否显示操作失败的详细错误信息, 默认 true. (支持字符串,自定义文本; 支持根据errMsg判断是否显示, 例如: (e) => !e.errMsg.includes('cancel') */
  toastError?: ((e: Err) => boolean | string) | boolean | string;

  /** 是否显示加载提示, 默认 false. (支持字符串,自定义文本) */
  showLoading?: boolean | string;

  /** 是否显示日志, 默认 true */
  showLog?: boolean;

  /** 成功和失败时,额外输出的日志数据 (可覆盖内部log参数,如'name') */
  logExtra?: Record<string, unknown>;

  /** 响应数据的转换, 如解密操作 (返回值在成功日志中输出'transformResponse'字段) */
  transformResponse?: (res: any) => Res;

  /** 获取task对象 (如uni.downloadFile、uni.uploadFile返回的task对象) */
  onTaskReady?: (task: Task) => void;
};

/**
 * 把 uni api 包装为 Promise 形式
 * @param uniApi uni api
 * @param apiName uni api 名称 (可选, 用于日志输出, 默认'enhanceUniApi')
 * @returns Promise 形式的 uni api (默认提示异常和输出日志,不显示进度条和操作成功: promise(option, {showLoading: false, toastSuccess: false, toastError: true, showLog: true}))
 * @example
 * const promise = enhanceUniApi(uni.downloadFile, 'downloadFile');
 * await promise({ url: 'xx' }, {showLoading: '下载中', toastSuccess: '下载成功'});
 */
export function enhanceUniApi<Option, Res, Err, Task>(
  uniApi: UniApi<Option, Res, Err>,
  apiName?: string,
) {
  return (option?: OmitOption<Option>, config: UniApiConfig<Res, Err, Task> = {}) => {
    const {
      showLoading = false,
      toastSuccess = false,
      toastError = true,
      showLog = true,
      transformResponse,
      logExtra,
    } = config;

    const { log } = getBaseToolsConfig();
    const fname = apiName || 'enhanceUniApi'; // uniApi.name得到的值都是'promiseApi'，不如默认'enhanceUniApi'

    if (showLoading) {
      const title = typeof showLoading === 'string' ? showLoading : '';
      uni.showLoading({ title, mask: true });
    }

    return new Promise<Res>((resolve, reject) => {
      let loadingHidden = false;

      const hideLoading = () => {
        if (!showLoading || loadingHidden) return;
        loadingHidden = true;
        uni.hideLoading();
      };

      const handleFail = (e: unknown) => {
        hideLoading();
        // 先确定 Promise 状态，避免自定义日志或 toastError 抛错后调用方一直等待。
        reject(e);
        if (showLog) log?.('error', { name: fname, status: 'fail', option, e, ...logExtra });

        const msg = typeof toastError === 'function' ? toastError(e as Err) : toastError;
        if (msg) {
          const errorMsg = e instanceof Error ? e.message : JSON.stringify(e);
          toast(typeof msg === 'string' ? msg : `${fname} fail: ${errorMsg}`);
        }
      };

      const task = uniApi({
        ...(option as Option),
        success(res) {
          hideLoading();

          // uni API 的 success 只代表平台调用成功，响应转换仍可能因业务错误而抛出异常。
          try {
            const finalRes = transformResponse ? transformResponse(res) : res;

            if (showLog) {
              const logData: AppLogInfo = { name: fname, status: 'success', option, ...logExtra };

              if (transformResponse) {
                logData.res = res; // 输出原始数据
                logData.transformResponse = cloneDeep(finalRes); // 深拷贝处理后数据,避免外部修改对象,造成输出不一致
              } else {
                logData.res = cloneDeep(res); // 深拷贝原始数据,避免外部修改对象,造成输出不一致
              }

              log?.('info', logData);
            }

            const msg = typeof toastSuccess === 'function' ? toastSuccess(finalRes) : toastSuccess;

            resolve(finalRes);
            if (msg) toast(msg);
          } catch (e) {
            handleFail(e);
          }
        },
        fail(e) {
          handleFail(e);
        },
      });

      if (config.onTaskReady && task) config.onTaskReady(task);
    });
  };
}
