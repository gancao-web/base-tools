import { cloneDeep } from 'es-toolkit';
import { getBaseToolsConfig, toast } from '../index';
import type { AppLogInfo } from '../index';
import type { ApiActionConfig, ApiTaskConfig } from '../../shared/network/action';

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
export type UniApiConfig<Res = any, Err = any, Task = any> = ApiActionConfig<Res, Err> &
  ApiTaskConfig<Task>;

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

          // 成功回调中的日志或提示处理可能抛出异常，统一按失败处理。
          try {
            if (showLog) {
              const logData: AppLogInfo = { name: fname, status: 'success', option, ...logExtra };
              logData.res = cloneDeep(res); // 深拷贝响应数据,避免外部修改对象,造成输出不一致

              log?.('info', logData);
            }

            const msg = typeof toastSuccess === 'function' ? toastSuccess(res) : toastSuccess;

            resolve(res);
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
