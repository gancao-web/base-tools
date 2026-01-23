# withTimeout

为 Promise 添加超时控制。

## 示例

```ts
import { withTimeout } from '@base-web-kits/base-tools-ts';

await withTimeout(fetch('https://example.com'), 5000);
// 如果 5秒内未完成，抛出 TimeoutError
```

## 参数

- `promise (Promise)`: 要控制的 Promise。
- `ms (number)`: 超时毫秒数。

## 返回值

- `(Promise<any>)`: 返回 Promise 结果。

## 来源

- [es-toolkit withTimeout](https://es-toolkit.dev/zh_hans/reference/promise/withTimeout.html)
