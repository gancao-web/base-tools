import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/ts/index.ts'],
  outDir: 'dist/ts',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  noExternal: ['es-toolkit'],
  clean: true,
  target: 'es2015',
  tsconfig: 'tsconfig.build.json',
});
