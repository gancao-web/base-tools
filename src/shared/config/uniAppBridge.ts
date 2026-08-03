// uni-app H5 与 base-tools-web 之间的内部配置桥接协议。
// 当前模块会被分别打包进 base-tools-uni 和 base-tools-web
// 不会产生运行时依赖。Uni 侧负责注册桥接对象，Web 侧只负责读取。

/**
 * 桥接对象挂载在 window 上的属性名。
 */
export const UNI_APP_CONFIG_KEY = '__BASE_WEB_KITS_UNI_CONFIG__';

/**
 * 桥接协议内部使用的日志信息结构。
 * Web 与 Uni 的公开 AppLogInfo 保留在各自入口，避免子包声明文件引用包外路径。
 */
type UniAppBridgeLogInfo = {
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

/**
 * Uni 侧提供、Web 侧消费的最小能力集合。
 * 保持该协议与各端完整 AppConfig 解耦，避免 Web 包反向依赖 Uni 包。
 */
export type UniAppConfigBridge = {
  toast: (msg: string) => void;
  showLoading: (title?: string) => void;
  hideLoading: () => void;
  toLogin: () => void;
  log: (level: 'info' | 'error' | 'warn' | 'debug', data: UniAppBridgeLogInfo) => void;
};

/** 访问桥接对象所需的最小 window 结构，仅供当前模块内部使用。 */
type UniAppBridgeHost = {
  uni?: unknown;
} & Record<string, unknown>;

/**
 * 获取 uni-app H5 的 window。
 * 同时检查 window.uni，避免普通 Web、SSR 和非 H5 的 uni-app 环境误用桥接。
 */
function getUniAppBridgeHost(): UniAppBridgeHost | undefined {
  if (typeof window === 'undefined') return undefined;

  const host = window as unknown as UniAppBridgeHost;
  return host.uni ? host : undefined;
}

/**
 * 在 uni-app H5 环境注册供 base-tools-web 使用的配置桥接。
 * 使用工厂延迟创建 bridge，确保非 H5 环境不会访问或调用 uni API。
 *
 * @param createBridge 根据当前 window.uni 创建桥接对象
 */
export function registerUniAppConfigBridge<TUni>(
  createBridge: (uniApi: TUni) => UniAppConfigBridge,
): void {
  const host = getUniAppBridgeHost();
  if (!host) return;

  host[UNI_APP_CONFIG_KEY] = createBridge(host.uni as TUni);
}

/**
 * 获取 uni-app H5 已注册的配置桥接。
 * 普通 Web、SSR、非 H5 的 uni-app 环境或尚未注册时均返回 undefined。
 */
export function getUniAppConfigBridge(): UniAppConfigBridge | undefined {
  const host = getUniAppBridgeHost();
  return host?.[UNI_APP_CONFIG_KEY] as UniAppConfigBridge | undefined;
}
