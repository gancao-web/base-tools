# useGetState

用法与 React.useState 完全一样，但多返回一个 getter 函数。

## 示例

```ts
import { useGetState } from '@base-web-kits/base-tools-react';

const [count, setCount, getCount] = useGetState(0);
```

## 参数

- `initialState (any)`: 初始状态。

## 返回值

- `(Array)`: [状态, 设置状态函数, 获取当前状态函数]。

## 来源

- [ahooks useGetState](https://ahooks.js.org/zh-CN/hooks/use-get-state/index)
