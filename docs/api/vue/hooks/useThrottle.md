# useThrottle

## 描述

返回一个节流后的值。

## 示例

```ts
import { useThrottle } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const input = ref('');
const throttledInput = useThrottle(input, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useThrottle/)
