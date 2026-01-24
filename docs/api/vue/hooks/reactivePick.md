# reactivePick

## 描述

从响应式对象中挑选属性。

## 示例

```ts
import { reactivePick } from '@base-web-kits/base-tools-vue';
import { reactive } from 'vue';

const state = reactive({ x: 0, y: 0, z: 0 });
const picked = reactivePick(state, 'x', 'y');
```

## 来源

[VueUse](https://vueuse.org/functions/reactivePick/)
