# tryOnScopeDispose

## 描述

安全的 onScopeDispose。

## 示例

```ts
import { tryOnScopeDispose } from '@base-web-kits/base-tools-vue';

tryOnScopeDispose(() => {
  console.log('disposed');
});
```

## 来源

[VueUse](https://vueuse.org/functions/tryOnScopeDispose/)
