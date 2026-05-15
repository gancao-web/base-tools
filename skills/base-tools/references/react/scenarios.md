# Base Tools React Scenarios

优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。

- Hook 组合: 先看 `hooks` 模块，优先复用现成 hooks，避免重复写状态 / 监听 / 请求逻辑。
- HOC / 包装器: 先看 `hoc` 模块，优先复用 memo、loading、error boundary、forwardRef、debounce。
- 第三方 hooks: `ahooks` 为全量 re-export，先把它当统一入口，再回到本包找封装或约束。
