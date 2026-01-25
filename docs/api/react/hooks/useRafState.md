# useRafState

## 描述

只在 requestAnimationFrame callback 时更新 state。

## 示例

```ts
import { useRafState } from '@base-web-kits/base-tools-react';

const [state, setState] = useRafState({ width: 0, height: 0 });
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-raf-state)
