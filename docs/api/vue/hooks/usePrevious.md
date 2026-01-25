# usePrevious

## 描述

保存 ref 的上一个值。

## 示例

```ts
import { usePrevious } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const previous = usePrevious(count); // undefined

count.value = 1;
// previous.value === 0
```

## 来源

[VueUse](https://vueuse.org/functions/usePrevious/)
