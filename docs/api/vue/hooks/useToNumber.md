# useToNumber

## 描述

将值响应式地转换为数字。

## 示例

```ts
import { useToNumber } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const str = ref('123');
const num = useToNumber(str); // 123
```

## 来源

[VueUse](https://vueuse.org/functions/useToNumber/)
