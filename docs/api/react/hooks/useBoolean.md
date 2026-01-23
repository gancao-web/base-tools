# useBoolean

优雅的管理 boolean 状态的 Hook。

## 示例

```ts
import { useBoolean } from '@base-web-kits/base-tools-react';

const [state, { toggle, setTrue, setFalse }] = useBoolean(true);
```

## 参数

- `defaultValue (boolean)`: 默认值。

## 返回值

- `(Array)`: [状态值, 操作集合]。

## 来源

- [ahooks useBoolean](https://ahooks.js.org/zh-CN/hooks/use-boolean/index)
