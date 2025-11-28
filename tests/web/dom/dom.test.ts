import { describe, it, expect, vi } from 'vitest';
import {
  getWindowWidth,
  getWindowHeight,
  getWindowScrollTop,
  getWindowScrollLeft,
  windowScrollTo,
  isInViewport,
  lockBodyScroll,
  unlockBodyScroll,
} from '../../../src/web';

describe('web/dom', () => {
  it('window scroll getters and viewport', () => {
    // 创建最小的 window/document stub
    const win = {
      innerWidth: 1024,
      innerHeight: 768,
      pageXOffset: 10,
      pageYOffset: 20,
      scrollTo: vi.fn(),
    };
    // @ts-expect-error test env stub
    globalThis.window = win;
    const docEl = { clientWidth: 1000, clientHeight: 700, style: {} };
    const body = { scrollTop: 0, scrollLeft: 0, style: {}, dataset: {} };
    // @ts-expect-error test env stub
    globalThis.document = { documentElement: docEl, body };

    expect(getWindowScrollTop()).toBe(20);
    expect(getWindowScrollLeft()).toBe(10);
  });

  it('windowScrollTo uses smooth when supported', () => {
    const spy = vi.fn();
    // @ts-expect-error test env stub
    globalThis.window = { scrollTo: spy };
    const docEl = { style: { scrollBehavior: 'smooth' } };
    // @ts-expect-error test env stub
    globalThis.document = { documentElement: docEl };
    windowScrollTo(100);
    expect(spy).toHaveBeenCalledWith({ top: 100, behavior: 'smooth' });
  });

  it('isInViewport uses element rect and viewport', () => {
    const el = {
      getBoundingClientRect: () => ({ top: 10, left: 10, right: 50, bottom: 50 }),
    } as unknown as Element;
    // @ts-expect-error test env stub
    globalThis.window = { innerWidth: 100, innerHeight: 100 };
    const docEl = { clientWidth: 100, clientHeight: 100 };
    // @ts-expect-error test env stub
    globalThis.document = { documentElement: docEl };
    expect(isInViewport(el)).toBe(true);
    expect(isInViewport(el, -60)).toBe(false);
  });

  it('lockBodyScroll and unlockBodyScroll', () => {
    const scrollSpy = vi.fn();
    // @ts-expect-error test env stub
    globalThis.window = {
      scrollY: 30,
      pageYOffset: 30,
      scrollTo: scrollSpy,
    };
    const body = { style: { position: '' }, dataset: { scrollLock: false } };
    // @ts-expect-error test env stub
    globalThis.document = { body };
    lockBodyScroll();
    expect(body.style.position).toBe('fixed');
    expect(body.dataset.scrollLock).toBe('true');
    unlockBodyScroll();
    expect(body.style.position).toBe('');
    expect(scrollSpy).toHaveBeenCalledWith(0, 30);
  });

  it('getWindowWidth and getWindowHeight prefer window inner values', () => {
    // @ts-expect-error test env stub
    globalThis.window = { innerWidth: 1200, innerHeight: 900 };
    const docEl = { clientWidth: 1100, clientHeight: 800 };
    const body = { clientWidth: 1000, clientHeight: 700 };
    // @ts-expect-error test env stub
    globalThis.document = { documentElement: docEl, body };
    expect(getWindowWidth()).toBe(1200);
    expect(getWindowHeight()).toBe(900);
  });

  it('getWindowWidth and getWindowHeight fallback to documentElement then body', () => {
    // @ts-expect-error test env stub
    globalThis.window = {};
    const docEl = { clientWidth: 1024, clientHeight: 768 };
    const body = { clientWidth: 800, clientHeight: 600 };
    // @ts-expect-error test env stub
    globalThis.document = { documentElement: docEl, body };
    expect(getWindowWidth()).toBe(1024);
    expect(getWindowHeight()).toBe(768);

    // @ts-expect-error test env stub
    globalThis.document = { documentElement: {}, body };
    expect(getWindowWidth()).toBe(800);
    expect(getWindowHeight()).toBe(600);
  });
});
