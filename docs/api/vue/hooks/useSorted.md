# useSorted

## 描述

响应式的排序数组。

## 示例

```ts
import { useSorted } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([10, 2, 5, 8, 1]);
const sorted = useSorted(list); // [1, 2, 5, 8, 10]
```

## 来源

[VueUse](https://vueuse.org/functions/useSorted/)
