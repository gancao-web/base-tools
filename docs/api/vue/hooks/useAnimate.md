# useAnimate

## 描述

响应式的 Web Animations API。

## 示例

```ts
import { useAnimate } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref(null);
const { play, pause } = useAnimate(el, { transform: 'rotate(360deg)' }, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useAnimate/)
