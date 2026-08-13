import { describe, it, expect } from 'vitest';
import {
  getUA,
  isMobile,
  isIPad,
  isAndroidTablet,
  isTablet,
  isPC,
  isIOS,
  isAppleOS,
  isAndroid,
  isWeChat,
  isChrome,
  isTouchSupported,
  getDevicePixelRatio,
  getBrowserName,
  getBrowserVersion,
  getOS,
} from '../../../src/web';

describe('web/device', () => {
  const setNavigator = (userAgent: string, maxTouchPoints = 0) => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent, maxTouchPoints },
      configurable: true,
      writable: true,
    });
  };

  it('UA helpers', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    setNavigator(ua);
    expect(getUA()).toBe(ua.toLowerCase());
    expect(isPC()).toBe(true);
    expect(isChrome()).toBe(true);
    expect(getBrowserName()).toBe('chrome');
    expect(getBrowserVersion()).toMatch(/^120\./);
    expect(getOS()).toBe('windows');
  });

  it('mobile/tablet/ios/android/wechat detection', () => {
    const uaMobile =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1 MicroMessenger/8.0.0';
    setNavigator(uaMobile, 5);
    expect(isMobile()).toBe(true);
    expect(isIPad()).toBe(false);
    expect(isAndroidTablet()).toBe(false);
    expect(isTablet()).toBe(false);
    expect(isPC()).toBe(false);
    expect(isIOS()).toBe(true);
    expect(isAppleOS()).toBe(true);
    expect(isAndroid()).toBe(false);
    expect(isWeChat()).toBe(true);
    expect(getOS()).toBe('ios');
  });

  it('detects iPad and iPadOS desktop mode as tablets', () => {
    setNavigator(
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      5,
    );
    expect(isMobile()).toBe(true);
    expect(isIPad()).toBe(true);
    expect(isAndroidTablet()).toBe(false);
    expect(isTablet()).toBe(true);
    expect(isPC()).toBe(false);
    expect(isIOS()).toBe(true);
    expect(isAppleOS()).toBe(true);
    expect(getOS()).toBe('ios');

    setNavigator(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      5,
    );
    expect(isIPad()).toBe(true);
    expect(isTablet()).toBe(true);
    expect(isIOS()).toBe(true);
    expect(isAppleOS()).toBe(true);
    expect(getOS()).toBe('ios');
  });

  it('detects macOS as an Apple OS', () => {
    setNavigator(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    );
    expect(isAppleOS()).toBe(true);
  });

  it('does not detect non-Apple systems as an Apple OS', () => {
    setNavigator(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    );
    expect(isAppleOS()).toBe(false);
  });

  it('detects Android before Linux', () => {
    setNavigator(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      5,
    );
    expect(isAndroid()).toBe(true);
    expect(isAndroidTablet()).toBe(false);
    expect(getOS()).toBe('android');
  });

  it('distinguishes Android tablets from Android phones', () => {
    setNavigator(
      'Mozilla/5.0 (Linux; Android 13; SM-X700 Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      5,
    );
    expect(isAndroid()).toBe(true);
    expect(isAndroidTablet()).toBe(true);
    expect(isIPad()).toBe(false);
    expect(isTablet()).toBe(true);
    expect(isMobile()).toBe(true);
    expect(isPC()).toBe(false);
  });

  it.each([
    [
      'edge',
      '120.0.0.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    ],
    [
      'opera',
      '106.0.0.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
    ],
    [
      'chrome',
      '120.0.0.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
    ],
    [
      'firefox',
      '121.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/121.0 Mobile/15E148 Safari/605.1.15',
    ],
    [
      'edge',
      '120.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/120.0 Mobile/15E148 Safari/605.1.15',
    ],
    [
      'edge',
      '120.0',
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 EdgA/120.0',
    ],
    [
      'samsung',
      '23.0',
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
    ],
    [
      'whale',
      '3.24.223.18',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Whale/3.24.223.18 Safari/537.36',
    ],
  ])('detects %s browser and version', (name, version, ua) => {
    setNavigator(ua);
    expect(getBrowserName()).toBe(name);
    expect(getBrowserVersion()).toBe(version);
    expect(isChrome()).toBe(name === 'chrome');
  });

  it('touch and dpr', () => {
    setNavigator('Mozilla', 1);
    Object.defineProperty(globalThis, 'window', {
      value: { devicePixelRatio: 2 },
      configurable: true,
      writable: true,
    });
    expect(isTouchSupported()).toBe(true);
    expect(getDevicePixelRatio()).toBe(2);
  });

  it('does not treat an unknown SSR device as PC', () => {
    Reflect.deleteProperty(globalThis, 'navigator');
    expect(getUA()).toBe('');
    expect(isMobile()).toBe(false);
    expect(isTablet()).toBe(false);
    expect(isPC()).toBe(false);
    expect(isTouchSupported()).toBe(false);
    expect(getBrowserName()).toBeNull();
    expect(getBrowserVersion()).toBeNull();
    expect(getOS()).toBe('unknown');
  });
});
