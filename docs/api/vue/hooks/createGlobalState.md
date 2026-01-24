# createGlobalState

## 描述

创建全局状态。

## 示例

```ts
import { createGlobalState } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const useGlobalState = createGlobalState(() => {
  const count = ref(0);
  return { count };
});
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/createGlobalState/)
