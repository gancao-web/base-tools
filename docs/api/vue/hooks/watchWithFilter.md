# watchWithFilter

## 描述

带 EventFilter 的 watch，提供了防抖、节流、暂停等控制能力。

## 示例

```ts
import { watchWithFilter, debounceFilter } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);

watchWithFilter(
  count,
  (val) => {
    console.log('Count changed:', val);
  },
  {
    eventFilter: debounceFilter(500), // 500ms 防抖
  },
);

count.value++;
```

## 来源

[VueUse](https://vueuse.org/functions/watchWithFilter/)
