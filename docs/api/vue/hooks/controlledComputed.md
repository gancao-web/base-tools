# controlledComputed

## 描述

受控的 computed (computedWithControl 的别名)。

## 示例

```ts
import { controlledComputed } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const double = controlledComputed(count, () => count.value * 2);
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/controlledComputed/)
