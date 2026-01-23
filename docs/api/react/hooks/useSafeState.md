# useSafeState

用法与 React.useState 完全一样，但是在组件卸载后异步回调内的 setState 不再执行。

## 示例

```ts
import { useSafeState } from '@base-web-kits/base-tools-react';

const [visible, setVisible] = useSafeState(false);
```

## 参数

- `initialState (any)`: 初始状态。

## 返回值

- `(Array)`: [状态, 设置状态函数]。

## 来源

- [ahooks useSafeState](https://ahooks.js.org/zh-CN/hooks/use-safe-state/index)
