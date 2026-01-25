# useAsyncQueue

## 描述

异步任务队列。

## 示例

```ts
import { useAsyncQueue } from '@base-web-kits/base-tools-vue';

const { activeIndex, result } = useAsyncQueue([
  () => Promise.resolve(1),
  () => Promise.resolve(2),
]);
```

## 来源

[VueUse](https://vueuse.org/functions/useAsyncQueue/)
