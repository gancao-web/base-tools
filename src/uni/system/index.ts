import { promisifyUniApi } from '../index';

/**
 * 窗口信息
 */
export function getWindowInfo() {
  if (uni.canIUse('getWindowInfo')) {
    return uni.getWindowInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}

/**
 * 设备信息
 */
export function getDeviceInfo() {
  if (uni.canIUse('getDeviceInfo')) {
    return uni.getDeviceInfo();
  } else {
    return uni.getSystemInfoSync();
  }
}

/**
 * 屏幕宽度
 */
export function getWindowWidth() {
  return getWindowInfo().windowWidth;
}

/**
 * 屏幕高度
 */
export function getWindowHeight() {
  return getWindowInfo().windowHeight;
}

/**
 * 状态栏高度
 */
export function getStatusBarHeight() {
  return getWindowInfo().statusBarHeight;
}

/**
 * 顶部安全区高度
 */
export function getSafeAreaTop() {
  return getWindowInfo().safeAreaInsets?.top;
}

/**
 * 底部安全区高度
 */
export function getSafeAreaBottom() {
  return getWindowInfo().safeAreaInsets?.bottom;
}

/**
 * 获取平台
 * @returns 'ios' | 'android' | 'windows' | 'mac' | 'devtools'
 */
export function getPlatformOs() {
  return getDeviceInfo().platform;
}

/**
 * 获取平台
 * @returns 'app' | 'web' | 'mp-weixin' | 'mp-alipay' | 'mp-baidu' | 'mp-toutiao' | 'mp-lark' | 'mp-jd' | 'mp-kuaishou' | 'mp-xhs' | ...
 */
export function getPlatformUni() {
  // #ifdef MP-WEIXIN
  return 'mp-weixin'; // 避免微信小程序使用getSystemInfoSync
  // #endif

  // #ifndef MP-WEIXIN
  return uni.getSystemInfoSync().uniPlatform;
  // #endif
}

/**
 * 复制
 * - 注: 小程序需在后台配置用户隐私保护指引并审核通过,才可使用该API。
 * @param text 要复制的文本
 * @param toastSuccess 复制成功的toast提示, 默认'复制成功'
 */
export function copyText(text: string, toastSuccess = '复制成功') {
  return promisifyUniApi(uni.setClipboardData)({ data: text, showToast: false }, { toastSuccess });
}
