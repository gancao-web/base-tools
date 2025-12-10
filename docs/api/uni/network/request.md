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
    ...config,
    dataPath: 'data',
    header: { token: 'xx', version: 'xx', tid: 'xx' },
    onResponse(res: any) {
      return {
        res,
        msg: res.message,
        isSuccess: res.status === 1,
        isRelogin: res.status === -10,
      };
    },
  });
}
```

## 参数

- `url: string` - 请求地址
- `param: RequestParam` - 请求参数 (`UniApp.RequestOptions['data']`)
- `config: RequestConfig` - 请求配置

### RequestConfig

`RequestConfig` 继承自 `Omit<UniApp.RequestOptions, 'url' | 'data' | 'success' | 'fail' | 'complete'>`，额外包含以下属性：

- `onResponse?: (xhrData: unknown) => { res: unknown; msg: string; isSuccess: boolean; isRelogin: boolean; }` - 响应数据的处理函数
  - `res` - 完整的响应数据
  - `msg` - 消息提示
  - `isSuccess` - 是否成功
  - `isRelogin` - 是否需要登录
- `showLoading?: boolean` - 是否显示进度条，默认 `true`
- `toastError?: boolean` - 是否提示接口异常，默认 `true`
- `dataPath?: string | false` - 获取响应数据的字段，支持 "a[0].b.c" 的格式。当配置 `false` 时返回完整的响应数据
- `isLog?: boolean` - 是否输出日志

## 返回值

`Promise<T> & { task?: UniApp.RequestTask }`
