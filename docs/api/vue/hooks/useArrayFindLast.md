# useArrayFindLast

## 描述

响应式的 Array.findLast。

## 示例

```ts
import { useArrayFindLast } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3, 2]);
const lastTwo = useArrayFindLast(list, i => i === 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayFindLast/)
