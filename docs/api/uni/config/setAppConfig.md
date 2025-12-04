# setAppConfig

初始化应用配置, 建议在入口文件先设置配置

## 示例

```ts
import { setAppConfig } from '@base-web-kits/base-tools-uni';

setAppConfig({
  pathHome: '/pages/tabbar/home/index',
  pathLogin: '/pages/login/index',
  pathWebview: '/pages/webview/index',
  hostFile: 'https://xx.com/',
  hostIcon: 'https://xx.com/xx/',
  isTabBar: (url) => url.startsWith('/pages/tabbar/'),
  isLogin: () => useUserStore().isLogin,
  log: (level, data) => console.log({ level, data }),
});
```

## 版本

- 1.0.0 新增
