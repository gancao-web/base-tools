# Base Tools TS Scenarios

优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。

- 通用逻辑 / 数据转换: 先看 `catalog.md` 里的 `array`、`object`、`string`、`number`、`async`。
- 日期 / 时间: 先看 `day` 模块，以及 `toDayjs` / 日期范围 / 倒计时相关工具。
- 校验 / 表单: 先看 `validator` 模块，优先复用现成校验函数。
- URL / 文件: 先看 `url` 模块，优先复用参数拼接、文件后缀、OSS 链接相关工具。
- 异步 / 事件: 先看 `async`、`bean`、`buffer` 模块，优先复用 `toAsync`、`EventBus`、`SSEParser` 一类能力。
- 数值 / 金额: 先看 `number` 模块，优先复用格式化、运算、金额转换能力。
