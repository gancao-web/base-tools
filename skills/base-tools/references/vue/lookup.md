# Base Tools Vue Lookup

Vue 3 组合式 API 或组件逻辑先查本包，再补查 `base-tools-ts` 和 `base-tools-web`。

按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。
遇到第三方 re-export 未命中时，再读对应的完整第三方索引文件。

| 需求 / 关键词 | 优先推荐 | 说明 |
| :-- | :-- | :-- |
| 点击外部 | `onClickOutside` 或 `vClickOutside` | `onClickOutside` 来自 @vueuse/core re-export；模板指令场景用 `vClickOutside`。 |
| 元素尺寸监听 | `useElementSize`、`useResizeObserver` | 来自 @vueuse/core re-export。 |
| 窗口尺寸 / 滚动 | `useWindowSize`、`useWindowScroll` | 来自 @vueuse/core re-export。 |
| 防抖 / 节流 | `useDebounceFn`、`useThrottleFn`、`watchDebounced`、`watchThrottled` | 来自 @vueuse/core re-export。 |
| 剪贴板 | `useClipboard` | 来自 @vueuse/core re-export。 |
| 本地存储 | `useLocalStorage`、`useSessionStorage`、`useStorage` | 来自 @vueuse/core re-export。 |
| 深色模式 / 媒体查询 | `useDark`、`useColorMode`、`useMediaQuery` | 来自 @vueuse/core re-export。 |
| 聚焦 | `vFocus` 或 `useFocus` | 模板指令场景用 `vFocus`；组合式场景用 `useFocus`。 |
| 懒加载图片 | `vLazy` | 模板指令场景使用。 |
| 长按 | `vLongpress` | 模板指令场景使用。 |
