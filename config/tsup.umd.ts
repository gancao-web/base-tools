import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      'base-tools-ts.umd': 'src/ts/index.ts',
    },
    outDir: 'dist/ts',
    format: ['iife'],
    sourcemap: true,
    dts: false,
    splitting: false,
    noExternal: ['lodash-es'],
    clean: false,
    tsconfig: 'tsconfig.build.json',
    globalName: 'baseToolsTS',
  },
  {
    entry: {
      'base-tools-web.umd': 'src/web/index.ts',
    },
    outDir: 'dist/web',
    format: ['iife'],
    sourcemap: true,
    dts: false,
    splitting: false,
    clean: false,
    tsconfig: 'tsconfig.build.json',
    globalName: 'baseToolsWeb',
  },
]);
