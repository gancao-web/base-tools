# request

基础请求 (返回promise和task对象)。

> 需在入口文件初始化应用配置 `setAppConfig({ pathLogin, log })`

## 示例

```ts
import { request } from '@base-web-kits/base-tools-uni';
import type { RequestParam, RequestConfig } from '@base-web-kits/base-tools-uni';

// 项目基础请求的封装
export function requestApi<T>(url: string, param: RequestParam, config?: RequestConfig) {
  return request<T>(HOST + url, param, {
    dataKey: 'data',
    msgKey: 'message',
    codeKey: 'status',
    successCode: [1],
    reloginCode: [-10],
    header: { token: 'xx', version: 'xx', tid: 'xx' },
    // responseInterceptor: (res) => res, // 响应拦截，可预处理响应数据，如解密 (可选)
    ...config,
  });
}
```

## 参数

- `url: string` - 请求地址
- `param: RequestParam` - 请求参数 (`UniApp.RequestOptions['data']`)
- `config: RequestConfig` - 请求配置

### RequestConfig

`RequestConfig` 继承自 `Omit<UniApp.RequestOptions, 'url' | 'data' | 'success' | 'fail' | 'complete'>`，额外包含以下属性：

- `dataKey: string | false` - 接口返回响应数据的字段, 支持"a[0].b.c"的格式, 当配置false时返回完整的响应数据
- `msgKey: string` - 接口返回响应消息的字段, 支持"a[0].b.c"的格式
- `codeKey: string` - 接口返回响应状态码的字段, 支持"a[0].b.c"的格式
- `successCode: (number | string)[]` - 成功状态码列表
- `reloginCode: (number | string)[]` - 登录过期状态码列表
- `responseInterceptor?: (data: any) => any` - 响应拦截，可预处理响应数据 (如解密)
- `showLoading?: boolean` - 是否显示进度条，默认 `true`
- `toastError?: boolean` - 是否提示接口异常，默认 `true`
- `isLog?: boolean` - 是否输出日志
- `cacheTime?: number` - 缓存时间，默认 `0` 不缓存

## 返回值

`Promise<T> & { task?: UniApp.RequestTask }`

## 版本

- 1.0.2 新增
