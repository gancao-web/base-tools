import { getAppConfig } from '../index';

const cache = {
  lastUrl: '', // 最近一次打开的页面
  lastTime: 0, // 最近一次打开页面的时间
};

/**
 * 打开界面
 * - 需在入口文件初始化应用配置 setAppConfig({onBeforeHref, pathWebview, isTabBar})
 * @param url 页面路径,包含参数
 * @param config 配置项
 * @param config.checkLogin 是否校验登录 (未登录则自动跳登, 触发toLogin回调)
 * @param config.mode 打开方式: 'redirectTo' | 'reLaunch' | 默认'navigateTo'
 * @param config.throttle 节流时间,默认1000ms (相同页面不可在短时间内重复打开,避免快速点击或接口并发调用的情况)
 * @example <view @click="href(`/pages/xx?id=123`)">打开界面,带参</view>
 * @example <view @click="href(`/pages/xx?name=${encodeURIComponent('中文|json')}`)">打开界面,参数中文或json需编码</view>
 * @example <view @click="href(`/pages/xx`, {checkLogin: true})">打开界面,必须登录</view>
 * @example <view @click="href(`/pages/xx`, {mode: 'redirectTo'})">打开界面,关闭当前页</view>
 * @example <view @click="href(`/pages/xx`, {mode: 'reLaunch'})">打开界面,关闭之前的所有页</view>
 */
export function href(
  url: string,
  config: { checkLogin?: true; mode?: 'redirectTo' | 'reLaunch'; throttle?: number } = {},
) {
  if (!url) return;

  const { onBeforeHref, pathWebview, isTabBar } = getAppConfig();

  // 页面跳转前的回调 (返回false,则阻止跳转)
  if (onBeforeHref && onBeforeHref(url) === false) return;

  // http开头的路径以webview的方式打开
  if (url.startsWith('http')) {
    uni.navigateTo({ url: pathWebview });
    return;
  }

  // 登录校验 (未登录, 则自动跳登)
  if (config.checkLogin && !checkLogin()) return;

  // 相同的界面不可在短时间内重复打开 (避免快速点击或接口并发调用)
  const now = Date.now();

  if (url === cache.lastUrl) {
    const throttle = config.throttle || 1000;
    if (now - cache.lastTime < throttle) return;
  }

  cache.lastUrl = url;
  cache.lastTime = now;

  if (isTabBar(url)) {
    // 首页tab
    uni.switchTab({ url });
  } else if (config.mode === 'redirectTo') {
    // 关闭当前页面, 打开新界面
    uni.redirectTo({ url });
  } else if (config.mode === 'reLaunch') {
    // 关闭之前的所有页, 打开新界面
    uni.reLaunch({ url });
  } else {
    // 保留当前页面, 打开新界面
    uni.navigateTo({ url });
  }
}

/**
 * 检查用户是否登录 (如果未登录, 默认自动跳登, 触发toLogin回调)
 * - 需在入口文件初始化应用配置 setAppConfig({ isLogin, pathLogin })
 * @param autoLogin 是否自动跳登, 触发toLogin回调
 */
export function checkLogin(autoLogin = true) {
  const { isLogin, pathLogin } = getAppConfig();
  if (isLogin()) return true;
  if (autoLogin) href(pathLogin);
  return false;
}

/**
 * 跳首页
 * - 需在入口文件初始化应用配置 setAppConfig({ pathHome })
 */
export function toHome() {
  const { pathHome } = getAppConfig();
  href(pathHome);
}

/**
 * 跳登录页
 * - 需在入口文件初始化应用配置 setAppConfig({ pathLogin })
 */
export function toLogin() {
  const { pathLogin } = getAppConfig();
  href(pathLogin);
}

/**
 * 返回 (长度不够, 直接跳首页)
 * - 需在入口文件初始化应用配置 setAppConfig({ pathHome })
 * @param delta 返回页数,默认1
 */
export function back(delta = 1) {
  if (getCurrentPages().length > delta) {
    uni.navigateBack({ delta });
  } else {
    toHome();
  }
}
