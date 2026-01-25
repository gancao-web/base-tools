# useTimeoutFn

## 描述

setTimeout 的包装器。

## 示例

```ts
import { useTimeoutFn } from '@base-web-kits/base-tools-vue';

const { isPending, start, stop } = useTimeoutFn(() => {
  console.log('Timeout!');
}, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useTimeoutFn/)
