type AppConfig = {
  /**
   * 首页路径 (使toHome方法能够跳转首页)
   * @example
   * '/pages/tabbar/home/index'
   */
  pathHome: string;

  /**
   * 登录页路径 (使checkLogin方法能够自动跳登; 若登录是全局弹窗,则在onBeforeHref拦截处理)
   * @example
   * '/pages/login/index'
   */
  pathLogin: string;

  /**
   * webview页路径 (使href方法正确打开http开头的网址)
   * @example
   * '/pages/webview/index'
   */
  pathWebview: string;

  /**
   * 文件域名 (oss,七牛或其他文件服务器域名;使getFileUrl能够拼接完整的文件地址)
   * @example
   * 'https://example.com/'
   */
  hostFile: string;

  /**
   * 图标域名 (oss,七牛或其他文件服务器域名;使getIconUrl,getIconBg能够拼接完整的图标地址)
   * @example
   * 'https://example.com/'
   */
  hostIcon: string;

  /**
   * 是否为tabbar页 (使href方法正确跳转tabbar页面)
   * @example
   * (url) => url.startsWith('/pages/tabbar/')
   */
  isTabBar: (url: string) => boolean;

  /**
   * 检查用户是否登录
   * @example
   * () => useUserStore().isLogin;
   */
  isLogin: () => boolean;

  /**
   * 页面跳转前的回调
   * @param path 目标路径
   * @returns 是否继续跳转 (返回false,则阻止跳转)
   */
  onBeforeHref?: (path: string) => boolean | void;

  /**
   * 日志记录函数
   * @param level 日志级别 'info' | 'error' | 'warn' | 'debug'
   * @param data 日志数据
   */
  log?: (level: 'info' | 'error' | 'warn' | 'debug', data: Record<string, unknown>) => void;
};

const appConfig: AppConfig = {
  pathHome: '',
  pathLogin: '',
  pathWebview: '',
  hostFile: '',
  hostIcon: '',
  isTabBar: () => false,
  isLogin: () => false,
};

/**
 * 获取应用配置
 */
export function getAppConfig() {
  return appConfig;
}

/**
 * 初始化应用配置, 建议在入口文件先设置配置
 * @example
 * setAppConfig({
 *   pathHome: '/pages/tabbar/home/index',
 *   pathLogin: '/pages/login/index',
 *   pathWebview: '/pages/webview/index',
 *   hostFile: 'https://example.com/',
 *   hostIcon: 'https://example.com/',
 *   isTabBar: (url) => url.startsWith('/pages/tabbar/'),
 *   isLogin: () => useUserStore().isLogin,
 * });
 */
export function setAppConfig(newConfig: AppConfig) {
  Object.assign(appConfig, newConfig);
}
