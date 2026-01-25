# ignorableWatch

## 描述

可忽略的 watch。

## 示例

```ts
import { ignorableWatch } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { ignoreUpdates } = ignorableWatch(count, () => {
  console.log('changed');
});

ignoreUpdates(() => {
  count.value++; // 不触发 watch
});
```

## 来源

[VueUse](https://vueuse.org/functions/ignorableWatch/)
