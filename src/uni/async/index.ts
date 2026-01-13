import { getBaseToolsConfig, toast } from '../index';

type UniCallbacks<Res, Err> = {
  success?: (res: Res) => void;
  fail?: (err: Err) => void;
  complete?: () => void;
};

type UniApi<Option, Res, Err, Task> = (option: Option & UniCallbacks<Res, Err>) => Task | void;

type OmitOption<T> = Omit<T, 'success' | 'fail' | 'complete'>;

/**
 * uni api 的调用配置
 */
export type UniApiConfig<Res = unknown, Err = unknown, Task = void> = {
  /** 是否显示加载提示, 默认 false. (支持字符串,自定义文本) */
  showLoading?: boolean | string;

  /** 操作成功的toast提示, 默认不显示 */
  toastSuccess?: ((res: Res) => false | string) | false | string;

  /** 是否显示操作失败的详细错误信息, 默认 true. (支持字符串,自定义文本; 支持根据errMsg判断是否显示, 例如: (e) => !e.errMsg.includes('cancel') */
  toastError?: ((e: Err) => boolean | string) | boolean | string;

  /** 是否显示日志, 默认 true */
  showLog?: boolean;

  /** task对象初始化的回调 (如uni.uploadFile或uni.downloadFile的task对象) */
  onTaskInit?: (task: Task) => void;
};

/**
 * 把 uni api 包装为 Promise 形式
 * @returns Promise 形式的 uni api (默认提示异常和输出日志,不显示进度条和操作成功: promise(option, {showLoading: false, toastSuccess: false, toastError: true, showLog: true}))
 * @example
 * // 常规promise使用
 * await promisifyUniApi(uni.loadFontFace)(option);
 *
 * // 获取task对象 - 方式1
 * const promise = promisifyUniApi(uni.downloadFile);
 * promise.task.onProgressUpdate((res) => {
 *   console.log('progress', res);
 * });
 * await promise({ url: 'xx' }, {showLoading: '下载中', toastSuccess: '下载成功'});
 *
 * // 获取task对象 - 方式2
 * await promisifyUniApi(uni.downloadFile)({ url: 'xx' }, { onTaskInit });
 */
export function promisifyUniApi<Option, Res, Err, Task>(uniApi: UniApi<Option, Res, Err, Task>) {
  return (option?: OmitOption<Option>, config: UniApiConfig<Res, Err, Task> = {}) => {
    const temp: { task?: Task } = {};
    const {
      showLoading = false,
      toastSuccess = false,
      toastError = true,
      showLog = true,
      onTaskInit,
    } = config;
    const { log } = getBaseToolsConfig();

    if (showLoading) {
      const title = typeof showLoading === 'string' ? showLoading : undefined;
      uni.showLoading({ title, mask: true });
    }

    const promise: Promise<Res> & { task?: Task } = new Promise<Res>((resolve, reject) => {
      temp.task = uniApi({
        ...(option as Option),
        success(res) {
          if (showLoading) uni.hideLoading();
          if (showLog) log?.('info', { name: uniApi.name, status: 'success', option, res });
          resolve(res);

          const msg = typeof toastSuccess === 'function' ? toastSuccess(res) : toastSuccess;
          if (msg) toast(msg);
        },
        fail(e) {
          if (showLoading) uni.hideLoading();
          if (showLog) log?.('error', { name: uniApi.name, status: 'fail', option, e });
          reject(e);

          const msg = typeof toastError === 'function' ? toastError(e) : toastError;
          if (msg)
            toast(typeof msg === 'string' ? msg : `${uniApi.name} fail: ${JSON.stringify(e)}`);
        },
      }) as Task | undefined;

      if (onTaskInit && temp.task) onTaskInit(temp.task);
    });

    promise.task = temp.task;

    return promise;
  };
}
