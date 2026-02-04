# debouncedWatch

## 描述

防抖的 watch。

## 示例

```ts
import { debouncedWatch } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
debouncedWatch(
  count,
  () => {
    console.log('changed');
  },
  { debounce: 1000 },
);
```

## 来源

[VueUse](https://vueuse.org/functions/debouncedWatch/)
