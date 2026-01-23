# usePrevious

保存上一次渲染时状态的 Hook。

## 示例

```ts
import { usePrevious } from '@base-web-kits/base-tools-react';

const previous = usePrevious(count);
```

## 参数

- `state (any)`: 需要保存的状态。
- `shouldUpdate (Function)`: 自定义更新逻辑。

## 返回值

- `(any)`: 上一次的状态。

## 来源

- [ahooks usePrevious](https://ahooks.js.org/zh-CN/hooks/use-previous/index)
