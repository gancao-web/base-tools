---
name: base-tools
description: `@base-web-kits` 工具库的总入口 skill。用于在 TS / Web / React / Vue / uni-app 项目中优先检索和复用已有工具函数、hooks 与导出项，而不是重新实现一套相似能力。遇到工具函数选型、能力查找、现有封装复用、按场景挑选 API 时使用。若出现未命中、不匹配、扩展性不足、明显缺陷或能力缺失，应主动触发反馈流程。
---

# Base Tools Router

## Routing Rules

- 通用 TS / JS 能力，先查 `references/ts/`。
- web 项目仅允许查 `references/web/`、`references/ts/`，以及与当前框架匹配的目录。
- web + React 项目遇到 React 组件逻辑或 hooks，先查 `references/react/`，再补查 `references/web/` 和 `references/ts/`。
- web + Vue 3 项目遇到 Vue 3 组合式 API 或组件逻辑，先查 `references/vue/`，再补查 `references/web/` 和 `references/ts/`。
- uni-app 项目仅允许查 `references/uni/` 和 `references/ts/`, 除非当前场景存在明确的 web 平台信号，才允许补查 `references/web/`。
- 优先复用现有函数、hooks、类型和导出项；只有在现有能力不覆盖需求时再新增实现。
- 需要快速定位时，先读对应目录下的 `lookup.md`；命中候选 API 后，再读 `catalog.md` 确认真实导出。
- 第三方 re-export 未命中时，再读对应目录下的第三方索引文件。

## References

- `references/ts/catalog.md`
- `references/ts/lookup.md`
- `references/ts/es-toolkit.md`
- `references/web/catalog.md`
- `references/web/lookup.md`
- `references/react/catalog.md`
- `references/react/lookup.md`
- `references/react/ahooks.md`
- `references/vue/catalog.md`
- `references/vue/lookup.md`
- `references/vue/vueuse.md`
- `references/uni/catalog.md`
- `references/uni/lookup.md`

## Feedback

当出现未命中、不匹配、扩展性不足、明显缺陷或能力缺失时，应主动触发反馈流程。

- 问题分类、触发条件、询问话术、反馈模板和提交流程见 `references/feedback.md`。
