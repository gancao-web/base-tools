# reactiveOmit

## 描述

从响应式对象中忽略属性。

## 示例

```ts
import { reactiveOmit } from '@base-web-kits/base-tools-vue';
import { reactive } from 'vue';

const state = reactive({ x: 0, y: 0, z: 0 });
const omitted = reactiveOmit(state, 'z');
```

## 来源

[VueUse](https://vueuse.org/functions/reactiveOmit/)
