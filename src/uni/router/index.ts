import { getBaseToolsConfig } from '../index';

const cache = {
  lastUrl: '', // 最近一次打开的页面
  lastTime: 0, // 最近一次打开页面的时间
};

/**
 * 打开界面
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({onBeforeHref, pathWebview, isTabBar})
 * @param url 页面路径,包含参数
 * @param config 配置项
 * @param config.needLogin 是否校验登录 (未登录则自动跳登, 触发toLogin回调)
 * @param config.mode 打开方式: 'redirectTo' | 'reLaunch' | 默认'navigateTo'
 * @param config.throttle 节流时间,默认1000ms (相同页面不可在短时间内重复打开,避免快速点击或接口并发调用的情况)
 * @example <view @click="href(`/pages/xx?id=123`)">打开界面,带参</view>
 * @example <view @click="href(`/pages/xx?name=${encodeURIComponent('中文|json')}`)">打开界面,参数中文或json需编码</view>
 * @example <view @click="href(`/pages/xx`, {needLogin: true})">打开界面,必须登录</view>
 * @example <view @click="href(`/pages/xx`, {mode: 'redirectTo'})">打开界面,关闭当前页</view>
 * @example <view @click="href(`/pages/xx`, {mode: 'reLaunch'})">打开界面,关闭之前的所有页</view>
 */
export function href(
  url: string,
  config: { needLogin?: true; mode?: 'redirectTo' | 'reLaunch'; throttle?: number } = {},
) {
  if (!url) return;

  const { onBeforeHref, pathWebview, isTabBar } = getBaseToolsConfig();
  const { mode = 'navigateTo', needLogin = false, throttle = 1000 } = config;

  // 页面跳转前的回调 (返回false,则阻止跳转)
  if (onBeforeHref && onBeforeHref(url) === false) return;

  // http开头的路径以webview的方式打开
  if (url.startsWith('http')) {
    uni.navigateTo({ url: pathWebview });
    return;
  }

  // 登录校验 (未登录, 则自动跳登)
  if (needLogin && !checkLogin()) return;

  // 相同的界面不可在短时间内重复打开 (避免快速点击或接口并发调用)
  const now = Date.now();

  if (url === cache.lastUrl) {
    if (now - cache.lastTime < throttle) return;
  }

  cache.lastUrl = url;
  cache.lastTime = now;

  if (isTabBar(url)) {
    // 首页tab
    uni.switchTab({ url });
  } else if (mode === 'redirectTo') {
    // 关闭当前页面, 打开新界面
    uni.redirectTo({ url });
  } else if (mode === 'reLaunch') {
    // 关闭之前的所有页, 打开新界面
    uni.reLaunch({ url });
  } else {
    // 保留当前页面, 打开新界面
    uni.navigateTo({ url });
  }
}

/**
 * 检查用户是否登录 (如果未登录, 默认自动跳登, 触发toLogin回调)
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ isLogin, pathLogin })
 * @param autoLogin 是否自动跳登, 触发toLogin回调
 */
export function checkLogin(autoLogin = true) {
  const { isLogin, pathLogin } = getBaseToolsConfig();
  if (isLogin()) return true;
  if (autoLogin) href(pathLogin);
  return false;
}

/**
 * 跳首页
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ pathHome })
 */
export function toHome() {
  const { pathHome } = getBaseToolsConfig();
  href(pathHome);
}

/**
 * 跳登录页
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ pathLogin })
 */
export function toLogin() {
  const { pathLogin } = getBaseToolsConfig();
  href(pathLogin);
}

/**
 * 返回 (长度不够, 直接跳首页)
 * - 需在入口文件初始化应用配置 setBaseToolsConfig({ pathHome })
 * @param delta 返回页数或指定页面, 默认1
 * @example
 * <view @click="back()">返回前一页</view>
 * <view @click="back(2)">返回前2页</view>
 * <view @click="back('/pages/login')">返回到登录之前的页面</view>
 */
export function back(delta: number | string = 1) {
  if (typeof delta === 'string') {
    const routes = getCurrentPages().map((item) => `/${item.route}`);
    const index = routes.indexOf(delta);
    uni.navigateBack({ delta: routes.length - index });
  } else if (getCurrentPages().length > delta) {
    uni.navigateBack({ delta });
  } else {
    toHome();
  }
}
