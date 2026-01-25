# extendRef

## 描述

扩展 ref。

## 示例

```ts
import { extendRef } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const extended = extendRef(count, { extra: 'data' });
```

## 来源

[VueUse](https://vueuse.org/functions/extendRef/)
