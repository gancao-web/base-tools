# useArrayIncludes

## 描述

响应式的 Array.includes。

## 示例

```ts
import { useArrayIncludes } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const includesTwo = useArrayIncludes(list, 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayIncludes/)
