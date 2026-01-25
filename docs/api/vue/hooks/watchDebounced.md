# watchDebounced

## 描述

带有防抖功能的 watch。

## 示例

```ts
import { watchDebounced } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

watchDebounced(
  count,
  (val) => {
    console.log('Changed:', val);
  },
  { debounce: 500 },
);

count.value++; // Debounced
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/watchDebounced/)
