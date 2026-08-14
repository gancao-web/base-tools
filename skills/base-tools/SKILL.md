---
name: 'base-tools'
description: '检索并复用 base-tools 系列包提供的通用 TS/JS 工具、浏览器与 H5 能力、React Hooks、Vue 组合式函数、uni-app 能力及其公共类型。仅当任务准备新增或选用可跨业务复用的上述能力时触发；普通业务组件、页面交互、业务流程、领域模型或类型，以及仅使用语言基础语法的修改不触发。'
---

# Base Tools Router

## Applicability

- 先判断任务是否需要可跨业务复用的基础能力；不要仅因项目使用 TS、Web、React、Vue 或 uni-app 就触发本 skill。
- 普通业务组件、页面交互、业务流程、领域模型或类型、接口字段映射和一次性局部逻辑不属于本 skill；其中确实需要日期、金额、URL、存储、防抖、请求状态等通用能力时，只针对该通用能力执行后续检索。

## Routing Rules

- 可跨业务复用的通用 TS / JS 工具需求，先查 `references/ts/`。
- web 项目仅允许查 `references/web/`、`references/ts/`，以及与当前框架匹配的目录。
- web + React 项目需要可复用 Hooks 或组件基础设施时，先查 `references/react/`，再补查 `references/web/` 和 `references/ts/`。
- web + Vue 3 项目需要可复用组合式函数或组件基础设施时，先查 `references/vue/`，再补查 `references/web/` 和 `references/ts/`。
- uni-app 项目仅允许查 `references/uni/` 和 `references/ts/`，除非当前场景存在明确的 web 平台信号，才允许补查 `references/web/`。
- 优先复用现有函数、hooks、类型和导出项；只有在现有能力不覆盖需求时再新增实现。
- 需要快速定位时，先读对应目录下的 `lookup.md`；命中候选 API 后，再读 `catalog.md` 确认真实导出。
- 第三方 re-export 未命中时，再读对应目录下的第三方索引文件。
- 无论何种方式命中候选 API，决定复用前，均需继续阅读源码或类型定义，确认其行为与当前业务一致。

## References

- [`references/ts/catalog.md`](references/ts/catalog.md)
- [`references/ts/lookup.md`](references/ts/lookup.md)
- [`references/ts/es-toolkit.md`](references/ts/es-toolkit.md)
- [`references/web/catalog.md`](references/web/catalog.md)
- [`references/web/lookup.md`](references/web/lookup.md)
- [`references/react/catalog.md`](references/react/catalog.md)
- [`references/react/lookup.md`](references/react/lookup.md)
- [`references/react/ahooks.md`](references/react/ahooks.md)
- [`references/vue/catalog.md`](references/vue/catalog.md)
- [`references/vue/lookup.md`](references/vue/lookup.md)
- [`references/vue/vueuse.md`](references/vue/vueuse.md)
- [`references/uni/catalog.md`](references/uni/catalog.md)
- [`references/uni/lookup.md`](references/uni/lookup.md)

## Feedback

当出现未命中、不匹配、扩展性不足、明显缺陷或能力缺失时，应主动触发反馈流程。

- 问题分类、触发条件、询问话术、反馈模板和提交流程见 [`references/feedback.md`](references/feedback.md)。
