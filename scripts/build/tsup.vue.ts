import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/vue/index.ts'],
  outDir: 'dist/vue',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  // 为了解决vue2+webpack不支持es6的问题, 需对re-export的第三方库进行打包, 并转为es2015
  // 在npm的dependencies也需声明依赖,仅提供ts类型资源
  noExternal: ['@vueuse/core'],
  target: 'es2015',
  tsconfig: 'tsconfig.build.json',
});
