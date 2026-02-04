# retry

重试执行一个异步函数。

## 示例

```ts
import { retry } from '@base-web-kits/base-tools-ts';

await retry(
  async () => {
    // 可能会失败的操作
  },
  { retries: 3 },
);
```

## 参数

- `func (Function)`: 要重试的异步函数。
- `options (Object)`: 重试选项（如次数、延迟等）。

## 返回值

- `(Promise<any>)`: 返回函数结果。

## 来源

- [es-toolkit retry](https://es-toolkit.dev/zh_hans/reference/promise/retry.html)
