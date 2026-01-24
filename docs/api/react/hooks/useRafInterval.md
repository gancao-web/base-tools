# useRafInterval

## 描述

使用 requestAnimationFrame 实现的定时器。

## 示例

```ts
import { useRafInterval } from '@base-web-kits/base-tools-react';

useRafInterval(() => {
  setCount(count + 1);
}, 1000);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-raf-interval)
