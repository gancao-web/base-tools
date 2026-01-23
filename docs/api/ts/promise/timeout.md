# timeout

创建一个在指定时间后 rejected 的 Promise。

## 示例

```ts
import { timeout } from '@base-web-kits/base-tools-ts';

try {
  await timeout(1000);
} catch (e) {
  // 1秒后抛出 TimeoutError
}
```

## 参数

- `ms (number)`: 超时毫秒数。

## 返回值

- `(Promise<void>)`: 返回 Promise。

## 来源

- [es-toolkit timeout](https://es-toolkit.dev/zh_hans/reference/promise/timeout.html)
