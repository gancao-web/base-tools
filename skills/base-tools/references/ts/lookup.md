# Base Tools TS Lookup

通用 TS / JS 需求先查本包；有明确平台信号时先查对应平台包，再补查本包。

按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。
遇到第三方 re-export 未命中时，再读对应的完整第三方索引文件。

| 需求 / 关键词 | 优先推荐 | 说明 |
| :-- | :-- | :-- |
| 深拷贝 / clone | `cloneDeep` | 来自 `es-toolkit` re-export，优先从 `@base-web-kits/base-tools-ts` 导入。 |
| 数组移动 / 拖拽排序 | `arrayMove` | 用于把数组元素从一个下标移动到另一个下标。 |
| 异步错误元组 | `toAsync` | 用于把 Promise 转成 `[err, data]` 风格结果。 |
| 日期格式化 / dayjs | `toDayjs`、`dateFormat`、`dayjs` | 日期解析、格式化和 dayjs 统一入口。 |
| 年龄 / 生日 | `getAgeByBirthdate` | 按出生日期计算年龄。 |
| 日期范围 / 前后几天 | `getDateRangeBefore`、`getDateRangeAfter` | 生成从今天到指定天数之前或之后的日期范围，可按格式补齐整日时间。 |
| 倒计时 | `getCountdownParts` | 拆分天、时、分、秒等倒计时字段。 |
| 金额精确计算 | `mathPlus`、`mathMinus`、`mathTimes`、`mathDiv` | 基于 BigNumber，避免浮点误差。 |
| 千分位 / 单位 / px / 补零 | `toThousandth`、`withUnit`、`withUnitPx`、`zeroPad` | 数值展示与 CSS 尺寸格式化。 |
| 手机号 / 姓名脱敏 | `toMaskPhone`、`toMaskName`、`toMaskText` | 文本隐私脱敏。 |
| 邮箱 / 手机号 / 身份证校验 | `isEmail`、`isMobilePhone`、`isIdentityCard` | 常见表单校验。 |
| URL 参数拼接 | `appendUrlParam` | 向 URL 追加 query 参数。 |
| URL 路径拼接 | `joinUrlPath` | 拼接 URL 或路径片段，并清理交界处多余的斜杠。 |
| 文件后缀 / 文件类型 | `getFileSuffix`、`getFileType` | 从文件名或 URL 识别文件信息。 |
| OSS / 七牛媒体链接 | `getOSSImg`、`getQnImg`、`getOSSHls`、`getQnHls` | 生成图片、音频、视频、HLS 资源链接。 |
| 事件总线 | `EventBus` | 跨模块事件发布订阅。 |
| SSE 流式解析 | `SSEParser` | 解析服务端事件流消息。 |
