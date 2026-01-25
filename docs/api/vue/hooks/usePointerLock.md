# usePointerLock

## 描述

响应式的 Pointer Lock API。

## 示例

```ts
import { usePointerLock } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(null);
const { lock, unlock, element } = usePointerLock(el);
```

## 来源

[VueUse](https://vueuse.org/functions/usePointerLock/)
