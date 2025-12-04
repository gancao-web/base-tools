import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/ts/index.ts'],
  outDir: 'dist/ts',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  noExternal: ['lodash-es'],
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
