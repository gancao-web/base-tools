# refThrottled

## 描述

节流的 ref (throttledRef 的别名)。

## 示例

```ts
import { refThrottled } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const throttled = refThrottled(source, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/refThrottled/)
