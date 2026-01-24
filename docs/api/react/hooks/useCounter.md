# useCounter

## 描述

管理计数器的 Hook。

## 示例

```ts
import { useCounter } from '@base-web-kits/base-tools-react';

const [current, { inc, dec, set, reset }] = useCounter(100, { min: 1, max: 10 });
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-counter)
