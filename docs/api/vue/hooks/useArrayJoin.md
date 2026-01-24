# useArrayJoin

## 描述

响应式的 Array.join。

## 示例

```ts
import { useArrayJoin } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref(['a', 'b', 'c']);
const str = useArrayJoin(list, ',');
```

## 来源

[VueUse](https://vueuse.org/functions/useArrayJoin/)
