# useArrayEvery

## 描述

响应式的 Array.every。

## 示例

```ts
import { useArrayEvery } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const allPositive = useArrayEvery(list, i => i > 0);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayEvery/)
