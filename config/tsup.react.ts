import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/react/index.ts'],
  outDir: 'dist/react',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  target: 'es2015',
  tsconfig: 'tsconfig.build.json',
  // 将re-export的依赖打包进产物中,否则代码会丢失 (dependencies仅提供ts类型提示)
  noExternal: ['ahooks'],
});
