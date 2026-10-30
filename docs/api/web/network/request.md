# request

基础请求方法，基于 fetch API 封装，支持流式请求、缓存、请求前转换、响应数据转换等功能。

## 示例

```typescript
import { setBaseToolsConfig, request } from '@base-web-kits/base-tools-web';
import type { RequestConfig, RequestTask, SSEMessage } from '@base-web-kits/base-tools-web';

// 1. 在入口文件完成配置 (确保请求失败有toast提示,登录过期能够触发重新登录,log有日志输出)
setBaseToolsConfig({
  toast: ({ msg, status }) => (status === 'fail' ? message.error(msg) : message.success(msg)),
  showLoading: () => message.loading('加载中...'),
  hideLoading: () => message.destroy(),
  toLogin: () => reLogin(),
  log(level, data) {
    if (level === 'error') {
      sendLog('error', data); // 错误日志
    } else if (data.name === 'request') {
      sendLog('request', data); // 请求日志
    } else {
      sendLog('xx', data); // 其他日志
    }
  },
});

// 2. 封装项目的基础请求
const HOST = 'https://api.example.com';

export function requestApi<T>(config: RequestConfig) {
  return request<T>({
    header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
    // transformRequest: ({ header, data }) => ({ header, data }), // 请求前转换, 如加密请求头和请求参数 (可选)
    // transformResponse: (res) => res, // 响应数据的转换, 如解密操作 (可选)
    resKey: 'data',
    msgKey: 'message',
    codeKey: 'status',
    successCode: [1],
    reloginCode: [-10],
    ...config,
    url: `${HOST}${config.url}`,
  });
}

// 3. 基于上面 requestApi 普通接口请求

type GoodItem = { id: number; name: string };

// 方式一：直接传参
export function apiGoodList(data: { page: number; size: number }) {
  return requestApi<GoodItem[]>({ url: '/goods/list', data, resKey: 'data.list' });
}

// 方式二：参数泛型写法
export function apiGoodList(config: RequestConfig<{ page: number; size: number }>) {
  return requestApi<GoodItem[]>({
    url: '/goods/list',
    resKey: 'data.list',
    ...config,
  });
}

// 调用
const goodList = await apiGoodList({ data: { page: 1, size: 10 } });

// 4. 基于上面 requestApi 流式请求 (SSE)
export function apiChatStream(config: RequestConfig<ChatData>) {
  return requestApi({
    ...config,
    url: '/sse/chatStream',
    resKey: false,
    showLoading: false,
    enableChunked: true, // 开启分块传输
  });
}

// 发送的消息类型
type ChatData = { content: string; conversationId: number };

// 可选：需要取消或提前结束时保存任务；只接收消息可省略 onTaskReady。
let chatTask: RequestTask | undefined;
const onTaskReady = (task: RequestTask) => {
  chatTask = task;
};

// 流式监听
const onMessage = (msg: SSEMessage) => {
  console.log(msg);
  // 消息处理代码抛错时，工具会自动终止流并向上传递异常。
  // 可选：当确认业务结束、希望提前关闭连接时，可调用 chatTask?.complete()。
  // 可选：当确认业务失败时、希望提前关闭连接时，可调用 chatTask?.fail(error, businessCode)。
  // 不调用也可以，默认等服务端关闭连接即可。

  // 思考中
  // if (msg.type === 'thinking') { }

  // 各种消息类型
  // if (msg.type === 'xx') {  }
};

// 流式发起
const data = { content: '你好', conversationId: 123 };
apiChatStream({ data, onTaskReady, onMessage });

// 流式取消 (在组件销毁或页面关闭时调用)
chatTask?.abort();
```

### RequestConfigBase

