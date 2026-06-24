## 第三方库的 re-export 说明

- 为了丰富工具库, 会对常用第三方库全量 re-export, 如 es-toolkit、vueuse、ahooks 等
- 另外, 工具库本身很多地方也会直接复用这些第三方库的能力
- 为了收敛依赖版本, 会对这些第三方库进行版本锁定
- docs目录已包含这些第三方库的使用说明, 以实现一站式搜索
- 升级第三方库时, 先更新根目录的package.json版本, 然后 `npm install`, 再 `npm run build`, 最后发布npm包
- 更新第三方库文档时, 先运行 `npm run update:xx`, 此时会在 re-export 目录产生 git diff, 查看 diff 就能知道新增的函数, 从而更新 docs 文档

## 分平台构建约定

- `web`、`uni` 包如需兼容 vue2 + webpack 这类默认不编译 `node_modules` ES 模块的老环境, 可以在 `tsup` 中按需配置 `noExternal`, 并转译为 `es2015`
- `web` 和 `uni` 目录使用 `ts` 目录下的函数时, 需使用相对路径引入到具体的包, 如 `import { toDayjs } from '../../ts/day'`, 并在 `tsup` 中配置 `dts: true`, 确保构建时把源码打进来, 不产生相互依赖关系
- `web` 和 `uni` 目录如果使用 `ts` 目录的第三方 re-export 函数, 应直接引用, 如 `import { pickBy } from 'es-toolkit'`, 并按兼容性要求决定是否配置 `noExternal`
- `react` 包不要把 `react`、`react-dom` 以及基于 React 的第三方 hooks 库打进产物
- `react` 包通过 `peerDependencies` 声明 `react`、`react-dom`, 并在 `tsup` 中将 `react`、`react-dom`、`ahooks` 设为 `external`
- `react` 包可以在 `dependencies` 中声明 `ahooks`, 让消费者安装本包时自动获得运行时依赖, 但不能将其 bundle 进产物, 否则容易引入多份 React 并触发 `Invalid Hook Call`
- `vue` 包不要把 `vue` 及其响应式运行时相关依赖打进产物
- `vue` 包通过 `peerDependencies` 声明 `vue`, 并在 `tsup` 中将 `vue`、`@vueuse/core`、`@vueuse/shared` 设为 `external`
- `vue` 包可以在 `dependencies` 中声明 `@vueuse/core`, 让消费者安装本包时自动获得运行时依赖, 但不能将其 bundle 进产物, 避免引入多份 Vue 运行时
- React/Vue 包发布前, 应检查 dist 中未内联框架运行时代码, 避免消费侧出现多实例运行时问题

## 其他说明

- 注意构建的node版本最低18, 否则会报错
