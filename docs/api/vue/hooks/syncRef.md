# syncRef

## 描述

双向同步 ref。

## 示例

```ts
import { syncRef } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const a = ref(0);
const b = ref(0);
const stop = syncRef(a, b);
```

## 来源

[VueUse](https://vueuse.org/functions/syncRef/)
