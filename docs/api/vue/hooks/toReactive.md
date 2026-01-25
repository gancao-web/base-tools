# toReactive

## 描述

将对象转换为 reactive 对象。

## 示例

```ts
import { toReactive } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const state = toReactive({ count });
```

## 来源

[VueUse](https://vueuse.org/functions/toReactive/)
