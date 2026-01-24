# useArrayFindIndex

## 描述

响应式的 Array.findIndex。

## 示例

```ts
import { useArrayFindIndex } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const index = useArrayFindIndex(list, i => i === 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayFindIndex/)
