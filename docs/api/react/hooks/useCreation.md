# useCreation

`useMemo` 或 `useRef` 的替代品，用于创建常量。

## 示例

```ts
import { useCreation } from '@base-web-kits/base-tools-react';

const foo = useCreation(() => new Foo(), []);
```

## 参数

- `factory (Function)`: 创建函数。
- `deps (Array)`: 依赖数组。

## 返回值

- `(any)`: 创建的常量。

## 来源

- [ahooks useCreation](https://ahooks.js.org/zh-CN/hooks/use-creation/index)
