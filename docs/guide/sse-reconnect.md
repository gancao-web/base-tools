# SSE 自动重连

Web 与 uni 的 `request` 共用以下配置。默认关闭；仅 `enableChunked: true` 且设置 `reconnect` 时启用。普通 HTTP 和未开启重连的 SSE 保持原行为。

```ts
request({
  url: '/executions/123/events',
  method: 'GET',
  enableChunked: true,
  timeout: 0,
  reconnect: true,
  async onMessage(message) {
    await handleMessage(message);
  },
});
```

示例省略项目已有的响应配置。`timeout: 0` 关闭本库每次传输的超时计时器，并非启用重连的强制条件；uni 原生请求仍受宿主平台超时限制。

## 配置

| 配置 | 默认值 | 含义 |
| --- | --- | --- |
| `reconnect` | `false` | `true` 使用默认值，对象覆盖指定选项 |
| `lastEventId` | 空字符串 | 初始协议游标；未传时沿用已有的 `Last-Event-ID` 请求头 |
| `onSseStateChange` | 无 | 接收状态对象；观察器异常被隔离 |

`reconnect` 对象支持：

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `maxRetries` | `5` | 连续失败的额外重试次数，不包含首次连接 |
| `initialDelay` | `1000` | 基础重试等待毫秒数，至少为 1 |
| `maxDelay` | `30000` | 等待上限，不小于 initialDelay，不超过宿主定时器上限 |
| `backoffFactor` | `2` | 指数退避倍率，至少为 1 |
| `jitter` | `0.2` | 随机扰动比例，范围 0～1；最终等待限幅且至少为 1ms |
| `onEof` | `false` | 正常 EOF 是否重新订阅 |
| `respectServerRetry` | `true` | 使用协议 retry 作为基础等待，再应用退避和扰动 |
| `allowReplay` | `false` | 非 GET 自动重发的显式安全声明 |
| `shouldReconnect` | 无 | 可异步返回 boolean，覆盖默认错误判断 |

收到 HTTP 200 或心跳不重置连续失败次数；成功处理一条数据事件才清零。因此 maxRetries 不是整段订阅的累计重试上限。连续空 EOF 会消耗预算。

状态依次可能为 `connecting`、`connected`、`reconnecting`，最终为 `completed`、`failed` 或 `aborted`。状态对象包含 `attempt`（实际连接次数）、`lastEventId`；重连时还包含 `delay` 和错误 `context`。

## 错误与重试

默认重试网络异常及 HTTP 408、429、500、502、503、504。正常 EOF 默认 resolve，设置 `onEof: true` 后才进入恢复策略。HTTP 204 正常停止，无需 SSE Content-Type。权限错误、无效响应和超时默认停止。

`shouldReconnect(context)` 接收 `reason`、`error`、`httpStatus`、`attempt`、`retry`、`lastEventId`、`defaultRetry`。`reason` 为 network/http/timeout/eof/response；retry 从 1 开始。返回 true/false 覆盖默认判断，抛错或返回非 boolean 会结束订阅。预算已耗尽、主动终止、准备失败、消息处理失败及不支持的平台不调用该钩子。

有效的 Retry-After 是等待下限；超过 maxDelay 时结束并保留原因，不会提前重发。协议 retry 只接受非负十进制安全整数，跨连接保留；0 仍应用最小 1ms 等待。超时按每次传输计时，重试等待不计入，不新增整段订阅超时。Fetch 读取背压期间传输计时器仍有效。

最终失败才触发公共提示、登录处理及一条结束日志；日志包含 attemptCount，复用现有脱敏配置。状态观察器可用于连接状态展示，不应承担必须成功的业务处理。

## 游标和异步处理

服务端应发送标准协议 ID：

```text
id: 102
event: progress
data: {"text":"处理中"}

```

完整事件按顺序调用并等待 onMessage，成功返回后才提交协议 ID。JSON 中的 id 不影响续传游标。没有 id 保持原值；空 id 清空游标并移除后续请求的旧头。id-only/retry-only 控制帧也按接收顺序处理。异常或正常 EOF 都不会把缺少空行边界的尾帧作为消息交付。

重连模式使用严格完整帧解析，支持 LF、CRLF、CR、UTF-8 跨块解码和空 data 事件；独立 SSEParser 和旧 SSE 的兼容行为不变。

`onTaskReady` 只调用一次，稳定 task 控制整个逻辑订阅。`task.lastEventId` 在重连模式下提供已确认游标。原 request Promise 在重连期间 pending，正常 EOF、204 或 complete 时 resolve(undefined)，失败或取消时 reject。

- `abort()`：立即 reject，错误名为 AbortError，取消传输和等待。
- `fail(error, code?)`：立即以原错误 reject，停止订阅。
- `complete()`：立即 resolve，停止订阅。

这三个方法在准备、连接、消息处理和重试等待阶段都有效。首个终态优先；终止后未返回成功的回调不再提交游标，也不再分发排队消息。例如在 onMessage 内调用 complete，当前消息的 ID 不会进入 task.lastEventId。若需要保留最终业务快照，应在终止前由业务完成保存。不要在 onMessage 内等待当前 request Promise。

网络异常后会等待已接受完整事件处理完再重连。超时先停止传输；仅在策略允许且满足重试限制时等待消息处理，再携带最新确认游标恢复。默认超时停止或策略拒绝恢复时立即结束，不等待未完成回调。abort/fail/complete 可以打断排空等待。工具库不能撤销正在执行的业务回调所产生的副作用。消息回调失败直接结束，不自动重放。

## 请求重放和二次封装

建议 POST 创建任务，再 GET 订阅事件。非 GET 开启恢复必须设置 `reconnect: { allowReplay: true }`，否则发送前拒绝。声明不创造服务端幂等性；稳定操作 ID、幂等键和补发能力由调用方与服务端保证。原始请求体或转换结果为一次性 ReadableStream 时拒绝重放。

每次尝试都重新执行 transformRequest，使用独立的原始参数副本，避免重复加密或转换；协议游标在转换后统一注入并去除大小写重复头。工具库不识别任何业务 token 或签名。动态凭证和签名应由二次封装放入每次尝试的转换钩子；在外层一次性生成的配置仍是静态值。

采用配置展开和类型继承的二次封装可透传新字段；白名单封装需要自行补充。跨域 Fetch 还需服务端允许 Last-Event-ID 请求头，并暴露需要读取的 Retry-After 响应头。

## 平台与资源边界

Web 和 uni H5 使用 Fetch，按块等待消息处理，以读取背压限制积压。uni H5 保留稳定的响应头监听能力；原生传输保留跨重连的响应头和分块监听器。

uni 非 H5 需要宿主提供 onChunkReceived/offChunkReceived、onHeadersReceived/offHeadersReceived，并在分块到达前交付响应头和 HTTP 状态码。不具备这些能力时明确失败；不静默转成普通请求。不同宿主和版本的支持不同，不能只根据 enableChunked 参数推断可用性。该限制只作用于新重连模式。

原生推送式传输不能暂停上游。严格解析器对未完成帧及待处理帧合计限制为 1,048,576 个 UTF-16 单元，超限直接结束，不丢帧后继续提交游标。此上限也约束 Fetch 路径中的超大单帧。各端实际宿主行为仍需在目标环境联调。

刷新后可以从业务快照恢复 lastEventId，快照必须对应同一执行和已恢复的历史展示。库只维护本次订阅内存状态，不持久化、不按 URL 共享。重放仍可能产生重复事件，业务负责去重和副作用；不保证 exactly-once。
