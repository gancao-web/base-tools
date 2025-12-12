# request

基础请求 (返回promise和task对象)。

> 需在入口文件初始化应用配置 `setAppConfig({ pathLogin, log })`

## 示例

```ts
import { request } from '@base-web-kits/base-tools-uni';
import type { RequestParams, RequestConfig } from '@base-web-kits/base-tools-uni';

// 封装项目的基础请求
export function requestApi<T>(config: RequestConfig) {
  return request<T>({
    header: { token: 'xx', version: 'xx', tid: 'xx' }, // 会自动过滤空值
    // responseInterceptor: (res) => res, // 响应拦截，可预处理响应数据，如解密 (可选)
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

// 2. 基于上面 requestApi 的流式接口
export function apiChatStream(data: { question: string }) {
  return requestApi<T>({
    url: '/sse/chatStream',
    data,
    resKey: false,
    showLoading: false,
    responseType: 'arraybuffer',
    enableChunked: true,
  });
}

const { task } = apiChatStream({ question: '你好' }); // 发起流式请求

task.onProgressUpdate((res) => {
  console.log('ArrayBuffer', res.data); // 接收流式数据
});

task.offChunkReceived(); // 取消监听,中断流式接收 (调用时机:流式结束,组件销毁,页面关闭)
task.abort(); // 取消请求 (若流式已生成,此时abort无效,因为请求已经成功)
```

### RequestConfig

`RequestConfig` 继承自 `Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'>`，额外包含以下属性：

- `resKey: string | false` - 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据
- `msgKey: string` - 接口返回响应消息的字段, 支持"a[0].b.c"的格式
- `codeKey: string` - 接口返回响应状态码的字段, 支持"a[0].b.c"的格式
- `successCode: (number | string)[]` - 成功状态码列表
- `reloginCode: (number | string)[]` - 登录过期状态码列表
- `responseInterceptor?: (data: any) => any` - 响应拦截，可预处理响应数据 (如解密)
- `showLoading?: boolean` - 是否显示进度条，默认 `true`
- `toastError?: boolean` - 是否提示接口异常，默认 `true`
- `isLog?: boolean` - 是否输出日志，默认 `true`
- `cacheTime?: number` - 缓存时间，默认 `0` 不缓存 (单位毫秒)
- `extraLog?: Record<string, unknown>` - 额外输出的日志数据

## 返回值

`Promise<T> & { task?: UniApp.RequestTask }`

## 版本

- 1.0.2 新增
