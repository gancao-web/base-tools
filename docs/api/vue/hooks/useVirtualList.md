# useVirtualList

## 描述

虚拟列表，用于高效渲染大型列表。

## 示例

```ts
import { useVirtualList } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const list = ref(Array.from(Array(1000).keys()));

const { list: virtualList, containerProps, wrapperProps } = useVirtualList(
  list,
  {
    itemHeight: 22,
  },
);
```

## 来源

[VueUse](https://vueuse.org/functions/useVirtualList/)
