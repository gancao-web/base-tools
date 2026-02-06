# useMagicKeys

## 描述

响应式的按键状态。

## 示例

```ts
import { useMagicKeys } from '@base-web-kits/base-tools-vue';
import { watch } from 'vue';

const { shift, v } = useMagicKeys();

watch(v, (v) => {
  if (v && shift.value) console.log('Shift + V have been pressed');
});
```

## 来源

[VueUse](https://vueuse.org/functions/useMagicKeys/)
