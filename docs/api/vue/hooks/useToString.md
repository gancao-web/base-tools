# useToString

## 描述

将值响应式地转换为字符串。

## 示例

```ts
import { useToString } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(123);
const str = useToString(count); // '123'
```

## 来源

[VueUse](https://vueuse.org/functions/useToString/)
