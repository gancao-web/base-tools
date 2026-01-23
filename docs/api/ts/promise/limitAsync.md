# limitAsync

限制并发执行的异步函数。

## 示例

```ts
import { limitAsync } from '@base-web-kits/base-tools-ts';

const limited = limitAsync(async (n) => n * 2, 2);

await Promise.all([limited(1), limited(2), limited(3)]);
// 结果: [2, 4, 6] (并发限制为 2)
```

## 参数

- `func (Function)`: 要限制的异步函数。
- `concurrency (number)`: 最大并发数。

## 返回值

- `(Function)`: 返回限制后的函数。

## 来源

- [es-toolkit limitAsync](https://es-toolkit.dev/zh_hans/reference/promise/limitAsync.html)
