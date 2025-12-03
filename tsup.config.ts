import { defineConfig } from 'tsup';

export default defineConfig([
  // TypeScript utilities - with both ESM and CJS for TS 4.x compatibility
  {
    entry: ['src/ts/index.ts'],
    outDir: 'dist/ts',
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    noExternal: ['lodash-es'],
    clean: true,
    tsconfig: 'tsconfig.json', // 使用主tsconfig，支持ESM语法
  },
  // Uni-app utilities
  {
    entry: ['src/uni/index.ts'],
    outDir: 'dist/uni',
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    clean: true,
    tsconfig: 'tsconfig.json', // 使用主tsconfig，支持ESM语法
  },
  // Web utilities
  {
    entry: ['src/web/index.ts'],
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    clean: true,
    tsconfig: 'tsconfig.json', // 使用主tsconfig，支持ESM语法
  },
  // React utilities
  {
    entry: ['src/react/index.ts'],
    outDir: 'dist/react',
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    noExternal: ['ahooks'],
    clean: true,
    tsconfig: 'tsconfig.json', // 使用主tsconfig，支持ESM语法
  },
  // Vue utilities
  {
    entry: ['src/vue/index.ts'],
    outDir: 'dist/vue',
    format: ['esm', 'cjs'],
    dts: false,
    splitting: false,
    noExternal: ['@vueuse/core'],
    clean: true,
    tsconfig: 'tsconfig.json', // 使用主tsconfig，支持ESM语法
  },
  // UMD builds for browser usage
  {
    entry: {
      'base-tools-ts.umd': 'src/ts/index.ts',
    },
    outDir: 'dist/ts',
    format: ['iife'],
    dts: false,
    splitting: false,
    noExternal: ['lodash-es'],
    clean: false, // Don't clean, we want to keep ESM/CJS builds
    tsconfig: 'tsconfig.json',
    globalName: 'baseToolsTS',
  },
  {
    entry: {
      'base-tools-web.umd': 'src/web/index.ts',
    },
    outDir: 'dist/web',
    format: ['iife'],
    dts: false,
    splitting: false,
    clean: false, // Don't clean, we want to keep ESM/CJS builds
    tsconfig: 'tsconfig.json',
    globalName: 'baseToolsWeb',
  },
]);
