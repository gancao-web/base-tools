import { getUniAppConfigBridge } from '../../shared/config/uniAppBridge';

export type AppConfig = {
  /** 全局 Toast 提示 */
  toast?: (option: { msg: string; status: 'success' | 'fail' }) => void;
  /** 显示全局 Loading */
  showLoading?: (option?: { title?: string }) => void;
  /** 隐藏全局 Loading */
  hideLoading?: () => void;
  /** 跳转登录页的方法 */
  toLogin?: () => void;
  /**
   * 日志回调函数
   * @param level 日志级别 'info' | 'error' | 'warn' | 'debug'
   * @param data 日志数据
   * @example
   * setBaseToolsConfig({
   *   //...
   *   // 优先处理错误日志，避免请求及其他工具函数的错误被归为普通日志。
   *   log(level, data) {
   *     if (level === 'error') {
   *       sendLog('error', data);
   *     } else if (data.name === 'request') {
   *       sendLog('request', data);
   *     } else {
   *       sendLog('action', data);
   *     }
   *   },
   * });
   */
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

function getUniAppConfig(): AppConfig {
  const bridge = getUniAppConfigBridge();
  if (!bridge) return {};

  return {
    toast: ({ msg }) => bridge.toast(msg),
    showLoading: ({ title } = {}) => bridge.showLoading(title),
    hideLoading: bridge.hideLoading,
    toLogin: bridge.toLogin,
    log: bridge.log,
  };
}

/**
 * 获取应用配置
 */
export function getBaseToolsConfig() {
  // uni-app H5 默认复用 uni 能力，显式 Web 配置可按字段覆盖默认适配。
  return { ...getUniAppConfig(), ...appConfig };
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
