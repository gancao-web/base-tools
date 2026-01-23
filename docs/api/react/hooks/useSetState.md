# useSetState

管理 object 类型 state 的 Hook，用法与 class 组件的 this.setState 基本一致。

## 示例

```ts
import { useSetState } from '@base-web-kits/base-tools-react';

const [state, setState] = useSetState({ hello: '', count: 0 });
```

## 参数

- `initialState (Object)`: 初始状态。

## 返回值

- `(Array)`: [状态, 设置状态函数]。

## 来源

- [ahooks useSetState](https://ahooks.js.org/zh-CN/hooks/use-set-state/index)
