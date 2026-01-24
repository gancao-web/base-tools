# syncRefs

## 描述

同步 refs。

## 示例

```ts
import { syncRefs } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const a = ref(0);
const b = ref(0);
const stop = syncRefs(a, b);
```

## 来源

[VueUse](https://vueuse.org/functions/syncRefs/)
