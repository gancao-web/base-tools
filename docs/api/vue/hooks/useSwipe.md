# useSwipe

## 描述

响应式的滑动检测。

## 示例

```ts
import { useSwipe } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref<HTMLElement | null>(null);

const { direction, isSwiping } = useSwipe(target);
```

## 来源

[VueUse](https://vueuse.org/functions/useSwipe/)
