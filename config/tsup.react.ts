import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/react/index.ts'],
  outDir: 'dist/react',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  noExternal: ['ahooks'],
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
