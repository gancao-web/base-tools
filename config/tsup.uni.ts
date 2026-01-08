import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  target: 'es2015',
  tsconfig: 'tsconfig.build.json',
  external: ['@base-web-kits/base-tools-ts'],
});
