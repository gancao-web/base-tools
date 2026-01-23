# useLockFn

用于给异步函数增加竞态锁，防止并发执行。

## 示例

```ts
import { useLockFn } from '@base-web-kits/base-tools-react';

const submit = useLockFn(async () => {
  await mockApiRequest();
});
```

## 参数

- `fn (Function)`: 需要加锁的异步函数。

## 返回值

- `(Function)`: 加锁后的函数。

## 来源

- [ahooks useLockFn](https://ahooks.js.org/zh-CN/hooks/use-lock-fn/index)
