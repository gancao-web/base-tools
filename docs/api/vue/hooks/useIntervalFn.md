# useIntervalFn

## 描述

setInterval 的包装器。

## 示例

```ts
import { useIntervalFn } from '@base-web-kits/base-tools-vue';

const { pause, resume, isActive } = useIntervalFn(() => {
  console.log('do something');
}, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useIntervalFn/)
