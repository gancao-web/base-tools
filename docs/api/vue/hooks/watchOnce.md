# watchOnce

## 描述

只触发一次的 watch。

## 示例

```ts
import { watchOnce } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

watchOnce(count, (val) => {
  console.log('Only triggered once:', val);
});

count.value = 1; // Triggered
count.value = 2; // Ignored
```

## 来源

[VueUse](https://vueuse.org/functions/watchOnce/)
