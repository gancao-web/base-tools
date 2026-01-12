import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/web/index.ts'],
  outDir: 'dist/web',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  target: 'es2015',
  tsconfig: 'tsconfig.build.json',
});
