# debouncedRef

## 描述

防抖的 ref。

## 示例

```ts
import { debouncedRef } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const debounced = debouncedRef(source, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/debouncedRef/)
