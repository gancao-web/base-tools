# useFocus

## 描述

响应式的聚焦状态。

## 示例

```ts
import { useFocus } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref<HTMLButtonElement>();
const { focused } = useFocus(target);
```

## 来源

[VueUse](https://vueuse.org/functions/useFocus/)
