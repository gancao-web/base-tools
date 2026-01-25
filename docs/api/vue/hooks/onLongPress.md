# onLongPress

## 描述

长按事件钩子。

## 示例

```ts
import { onLongPress } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
onLongPress(el, () => {
  console.log('long pressed');
});
```

## 来源

[VueUse](https://vueuse.org/functions/onLongPress/)
