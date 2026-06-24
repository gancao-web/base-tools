import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/vue/index.ts'],
  outDir: 'dist/vue',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  // Vue生态依赖必须保持外部化, 避免把多份Vue响应式运行时打进产物
  external: ['vue', '@vueuse/core', '@vueuse/shared'],
  target: 'es2015',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  tsconfig: 'tsconfig.build.json',
});
