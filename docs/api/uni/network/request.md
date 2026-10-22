# request

基础请求 (返回promise和task对象)。

> 需在入口文件初始化应用配置 `setBaseToolsConfig({ pathLogin, log })`

## 示例

```ts
import { request } from '@base-web-kits/base-tools-uni';
import type { RequestConfig } from '@base-web-kits/base-tools-uni';

// 封装项目的基础请求
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
  });
}

// 1. 基于上面 requestApi 的普通接口
export function apiGoodList(data: { page: number; size: number }) {
  return requestApi<GoodItem[]>({ url: '/goods/list', data, resKey: 'data.list' });
}

const goodList = await apiGoodList({ page: 1, size: 10 });

// 2. 参数支持泛型
export function apiGoodList(config: RequestConfig<{ page: number; size: number }>) {
  return requestApi<GoodItem[]>({ url: '/goods/list', resKey: 'data.list', ...config });
}

const goodList = await apiGoodList({ data: { page: 1, size: 10 } });

// 3. 基于上面 requestApi 的流式接口
export function apiChatStream(config: RequestConfig<ChatData>) {
  return requestApi({
    ...config,
    url: '/sse/chatStream',
    resKey: false,
    showLoading: false,
    responseType: 'arraybuffer', // 流式响应类型
    enableChunked: true, // 开启分块传输
  });
}

// 发送的消息类型
type ChatData = { content: string; conversationId: number };

// 初始化请求对象
let chatTask: RequestTask;
const onTaskReady = (task: RequestTask) => {
  chatTask = task;
};

// 流式监听
const onMessage = (msg: SSEMessage) => {
  console.log(msg);
  // 流式传输结束
  // if (msg.type === 'DONE') { }

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

### RequestConfig

`RequestConfig` 继承自 `Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'>`，额外包含以下属性：

- `resKey: string | false` - 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据
- `msgKey: string` - 接口返回响应消息的字段, 支持"a[0].b.c"的格式
- `codeKey: string` - 接口返回响应状态码的字段, 支持"a[0].b.c"的格式
- `successKey?: string` - 接口返回成功状态码的字段, 支持"a[0].b.c"的格式 (默认取 codeKey)
- `successCode: (number | string)[]` - 成功状态码列表
- `reloginCode: (number | string)[]` - 登录过期状态码列表
- `transformRequest?: (ctx: { url: string; method?: string; header: Record<string, string | number | boolean>; data?: D }) => Partial<{ url: string; header: Record<string, string | number | boolean>; data?: D }> | Promise<...>` - 请求前的数据转换, 可用于加密 `header`、`data` 或重写 `url`
- `transformResponse?: (data: any) => any` - 响应数据的转换, 如解密操作
- `showLoading?: boolean | string` - 是否显示进度条，默认 `true`，支持字符串自定义文案
- `toastError?: boolean` - 是否提示接口异常，默认 `true`
- `showLog?: boolean` - 是否输出日志，默认 `true`
- `cacheTime?: number` - 缓存时间，默认 `0` 不缓存 (单位毫秒)
- `logExtra?: Record<string, unknown>` - 额外输出的日志数据

## 返回值

`Promise<T>`

## 请求日志（1.7.0）

继续通过 `setBaseToolsConfig({ log })` 接收请求结束日志，单次调用使用 `showLog` 控制。普通 HTTP 调用在业务结果判断及结果提取完成后输出一次结束日志；日志和 UI 回调的同步异常、异步拒绝不覆盖已确定的请求结果。

### 字段含义

保留 name、status、url、method、data、header、res、e、fromCache 和 logExtra。`res` 通常是执行 transformResponse 后、按 resKey 提取业务结果前的完整正文；若 transformResponse 抛错，则保留宿主传入转换函数的正文。`e` 中的 Error 转换为包含 name/message/stack 的普通对象，并递归记录标准 Error.cause；循环的 Error.cause 用 `[Circular error cause]` 截断，非 Error 值保持原值。reject 仍传递原始异常，不使用日志序列化结果。

开启 toastError 时，普通响应处理异常使用 Error.message 生成“请求失败: 错误信息”提示，不将 cause 或响应正文展示给用户。封装库可抛出 `new Error('响应处理失败', { cause: originalError })`，分别提供用户提示和日志中的原始原因；工具库不根据提示文字或异常类型推断业务专有分类。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| success | `boolean` | 按现有 successCode/successKey 等规则处理成功，且完成结果提取；业务失败、掉登或处理异常为 false |
| businessCode | `string \| number`，可选 | 从转换后的响应按 codeKey 读取，不等同于 successKey，也不保证是未经转换的服务端原码 |
| httpStatus | `number`，可选 | 实际收到的 HTTP 状态，独立于业务结果 |
| responseHeader | `Record<string, unknown>`，可选 | 实际取得的响应头；Web 受浏览器权限限制，uni 以宿主提供的值为准 |
| failureStage | `RequestFailureStage`，可选 | prepare、network、http、response、business |
| failureCode | `RequestFailureCode`，可选 | 明确取得的失败原因，见下表 |
| startTimeMs / endTimeMs | `number`，可选 | 实际发送前、正文接收完成或传输失败通知时的 Unix 毫秒时间戳 |
| startTime / endTime | `string`，可选 | 对应数字时间戳的可读时间，格式 YYYY-MM-DD HH:mm:ss.SSS，使用 dateFormat 的运行环境时区 |
| duration | `number`，可选 | 传输耗时，单位毫秒，优先使用单调时钟，可含小数，不保证等于 endTimeMs - startTimeMs |

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

避免在请求完成前提前展开或序列化 logExtra；showLog: false 或未配置 log 时，工具库不读取这些 getter。调用方覆盖 success、失败分类等默认字段时，需要自行保证含义一致。

## 版本

- 1.7.0 增强普通 HTTP 结束日志，新增业务结果、HTTP 信息和失败分类；时间字段改为传输口径，详见升级说明。
- 1.0.2 新增
