# throttledWatch

## 描述

节流的 watch。

## 示例

```ts
import { throttledWatch } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
throttledWatch(
  count,
  () => {
    console.log('changed');
  },
  { throttle: 1000 },
);
```

## 来源

[VueUse](https://vueuse.org/functions/throttledWatch/)
