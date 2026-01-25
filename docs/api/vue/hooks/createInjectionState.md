# createInjectionState

## 描述

创建注入状态。

## 示例

```ts
import { createInjectionState } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const [useProvideCount, useCount] = createInjectionState(() => {
  const count = ref(0);
  return { count };
});
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/createInjectionState/)
