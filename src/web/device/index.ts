/**
 * 获取用户代理字符串（UA）
 */
export function getUA() {
  if (typeof navigator === 'undefined') return ''; // SSR无 navigator
  return (navigator.userAgent || '').toLowerCase();
}

/**
 * iPadOS 13+ 在桌面模式下使用 Macintosh UA，需要结合触摸点判断
 */
function isIPadOSDesktopMode() {
  if (typeof navigator === 'undefined') return false;
  return /macintosh/i.test(getUA()) && navigator.maxTouchPoints > 1;
}

/**
 * 是否为移动端设备（含平板）
 */
export function isMobile() {
  const ua = getUA();
  return (
    isIPadOSDesktopMode() ||
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)
  );
}

/**
 * 是否为 iPad
 * 包含使用桌面模式 UA 的 iPadOS
 */
export function isIPad() {
  return isIPadOSDesktopMode() || /ipad/i.test(getUA());
}

/**
 * 是否为 Android 平板
 * Android 平板的 UA 通常包含 Android，但不包含 Mobile
 */
export function isAndroidTablet() {
  const ua = getUA();
  return /android/i.test(ua) && !/mobile/i.test(ua);
}

/**
 * 是否为平板设备
 */
export function isTablet() {
  return isIPad() || isAndroidTablet() || /tablet/i.test(getUA());
}

/**
 * 是否为 PC 设备
 */
export function isPC() {
  return getUA() !== '' && !isMobile() && !isTablet();
}

/**
 * 是否为 iPhone、iPad、iPod touch，包括桌面模式的 iPadOS，不含 macOS
 */
export function isIOS() {
  return isIPad() || /iphone|ipod/i.test(getUA());
}

/**
 * 是否为 Apple 平台 (包含 iOS、iPadOS 和 macOS)
 */
export function isAppleOS() {
  return isIOS() || /macintosh|mac os x/i.test(getUA());
}

/**
 * 是否为 Android 系统
 */
export function isAndroid() {
  const ua = getUA();
  return /android/i.test(ua);
}

/**
 * 是否微信内置浏览器
 */
export function isWeChat() {
  const ua = getUA();
  return /micromessenger/i.test(ua);
}

/**
 * 是否为 Chrome 浏览器
 * 已排除 Edge、Opera 等基于 Chromium 的浏览器
 */
export function isChrome() {
  const ua = getUA();
  if (/crios\//i.test(ua)) return true;
  return (
    /chrome\//i.test(ua) &&
    !/(?:edg|edge|edga|edgios)\//i.test(ua) &&
    !/(?:opr|opera|opios)\//i.test(ua) &&
    !/(?:samsungbrowser|whale)\//i.test(ua)
  );
}

/**
 * 检测是否支持触摸事件
 */
export function isTouchSupported() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio() {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

/**
 * 获取浏览器名字
 */
export function getBrowserName() {
  const ua = getUA();

  if (/samsungbrowser\//i.test(ua)) return 'samsung';
  if (/whale\//i.test(ua)) return 'whale';
  if (/(?:edg|edge|edga|edgios)\//i.test(ua)) return 'edge';
  if (/(?:opr|opera|opios)\//i.test(ua)) return 'opera';
  if (/(?:chrome|crios)\//i.test(ua)) return 'chrome';
  if (/(?:firefox|fxios)\//i.test(ua)) return 'firefox';
  if (/safari\//i.test(ua)) return 'safari';
  if (/msie|trident/i.test(ua)) return 'ie';

  return null;
}

/**
 * 获取浏览器版本号
 */
export function getBrowserVersion() {
  const ua = getUA();

  const versionPatterns = [
    /samsungbrowser\/([0-9.]+)/i,
    /whale\/([0-9.]+)/i,
    /(?:edg|edge|edga|edgios)\/([0-9.]+)/i,
    /(?:opr|opera|opios)\/([0-9.]+)/i,
    /(?:chrome|crios)\/([0-9.]+)/i,
    /(?:firefox|fxios)\/([0-9.]+)/i,
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
export function getOS() {
  const ua = getUA();

  if (isIPadOSDesktopMode() || /iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (/windows/i.test(ua)) return 'windows';
  if (/cros/i.test(ua)) return 'chromeos';
  if (/mac os/i.test(ua)) return 'macos';
  if (/linux/i.test(ua)) return 'linux';

  return 'unknown';
}
