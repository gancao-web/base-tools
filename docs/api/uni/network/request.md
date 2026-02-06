# request

基础请求 (返回promise和task对象)。

> 需在入口文件初始化应用配置 `setBaseToolsConfig({ pathLogin, log })`

## 示例

```ts
import { request } from '@base-web-kits/base-tools-uni';
import type { RequestData, RequestConfig } from '@base-web-kits/base-tools-uni';

// 封装项目的基础请求
export function requestApi<T>(config: RequestConfig) {
  return request<T>({
    header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
    // resMap: (res) => res, // 响应数据的转换, 如解密操作 (可选)
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
- `resMap?: (data: any) => any` - 响应数据的转换, 如解密操作
- `showLoading?: boolean` - 是否显示进度条，默认 `true`
- `toastError?: boolean` - 是否提示接口异常，默认 `true`
- `showLog?: boolean` - 是否输出日志，默认 `true`
- `cacheTime?: number` - 缓存时间，默认 `0` 不缓存 (单位毫秒)
- `extraLog?: Record<string, unknown>` - 额外输出的日志数据

## 返回值

`Promise<T> & { task?: UniApp.RequestTask }`

## 版本

- 1.0.2 新增
