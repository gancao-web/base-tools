# useArraySome

## 描述

响应式的 Array.some。

## 示例

```ts
import { useArraySome } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const result = useArraySome(list, i => i > 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArraySome/)
