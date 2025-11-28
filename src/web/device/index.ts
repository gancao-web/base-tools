/**
 * 获取用户代理字符串（UA）
 * @returns navigator.userAgent.toLowerCase();
 */
export function getUA(): string {
  if (typeof navigator === 'undefined') return ''; // SSR无 navigator
  return (navigator.userAgent || '').toLowerCase();
}

/**
 * 是否为移动端设备（含平板）
 */
export function isMobile(): boolean {
  const ua = getUA();
  return /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
}

/**
 * 是否为平板设备
 */
export function isTablet(): boolean {
  const ua = getUA();
  return /ipad|android(?!.*mobile)|tablet/i.test(ua) && !/mobile/i.test(ua);
}

/**
 * 是否为 PC 设备
 */
export function isPC(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * 是否为 iOS 系统
 */
export function isIOS(): boolean {
  const ua = getUA();
  return /iphone|ipad|ipod/i.test(ua);
}

/**
 * 是否为 Android 系统
 */
export function isAndroid(): boolean {
  const ua = getUA();
  return /android/i.test(ua);
}

/**
 * 是否微信内置浏览器
 */
export function isWeChat(): boolean {
  const ua = getUA();
  return /micromessenger/i.test(ua);
}

/**
 * 是否为 Chrome 浏览器
 * 已排除 Edge、Opera 等基于 Chromium 的浏览器
 */
export function isChrome(): boolean {
  const ua = getUA();
  return /chrome\//i.test(ua) && !/edg\//i.test(ua) && !/opr\//i.test(ua) && !/whale\//i.test(ua);
}

/**
 * 检测是否支持触摸事件
 */
export function isTouchSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

/**
 * 获取浏览器名字
 */
export function getBrowserName(): string | null {
  const ua = getUA();

  if (/chrome\//i.test(ua)) return 'chrome';
  if (/safari\//i.test(ua)) return 'safari';
  if (/firefox\//i.test(ua)) return 'firefox';
  if (/opr\//i.test(ua)) return 'opera';
  if (/edg\//i.test(ua)) return 'edge';
  if (/msie|trident/i.test(ua)) return 'ie';

  return null;
}

/**
 * 获取浏览器版本号
 */
export function getBrowserVersion(): string | null {
  const ua = getUA();

  const versionPatterns = [
    /(?:edg|edge)\/([0-9.]+)/i,
    /(?:opr|opera)\/([0-9.]+)/i,
    /chrome\/([0-9.]+)/i,
    /firefox\/([0-9.]+)/i,
    /version\/([0-9.]+).*safari/i,
    /(?:msie |rv:)([0-9.]+)/i,
  ];

  for (const pattern of versionPatterns) {
    const matches = ua.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }

  return null;
}

/**
 * 获取操作系统信息
 */
export function getOS(): string {
  const ua = getUA();

  if (/windows/i.test(ua)) return 'windows';
  if (/mac os/i.test(ua)) return 'macos';
  if (/linux/i.test(ua)) return 'linux';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';

  return 'unknown';
}
