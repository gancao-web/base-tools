import { getBaseToolsConfig } from '../index';

type WebApi<Option = any, Res = any, Config = any> = (
  option: Option,
  config?: Config,
) => Promise<Res>;

/**
 * web api 的调用配置
 */
export type WebApiConfig<Res = any, Err = any> = {
  /** 是否显示加载提示, 默认 false. (支持字符串,自定义文本) */
  showLoading?: boolean | string;

  /** 操作成功的toast提示, 默认不显示 */
  toastSuccess?: ((res: Res) => false | string) | false | string;

  /** 是否显示操作失败的详细错误信息, 默认 true. (支持字符串,自定义文本; 支持根据errMsg判断是否显示, 例如: (e) => !e.errMsg.includes('cancel') */
  toastError?: ((e: Err) => boolean | string) | boolean | string;

  /** 是否显示日志, 默认 true */
  showLog?: boolean;
};

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

    return new Promise<Res>((resolve, reject) => {
      webApi(option, finalConfig)
        .then((res) => {
          if (showLoading) hideLoadingFn?.();
          if (showLog) log?.('info', { name: fname, status: 'success', option, res });
          resolve(res);

          const msg = typeof toastSuccess === 'function' ? toastSuccess(res) : toastSuccess;
          if (msg) toast?.({ msg, status: 'success' });
        })
        .catch((e) => {
          if (showLoading) hideLoadingFn?.();
          if (showLog) log?.('error', { name: fname, status: 'fail', option, e });

          const msg = typeof toastError === 'function' ? toastError(e) : toastError;
          if (msg) {
            toast?.({
              msg: typeof msg === 'string' ? msg : `${fname} fail: ${JSON.stringify(e)}`,
              status: 'fail',
            });
          }

          reject(e);
        });
    });
  };
}
