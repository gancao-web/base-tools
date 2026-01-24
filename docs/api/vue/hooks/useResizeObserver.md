# useResizeObserver

## 描述

响应式的 ResizeObserver。

## 示例

```ts
import { useResizeObserver } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
const text = ref('');

useResizeObserver(el, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  text.value = `width: ${width}, height: ${height}`;
});
```

## 来源

[VueUse](https://vueuse.org/functions/useResizeObserver/)
