# createSharedComposable

## 描述

创建共享的可组合函数。

## 示例

```ts
import { createSharedComposable } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const useShared = createSharedComposable(() => {
  const count = ref(0);
  return { count };
});
```

## 来源

[VueUse](https://vueuse.org/functions/createSharedComposable/)
