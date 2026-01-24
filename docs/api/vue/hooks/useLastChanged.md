# useLastChanged

## 描述

记录最后一次改变的时间戳。

## 示例

```ts
import { useLastChanged } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const input = ref('');
const lastChanged = useLastChanged(input);
```

## 来源

[VueUse](https://vueuse.org/functions/useLastChanged/)
