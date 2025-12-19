# Base Tools

Web前端团队常用工具库，包含`ts`、`web`、`react`、`vue`、`uni`模块。

## 📖 在线文档

[https://gancao-web.github.io/base-tools/](https://gancao-web.github.io/base-tools/)

## 🚀 快速开始

### 安装

- 按需安装即可,模块之间不相互依赖
- 非ts环境和普通h5也能使用,因为所有函数已编译为es5

```js
// 通用TS/JS模块
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

### 使用

```ts
// 通用TS/JS模块
import { toDayjs, getUrlParam, toMaskPhone } from '@base-web-kits/base-tools-ts';

// Web 模块
import { copyText, isPC, setCookie } from '@base-web-kits/base-tools-web';

// React 模块
import { useCountDown } from '@base-web-kits/base-tools-react';

// Vue 模块
import { useResizeObserver } from '@base-web-kits/base-tools-vue';

// Uni 模块
import { setBaseToolsConfig, chooseMedia, toPayWx } from '@base-web-kits/base-tools-uni';

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

### 普通h5

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Base Tools 示例</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/@base-web-kits/base-tools-ts@1.0.0/dist/base-tools-ts.umd.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@base-web-kits/base-tools-web@1.0.0/dist/base-tools-web.umd.global.js"></script>

    <script>
      // 使用 base-tools-ts 中的函数
      const { createTimeRandId, EventBus } = baseToolsTS;

      // 使用 base-tools-web 中的函数
      const { getCookie, setCookie } = baseToolsWeb;

      // 示例：创建随机ID
      const id = createTimeRandId();
      console.log('随机ID:', id);

      // 示例：使用EventBus
      const emitter = new EventBus();
      emitter.on('test', (data) => {
        console.log('收到事件:', data);
      });
      emitter.emit('test', 'Hello World!');

      // 示例：操作Cookie
      setCookie('name', 'Base Tools', 7);
      const name = getCookie('name');
      console.log('Cookie值:', name);
    </script>
  </body>
</html>
```
