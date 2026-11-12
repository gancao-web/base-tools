# uni-app 小程序兼容方案

## 适用场景与职责

适用于 uni-app / Vue 3 / Vite 应用，需要同时处理业务代码、Base Tools 及其他依赖使用的新语法和标准 API。以下配置添加到消费工具库的应用项目，不是添加到 Base Tools 源码或 npm 包中。

工具库将运行时代码及内联工具型依赖转换为 ES2015，但不向宿主注入全局 Polyfill。编译目标只能约束语法，不能自动提供 `Object.hasOwn` 等 API。应用知道自己的最低运行环境，应统一承担语法降级、补丁裁剪及初始化顺序，避免每个依赖重复注入或擅自修改全局对象。

例如，旧微信运行环境中执行 `cloneDeep({ items: [1] })` 时，第三方实现可能访问不存在的 `Object.hasOwn`。临时补这个 API 可以止血；长期方案应覆盖稳定标准能力，不靠逐项枚举工具库、其他依赖或未来业务代码使用的 API。

## 固定编译基线

| 平台 | 示例编译目标 | 依据与取舍 |
| --- | --- | --- |
| 小程序 | Chrome 53 / iOS 10 | iOS 10 对齐 uni-app 文档列出的 Vue 3 最低 iOS 范围；Chrome 53 作为旧 Android V8 的保守目标，一次性保留旧引擎兼容余量。 |
| H5 | Chrome 80 / iOS 13 | 采用现代浏览器范围，避免仅因小程序故障扩大 H5 的补丁和转换成本；应用有更低支持要求时另行评估。 |

