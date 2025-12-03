import { defineConfig } from 'tsup';

export default defineConfig([
  // TypeScript utilities - with both ESM and CJS for TS 4.x compatibility
  {
    entry: ['src/ts/index.ts'],
    outDir: 'dist/ts',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    noExternal: ['lodash-es'],
    clean: true,
    tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
  },
  // Uni-app utilities
  {
    entry: ['src/uni/index.ts'],
    outDir: 'dist/uni',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    clean: true,
    tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
  },
  // Web utilities
  {
    entry: ['src/web/index.ts'],
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    clean: true,
    tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
  },
  // React utilities
  {
    entry: ['src/react/index.ts'],
    outDir: 'dist/react',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    noExternal: ['ahooks'],
    clean: true,
    tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
  },
  // Vue utilities
  {
    entry: ['src/vue/index.ts'],
    outDir: 'dist/vue',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    noExternal: ['@vueuse/core'],
    clean: true,
    tsconfig: 'tsconfig.build.json', // 使用专门的构建配置
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
    tsconfig: 'tsconfig.build.json',
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
    tsconfig: 'tsconfig.build.json',
    globalName: 'baseToolsWeb',
  },
]);
