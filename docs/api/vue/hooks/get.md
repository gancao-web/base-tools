# get

## 描述

获取 ref 或普通值的值。

## 示例

```ts
import { get } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const val = get(count); // 0
const val2 = get(1); // 1
```

## 来源

[VueUse](https://vueuse.org/functions/get/)
