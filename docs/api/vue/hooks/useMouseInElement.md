# useMouseInElement

## 描述

响应式的元素内鼠标位置。

## 示例

```ts
import { useMouseInElement } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref(null);
const { x, y, isOutside } = useMouseInElement(target);
```

## 来源

[VueUse](https://vueuse.org/functions/useMouseInElement/)
