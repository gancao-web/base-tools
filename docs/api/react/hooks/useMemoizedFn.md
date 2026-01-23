# useMemoizedFn

持久化 function 的 Hook，理论上可以代替 useCallback。

## 示例

```ts
import { useMemoizedFn } from '@base-web-kits/base-tools-react';

const memoizedFn = useMemoizedFn(() => {
  console.log('hello');
});
```

## 参数

- `fn (Function)`: 需要持久化的函数。

## 返回值

- `(Function)`: 持久化后的函数。

## 来源

- [ahooks useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn/index)
