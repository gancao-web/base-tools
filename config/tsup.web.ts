import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/web/index.ts'],
  outDir: 'dist/web',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
