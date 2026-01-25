# useObjectUrl

## 描述

响应式的 URL.createObjectURL。

## 示例

```ts
import { useObjectUrl } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const file = ref<File | null>(null);
const url = useObjectUrl(file);
```

## 来源

[VueUse](https://vueuse.org/functions/useObjectUrl/)
