import type { AppConfig } from '../../src/uni/config';

/**
 * 创建测试使用的完整 Uni 配置。
 * 可选字段也显式初始化，避免 setBaseToolsConfig 合并单例配置时残留上一条用例的数据。
 */
export function createUniConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    pathHome: '/pages/index/index',
    pathLogin: '/pages/login/index',
    pathWebview: '/pages/webview/index',
    hostFile: '',
    hostIcon: '',
    versionIcon: '',
    isTabBar: () => false,
    isLogin: () => false,
    onBeforeHref: undefined,
    log: undefined,
    ...overrides,
  };
}
