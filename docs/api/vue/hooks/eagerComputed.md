# eagerComputed

## 描述

急切的 computed。

## 示例

```ts
import { eagerComputed } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const double = eagerComputed(() => count.value * 2);
```

## 来源

[VueUse](https://vueuse.org/functions/eagerComputed/)
