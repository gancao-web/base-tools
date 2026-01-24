# usePointerSwipe

## 描述

响应式的指针滑动检测。

## 示例

```ts
import { usePointerSwipe } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref<HTMLElement | null>(null);
const { distanceX, distanceY } = usePointerSwipe(target);
```

## 来源

[VueUse](https://vueuse.org/functions/usePointerSwipe/)
