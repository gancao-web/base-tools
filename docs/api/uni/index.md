**安装**

`npm i @base-web-kits/base-tools-uni`

**使用**

```ts
import { setBaseToolsConfig } from '@base-web-kits/base-tools-uni';

setBaseToolsConfig({
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
