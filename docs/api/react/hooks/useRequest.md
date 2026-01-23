# useRequest

一个强大的管理异步数据请求的 Hook。

## 示例

```ts
import { useRequest } from '@base-web-kits/base-tools-react';

const { data, error, loading } = useRequest(getUsername);
```

## 参数

- `service (Function)`: 异步请求函数。
- `options (Object)`: 配置项。

## 返回值

- `(Object)`: 包含 data, error, loading 等状态的对象。

## 来源

- [ahooks useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/index)
