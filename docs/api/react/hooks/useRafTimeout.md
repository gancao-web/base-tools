# useRafTimeout

## 描述

使用 requestAnimationFrame 实现的延时器。

## 示例

```ts
import { useRafTimeout } from '@base-web-kits/base-tools-react';

useRafTimeout(() => {
  setCount(count + 1);
}, 1000);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-raf-timeout)
