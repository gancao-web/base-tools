# pausableWatch

## 描述

可暂停的 watch。

## 示例

```ts
import { pausableWatch } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { stop, pause, resume } = pausableWatch(count, () => {
  console.log('changed');
});
```

## 来源

[VueUse](https://vueuse.org/functions/pausableWatch/)
