import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
