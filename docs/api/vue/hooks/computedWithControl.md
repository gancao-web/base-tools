# computedWithControl

## 描述

带控制的 computed。

## 示例

```ts
import { computedWithControl } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const double = computedWithControl(count, () => count.value * 2);
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/computedWithControl/)
