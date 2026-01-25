# refDebounced

## 描述

防抖的 ref (debouncedRef 的别名)。

## 示例

```ts
import { refDebounced } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const debounced = refDebounced(source, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/refDebounced/)
