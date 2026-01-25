# toRefs

## 描述

将响应式对象转换为 refs。

## 示例

```ts
import { toRefs } from '@base-web-kits/base-tools-vue';
import { reactive } from 'vue';

const state = reactive({ count: 0 });
const { count } = toRefs(state);
```

## 来源

[VueUse](https://vueuse.org/functions/toRefs/)
