# useDraggable

## 描述

使元素可拖拽。

## 示例

```ts
import { useDraggable } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(null);
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
});
```

## 来源

[VueUse](https://vueuse.org/functions/useDraggable/)
