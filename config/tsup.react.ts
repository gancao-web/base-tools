import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/react/index.ts'],
  outDir: 'dist/react',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  noExternal: ['ahooks'],
  clean: true,
  tsconfig: 'tsconfig.build.json',
});
