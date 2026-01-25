# useArrayReduce

## 描述

响应式的 Array.reduce。

## 示例

```ts
import { useArrayReduce } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const sum = useArrayReduce(list, (a, b) => a + b, 0);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayReduce/)
