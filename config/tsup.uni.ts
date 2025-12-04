import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
