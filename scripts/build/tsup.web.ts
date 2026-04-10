import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/web/index.ts'],
  outDir: 'dist/web',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
  // 为了解决vue2+webpack不支持es6的问题, 需对re-export的第三方库进行打包, 并转为es2015
  // 为了在 pnpm 严格布局下, dependencies依赖丢失的问题, 需对运行时依赖打包到库里
  noExternal: ['es-toolkit', 'dayjs'],
  target: 'es2015',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  tsconfig: 'tsconfig.build.json',
});
