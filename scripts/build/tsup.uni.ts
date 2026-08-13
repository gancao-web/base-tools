import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
  // 工具型运行时依赖必须同时维护在发布包 dependencies 和此处 noExternal 中：
  // 1. dependencies 声明安装关系、版本及类型解析；noExternal 则将运行时代码内联到发布产物。
  // 2. 内联后会随本包统一转译为 ES2015，兼容 Vue 2 + Webpack 等默认不转译 node_modules 的旧构建链。
  // 3. 内联还能让产物在 pnpm 严格布局下保持自包含，避免消费侧无法解析产物残留的运行时依赖。
  // 新增或删除下列依赖时，必须同步修改对应发布包的 dependencies。React、Vue 等需共享宿主实例的
  // 框架依赖不适用此规则，应使用 external + peerDependencies，禁止打入产物。
  noExternal: ['es-toolkit', 'dayjs'],
  // Vue 由 uni-app 宿主提供，打进产物会产生重复运行时，并意外带入编译器及 Node.js API。
  external: ['vue'],
  target: 'es2015',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  tsconfig: 'tsconfig.build.json',
});
