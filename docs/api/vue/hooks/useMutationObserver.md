# useMutationObserver

## 描述

响应式的 MutationObserver。

## 示例

```ts
import { useMutationObserver } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);

useMutationObserver(el, (mutations) => {
  console.log(mutations);
}, {
  attributes: true,
});
```

## 来源

[VueUse](https://vueuse.org/functions/useMutationObserver/)
