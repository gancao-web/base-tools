# computedInject

## 描述

结合了 inject 的 computed。

## 示例

```ts
import { computedInject } from '@base-web-kits/base-tools-vue';
import { provide, ref } from 'vue';

const key = Symbol('key');
const count = ref(0);
provide(key, count);

const injected = computedInject(key, (v) => v ? v.value * 2 : 0);
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/computedInject/)
