# useScrollLock

## 描述

锁定 body 滚动。

## 示例

```ts
import { useScrollLock } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(document.body);
const isLocked = useScrollLock(el);

isLocked.value = true; // body scroll is locked
```

## 来源

[VueUse](https://vueuse.org/functions/useScrollLock/)