参考 [uni-app Vue 3 迁移说明](https://uniapp.dcloud.io/tutorial/migration-to-vue3)和 [Vue 官方支持范围](https://vuejs.org/about/faq)。Chrome 53 是工程侧选择，不表示所有 Android 设备都对应这个版本。

**编译目标不等于设备支持承诺。** 小程序基础库版本不等于 JS 引擎版本；构建成功也不能证明所有 iOS 10 设备、微信版本和其他小程序宿主都能正常使用。实际支持范围还需要用户环境分布、宿主要求、原生能力和真机结果作为依据。

不要发现一台报错设备就下调目标。先检查补丁加载顺序、core-js 覆盖范围、宿主能力及设备是否处于支持范围；只有产品策略、用户统计或框架/宿主要求改变时才调整。调整时同步记录原因、包体积变化和真机结果。微信可参考官方 [miniprogram-compat](https://github.com/wechat-miniprogram/miniprogram-compat)，但需要核对数据覆盖范围与更新时间，不能直接套用到其他宿主。

## 接入步骤

### 1. 安装应用依赖

以下使用 pnpm；其他项目使用各自的包管理器，避免混用锁文件。

```sh
pnpm add core-js@3.49.0
pnpm add -D @babel/core@7 @babel/preset-env@7
```

`core-js` 是应用运行时依赖，Babel 是构建依赖。下例读取实际安装的 core-js 版本用于裁剪，升级后需要重新验证。不要只配置 `corejs: 3` 而忽略小版本新增的标准补丁。

### 2. 添加统一兼容插件

在应用中创建 `build/runtime-compatibility.mjs`：

```js
import { createRequire } from 'node:module';
import { transformAsync } from '@babel/core';
import presetEnv from '@babel/preset-env';

const require = createRequire(import.meta.url);
const { version: corejsVersion } = require('core-js/package.json');

// 固定编译基线，不随单例故障下调，也不代表所有旧设备已经通过验证。
const compatibilityTargets = {
  h5: { chrome: '80', ios: '13' },
  mp: { chrome: '53', ios: '10' },
};

export function runtimeCompatibility(platform) {
  const targets =
    platform === 'h5'
      ? compatibilityTargets.h5
      : platform.startsWith('mp-')
        ? compatibilityTargets.mp
        : null;

  if (!targets) return false;

  const babelOptions = {
    babelrc: false,
    configFile: false,
    sourceType: 'unambiguous',
  };
  let sourcemap = false;

  return {
    name: 'runtime-compatibility',
    enforce: 'post',
    config() {
      // 最终压缩也遵守同一基线，避免重新生成旧引擎不支持的语法。
      return {
        build: {
          target: [
            'es2019',
            ...Object.entries(targets).map(([engine, version]) => `${engine}${version}`),
          ],
        },
      };
    },
    configResolved(config) {
      sourcemap = Boolean(config.build.sourcemap);
    },
    async transform(code, id) {
      const filename = id.replaceAll('\\', '/').split('?')[0];

      if (filename.endsWith('/src/main.ts')) {
        // uni 可能插入 Vue 导入，将补丁重新置首，避免依赖先初始化。
        const result = await transformAsync(code, {
          ...babelOptions,
          filename: id,
          sourceMaps: true,
          plugins: [
            ({ types }) => ({
              visitor: {
                Program(path) {
                  const body = path.node.body;
                  const entry = body.find(
                    (node) =>
                      types.isImportDeclaration(node) && node.source.value === './polyfills',
                  );

                  if (entry) path.node.body = [entry, ...body.filter((node) => node !== entry)];
                },
              },
            }),
          ],
        });

        return { code: result.code, map: result.map };
      }

      if (!filename.endsWith('/src/polyfills.ts')) return;

      // 在 Rollup 解析依赖前裁剪入口，不依赖逐项识别业务与依赖使用的 API。
      const result = await transformAsync(code, {
        ...babelOptions,
        filename: id,
        sourceMaps: true,
        presets: [
          [
            presetEnv,
            {
              targets,
              modules: false,
              bugfixes: true,
              useBuiltIns: 'entry',
              corejs: corejsVersion,
            },
          ],
        ],
      });

      return { code: result.code, map: result.map };
    },
    async renderChunk(code, chunk) {
      // 处理参与打包的全部 JS，包括业务、第三方依赖和分包。
      const result = await transformAsync(code, {
        ...babelOptions,
        filename: chunk.fileName,
        compact: false,
        sourceMaps: sourcemap,
        presets: [
          [
            presetEnv,
            {
              targets,
              modules: false,
              bugfixes: true,
              useBuiltIns: false,
              // esbuild 无法处理 iOS 10 的块级声明降级，交给 Babel 显式转换。
              include: platform.startsWith('mp-') ? ['transform-block-scoping'] : [],
            },
          ],
        ],
      });

      return { code: result.code, map: result.map };
    },
  };
}
```

这个示例按 `src/main.ts` 和 `src/polyfills.ts` 匹配入口。使用其他目录、JavaScript 入口或额外的独立运行入口时，需要同步调整匹配规则和补丁导入，并验证各入口的执行顺序。

### 3. 添加裁剪入口并优先加载

创建 `src/polyfills.ts`：

```ts
// 仅作为 Babel entry 的输入；构建时会展开为目标环境缺少的模块。
import 'core-js/es';
```

在 `src/main.ts` 最前面添加：

```ts
// #ifdef H5 || MP
import './polyfills';
// #endif
import { createSSRApp } from 'vue';
// 后续保留应用现有导入与 createApp() 实现。
```

`core-js/es` 是稳定 ES 标准入口，避免 `core-js/stable` 中的 Web 补丁假设小程序拥有完整的浏览器宿主能力。`useBuiltIns: 'entry'` 会按目标环境裁剪它；这不是全量引入，也不是 `usage` 按代码使用情况扫描，所以不需要逐项枚举 `Object.hasOwn`、数组 `at` 等 API。

全局补丁需要先执行才能服务第三方库，不能在 `createApp()` 中延后加载。兼容插件还会处理 uni 编译器插入 Vue 导入后的排序。

### 4. 在 Vite 中接入

将插件合并到应用现有 `vite.config.ts`，保留原来的环境配置和其他插件：

```ts
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { runtimeCompatibility } from './build/runtime-compatibility.mjs';

export default defineConfig(() => ({
  plugins: [uni(), runtimeCompatibility(process.env.UNI_PLATFORM || 'h5')],
}));
```

Vite 不会因为存在 `babel.config.js` 就自动让整条构建链经过 Babel，必须显式接入插件。示例同时覆盖 H5 和 `mp-*`，其他目标返回 `false`，保留原有构建链。

若原 H5 使用 `renderLegacyChunks: false` 的 legacy 配置来注入现代补丁，可在统一接入后移除该配置及其依赖。若原来依赖 SystemJS、`nomodule` 等旧浏览器加载机制，需要单独评估，不能认为 Babel 完全替代了这些能力。

## 验证与限制

- 在应用中运行现有 lint 及 H5、小程序构建命令，并分别检查实际使用的环境模式。仅构建验证，不运行附带上传、发布的命令。
- 检查产物没有保留未裁剪的 `core-js/es` 总入口，并确认 `Object.hasOwn` 等所需模块已打包、补丁先于 Vue 和业务依赖执行。直接复制到输出目录的静态脚本、原生组件或其他独立执行环境不会自动经过上述打包转换，需要单独核对。
- 在隔离环境移除原生 `Object.hasOwn` 和 `Array.prototype.at`，确认补丁加载后能调用，再验证 `cloneDeep({ items: [1] })` 等实际依赖路径。隔离验证与开发者工具模拟均不能代替最低目标附近的真机验证。
- `entry` 按环境裁剪仍会包含当前业务暂未使用的补丁，用一定包体积换取对未来代码和依赖的统一覆盖。参考 core-js 3.49.0 的独立压缩补丁约为 H5 92 KiB、小程序 113 KiB。

配置选项参考 [Babel preset-env 文档](https://v7.babeljs.io/docs/babel-preset-env)及 [core-js 文档](https://core-js.io/docs/)。
