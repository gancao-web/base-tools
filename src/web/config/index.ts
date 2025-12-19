export type AppConfig = {
  /** 全局 Toast 提示 */
  toast?: (option: { msg: string; status: 'success' | 'fail' }) => void;
  /** 显示全局 Loading */
  showLoading?: () => void;
  /** 隐藏全局 Loading */
  hideLoading?: () => void;
  /** 跳转登录页的方法 */
  toLogin?: () => void;
  /** 日志记录函数 */
  log?: (level: 'info' | 'error' | 'warn' | 'debug', data: AppLogInfo) => void;
};

export type AppLogInfo = {
  /** 调用函数的名称 */
  name: string;

  /** 函数的调用状态 */
  status?: 'success' | 'fail';

  /** 函数的调用参数 */
  option?: unknown;

  /** 函数的调用结果 */
  res?: unknown;

  /** 函数的调用错误 */
  e?: unknown;

  /** 日志描述 */
  desc?: string;

  // 其他自定义属性
  [key: string]: unknown;
};

const appConfig: AppConfig = {};

/**
 * 获取应用配置
 */
export function getBaseToolsConfig() {
  return appConfig;
}

/**
 * 初始化应用配置 (在入口文件设置)
 * @example
 * setBaseToolsConfig({
 * toast: ({ msg, status }) => (status === 'fail' ? message.error(msg) : message.success(msg)),
 * showLoading: () => message.loading('加载中...'),
 * hideLoading: () => message.destroy(),
 * toLogin: () => reLogin(),
 * log(level, data) {
 *   if (data.name === 'request') {
 *     sendLog('request', data); // 请求日志
 *   } else if (level === 'error') {
 *     sendLog('error', data); // 错误日志
 *   } else {
 *     sendLog('action', data); // 操作日志
 *   }
 * },
 * });
 */
export function setBaseToolsConfig(newConfig: AppConfig) {
  Object.assign(appConfig, newConfig);
}
