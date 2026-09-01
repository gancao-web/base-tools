/**
 * 异步 API 的通用配置。
 *
 * Web 和 uni-app 的错误类型不同，通过泛型保留平台差异；
 * 任务对象能力由 ApiTaskConfig 单独描述，避免普通 API 暴露无效配置。
 */
export type ApiActionConfig<Res = unknown, Err = unknown> = {
  /** 操作成功的 toast 提示，默认不显示。 */
  toastSuccess?: ((res: Res) => false | string) | false | string;

  /** 操作失败时是否显示详细错误信息，默认 true。 */
  toastError?: ((err: Err) => boolean | string) | boolean | string;

  /** 是否显示加载提示，默认 false。 */
  showLoading?: boolean | string;

  /** 是否输出日志，默认 true。 */
  showLog?: boolean;

  /** 成功和失败时额外输出的日志数据。 */
  logExtra?: Record<string, unknown>;
};

/**
 * 支持获取底层任务对象的配置。
 *
 * 只有底层 API 能返回可操作的任务对象时才应组合此配置；普通异步 API
 * 不应暴露 onTaskReady。
 */
export type ApiTaskConfig<Task = unknown> = {
  /** 获取底层任务对象。 */
  onTaskReady?: (task: Task) => void;
};
