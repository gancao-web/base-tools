# Base Tools

Web前端团队常用工具库，包含`ts`、`web`、`react`、`vue`、`uni`模块。

## 📖 在线文档

[https://gancao-web.github.io/base-tools/](https://gancao-web.github.io/base-tools/)

## 🚀 快速开始

**安装**

按需安装即可,模块之间不相互依赖

```js
// 通用 TS 模块
npm i @base-web-kits/base-tools-ts

// Web 模块
npm i @base-web-kits/base-tools-web

// React 模块
npm i @base-web-kits/base-tools-react

// Vue 模块
npm i @base-web-kits/base-tools-vue

// Uni 模块
npm i @base-web-kits/base-tools-uni
```

**快速使用**

```ts
// 通用 TS 模块
import { toDayjs, getUrlParam, toMaskPhone } from '@base-web-kits/base-tools-ts';

// Web 模块
import { copyText, isPC, download, setCookie } from '@base-web-kits/base-tools-web';

// React 模块
import { useCountDown } from '@base-web-kits/base-tools-react';

// Vue 模块
import { useResizeObserver } from '@base-web-kits/base-tools-vue';

// Uni 模块
import { setAppConfig, chooseMedia, toPayWx } from '@base-web-kits/base-tools-uni';

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
