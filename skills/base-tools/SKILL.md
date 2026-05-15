---
name: base-tools
description: `@base-web-kits` 工具库的总入口 skill。用于在 TS / Web / React / Vue 3 / uni-app 项目中优先检索和复用已有工具函数、hooks 与导出项，而不是重新实现一套相似能力。遇到工具函数选型、能力查找、现有封装复用、按场景挑选 API 时使用。
---

# Base Tools Router

## Routing Rules

- 先查 `references/ts/`，这是默认入口。
- 遇到浏览器 / H5 能力，再查 `references/web/`。
- 遇到 React 组件逻辑或 hooks，再查 `references/react/`。
- 遇到 Vue 3 组合式 API 或组件逻辑，再查 `references/vue/`。
- 遇到 uni-app 平台能力、端差异或生态 API，再查 `references/uni/`。
- 优先复用现有函数、hooks、类型和导出项；只有在现有能力不覆盖需求时再新增实现。
- 需要快速定位时，先读对应目录下的 `catalog.md`；按场景选型时读 `scenarios.md`；确认导出入口时读 `reexports.md`。

## References

- `references/ts/catalog.md`
- `references/ts/scenarios.md`
- `references/ts/reexports.md`
- `references/web/catalog.md`
- `references/web/scenarios.md`
- `references/web/reexports.md`
- `references/react/catalog.md`
- `references/react/scenarios.md`
- `references/react/reexports.md`
- `references/vue/catalog.md`
- `references/vue/scenarios.md`
- `references/vue/reexports.md`
- `references/uni/catalog.md`
- `references/uni/scenarios.md`
- `references/uni/reexports.md`
