# useDebounceEffect

## 描述

为 useEffect 增加防抖的能力。

## 示例

```ts
import { useDebounceEffect } from '@base-web-kits/base-tools-react';

useDebounceEffect(
  () => {
    setRecords(val);
  },
  [val],
  { wait: 1000 },
);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-debounce-effect)
