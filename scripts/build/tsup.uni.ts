import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
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
