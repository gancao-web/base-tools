# toRef

## 描述

将值转换为 ref。

## 示例

```ts
import { toRef } from '@base-web-kits/base-tools-vue';
import { reactive } from 'vue';

const state = reactive({ count: 0 });
const count = toRef(state, 'count');
```

## 来源

[VueUse](https://vueuse.org/functions/toRef/)
