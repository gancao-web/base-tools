# Base Tools React Lookup

React 组件逻辑或 hooks 先查本包，再补查 `base-tools-ts` 和 `base-tools-web`。

按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。
遇到第三方 re-export 未命中时，再读对应的完整第三方索引文件。

| 需求 / 关键词 | 优先推荐 | 说明 |
| :-- | :-- | :-- |
| 元素尺寸监听 | `useMeasure` 或 `useSize` | `useMeasure` 是本包封装；`useSize` 来自 ahooks re-export。 |
| 倒计时 | `useCountDown` | 来自 ahooks re-export。 |
| 请求状态管理 | `useRequest` | 来自 ahooks re-export。 |
| 防抖 / 节流 | `useDebounceFn`、`useThrottleFn`、`withDebounce` | hooks 场景优先用 ahooks，组件包装可用 HOC。 |
| 点击外部 | `useClickAway` | 来自 ahooks re-export。 |
| 事件监听 | `useEventListener`、`useKeyPress` | 来自 ahooks re-export。 |
| 本地存储状态 | `useLocalStorageState`、`useSessionStorageState`、`useCookieState` | 来自 ahooks re-export。 |
| 加载态包装组件 | `withLoading`、`withSkeleton`、`withSuspense` | 组件级状态包装。 |
| 错误边界 | `withErrorBoundary`、`ErrorBoundary`、`withAsyncBoundary` | 组件异常捕获和异步边界。 |
| memo / ref / displayName | `withMemo`、`withForwardRef`、`withDisplayName` | 组件性能和类型包装。 |
