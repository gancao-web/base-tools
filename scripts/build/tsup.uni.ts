import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/uni/index.ts'],
  outDir: 'dist/uni',
  format: ['esm', 'cjs'],
  sourcemap: true,
  dts: true,
  splitting: false,
  clean: true,
  // vue2+webpack默认不编译node_modules的es6, 需对'es-toolkit'进行打包转义es5 (无需在npm的dependencies声明依赖,因为不对外暴露es-toolkit的函数)
  noExternal: ['es-toolkit'],
  target: 'es2015',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  tsconfig: 'tsconfig.build.json',
});
