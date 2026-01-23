# useLatest

返回当前最新值的 Hook，可以避免闭包问题。

## 示例

```ts
import { useLatest } from '@base-web-kits/base-tools-react';

const latestCount = useLatest(count);
```

## 参数

- `value (any)`: 当前值。

## 返回值

- `(Object)`: 包含 current 属性的 Ref 对象。

## 来源

- [ahooks useLatest](https://ahooks.js.org/zh-CN/hooks/use-latest/index)