基础请求配置对象（接口字段参数必填）。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| url | `string` | 是 | - | 接口地址 |
| method | `RequestMethod` | 否 | `'GET'` | 请求方法 (`'GET' \| 'POST' \| 'PUT' \| 'DELETE'` 等) |
| header | `Record<string, string>` | 否 | - | 请求头 (会自动过滤undefined, null, "";不过滤0和false; 数字和布尔值会自动转换为字符串) |
| data | `D` | 否 | - | 请求参数 |
| timeout | `number` | 否 | `60000` | 超时时间 (毫秒) |
| fetchOptions | `Omit<RequestInit, 'method' \| 'headers' \| 'body' \| 'signal'>` | 否 | - | 额外的原生 Fetch 配置；核心请求参数仍由 `method`、`header`、`data` 和内部取消逻辑控制 |
| resKey | `string \| false` | 是 | - | 接口返回响应数据的字段，支持 "a[0].b.c" 格式，false 返回完整响应 |
| msgKey | `string` | 是 | - | 接口返回响应消息的字段 |
| codeKey | `string` | 是 | - | 接口返回响应状态码的字段 |
| successKey | `string` | 否 | - | 接口返回成功状态码的字段 (默认取 codeKey) |
| successCode | `(number \| string)[]` | 是 | - | 成功状态码列表 |
| reloginCode | `(number \| string)[]` | 是 | - | 登录过期状态码列表 |
| showLoading | `boolean \| string` | 否 | `true` | 是否显示进度条，支持字符串自定义文案 |
| toastError | `boolean` | 否 | `true` | 是否提示接口异常 |
| logExtra | `Record<string, unknown>` | 否 | - | 额外输出的日志数据 |
| cacheTime | `number` | 否 | `0` | 响应数据的缓存时间 (毫秒)，仅成功时缓存，内存缓存 |
| enableChunked | `boolean` | 否 | `false` | 是否开启流式传输 (如 SSE) |
| responseType | `'text' \| 'arraybuffer' \| 'json'` | 否 | `'json'` | 普通请求的响应类型，开启流式请求时忽略 |
| transformRequest | `(ctx: { url: string; method: RequestMethod; header: Record<string, string>; data?: D }) => Partial<{ url: string; header: Record<string, string>; data?: D }> \| Promise<...>` | 否 | - | 请求前的数据转换, 可用于加密 `header`、`data` 或重写 `url` |
| transformResponse | `(data: unknown) => unknown` | 否 | - | 响应数据的转换, 如解密操作 |
| onTaskReady | `(task: RequestTask) => void` | 否 | - | 普通和流式请求使用同一任务类型，可用于取消或提前结束流式请求 |
| onMessage | `MessageCallback` | 否 | - | 接收已完成基础解析的 SSE 消息；使用流式请求时配置 |

### 缓存说明

- `cacheTime > 0` 时仅缓存业务成功的响应，缓存位于内存中，页面刷新后失效。
- 缓存键由转换后的 `url`、`method`、`header`、`data`，以及 `fetchOptions`、`responseType` 共同生成，配置不同的请求不会共用缓存。
- 不建议为包含大段文本、Base64 或其他大体积数据的请求开启缓存。

**返回值**

统一返回 `Promise<T>`，默认 `T = unknown`，不根据 `enableChunked` 区分返回类型。普通请求的 `T` 由调用方声明；接口可能返回 `null` 时，应将其包含在 `T` 中。流式内容通过 `onMessage` 交付，工具不自动累积消息，正常完成时兑现值为 `undefined`；调用方只等待结束、处理失败，不读取结果，也不需要指定 `T`。即使为流式请求指定了 `T`，工具也不会生成该类型的结果。普通和流式请求统一使用 `RequestTask`。

### RequestTask

请求任务对象，提供 `abort()`、`complete()` 和 `fail(error, businessCode?)`，用于主动取消请求和按需控制流式请求。普通请求调用 `complete()`、`fail()` 时无效果。

```typescript
interface RequestTask {
  /** 取消请求 */
  abort: () => void;
  /** 确认业务完成，正常停止流 */
  complete: () => void;
  /** 确认业务失败，以原错误或完整消息结束流 */
  fail: (error: unknown, businessCode?: string | number) => void;
}
```

## 兼容

现代环境（PC/移动）：可放心使用 Fetch，无需 polyfill。  
需兼容老旧系统（如 IE、Android 4.x）：引入 whatwg-fetch 即可

```ts
// 1. 安装:
npm i whatwg-fetch

// 2.在入口文件引入即可：
import 'whatwg-fetch';
```

## 请求日志（2.0.0）

继续通过 `setBaseToolsConfig({ log })` 接收请求结束日志，成功和失败均记录，不再提供单次调用关闭日志的开关。普通 HTTP 调用在业务结果判断及结果提取完成后输出一次结束日志；日志和 UI 回调的同步异常、异步拒绝不覆盖已确定的请求结果。

### 字段含义

保留 name、status、url、method、data、header、res、e、fromCache 和 logExtra。`res` 通常是执行 transformResponse 后、按 resKey 提取业务结果前的完整正文；若 transformResponse 抛错，则保留传入转换函数的正文（Web 为正文读取与解析后的值，不是 HTTP 原始字节）。`e` 中的 Error 转换为包含 name/message/stack 的普通对象，并递归记录标准 Error.cause；循环的 Error.cause 用 `[Circular error cause]` 截断，非 Error 值保持原值。reject 仍传递原始异常，不使用日志序列化结果。

