# useBase64

## 描述

响应式的 Base64 编码/解码。

## 示例

```ts
import { useBase64 } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const text = ref('hello world');
const { base64 } = useBase64(text);
```

## 来源

[VueUse](https://vueuse.org/functions/useBase64/)
