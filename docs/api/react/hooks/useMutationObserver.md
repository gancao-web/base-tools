# useMutationObserver

## 描述

监听 DOM 变化。

## 示例

```ts
import { useMutationObserver } from '@base-web-kits/base-tools-react';

useMutationObserver(
  (mutationsList) => {
    setCount((c) => c + 1);
  },
  ref,
  { attributes: true },
);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-mutation-observer)
