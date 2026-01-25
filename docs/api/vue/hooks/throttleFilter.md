# throttleFilter

## 描述

节流过滤器。

## 示例

```ts
import { throttleFilter, watchWithFilter } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
watchWithFilter(count, () => {
  console.log('changed');
}, { eventFilter: throttleFilter(1000) });
```

## 来源

[VueUse](https://vueuse.org/functions/throttleFilter/)
