import { afterEach, describe, expect, it, vi } from 'vitest';
import { setBaseToolsConfig as setUniBaseToolsConfig } from '../../../src/uni/config';
import {
  getBaseToolsConfig as getWebBaseToolsConfig,
  setBaseToolsConfig as setWebBaseToolsConfig,
} from '../../../src/web/config';
import { UNI_APP_CONFIG_KEY } from '../../../src/shared/config/uniAppBridge';
import { createUniConfig } from '../../helpers/uniConfig';

describe('web/config uni-app H5 adapter', () => {
  afterEach(() => {
    if (typeof window !== 'undefined') {
      delete (window as unknown as Record<string, unknown>)[UNI_APP_CONFIG_KEY];
    }
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    setWebBaseToolsConfig({
      toast: undefined,
      showLoading: undefined,
      hideLoading: undefined,
      toLogin: undefined,
      log: undefined,
    });
  });

  it('检测到 window.uni 时复用 uni 的 UI、登录和日志配置', () => {
    const showToast = vi.fn();
    const showLoading = vi.fn();
    const hideLoading = vi.fn();
    const navigateTo = vi.fn();
    const log = vi.fn();
    const onBeforeHref = vi.fn(() => undefined);
    const uni = { showToast, showLoading, hideLoading, navigateTo };

    vi.stubGlobal('window', { uni });
    setUniBaseToolsConfig(
      createUniConfig({
        onBeforeHref,
        log,
      }),
    );

    const config = getWebBaseToolsConfig();

    config.toast?.({ msg: '请求失败', status: 'fail' });
    config.showLoading?.({ title: '上传中' });
    config.hideLoading?.();
    config.toLogin?.();
    config.log?.('error', { name: 'uploadFile' });

    expect(showToast).toHaveBeenCalledWith({ icon: 'none', title: '请求失败', duration: 1000 });
    expect(showLoading).toHaveBeenCalledWith({ title: '上传中', mask: true });
    expect(hideLoading).toHaveBeenCalledOnce();
    expect(onBeforeHref).toHaveBeenCalledWith('/pages/login/index');
    expect(navigateTo).toHaveBeenCalledWith({ url: '/pages/login/index' });
    expect(log).toHaveBeenCalledWith('error', { name: 'uploadFile' });
  });

  it('显式 Web 配置优先于 uni-app 自动适配', () => {
    const uniToast = vi.fn();
    const webToast = vi.fn();
    const uni = {
      showToast: uniToast,
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
      navigateTo: vi.fn(),
    };

    vi.stubGlobal('window', { uni });
    setUniBaseToolsConfig(createUniConfig());
    setWebBaseToolsConfig({ toast: webToast });

    getWebBaseToolsConfig().toast?.({ msg: '提示', status: 'success' });

    expect(webToast).toHaveBeenCalledWith({ msg: '提示', status: 'success' });
    expect(uniToast).not.toHaveBeenCalled();
  });

  it('非 H5 或 window.uni 不存在时不注册适配', () => {
    vi.stubGlobal('window', {});
    setUniBaseToolsConfig(createUniConfig());

    expect(getWebBaseToolsConfig().toast).toBeUndefined();
    expect((window as unknown as Record<string, unknown>)[UNI_APP_CONFIG_KEY]).toBeUndefined();
  });
});
