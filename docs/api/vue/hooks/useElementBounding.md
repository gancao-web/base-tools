# useElementBounding

## 描述

响应式的元素边界信息。

## 示例

```ts
import { useElementBounding } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el);
```

## 来源

[VueUse](https://vueuse.org/functions/useElementBounding/)
