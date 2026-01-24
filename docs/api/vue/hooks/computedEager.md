# computedEager

## 描述

急切的 computed (eagerComputed 的别名)。

## 示例

```ts
import { computedEager } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const double = computedEager(() => count.value * 2);
```来源

[VueUse](https://vueuse.org/functions/computedEager/)
