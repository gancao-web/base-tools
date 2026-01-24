# useRafFn

## 描述

在每个 requestAnimationFrame 上执行函数。

## 示例

```ts
import { useRafFn } from '@base-web-kits/base-tools-vue';

const { pause, resume } = useRafFn(() => {
  // 每一帧都会执行
});
```

## 来源

[VueUse](https://vueuse.org/functions/useRafFn/)
