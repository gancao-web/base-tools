import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/vue/index.ts'],
  outDir: 'dist/vue',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  noExternal: ['@vueuse/core'],
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
