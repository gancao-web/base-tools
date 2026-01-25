# watchAtMost

## 描述

限制触发次数的 watch。

## 示例

```ts
import { watchAtMost } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

watchAtMost(
  count,
  () => {
    console.log('Triggered');
  },
  { count: 3 },
);

count.value++; // Triggered (1/3)
count.value++; // Triggered (2/3)
count.value++; // Triggered (3/3)
count.value++; // Ignored
```来源

[VueUse](https://vueuse.org/functions/watchAtMost/)
