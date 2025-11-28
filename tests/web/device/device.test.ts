import { describe, it, expect } from 'vitest';
import {
  getUA,
  isMobile,
  isTablet,
  isPC,
  isIOS,
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
  it('UA helpers', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: ua, maxTouchPoints: 0 },
      configurable: true,
      writable: true,
    });
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
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: uaMobile, maxTouchPoints: 5 },
      configurable: true,
      writable: true,
    });
    expect(isMobile()).toBe(true);
    expect(isTablet()).toBe(false);
    expect(isPC()).toBe(false);
    expect(isIOS()).toBe(true);
    expect(isAndroid()).toBe(false);
    expect(isWeChat()).toBe(true);
  });

  it('touch and dpr', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { userAgent: 'Mozilla', maxTouchPoints: 1 },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      value: { devicePixelRatio: 2 },
      configurable: true,
      writable: true,
    });
    expect(isTouchSupported()).toBe(true);
    expect(getDevicePixelRatio()).toBe(2);
  });
});
