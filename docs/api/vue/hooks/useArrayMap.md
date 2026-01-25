# useArrayMap

## 描述

响应式的 Array.map。

## 示例

```ts
import { useArrayMap } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 3]);
const doubled = useArrayMap(list, i => i * 2);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayMap/)
