# useDebounce

## 描述

防抖值。

## 示例

```ts
import { useDebounce } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const input = ref('foo');
const debounced = useDebounce(input, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useDebounce/)
