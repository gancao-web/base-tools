# until

## 描述

基于 Promise 的监听。

## 示例

```ts
import { until, useCounter } from '@base-web-kits/base-tools-vue';

const { count, inc } = useCounter();

await until(count).toBe(5);
```

## 来源

[VueUse](https://vueuse.org/functions/until/)
