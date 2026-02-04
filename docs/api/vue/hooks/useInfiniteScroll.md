# useInfiniteScroll

## 描述

无限滚动。

## 示例

```ts
import { useInfiniteScroll } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(null);
const data = ref([1, 2, 3]);

useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(data.value.length + 1);
  },
  { distance: 10 },
);
```

## 来源

[VueUse](https://vueuse.org/functions/useInfiniteScroll/)
