# useScroll

## 描述

响应式的滚动位置。

## 示例

```ts
import { useScroll } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(null);
const { x, y } = useScroll(el);
```

## 来源

[VueUse](https://vueuse.org/functions/useScroll/)
