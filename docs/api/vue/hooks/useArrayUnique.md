# useArrayUnique

## 描述

响应式的数组去重。

## 示例

```ts
import { useArrayUnique } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref([1, 2, 2, 3]);
const unique = useArrayUnique(list);
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayUnique/)
