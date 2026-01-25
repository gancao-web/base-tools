# useArrayDifference

## 描述

响应式的数组差集。

## 示例

```ts
import { useArrayDifference } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list1 = ref([1, 2, 3]);
const list2 = ref([2, 3, 4]);
const diff = useArrayDifference(list1, list2); // [1]
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayDifference/)
