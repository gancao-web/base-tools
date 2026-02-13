# 指南

## 简介

web前端团队常用工具库，包含`ts`、`web`、`react`、`vue`、`uni`模块。

## 安装

- 按需安装即可,模块之间不相互依赖
- 非ts环境和普通h5也能使用,因为所有函数已编译为es5

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

## 使用

```ts
// 通用 TS 模块
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

## 普通h5

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

## 兼容性

本工具库和相关依赖可能涉及的新特性及其最低兼容版本：

| 特性                                      | ES 版本 | 最低兼容版本 (Browser/OS)           |
| :---------------------------------------- | :------ | :---------------------------------- |
| **Array.prototype.includes**              | ES2016  | Chrome 47+, iOS 9+, Android 6.0+    |
| **Object.values / entries**               | ES2017  | Chrome 54+, iOS 10.3+, Android 7.0+ |
| **String.prototype.padStart / padEnd**    | ES2017  | Chrome 57+, iOS 10.3+, Android 8.0+ |
| **Object.getOwnPropertyDescriptors**      | ES2017  | Chrome 54+, iOS 10.3+, Android 7.0+ |
| **Promise.prototype.finally**             | ES2018  | Chrome 63+, iOS 11.3+, Android 9.0+ |
| **Async Iterator (Symbol.asyncIterator)** | ES2018  | Chrome 63+, iOS 12.0+, Android 9.0+ |
| **Object.fromEntries**                    | ES2019  | Chrome 73+, iOS 12.2+, Android 10+  |
| **Array.prototype.flat / flatMap**        | ES2019  | Chrome 69+, iOS 12.0+, Android 9.0+ |
| **String.prototype.trimStart / trimEnd**  | ES2019  | Chrome 66+, iOS 12.0+, Android 9.0+ |
| **Promise.allSettled**                    | ES2020  | Chrome 76+, iOS 13.0+, Android 10+  |
| **String.prototype.matchAll**             | ES2020  | Chrome 80+, iOS 13.0+, Android 10+  |
| **BigInt**                                | ES2020  | Chrome 67+, iOS 14.0+, Android 11+  |
| **globalThis**                            | ES2020  | Chrome 71+, iOS 12.2+, Android 9.0+ |
| **String.prototype.replaceAll**           | ES2021  | Chrome 85+, iOS 13.4+, Android 11+  |
| **Promise.any**                           | ES2021  | Chrome 85+, iOS 14.0+, Android 11+  |
| **WeakRef / FinalizationRegistry**        | ES2021  | Chrome 84+, iOS 14.5+, Android 11+  |
| **Array/String.prototype.at**             | ES2022  | Chrome 92+, iOS 15.4+, Android 12+  |
| **Error.prototype.cause**                 | ES2022  | Chrome 93+, iOS 15.0+, Android 12+  |
| **Object.hasOwn**                         | ES2022  | Chrome 93+, iOS 15.4+, Android 12+  |

本工具库构建目标为 **ES2015+**。但不内置 Polyfill, 如需支持低版本浏览器, 请务必在项目中配置 Polyfill。

### 配置 Polyfill

#### 1. Vite 项目 (推荐)

使用 `@vitejs/plugin-legacy` 插件，它会自动根据目标浏览器注入所需的 Polyfill。

```bash
npm add -D @vitejs/plugin-legacy
```

```ts
// vite.config.ts
import legacy from '@vitejs/plugin-legacy';

export default {
  plugins: [
    legacy({
      // 与antd4兼容性对齐 https://4x-ant-design.antgroup.com/docs/react/introduce-cn
      // targets: ['defaults', 'not IE 11'],

      // 与vant4兼容性对齐 https://vant4.ylhtest.com/#/zh-CN/home
      // targets: ['chrome >= 51', 'android >= 5', 'ios >= 10'],

      // 与Element对齐: https://element-plus.org/zh-CN/guide/installation
      targets: ['Chrome >= 64', 'Edge >= 79', 'Firefox >= 78', 'Safari >= 12', 'not IE 11'],

      // 自动根据目标浏览器注入所需的 Polyfill
      modernPolyfills: true,
    }),
  ],
};
```

#### 2. Webpack / Vue CLI

请确保安装了 `core-js`，并在入口文件顶部引入。

```bash
npm add core-js
```

```ts
import 'core-js/stable';
```

或者在 `babel.config.js` 中配置：

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
};
```

#### 3. uni-app 项目

uni-app 如果运行在小程序,原生app,微信端h5，则无需额外配置 Polyfill。
