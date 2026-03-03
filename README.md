# Base Tools

Web前端团队常用工具库，包含`ts`、`web`、`react`、`vue`、`uni`模块。

## 📖 在线文档

[https://gancao-web.github.io/base-tools/](https://gancao-web.github.io/base-tools/)

## 🚀 快速开始

### 安装

- 按需安装即可
- 非ts环境和普通h5也能使用,因为所有函数已编译为es5

```js
// 通用TS/JS模块
npm i @base-web-kits/base-tools-ts

// Web 模块
npm i @base-web-kits/base-tools-web

// Uni 模块
npm i @base-web-kits/base-tools-uni

// React 模块
npm i @base-web-kits/base-tools-react

// Vue 模块
npm i @base-web-kits/base-tools-vue
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

## 🤖 AI 智能助手 (Skill)

本项目提供了强大的 AI Skill，可让 Cursor、Trae、Claude Code 等 AI 助手深度理解 `@base-web-kits` 的能力，为您精准推荐最佳实践函数，并自动处理依赖安装。

### 安装方式

在项目根目录下执行以下命令：

```bash
npx skills add gancao-web/base-tools
```

### 验证生效

安装完成后，可以在对话框中输入以下问题进行测试。如果 AI 推荐了 `@base-web-kits` 下的相关包或函数，说明配置已生效。

| 测试场景 | 推荐提问 | 预期 AI 回答 |
| :-- | :-- | :-- |
| **JS工具库** | "我需要深拷贝一个对象,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `cloneDeep` |
| **JS正则验证** | "我需要校验邮箱格式,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-ts` 的 `isEmail` |
| **通用web** | "我需要复制文本到剪贴板,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-web` 的 `copyText` |
| **React项目** | "我需要监听dom元素的尺寸变化,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-react` 的 `useSize` |
| **Vue项目** | "我需要监听元素外部点击事件,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-vue` 的 `onClickOutside` |
| **UniApp项目** | "我需要保存网络图片到系统相册,请编写或推荐一个函数,优先考虑已配置的skill" | 推荐使用 `base-tools-uni` 的 `saveImageToPhotosAlbum` 函数 |

## 兼容性

本工具库和相关依赖可能涉及的新特性及其最低兼容版本：

| 特性                                     | ES 版本 | 最低兼容版本 (Browser/OS)           |
| :--------------------------------------- | :------ | :---------------------------------- |
| **Object.values / entries**              | ES2017  | Chrome 54+, iOS 10.3+, Android 7.0+ |
| **String.prototype.padStart / padEnd**   | ES2017  | Chrome 57+, iOS 10.3+, Android 8.0+ |
| **Object.getOwnPropertyDescriptors**     | ES2017  | Chrome 54+, iOS 10.3+, Android 7.0+ |
| **Promise.prototype.finally**            | ES2018  | Chrome 63+, iOS 11.3+, Android 9.0+ |
| **Symbol.asyncIterator**                 | ES2018  | Chrome 63+, iOS 12.0+, Android 9.0+ |
| **Object.fromEntries**                   | ES2019  | Chrome 73+, iOS 12.2+, Android 10+  |
| **Array.prototype.flat / flatMap**       | ES2019  | Chrome 69+, iOS 12.0+, Android 9.0+ |
| **String.prototype.trimStart / trimEnd** | ES2019  | Chrome 66+, iOS 12.0+, Android 9.0+ |
| **Promise.allSettled**                   | ES2020  | Chrome 76+, iOS 13.0+, Android 10+  |
| **String.prototype.matchAll**            | ES2020  | Chrome 80+, iOS 13.0+, Android 10+  |
| **BigInt**                               | ES2020  | Chrome 67+, iOS 14.0+, Android 11+  |
| **globalThis**                           | ES2020  | Chrome 71+, iOS 12.2+, Android 9.0+ |
| **String.prototype.replaceAll**          | ES2021  | Chrome 85+, iOS 13.4+, Android 11+  |
| **Promise.any**                          | ES2021  | Chrome 85+, iOS 14.0+, Android 11+  |
| **WeakRef / FinalizationRegistry**       | ES2021  | Chrome 84+, iOS 14.5+, Android 11+  |
| **Array/String.prototype.at**            | ES2022  | Chrome 92+, iOS 15.4+, Android 12+  |
| **Error.prototype.cause**                | ES2022  | Chrome 93+, iOS 15.0+, Android 12+  |
| **Object.hasOwn**                        | ES2022  | Chrome 93+, iOS 15.4+, Android 12+  |

本工具库构建目标为 **ES2015+**。但不内置 Polyfill, 如需支持低版本浏览器, 请务必在项目中配置 Polyfill。

### 配置 Polyfill

以 Vite 项目为例, 使用 `@vitejs/plugin-legacy` 插件自动按需注入 Polyfill。

```ts
// vite.config.ts
import legacy from '@vitejs/plugin-legacy'; // 安装命令: npm install -D @vitejs/plugin-legacy

export default {
  plugins: [
    legacy({
      // 与antd4兼容性对齐 https://4x-ant-design.antgroup.com/docs/react/introduce-cn
      // targets: ['defaults', 'not IE 11'],

      // 与vant4兼容性对齐 https://vant4.ylhtest.com/#/zh-CN/home
      // targets: ['chrome >= 51', 'android >= 5', 'ios >= 10'],

      // 与Element对齐: https://element-plus.org/zh-CN/guide/installation
      targets: ['Chrome >= 64', 'Edge >= 79', 'Firefox >= 78', 'Safari >= 12', 'not IE 11'],

      // 按需自动引入polyfill (至少升级到vite3.x, 推荐vite5+)
      modernPolyfills: true,
    }),
  ],
};
```
