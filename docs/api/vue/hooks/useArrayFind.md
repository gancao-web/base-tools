# useArrayFind

## 描述

响应式的 Array.find。

## 示例

```ts
import { useArrayFind } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const two = useArrayFind(list, i => i === 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayFind/)
