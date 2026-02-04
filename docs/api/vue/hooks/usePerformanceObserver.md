# usePerformanceObserver

## 描述

响应式的 PerformanceObserver。

## 示例

```ts
import { usePerformanceObserver } from '@base-web-kits/base-tools-vue';

usePerformanceObserver(
  {
    entryTypes: ['paint'],
  },
  (list) => {
    // do something
  },
);
```

## 来源

[VueUse](https://vueuse.org/functions/usePerformanceObserver/)
