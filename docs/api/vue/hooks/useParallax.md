# useParallax

## 描述

创建视差效果。

## 示例

```ts
import { useParallax } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const target = ref(null);
const { tilt, roll, source } = useParallax(target);
```

## 来源

[VueUse](https://vueuse.org/functions/useParallax/)
