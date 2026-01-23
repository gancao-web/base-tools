# request

基础请求方法，基于 fetch API 封装，支持流式请求、缓存、拦截器、字段属性等功能。

## 示例

```typescript
import { setBaseToolsConfig, request, RequestConfig } from '@base-web-kits/base-tools-web';

// 1. 在入口文件完成配置 (确保请求失败有toast提示,登录过期能够触发重新登录,log有日志输出)
setBaseToolsConfig({
  toast: ({ msg, status }) => (status === 'fail' ? message.error(msg) : message.success(msg)),
  showLoading: () => message.loading('加载中...'),
  hideLoading: () => message.destroy(),
  toLogin: () => reLogin(),
  log(level, data) {
    if (data.name === 'request') {
      sendLog('request', data); // 请求日志
    } else if (level === 'error') {
      sendLog('error', data); // 错误日志
    } else {
      sendLog('action', data); // 操作日志
    }
  },
});

// 2. 封装项目的基础请求
export function requestApi<T>(config: RequestConfig) {
  return request<T>({
    header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
    // resMap: (res) => res, // 响应拦截 (可选)
    resKey: 'data',
    msgKey: 'message',
    codeKey: 'status',
    successCode: [1],
    reloginCode: [-10],
    ...config,
  });
}

// 3. 基于上面 requestApi 普通接口请求

// 方式一：直接传参
export function apiGoodList(data: { page: number; size: number }) {
  return requestApi<GoodItem[]>({ url: '/goods/list', data, resKey: 'data.list' });
}

// 方式二：参数泛型写法 (推荐，更灵活)
export function apiGoodList(config: RequestConfig<{ page: number; size: number }>) {
  return requestApi<GoodItem[]>({ url: '/goods/list', resKey: 'data.list', ...config });
}

// 调用
const goodList = await apiGoodList({ data: { page: 1, size: 10 } });

// 4. 基于上面 requestApi 流式请求 (SSE)
export function apiChatStream(data: { question: string }) {
  return requestApi<void>({
    url: '/sse/chatStream',
    data,
    resKey: false,
    showLoading: false,
    responseType: 'arraybuffer',
    enableChunked: true,
  });
}

const { task } = apiChatStream({ question: '你好' }); // 发起流式请求

// 监听数据接收
task.onChunkReceived((res) => {
  console.log('ArrayBuffer', res.data); // 接收流式数据
});

// 取消监听 (流式结束、组件销毁或页面关闭时调用)
task.offChunkReceived();

// 取消请求 (中断流并抛出异常)
task.abort();
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
| resKey | `string \| false` | 是 | - | 接口返回响应数据的字段，支持 "a[0].b.c" 格式，false 返回完整响应 |
| msgKey | `string` | 是 | - | 接口返回响应消息的字段 |
| codeKey | `string` | 是 | - | 接口返回响应状态码的字段 |
| successKey | `string` | 否 | - | 接口返回成功状态码的字段 (默认取 codeKey) |
| successCode | `(number \| string)[]` | 是 | - | 成功状态码列表 |
| reloginCode | `(number \| string)[]` | 是 | - | 登录过期状态码列表 |
| showLoading | `boolean` | 否 | `true` | 是否显示进度条 |
| toastError | `boolean` | 否 | `true` | 是否提示接口异常 |
| showLog | `boolean` | 否 | `true` | 是否输出日志 |
| extraLog | `Record<string, unknown>` | 否 | - | 额外输出的日志数据 |
| cacheTime | `number` | 否 | `0` | 响应数据的缓存时间 (毫秒)，仅成功时缓存，内存缓存 |
| enableChunked | `boolean` | 否 | `false` | 是否开启流式传输 (如 SSE) |
| responseType | `'text' \| 'arraybuffer' \| 'json'` | 否 | `'json'` | 响应类型 |
| resMap | `(data: unknown) => unknown` | 否 | - | 响应拦截函数 |

**返回值**

返回一个 Promise 对象，该 Promise 对象附加了一个类型为`RequestTask`的`task`属性，用于控制请求（如取消请求）。

### RequestTask

请求任务对象，用于取消请求或监听流式数据。

```typescript
interface RequestTask {
  /** 取消请求 */
  abort: () => void;
  /** 监听流式数据块接收事件 */
  onChunkReceived: (callback: ChunkCallback) => void;
  /** 取消监听流式数据块接收事件 */
  offChunkReceived: () => void;
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

## 版本

- 1.1.2 新增
