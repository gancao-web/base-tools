# throttledRef

## 描述

节流的 ref。

## 示例

```ts
import { throttledRef } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const throttled = throttledRef(source, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/throttledRef/)
