## 第三方库的 re-export 说明

- 为了丰富工具库,会对常用第三方库全量 re-export, 如 es-toolkit, vueuse, ahooks 等
- 工具库本身很多地方也用到这些第三方库, 比如 es-toolkit 中的函数
- 为了解决vue2+webpack不支持es6模块的问题, 会对这些第三方库进行打包, 并转译为 es2015 版本 (在'scripts/build/tsup.xx.ts'中配置noExternal和target)
- 为了提供类型提示, 会在 npm 包 package.json 的 `dependencies` 中声明这些第三方库的版本, 仅提供类型资源
- 为了收敛依赖版本, 会对这些第三方库进行版本锁定
- docs目录已包含这些第三方库的使用说明,以实现一站式搜索
- 升级第三方库, 先更新根目录的package.json版本, 然后npm install, 然后 npm run build, 然后发npm包
- 更新第三方库的文档,先运行npm run update:xx, 此时会在re-export目录产生git diff, 查看diff就能知道新增的函数, 从而更新docs文档
- web和uni目录使用ts目录下的函数,需使用相对路径引入到具体的包, 如 `import { toDayjs } from '../../ts/day'`, 并在`tsup`中配置`dts: true`,确保构建的时候把源码打进来,不产生相互依赖关系
- web和uni目录如果使用ts目录的re-export函数, 需要配置tsup的noExternal, 如 `noExternal: ['es-toolkit']`, 否则不会转义es5, 但是这样的话, 会导致构建出来的js文件体积很大, 因为会把es-toolkit的所有函数都打包进来. 所以建议直接引用es-toolkit的函数, 如 `import { pickBy } from 'es-toolkit'`, 当然noExternal也要配置, 因为vue2+webpack默认不编译node_modules的es6
- 注意构建的node版本最低18, 否则会报错
