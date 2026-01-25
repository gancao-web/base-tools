# useFocusWithin

## 描述

检测焦点是否在元素内。

## 示例

```ts
import { useFocusWithin } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref<HTMLFormElement>();
const { focused } = useFocusWithin(target);
```

## 来源

[VueUse](https://vueuse.org/functions/useFocusWithin/)
