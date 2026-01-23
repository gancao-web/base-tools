# useToggle

用于在两个状态值之间切换的 Hook。

## 示例

```ts
import { useToggle } from '@base-web-kits/base-tools-react';

const [state, { toggle, setLeft, setRight }] = useToggle();
```

## 参数

- `defaultValue (any)`: 默认值。
- `reverseValue (any)`: 取反后的值。

## 返回值

- `(Array)`: [状态值, 操作集合]。

## 来源

- [ahooks useToggle](https://ahooks.js.org/zh-CN/hooks/use-toggle/index)
