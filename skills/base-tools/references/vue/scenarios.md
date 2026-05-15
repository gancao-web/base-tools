# Base Tools Vue Scenarios

优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。

- 组合式 API: 先看 `hooks` 模块，优先复用现成组合式能力。
- 自定义指令: 先看 `directives` 模块，优先复用点击外部、聚焦、懒加载、长按等指令。
- 第三方 hooks: `@vueuse/core` 为全量 re-export，先把它当统一入口，再回到本包找封装或约束。
