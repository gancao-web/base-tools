import { cloneDeep } from 'es-toolkit';
import { getBaseToolsConfig } from '../index';
import type { AppLogInfo } from '../index';
import type { ApiActionConfig } from '../../shared/network/action';

type WebApi<Option = any, Res = any, Config = any> = (
  option: Option,
  config?: Config,
) => Promise<Res>;

/**
 * web api 的调用配置
 */
export type WebApiConfig<Res = any, Err = any> = ApiActionConfig<Res, Err>;

/**
 * 拓展 web api, 使其支持loading,toast,log能力
 * @param webApi web api
 * @param apiName web api 名称 (可选, 用于日志输出, 默认'enhanceWebApi')
 * @return 注入拓展能力的promise (默认提示异常和输出日志,不显示进度条和操作成功)
 * @example
 * const promise = enhanceWebApi(downloadFile, 'downloadFile');
 * await promise({ url: 'xx' }, {showLoading: '下载中', toastSuccess: '下载成功'});
 */
export function enhanceWebApi<Option = any, Res = any, Err = any, Config = any>(
  webApi: WebApi<Option, Res, Config>,
  apiName?: string,
) {
  return (option: Option, config?: WebApiConfig<Res, Err> & Config) => {
    const finalConfig = config || ({} as WebApiConfig<Res, Err> & Config);
    const {
      showLoading = false,
      toastSuccess = false,
      toastError = true,
      showLog = true,
      logExtra,
    } = finalConfig;

    const {
      log,
      toast,
      showLoading: showLoadingFn,
      hideLoading: hideLoadingFn,
    } = getBaseToolsConfig();
    const fname = apiName || 'enhanceWebApi'; // webApi.name经过打包后取不到原函数名，不如默认'enhanceWebApi'

    if (showLoading) {
      const title = typeof showLoading === 'string' ? showLoading : '';
      showLoadingFn?.({ title });
    }

    // 成功处理也可能抛错，确保成功分支和失败分支不会重复关闭同一次 Loading。
    let loadingHidden = false;
    const hideLoading = () => {
      if (!showLoading || loadingHidden) return;
      loadingHidden = true;
      hideLoadingFn?.();
    };

    return new Promise<Res>((resolve, reject) => {
      webApi(option, finalConfig)
        .then((res) => {
          hideLoading();

          if (showLog) {
            const logData: AppLogInfo = { name: fname, status: 'success', option, ...logExtra };
            logData.res = cloneDeep(res); // 深拷贝响应数据,避免外部修改对象,造成输出不一致

            log?.('info', logData);
          }

          resolve(res);

          const msg = typeof toastSuccess === 'function' ? toastSuccess(res) : toastSuccess;
          if (msg) toast?.({ msg, status: 'success' });
        })
        .catch((e) => {
          hideLoading();
          if (showLog) log?.('error', { name: fname, status: 'fail', option, e, ...logExtra });

          const msg = typeof toastError === 'function' ? toastError(e) : toastError;
          if (msg) {
            toast?.({
              msg:
                typeof msg === 'string'
                  ? msg
                  : `${fname} fail: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
              status: 'fail',
            });
          }

          reject(e);
        });
    });
  };
}
