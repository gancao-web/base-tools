# useCssVar

## 描述

响应式的 CSS 变量。

## 示例

```ts
import { useCssVar } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
const color = useCssVar('--color', el);
```

## 来源

[VueUse](https://vueuse.org/functions/useCssVar/)
