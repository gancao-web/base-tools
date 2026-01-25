# useArrayFilter

## 描述

响应式的 Array.filter。

## 示例

```ts
import { useArrayFilter } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const greaterThanOne = useArrayFilter(list, i => i > 1);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayFilter/)
