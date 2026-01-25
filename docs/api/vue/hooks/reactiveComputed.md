# reactiveComputed

## 描述

响应式的计算属性对象。

## 示例

```ts
import { reactiveComputed } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const state = reactiveComputed(() => ({
  double: count.value * 2,
}));
```

## 来源

[VueUse](https://vueuse.org/functions/reactiveComputed/)