开启 toastError 且配置 toast 时，普通响应处理异常使用 Error.message 生成“请求失败: 错误信息”提示，不将 cause 或响应正文展示给用户。封装库可抛出 `new Error('响应处理失败', { cause: originalError })`，分别提供用户提示和日志中的原始原因；工具库不根据提示文字或异常类型推断业务专有分类。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| success | `boolean` | 按现有 successCode/successKey 等规则处理成功，且完成结果提取；业务失败、掉登或处理异常为 false |
| businessCode | `string \| number`，可选 | 从转换后的响应按 codeKey 读取，不等同于 successKey，也不保证是未经转换的服务端原码 |
| httpStatus | `number`，可选 | 实际收到的 HTTP 状态，独立于业务结果 |
| responseHeader | `Record<string, unknown>`，可选 | 实际取得的响应头；Web 受浏览器权限限制，uni 以宿主提供的值为准 |
| failureStage | `RequestFailureStage`，可选 | prepare、network、http、response、business |
| failureCode | `RequestFailureCode` 或扩展字符串，可选 | 明确取得的失败原因，见下表 |
| networkStartTimeMs / networkEndTimeMs | `number`，可选 | 实际发送前、正文接收完成或传输失败通知时的 Unix 毫秒时间戳 |
| networkStartTime / networkEndTime | `string`，可选 | 网络开始、结束时间，格式 YYYY-MM-DD HH:mm:ss.SSS，使用运行环境时区 |
| networkDurationMs | `number`，可选 | 网络耗时，毫秒，优先使用单调时钟，可含小数，不保证等于时间戳差 |

工具库只提供网络计时，不采集请求总耗时或调用方上下文。调用方自定义字段通过 `logExtra` 传入，工具库不规定其名称或结构。缓存命中、发送前失败时不生成网络计时字段。

Error 及其 cause 序列化时保留实际存在的字符串或数字 `code`；请求 `failureCode` 与异常 `code` 相互独立。

`status` 仍表示调用状态，不等同于 `success`。例如 HTTP 已返回但业务码表示掉登时，仍可能输出 `level: 'info'`、`status: 'success'`，同时 `success: false`、`failureStage: 'business'`、`failureCode: 'login_required'`。HTTP 200 不代表业务成功；HTTP 非 2xx 返回可解析业务正文时，仍沿用已有业务判断规则。

### 失败分类

| failureStage | failureCode                      | 含义                                   |
| ------------ | -------------------------------- | -------------------------------------- |
| prepare      | request_prepare_failed           | 参数过滤、请求转换或编码等准备步骤失败 |
| network      | network_failed                   | 网络调用或正文接收失败                 |
| network      | timeout / aborted                | 明确确认的超时或取消                   |
| http         | http_failed                      | HTTP 错误响应无法按原有流程处理        |
| response     | response_transform_failed        | transformResponse 同步抛错             |
| response     | response_result_failed           | 业务字段读取或结果提取失败             |
| business     | business_failed / login_required | 按既有规则判定业务拒绝或登录失效       |

RequestFailureCode 还包含 response_parse_failed，供能够明确识别解析错误的封装使用；工具库不会根据某个码值推断解析失败。普通成功日志不主动添加失败字段。已取得的 HTTP 状态、响应头和传输时间，在后续响应处理失败时仍保留。

### 附加字段与 getter

logExtra 保留覆盖默认日志字段的行为。工具库在结果确定后、复制响应正文及调用 log 之前合并一次；调用方可使用可枚举 getter 延迟生成自己的字段。需要测量封装耗时时，可结合 [startTimer](../../ts/time/startTimer.md) 使用：

```ts
const logExtra = {
  get completedAtMs() {
    return Date.now();
  },
  tag: 'example',
};

await requestApi({ url: '/items', logExtra });
// completedAtMs 在结束日志组装时读取，而不是在创建对象时读取。
```

避免在请求完成前提前展开或序列化 logExtra；未配置 log 时，工具库不读取这些 getter。调用方覆盖 success、失败分类等默认字段时，需要自行保证含义一致。

## 版本

### 2.0.0 升级说明

网络计时字段统一增加 `network` 前缀，耗时字段明确使用毫秒单位；以下旧字段不再由工具库生成，日志接收方需同步调整：

| 旧字段      | 2.0.0 字段         |
| ----------- | ------------------ |
| startTime   | networkStartTime   |
| endTime     | networkEndTime     |
| startTimeMs | networkStartTimeMs |
| endTimeMs   | networkEndTimeMs   |
| duration    | networkDurationMs  |

同时，日志中的 Error 及其 cause 新增保留字符串或数字 `code`。请求调用方式及 `logExtra` 扩展方式保持不变。

### 历史版本

- 1.7.0 增强普通 HTTP 结束日志，新增业务结果、HTTP 信息和失败分类；时间字段改为传输口径，详见升级说明。
- 1.1.2 新增
